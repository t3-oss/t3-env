import Joi, { AnySchema, ValidationError } from "joi";
import { z, ZodType, ZodError } from "zod";

export type ErrorMessage<T extends string> = T;
export type Simplify<T> = {
  [P in keyof T]: T[P];
  // eslint-disable-next-line @typescript-eslint/ban-types
} & {};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Impossible<T extends Record<string, any>> = Partial<
  Record<keyof T, never>
>;

export interface BaseOptions<
  TShared extends Record<string, ZodType | AnySchema<any>>
> {
  /**
   * How to determine whether the app is running on the server or the client.
   * @default typeof window === "undefined"
   */
  isServer?: boolean;

  /**
   * Shared variables, often those that are provided by build tools and is available to both client and server,
   * but isn't prefixed and doesn't require to be manually supplied. For example `NODE_ENV`, `VERCEL_URL` etc.
   */
  shared?: TShared;

  /**
   * Called when validation fails. By default the error is logged,
   * and an error is thrown telling what environment variables are invalid.
   */
  onValidationError?: (error: ZodError | ValidationError) => never;

  /**
   * Called when a server-side environment variable is accessed on the client.
   * By default an error is thrown.
   */
  onInvalidAccess?: (variable: string) => never;

  /**
   * Whether to skip validation of environment variables.
   * @default false
   */
  skipValidation?: boolean;

  /**
   * Validator
   * @default zod
   */
  validator?: "zod" | "joi";
}

export interface LooseOptions<
  TShared extends Record<string, ZodType | AnySchema<any>>
> extends BaseOptions<TShared> {
  runtimeEnvStrict?: never;
  /**
   * Runtime Environment variables to use for validation - `process.env`, `import.meta.env` or similar.
   * Unlike `runtimeEnvStrict`, this doesn't enforce that all environment variables are set.
   */
  runtimeEnv: Record<string, string | boolean | number | undefined>;
}

export interface StrictOptions<
  TPrefix extends string,
  TServer extends Record<string, ZodType | AnySchema<any>>,
  TClient extends Record<string, ZodType | AnySchema<any>>,
  TShared extends Record<string, ZodType | AnySchema<any>>
> extends BaseOptions<TShared> {
  /**
   * Runtime Environment variables to use for validation - `process.env`, `import.meta.env` or similar.
   * Enforces all environment variables to be set. Required in for example Next.js Edge and Client runtimes.
   */
  runtimeEnvStrict: Record<
    | {
        [TKey in keyof TClient]: TKey extends `${TPrefix}${string}`
          ? TKey
          : never;
      }[keyof TClient]
    | {
        [TKey in keyof TServer]: TKey extends `${TPrefix}${string}`
          ? never
          : TKey;
      }[keyof TServer]
    | {
        [TKey in keyof TShared]: TKey extends string ? TKey : never;
      }[keyof TShared],
    string | boolean | number | undefined
  >;
  runtimeEnv?: never;
}

export interface ClientOptions<
  TPrefix extends string,
  TClient extends Record<string, ZodType | AnySchema<any>>
> {
  /**
   * Client-side environment variables are exposed to the client by default. Set what prefix they have
   */
  clientPrefix: TPrefix;

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app isn't
   * built with invalid env vars. To expose them to the client, prefix them with `NEXT_PUBLIC_`.
   */
  client: Partial<{
    [TKey in keyof TClient]: TKey extends `${TPrefix}${string}`
      ? TClient[TKey]
      : ErrorMessage<`${TKey extends string
          ? TKey
          : never} is not prefixed with ${TPrefix}.`>;
  }>;
}

export interface ServerOptions<
  TPrefix extends string,
  TServer extends Record<string, ZodType | AnySchema<any>>
> {
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app isn't
   * built with invalid env vars.
   */
  server: Partial<{
    [TKey in keyof TServer]: TPrefix extends ""
      ? TServer[TKey]
      : TKey extends `${TPrefix}${string}`
      ? ErrorMessage<`${TKey extends `${TPrefix}${string}`
          ? TKey
          : never} should not prefixed with ${TPrefix}.`>
      : TServer[TKey];
  }>;
}

export type ServerClientOptions<
  TPrefix extends string,
  TServer extends Record<string, ZodType | AnySchema<any>>,
  TClient extends Record<string, ZodType | AnySchema<any>>
