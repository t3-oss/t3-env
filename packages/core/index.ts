import z, { ZodObject, ZodType } from "zod";

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
   * Whether to skip validation of environment variables.
   * @default !!process.env.SKIP_ENV_VALIDATION && process.env.SKIP_ENV_VALIDATION !== "false" && process.env.SKIP_ENV_VALIDATION !== "0"
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
  TServer extends Record<string, ZodType>,
  TClient extends Record<string, ZodType>
>(
  opts:
    | LooseOptions<TPrefix, TServer, TClient>
    | StrictOptions<TPrefix, TServer, TClient>
): z.infer<ZodObject<TServer>> & z.infer<ZodObject<TClient>> {
  const _client = typeof opts.client === "object" ? opts.client : {};
  const client = z.object(_client);
  const server = z.object(opts.server);
  const runtimeEnv = opts.runtimeEnvStrict ?? opts.runtimeEnv ?? process.env;
  const isServer = opts.isServer ?? typeof window === "undefined";
  const skip =
    opts.skipValidation ??
    (!!process.env.SKIP_ENV_VALIDATION &&
      process.env.SKIP_ENV_VALIDATION !== "false" &&
      process.env.SKIP_ENV_VALIDATION !== "0");

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any
  if (skip) return runtimeEnv as any;

  const merged = server.merge(client);
  const parsed = isServer
    ? merged.safeParse(runtimeEnv) // on server we can validate all env vars
    : client.safeParse(runtimeEnv); // on client we can only validate the ones that are exposed

  if (parsed.success === false) {
    console.error(
      "❌ Invalid environment variables:",
      parsed.error.flatten().fieldErrors
    );
    throw new Error("Invalid environment variables");
  }

  const env = new Proxy(parsed.data, {
    get(target, prop) {
      if (typeof prop !== "string") return undefined;
      if (!isServer && !prop.startsWith(opts.clientPrefix))
        throw new Error(
          "❌ Attempted to access a server-side environment variable on the client"
        );
      return target[prop as keyof typeof target];
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any
  return env as any;
}
