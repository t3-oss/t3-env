export const CLIENT_PREFIX = "NUXT_PUBLIC_" as const;
export type ClientPrefix = typeof CLIENT_PREFIX;
import { type ZodType } from "zod";

import { ServerClientOptions, type StrictOptions } from "../core";
import { AnySchema } from "joi";

export type ZodOptions<
  TServer extends Record<string, ZodType>,
  TClient extends Record<`${ClientPrefix}${string}`, ZodType>,
  TShared extends Record<string, ZodType>
> = Omit<
  StrictOptions<ClientPrefix, TServer, TClient, TShared> &
    ServerClientOptions<ClientPrefix, TServer, TClient>,
  "runtimeEnvStrict" | "runtimeEnv" | "clientPrefix"
>;

export type JoiOptions<
  TServer extends Record<string, AnySchema<any>>,
  TClient extends Record<`${ClientPrefix}${string}`, AnySchema<any>>,
  TShared extends Record<string, AnySchema<any>>
> = Omit<
  StrictOptions<ClientPrefix, TServer, TClient, TShared> &
    ServerClientOptions<ClientPrefix, TServer, TClient>,
  "runtimeEnvStrict" | "runtimeEnv" | "clientPrefix"
>;
