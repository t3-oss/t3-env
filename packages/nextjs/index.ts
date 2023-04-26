import { type ZodType } from "zod";

import { createEnv as createEnvCore, type StrictOptions } from "../core";

type ClientPrefix = "NEXT_PUBLIC_";

interface Options<
  TServer extends Record<string, ZodType>,
  TClient extends Record<`${ClientPrefix}${string}`, ZodType>
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
  TServer extends Record<string, ZodType>,
  TClient extends Record<`${ClientPrefix}${string}`, ZodType>
>({ runtimeEnv, ...opts }: Options<TServer, TClient>) {
  return createEnvCore<ClientPrefix, TServer, TClient>({
    ...opts,
    clientPrefix: "NEXT_PUBLIC_",
    runtimeEnvStrict: runtimeEnv,
  });
}
