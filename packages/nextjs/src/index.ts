import {
  type UnknownKeysParam,
  type ZodObject,
  type ZodRawShape,
  type ZodTypeAny,
  object,
} from "zod";
import type {
  CreateEnv,
  SchemaObject,
  SchemaShape,
  ServerClientOptions,
  StrictOptions,
} from "../../core/src/index";
import { createEnv as createEnvCore } from "../../core/src/index";

const CLIENT_PREFIX = "NEXT_PUBLIC_" as const;
type ClientPrefix = typeof CLIENT_PREFIX;

type Options<
  TServer extends SchemaObject,
  TClient extends SchemaObject,
  TShared extends SchemaObject,
  TExtends extends Array<Record<string, unknown>>,
> = Omit<
  StrictOptions<ClientPrefix, TServer, TClient, TShared, TExtends> &
    ServerClientOptions<ClientPrefix, TServer, TClient>,
  "runtimeEnvStrict" | "runtimeEnv" | "clientPrefix"
> &
  (
    | {
        /**
         * Manual destruction of `process.env`. Required for Next.js < 13.4.4.
         */
        runtimeEnv: StrictOptions<
          ClientPrefix,
          TServer,
          TClient,
          TShared,
          TExtends
        >["runtimeEnvStrict"];
        experimental__runtimeEnv?: never;
      }
    | {
        runtimeEnv?: never;
        /**
         * Can be used for Next.js ^13.4.4 since they stopped static analysis of server side `process.env`.
         * Only client side `process.env` is statically analyzed and needs to be manually destructured.
         */
        experimental__runtimeEnv: Record<
          | {
              [TKey in keyof SchemaShape<TClient>]: TKey extends `${ClientPrefix}${string}`
                ? TKey
                : never;
            }[keyof SchemaShape<TClient>]
          | {
              [TKey in keyof SchemaShape<TShared>]: TKey extends string
                ? TKey
                : never;
            }[keyof SchemaShape<TShared>],
          string | boolean | number | undefined
        >;
      }
  );

export function createEnv<
  TServer extends SchemaObject = SchemaObject,
  TClient extends SchemaObject = SchemaObject,
  TShared extends SchemaObject = SchemaObject,
  const TExtends extends Array<Record<string, unknown>> = [],
>(
  opts: Options<TServer, TClient, TShared, TExtends>,
): CreateEnv<TServer, TClient, TShared, TExtends> {
  const client =
    typeof opts.client === "object"
      ? opts.client
      : (object({}) as ZodObject<
          ZodRawShape,
          UnknownKeysParam,
          ZodTypeAny,
          {},
          {}
        >);
  const server =
    typeof opts.server === "object"
      ? opts.server
      : (object({}) as ZodObject<
          ZodRawShape,
          UnknownKeysParam,
          ZodTypeAny,
          {},
          {}
        >);
  const shared = opts.shared;

  const runtimeEnv = opts.runtimeEnv
    ? opts.runtimeEnv
    : {
        ...process.env,
        ...opts.experimental__runtimeEnv,
      };

  type TClient2 = typeof client;
  type TServer2 = typeof server;

  return createEnvCore<ClientPrefix, TServer2, TClient2, TShared, TExtends>({
    ...opts,
    shared,
    client,
    server,
    clientPrefix: CLIENT_PREFIX,
    runtimeEnv,
  });
}
