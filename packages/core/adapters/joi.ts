import { EnvOptions } from "../types";
import { onInvalidAccess } from "./shared";
import Joi, { AnySchema } from "joi";

export const joiAdapter = <
  TPrefix extends string = "",
  TServer extends Record<string, AnySchema<any>> = NonNullable<unknown>,
  TClient extends Record<string, AnySchema<any>> = NonNullable<unknown>,
  TShared extends Record<string, AnySchema<any>> = NonNullable<unknown>
>(
  opts: EnvOptions<TPrefix, TServer, TClient, TShared>
): {
  [key: string]: string | number | boolean | undefined;
} => {
  const runtimeEnv = opts.runtimeEnvStrict ?? opts.runtimeEnv ?? process.env;

  const skip = !!opts.skipValidation;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any
  if (skip) return runtimeEnv as any;

  const _client = typeof opts.client === "object" ? opts.client : {};
  const _server = typeof opts.server === "object" ? opts.server : {};
  const _shared = typeof opts.shared === "object" ? opts.shared : {};
  const client = Joi.object(_client);
  const server = Joi.object(_server);
  const shared = Joi.object(_shared);
  const isServer = opts.isServer ?? typeof window === "undefined";

  const allClient = client.concat(shared);
  const allServer = server.concat(shared).concat(client);
  const parsed = isServer
    ? validate(allServer, runtimeEnv) // on server we can validate all env vars
    : validate(allClient, runtimeEnv); // on client we can only validate the ones that are exposed
  const env = new Proxy(parsed, {
    get(target, prop) {
      if (typeof prop !== "string") return undefined;
      if (
        !isServer &&
        opts.clientPrefix &&
        !prop.startsWith(opts.clientPrefix)
      ) {
        return onInvalidAccess(opts);
      }
      return target[prop as string];
    },
  });

  return env as any;
};

export function validate<T>(schema: Joi.Schema<T>, data: unknown): Partial<T> {
  const { error, value } = schema.validate(data, {
    stripUnknown: true,
  });

  if (error) {
    console.error(
      "❌ Invalid environment variables: \n",
      error.details.map((detail) => `  - ${detail.message}`).join(`\n`)
    );
    throw new Error("Invalid environment variables");
  }

  return value;
}
