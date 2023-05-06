import type { ZodType } from "zod";
import { createEnv as createEnvCore, StrictOptions } from "../core";

const CLIENT_PREFIX = "NUXT_PUBLIC_" as const;
type ClientPrefix = typeof CLIENT_PREFIX;

type Options<
  TServer extends Record<string, ZodType>,
  TClient extends Record<`${ClientPrefix}${string}`, ZodType>
> = Omit<
  StrictOptions<ClientPrefix, TServer, TClient>,
  "runtimeEnvStrict" | "runtimeEnv" | "clientPrefix"
>;

export function createEnv<
  TServer extends Record<string, ZodType> = NonNullable<unknown>,
  TClient extends Record<string, ZodType> = NonNullable<unknown>
>(opts: Options<TServer, TClient>) {
  return createEnvCore<ClientPrefix, TServer, TClient>({
    ...opts,
    clientPrefix: CLIENT_PREFIX,
    runtimeEnv: process.env,
  });
}
