import type { ZodType } from "zod";
import {
  createEnv as createEnvCore,
  ServerClientOptions,
  StrictOptions,
} from "../core";

const CLIENT_PREFIX = "NUXT_PUBLIC_" as const;
type ClientPrefix = typeof CLIENT_PREFIX;

type Options<
  TServer extends Record<string, ZodType>,
  TClient extends Record<`${ClientPrefix}${string}`, ZodType>,
  TShared extends Record<string, ZodType>
> = Omit<
  StrictOptions<ClientPrefix, TServer, TClient, TShared> &
    ServerClientOptions<ClientPrefix, TServer, TClient>,
  "runtimeEnvStrict" | "runtimeEnv" | "clientPrefix"
>;

export function createEnv<
  TServer extends Record<string, ZodType> = NonNullable<unknown>,
  TClient extends Record<string, ZodType> = NonNullable<unknown>,
  TShared extends Record<string, ZodType> = NonNullable<unknown>
>(opts: Options<TServer, TClient, TShared>) {
  const client = typeof opts.client === "object" ? opts.client : {};
  const server = typeof opts.server === "object" ? opts.server : {};
  const shared = opts.shared;

  return createEnvCore<ClientPrefix, TServer, TClient, TShared>({
    ...opts,
    shared,
    client,
    server,
    clientPrefix: CLIENT_PREFIX,
    runtimeEnv: process.env,
  });
}
