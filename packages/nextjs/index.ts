import { type ZodType } from "zod";

import { createEnv as createEnvCore, type StrictOptions } from "../core";

const CLIENT_PREFIX = "NEXT_PUBLIC_" as const;
type ClientPrefix = typeof CLIENT_PREFIX;

interface Options<
  TServer extends Record<string, ZodType> = NonNullable<unknown>,
  TClient extends Record<
    `${ClientPrefix}${string}`,
    ZodType
  > = NonNullable<unknown>
> extends Omit<
    StrictOptions<ClientPrefix, TServer, TClient>,
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
  return createEnvCore<ClientPrefix, TServer, TClient>({
    ...opts,
    clientPrefix: CLIENT_PREFIX,
    runtimeEnvStrict: runtimeEnv,
  });
}
