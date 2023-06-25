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
  TBuildEnv extends Record<string, ZodType>
> = Omit<
  StrictOptions<ClientPrefix, TServer, TClient, TBuildEnv> &
    ServerClientOptions<ClientPrefix, TServer, TClient>,
  "runtimeEnvStrict" | "runtimeEnv" | "clientPrefix"
>;

export function createEnv<
  TServer extends Record<string, ZodType> = NonNullable<unknown>,
  TClient extends Record<string, ZodType> = NonNullable<unknown>,
  TBuildEnv extends Record<string, ZodType> = NonNullable<unknown>
>(opts: Options<TServer, TClient, TBuildEnv>) {
  const buildEnvs = typeof opts.buildEnvs === "object" ? opts.buildEnvs : {};
  const client = typeof opts.client === "object" ? opts.client : {};
  const server = typeof opts.server === "object" ? opts.server : {};

  return createEnvCore<ClientPrefix, TServer, TClient, TBuildEnv>({
    ...opts,
    // FIXME: don't require this `as any` cast
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
    buildEnvs: buildEnvs as any,
    client,
    server,
    clientPrefix: CLIENT_PREFIX,
    runtimeEnv: process.env,
  });
}
