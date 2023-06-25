import { z, type ZodError, type ZodObject, type ZodType } from "zod";

export type ErrorMessage<T extends string> = T;
export type Simplify<T> = {
  [P in keyof T]: T[P];
  // eslint-disable-next-line @typescript-eslint/ban-types
} & {};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Impossible<T extends Record<string, any>> = Partial<
  Record<keyof T, never>
>;

export interface BaseOptions<TBuildEnv extends Record<string, ZodType>> {
  /**
   * How to determine whether the app is running on the server or the client.
   * @default typeof window === "undefined"
   */
  isServer?: boolean;

  /**
   * Variables that are provided by build tools and is available to both client and server,
   * and doesn't require to be manually supplied. For example `NODE_ENV`, `VERCEL_URL` etc.
   */
  buildEnvs?: TBuildEnv;

  /**
   * Called when validation fails. By default the error is logged,
   * and an error is thrown telling what environment variables are invalid.
   */
  onValidationError?: (error: ZodError) => never;

  /**
   * Called when a server-side environment variable is accessed on the client.
   * By default an error is thrown.
   */
  onInvalidAccess?: (variable: string) => never;

  /**
   * Whether to skip validation of environment variables.
   * @default false
   */
  skipValidation?: boolean;
}

export interface LooseOptions<TBuildEnv extends Record<string, ZodType>>
  extends BaseOptions<TBuildEnv> {
  runtimeEnvStrict?: never;
  /**
   * Runtime Environment variables to use for validation - `process.env`, `import.meta.env` or similar.
   * Unlike `runtimeEnvStrict`, this doesn't enforce that all environment variables are set.
   */
  runtimeEnv: Record<string, string | boolean | number | undefined>;
}

export interface StrictOptions<
  TPrefix extends string,
  TServer extends Record<string, ZodType>,
  TClient extends Record<string, ZodType>,
  TBuildEnv extends Record<string, ZodType>
> extends BaseOptions<TBuildEnv> {
  /**
   * Runtime Environment variables to use for validation - `process.env`, `import.meta.env` or similar.
   * Enforces all environment variables to be set. Required in for example Next.js Edge and Client runtimes.
   */
  runtimeEnvStrict: Record<
    | {
        [TKey in keyof TClient]: TKey extends `${TPrefix}${string}`
          ? TKey
          : never;
      }[keyof TClient]
    | {
        [TKey in keyof TServer]: TKey extends `${TPrefix}${string}`
          ? never
          : TKey;
      }[keyof TServer]
    | {
        [TKey in keyof TBuildEnv]: TKey extends string ? TKey : never;
      }[keyof TBuildEnv],
    string | boolean | number | undefined
  >;
  runtimeEnv?: never;
}

export interface ClientOptions<
  TPrefix extends string,
  TClient extends Record<string, ZodType>
> {
  /**
   * Client-side environment variables are exposed to the client by default. Set what prefix they have
   */
  clientPrefix: TPrefix;

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app isn't
   * built with invalid env vars. To expose them to the client, prefix them with `NEXT_PUBLIC_`.
   */
  client: Partial<{
    [TKey in keyof TClient]: TKey extends `${TPrefix}${string}`
      ? TClient[TKey]
      : ErrorMessage<`${TKey extends string
          ? TKey
          : never} is not prefixed with ${TPrefix}.`>;
  }>;
}

export interface ServerOptions<
  TPrefix extends string,
  TServer extends Record<string, ZodType>
> {
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app isn't
   * built with invalid env vars.
   */
  server: Partial<{
    [TKey in keyof TServer]: TPrefix extends ""
      ? TServer[TKey]
      : TKey extends `${TPrefix}${string}`
      ? ErrorMessage<`${TKey extends `${TPrefix}${string}`
          ? TKey
          : never} should not prefixed with ${TPrefix}.`>
      : TServer[TKey];
  }>;
}

export type ServerClientOptions<
  TPrefix extends string,
  TServer extends Record<string, ZodType>,
  TClient extends Record<string, ZodType>
> =
  | (ClientOptions<TPrefix, TClient> & ServerOptions<TPrefix, TServer>)
  | (ServerOptions<TPrefix, TServer> & Impossible<ClientOptions<never, never>>)
  | (ClientOptions<TPrefix, TClient> & Impossible<ServerOptions<never, never>>);

export type EnvOptions<
  TPrefix extends string,
  TServer extends Record<string, ZodType>,
  TClient extends Record<string, ZodType>,
  TBuildEnv extends Record<string, ZodType>
> =
  | (LooseOptions<TBuildEnv> & ServerClientOptions<TPrefix, TServer, TClient>)
  | (StrictOptions<TPrefix, TServer, TClient, TBuildEnv> &
      ServerClientOptions<TPrefix, TServer, TClient>);

export function createEnv<
  TPrefix extends string = "",
  TServer extends Record<string, ZodType> = NonNullable<unknown>,
  TClient extends Record<string, ZodType> = NonNullable<unknown>,
  TBuildEnv extends Record<string, ZodType> = NonNullable<unknown>
>(
  opts: EnvOptions<TPrefix, TServer, TClient, TBuildEnv>
): Simplify<
  z.infer<ZodObject<TServer>> &
    z.infer<ZodObject<TClient>> &
    z.infer<ZodObject<TBuildEnv>>
> {
  const runtimeEnv = opts.runtimeEnvStrict ?? opts.runtimeEnv ?? process.env;

  const skip = !!opts.skipValidation;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any
  if (skip) return runtimeEnv as any;

  const _buildEnvs = typeof opts.buildEnvs === "object" ? opts.buildEnvs : {};
  const _client = typeof opts.client === "object" ? opts.client : {};
  const _server = typeof opts.server === "object" ? opts.server : {};
  const buildEnvs = z.object(_buildEnvs);
  const client = z.object(_client);
  const server = z.object(_server);
  const isServer = opts.isServer ?? typeof window === "undefined";

  const allClient = client.merge(buildEnvs);
  const allServer = server.merge(buildEnvs).merge(client);
  const parsed = isServer
    ? allServer.safeParse(runtimeEnv) // on server we can validate all env vars
    : allClient.safeParse(runtimeEnv); // on client we can only validate the ones that are exposed

  const onValidationError =
    opts.onValidationError ??
    ((error: ZodError) => {
      console.error(
        "❌ Invalid environment variables:",
        error.flatten().fieldErrors
      );
      throw new Error("Invalid environment variables");
    });

  const onInvalidAccess =
    opts.onInvalidAccess ??
    ((_variable: string) => {
      throw new Error(
        "❌ Attempted to access a server-side environment variable on the client"
      );
    });

  if (parsed.success === false) {
    return onValidationError(parsed.error);
  }

  const env = new Proxy(parsed.data, {
    get(target, prop) {
      if (typeof prop !== "string") return undefined;
      if (
        !isServer &&
        opts.clientPrefix &&
        !prop.startsWith(opts.clientPrefix) &&
        buildEnvs.shape[prop as keyof typeof buildEnvs.shape] === undefined
      ) {
        return onInvalidAccess(prop);
      }
      return target[prop as keyof typeof target];
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any
  return env as any;
}
