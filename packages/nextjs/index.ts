import { type ZodType } from "zod";

import {
  createEnv as createEnvCore,
  ServerClientOptions,
  type StrictOptions,
} from "../core";

const CLIENT_PREFIX = "NEXT_PUBLIC_" as const;
type ClientPrefix = typeof CLIENT_PREFIX;

type Options<
  TServer extends Record<string, ZodType>,
  TClient extends Record<`${ClientPrefix}${string}`, ZodType>,
  TBuildEnv extends Record<string, ZodType>
> = Omit<
  StrictOptions<ClientPrefix, TServer, TClient, TBuildEnv> &
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
          TBuildEnv
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
          {
            [TKey in keyof TClient]: TKey extends `${ClientPrefix}${string}`
              ? TKey
              : never;
          }[keyof TClient],
          string | boolean | number | undefined
        >;
      }
  );

export function createEnv<
  TServer extends Record<string, ZodType> = NonNullable<unknown>,
  TClient extends Record<
    `${ClientPrefix}${string}`,
    ZodType
  > = NonNullable<unknown>,
  TBuildEnv extends Record<string, ZodType> = NonNullable<unknown>
>(opts: Options<TServer, TClient, TBuildEnv>) {
  const buildEnvs = typeof opts.buildEnvs === "object" ? opts.buildEnvs : {};
  const client = typeof opts.client === "object" ? opts.client : {};
  const server = typeof opts.server === "object" ? opts.server : {};

  const runtimeEnv = opts.runtimeEnv
    ? opts.runtimeEnv
    : {
        ...process.env,
        ...opts.experimental__runtimeEnv,
        NODE_ENV: process.env.NODE_ENV,
      };

  return createEnvCore<ClientPrefix, TServer, TClient>({
    ...opts,
    // FIXME: don't require this `as any` cast
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
    buildEnvs: buildEnvs as any,
    client,
    server,
    clientPrefix: CLIENT_PREFIX,
    runtimeEnv,
  });
}
