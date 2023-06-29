import { ZodType } from "zod";

import { CLIENT_PREFIX, ClientPrefix, ZodOptions, JoiOptions } from "./types";
import {
  zodAdapter as createZodAdapter,
  joiAdapter as createJoiAdapter,
} from "../core";
import { AnySchema } from "joi";

export function zodAdapter<
  TServer extends Record<string, ZodType> = NonNullable<unknown>,
  TClient extends Record<
    `${ClientPrefix}${string}`,
    ZodType
  > = NonNullable<unknown>,
  TShared extends Record<string, ZodType> = NonNullable<unknown>
>(opts: ZodOptions<TServer, TClient, TShared>) {
  const client = typeof opts.client === "object" ? opts.client : {};
  const server = typeof opts.server === "object" ? opts.server : {};
  const shared = typeof opts.shared === "object" ? opts.shared : {};

  const runtimeEnv = opts.runtimeEnv
    ? opts.runtimeEnv
    : {
        ...process.env,
        ...opts.experimental__runtimeEnv,
      };

  return createZodAdapter<ClientPrefix, TServer, TClient, TShared>({
    ...opts,
    shared: shared as any,
    client,
    server,
    clientPrefix: CLIENT_PREFIX,
    runtimeEnv,
  });
}

export function joiAdapter<
  TServer extends Record<string, AnySchema<any>> = NonNullable<unknown>,
  TClient extends Record<
    `${ClientPrefix}${string}`,
    AnySchema<any>
  > = NonNullable<unknown>,
  TShared extends Record<string, AnySchema<any>> = NonNullable<unknown>
>(opts: JoiOptions<TServer, TClient, TShared>) {
  const client = typeof opts.client === "object" ? opts.client : {};
  const server = typeof opts.server === "object" ? opts.server : {};
  const shared = typeof opts.shared === "object" ? opts.shared : {};

  const runtimeEnv = opts.runtimeEnv
    ? opts.runtimeEnv
    : {
        ...process.env,
        ...opts.experimental__runtimeEnv,
      };

  return createJoiAdapter<ClientPrefix, TServer, TClient, TShared>({
    ...opts,
    shared: shared as any,
    client,
    server,
    clientPrefix: CLIENT_PREFIX,
    runtimeEnv,
  });
}
