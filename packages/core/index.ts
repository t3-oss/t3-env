import z, { ZodObject, ZodType } from "zod";

export type ErrorMessage<T extends string> = T;

export type CreateEnvOptions<
  TPrefix extends string,
  TServer extends Record<string, ZodType>,
  TClient extends Record<string, ZodType>
> = {
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
   * Manual destruction of `process.env`. Required for Next.js.
   * @default process.env
   */
  processEnv?: Record<keyof TServer | keyof TClient, string | undefined>;

  /**
   * Client-side environment variables are exposed to the client by default. Set what prefix they have
   */
  clientPrefix: TPrefix;

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
};

export function createEnv<
  TPrefix extends string,
  TServer extends Record<string, ZodType>,
  TClient extends Record<string, ZodType>
>(
  opts: CreateEnvOptions<TPrefix, TServer, TClient>
): z.infer<ZodObject<TServer>> & z.infer<ZodObject<TClient>> {
  const _client = typeof opts.client === "object" ? opts.client : {};
  const client = z.object(_client);
  const server = z.object(opts.server ?? {});
  const processEnv = opts.processEnv ?? {};
  const isServer = opts.isServer ?? typeof window === "undefined";
  const skip = opts.skipValidation ?? false;

  const merged = server.merge(client);

  if (skip) return processEnv as any;

  const parsed = isServer
    ? merged.safeParse(processEnv) // on server we can validate all env vars
    : client.safeParse(processEnv); // on client we can only validate the ones that are exposed

  if (parsed.success === false) {
    console.error(
      "❌ Invalid environment variables:",
      parsed.error.flatten().fieldErrors
    );
    throw new Error("Invalid environment variables");
  }

  return new Proxy(parsed.data, {
    get(target, prop) {
      if (typeof prop !== "string") return undefined;
      if (!isServer && !prop.startsWith(opts.clientPrefix))
        throw new Error(
          "❌ Attempted to access a server-side environment variable on the client"
        );
      return target[prop as keyof typeof target];
    },
  }) as any;
}
