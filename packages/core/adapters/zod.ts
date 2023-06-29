import { EnvOptions, Simplify } from "../types";
import z, { type ZodObject, ZodError, ZodType } from "zod";
import { onInvalidAccess, onValidationError } from "./shared";

export const zodAdapter = <
  TPrefix extends string = "",
  TServer extends Record<string, ZodType> = NonNullable<unknown>,
  TClient extends Record<string, ZodType> = NonNullable<unknown>,
  TShared extends Record<string, ZodType> = NonNullable<unknown>
>(
  opts: EnvOptions<TPrefix, TServer, TClient, TShared>
): Simplify<
  z.infer<ZodObject<TServer>> &
    z.infer<ZodObject<TClient>> &
    z.infer<ZodObject<TShared>>
> => {
  const runtimeEnv = opts.runtimeEnvStrict ?? opts.runtimeEnv ?? process.env;

  const skip = !!opts.skipValidation;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any
  if (skip) return runtimeEnv as any;

  const _client = typeof opts.client === "object" ? opts.client : {};
  const _server = typeof opts.server === "object" ? opts.server : {};
  const _shared = typeof opts.shared === "object" ? opts.shared : {};
  const client = z.object(_client);
  const server = z.object(_server);
  const shared = z.object(_shared);
  const isServer = opts.isServer ?? typeof window === "undefined";

  const allClient = client.merge(shared);
  const allServer = server.merge(shared).merge(client);
  const parsed = isServer
    ? validate(allServer, runtimeEnv) // on server we can validate all env vars
    : validate(allClient, runtimeEnv); // on client we can only validate the ones that are exposed

  if (parsed.success === false) {
    //@ts-ignore
    return onValidationError(parsed.error);
  }
  const env = new Proxy(parsed, {
    get(target, prop) {
      if (typeof prop !== "string") return undefined;
      if (
        !isServer &&
        opts.clientPrefix &&
        !prop.startsWith(opts.clientPrefix) &&
        shared.shape[prop as keyof typeof shared.shape] === undefined
      ) {
        return onInvalidAccess(opts);
      }
      return target[prop as keyof typeof target];
    },
  });

  return env as any;
};

const validate = (schema: ZodObject<any>, data: unknown) => {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof ZodError) {
      console.error(
        "❌ Invalid environment variables:",
        error.issues.map((issue) => `\n  - ${issue.message}`).join("")
      );
      throw new Error("Invalid environment variables");
    }
    throw error;
  }
};
