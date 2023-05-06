import z, { type ZodError, type ZodObject, type ZodType } from "zod";

export type ErrorMessage<T extends string> = T;

export interface BaseOptions<
  TPrefix extends string,
  TServer extends Record<string, ZodType>,
  TClient extends Record<string, ZodType>
> {
  /**
   * Client-side environment variables are exposed to the client by default. Set what prefix they have
   */
  clientPrefix: TPrefix;

  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app isn't
   * built with invalid env vars.
   */
  server: TServer;

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app isn't
   * built with invalid env vars. To expose them to the client, prefix them with `NEXT_PUBLIC_`.
   */
  client: {
    [TKey in keyof TClient]: TKey extends `${TPrefix}${string}`
      ? TClient[TKey]
      : ErrorMessage<`${TKey extends string
          ? TKey
          : never} is not prefixed with ${TPrefix}.`>;
  };

  /**
   * How to determine whether the app is running on the server or the client.
   * @default typeof window === "undefined"
   */
  isServer?: boolean;

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

export interface LooseOptions<
  TPrefix extends string,
  TServer extends Record<string, ZodType>,
  TClient extends Record<string, ZodType>
> extends BaseOptions<TPrefix, TServer, TClient> {
  runtimeEnvStrict?: never;
  /**
   * Runtime Environment variables to use for validation - `process.env`, `import.meta.env` or similar.
   * Unlike `runtimeEnvStrict`, this doesn't enforce that all environment variables are set.
   */
  runtimeEnv: Record<string, string | undefined>;
}

export interface StrictOptions<
  TPrefix extends string,
  TServer extends Record<string, ZodType>,
  TClient extends Record<string, ZodType>
> extends BaseOptions<TPrefix, TServer, TClient> {
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
    | keyof TServer,
    string | undefined
  >;
  runtimeEnv?: never;
}

export function createEnv<
  TPrefix extends string,
  TServer extends Record<string, ZodType> = NonNullable<unknown>,
  TClient extends Record<string, ZodType> = NonNullable<unknown>
>(
  opts:
    | LooseOptions<TPrefix, TServer, TClient>
    | StrictOptions<TPrefix, TServer, TClient>
): z.infer<ZodObject<TServer>> & z.infer<ZodObject<TClient>> {
  const runtimeEnv = opts.runtimeEnvStrict ?? opts.runtimeEnv ?? process.env;

  const skip = !!opts.skipValidation;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any
  if (skip) return runtimeEnv as any;

  const _client = typeof opts.client === "object" ? opts.client : {};
  const client = z.object(_client);
  const server = z.object(opts.server);
  const isServer = opts.isServer ?? typeof window === "undefined";

  const merged = server.merge(client);
  const parsed = isServer
    ? merged.safeParse(runtimeEnv) // on server we can validate all env vars
    : client.safeParse(runtimeEnv); // on client we can only validate the ones that are exposed

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
      if (!isServer && !prop.startsWith(opts.clientPrefix)) {
        return onInvalidAccess(prop);
      }
      return target[prop as keyof typeof target];
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any
  return env as any;
}
