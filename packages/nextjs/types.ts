export const CLIENT_PREFIX = "NEXT_PUBLIC_" as const;
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
          TShared
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
              [TKey in keyof TClient]: TKey extends `${ClientPrefix}${string}`
                ? TKey
                : never;
            }[keyof TClient]
          | {
              [TKey in keyof TShared]: TKey extends string ? TKey : never;
            }[keyof TShared],
          string | boolean | number | undefined
        >;
      }
  );

export type JoiOptions<
  TServer extends Record<string, AnySchema<any>>,
  TClient extends Record<`${ClientPrefix}${string}`, AnySchema<any>>,
  TShared extends Record<string, AnySchema<any>>
> = Omit<
  StrictOptions<ClientPrefix, TServer, TClient, TShared> &
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
          TShared
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
              [TKey in keyof TClient]: TKey extends `${ClientPrefix}${string}`
                ? TKey
                : never;
            }[keyof TClient]
          | {
              [TKey in keyof TShared]: TKey extends string ? TKey : never;
            }[keyof TShared],
          string | boolean | number | undefined
        >;
      }
  );
