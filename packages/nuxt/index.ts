import { ZodType } from "zod";

import { CLIENT_PREFIX, ClientPrefix, ZodOptions, JoiOptions } from "./types";
import {
  zodAdapter as createZodAdapter,
  joiAdapter as createJoiAdapter,
} from "../core";
import { AnySchema } from "joi";

export function zodAdapter<
  TServer extends Record<string, ZodType> = NonNullable<unknown>,
  TClient extends Record<string, ZodType> = NonNullable<unknown>,
  TShared extends Record<string, ZodType> = NonNullable<unknown>
>(opts: ZodOptions<TServer, TClient, TShared>) {
  const client = typeof opts.client === "object" ? opts.client : {};
  const server = typeof opts.server === "object" ? opts.server : {};
  const shared = typeof opts.shared === "object" ? opts.shared : {};

  return createZodAdapter<ClientPrefix, TServer, TClient, TShared>({
    ...opts,
    // FIXME: don't require this `as any` cast
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
    shared: shared as any,
    client,
    server,
    clientPrefix: CLIENT_PREFIX,
    runtimeEnv: process.env,
  });
}

export function joiAdapter<
  TServer extends Record<string, AnySchema<any>> = NonNullable<unknown>,
  TClient extends Record<string, AnySchema<any>> = NonNullable<unknown>,
  TShared extends Record<string, AnySchema<any>> = NonNullable<unknown>
>(opts: JoiOptions<TServer, TClient, TShared>) {
  const client = typeof opts.client === "object" ? opts.client : {};
  const server = typeof opts.server === "object" ? opts.server : {};
  const shared = typeof opts.shared === "object" ? opts.shared : {};

  return createJoiAdapter<ClientPrefix, TServer, TClient, TShared>({
    ...opts,
    // FIXME: don't require this `as any` cast
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
    shared: shared as any,
    client,
    server,
    clientPrefix: CLIENT_PREFIX,
    runtimeEnv: process.env,
  });
}