> =
  | (ClientOptions<TPrefix, TClient> & ServerOptions<TPrefix, TServer>)
  | (ServerOptions<TPrefix, TServer> & Impossible<ClientOptions<never, never>>)
  | (ClientOptions<TPrefix, TClient> & Impossible<ServerOptions<never, never>>);

export type EnvOptions<
  TPrefix extends string,
  TServer extends Record<string, ZodType | AnySchema<any>>,
  TClient extends Record<string, ZodType | AnySchema<any>>,
  TShared extends Record<string, ZodType | AnySchema<any>>
> =
  | (LooseOptions<TShared> & ServerClientOptions<TPrefix, TServer, TClient>)
  | (StrictOptions<TPrefix, TServer, TClient, TShared> &
      ServerClientOptions<TPrefix, TServer, TClient>);

export function validateWithZod(schema: z.ZodObject<any>, data: unknown) {
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
}

export function validateWithJoi<T>(
  schema: Joi.Schema<T>,
  data: unknown
): Partial<T> {
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

export function createEnv<
  TPrefix extends string = "",
  TServer extends Record<
    string,
    ZodType | AnySchema<any>
  > = NonNullable<unknown>,
  TClient extends Record<
    string,
    ZodType | AnySchema<any>
  > = NonNullable<unknown>,
  TShared extends Record<
    string,
    ZodType | AnySchema<any>
  > = NonNullable<unknown>
>(
  opts: EnvOptions<TPrefix, TServer, TClient, TShared>
): {
  [key: string]: string | boolean | number | undefined;
} {
  const runtimeEnv = opts.runtimeEnvStrict ?? opts.runtimeEnv ?? process.env;

  const skip = !!opts.skipValidation;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any
  if (skip) return runtimeEnv as any;

  const _client = typeof opts.client === "object" ? opts.client : {};
  const _server = typeof opts.server === "object" ? opts.server : {};
  const _shared = typeof opts.shared === "object" ? opts.shared : {};

  const isZod = () => {
    if (opts.validator === "joi") {
      return false;
    }
    return true;
  };

  const returnObject = (obj: any) => {
    return isZod() ? z.object(obj) : Joi.object(obj);
  };

  const client = returnObject(_client);
  const server = returnObject(_server);
  const shared = returnObject(_shared);

  const isServer = opts.isServer ?? typeof window === "undefined";

  const merge = (
    obj1: z.ZodObject<any> | Joi.AnySchema<any>,
    ...rest: Array<z.ZodObject<any> | Joi.AnySchema<any>>
  ): z.ZodObject<any> | Joi.AnySchema<any> => {
    if (isZod()) {
      const toMerge = obj1 as z.ZodObject<any>;
      const merged = rest.reduce<z.ZodObject<any>>(
        (acc, schema) => acc.merge(schema as z.ZodObject<any>),
        toMerge
      );
      return merged;
    } else {
      const toMerge = obj1 as Joi.AnySchema<any>;
      const merged = rest.reduce<Joi.AnySchema<any>>(
        (acc, schema) => acc.concat(schema as Joi.AnySchema<any>),
        toMerge
      );
      return merged;
    }
  };

  const allClient = merge(client, shared);
  const allServer = merge(shared, client, server);
  const parsed = isZod()
    ? isServer
      ? validateWithZod(allServer as z.ZodObject<any>, runtimeEnv)
      : validateWithZod(allClient as z.ZodObject<any>, runtimeEnv)
    : isServer
    ? validateWithJoi(allServer as Joi.AnySchema<any>, runtimeEnv)
    : validateWithJoi(allClient as Joi.AnySchema<any>, runtimeEnv);

  const onInvalidAccess =
    opts.onInvalidAccess ??
    ((_variable: string) => {
      throw new Error(
        "❌ Attempted to access a server-side environment variable on the client"
      );
    });

  const env = new Proxy(parsed, {
    get(target, prop) {
      if (typeof prop !== "string") return undefined;
      if (
        !isServer &&
        opts.clientPrefix &&
        !prop.startsWith(opts.clientPrefix)
      ) {
        return onInvalidAccess(prop);
      }
      return target[prop as keyof typeof target];
    },
  });

  // eslint-disable-next c-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any
  return env as {
    [key: string]: string | boolean | number | undefined;
  };
}
