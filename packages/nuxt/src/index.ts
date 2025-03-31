import type {
  CreateEnv,
  ServerClientOptions,
  StandardSchemaV1,
  StrictOptions,
} from "@t3-oss/env-core";
import { createEnv as createEnvCore } from "@t3-oss/env-core";

export type {
  StandardSchemaV1,
  StandardSchemaDictionary,
  ErrorMessage,
  Simplify,
} from "@t3-oss/env-core";

const CLIENT_PREFIX = "NUXT_PUBLIC_" as const;
type ClientPrefix = typeof CLIENT_PREFIX;

type Options<
  TServer extends Record<string, StandardSchemaV1>,
  TClient extends Record<`${ClientPrefix}${string}`, StandardSchemaV1>,
  TShared extends Record<string, StandardSchemaV1>,
  TExtends extends Array<Record<string, unknown>>,
> = Omit<
  StrictOptions<ClientPrefix, TServer, TClient, TShared, TExtends> &
    ServerClientOptions<ClientPrefix, TServer, TClient>,
  "runtimeEnvStrict" | "runtimeEnv" | "clientPrefix"
>;

export function createEnv<
  TServer extends Record<string, StandardSchemaV1> = NonNullable<unknown>,
  TClient extends Record<
    `${ClientPrefix}${string}`,
    StandardSchemaV1
  > = NonNullable<unknown>,
  TShared extends Record<string, StandardSchemaV1> = NonNullable<unknown>,
  const TExtends extends Array<Record<string, unknown>> = [],
>(
  opts: Options<TServer, TClient, TShared, TExtends>,
): CreateEnv<TServer, TClient, TShared, TExtends> {
  const client = typeof opts.client === "object" ? opts.client : {};
  const server = typeof opts.server === "object" ? opts.server : {};
  const shared = opts.shared;

  return createEnvCore<ClientPrefix, TServer, TClient, TShared, TExtends>({
    ...opts,
    shared,
    client,
    server,
    clientPrefix: CLIENT_PREFIX,
    runtimeEnv: process.env,
  });
}
