import { type ZodType } from "zod";

import {
  createEnv as createEnvCore,
  ServerClientOptions,
  type StrictOptions,
} from "../core";

const CLIENT_PREFIX = "NEXT_PUBLIC_" as const;
type ClientPrefix = typeof CLIENT_PREFIX;

interface Options<
  TServer extends Record<string, ZodType>,
  TClient extends Record<`${ClientPrefix}${string}`, ZodType>
> extends Omit<
    StrictOptions<ClientPrefix, TServer, TClient> &
      ServerClientOptions<ClientPrefix, TServer, TClient>,
    "runtimeEnvStrict" | "runtimeEnv" | "clientPrefix"
  > {
  /**
   * Manual destruction of `process.env`. Required for Next.js.
   */
  runtimeEnv: StrictOptions<ClientPrefix, TServer, TClient>["runtimeEnvStrict"];
}

export function createEnv<
  TServer extends Record<string, ZodType> = NonNullable<unknown>,
  TClient extends Record<
    `${ClientPrefix}${string}`,
    ZodType
  > = NonNullable<unknown>
>({ runtimeEnv, ...opts }: Options<TServer, TClient>) {
  const client =
    typeof opts.client === "object"
      ? opts.client
      : ({} as {
          [TKey in keyof TClient]: TKey extends `NEXT_PUBLIC_${string}`
            ? TClient[TKey]
            : `${TKey extends string
                ? TKey
                : never} is not prefixed with NEXT_PUBLIC_.`;
        });
  const server =
    typeof opts.server === "object"
      ? opts.server
      : ({} as {
          [TKey in keyof TServer]: TKey extends `NEXT_PUBLIC_${string}`
            ? `${TKey extends `NEXT_PUBLIC_${string}`
                ? TKey
                : never} should not prefixed with NEXT_PUBLIC_.`
            : TServer[TKey];
        });

  return createEnvCore<ClientPrefix, TServer, TClient>({
    ...opts,
    client,
    server,
    clientPrefix: CLIENT_PREFIX,
    runtimeEnvStrict: runtimeEnv,
  });
}
