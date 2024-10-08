import type {
  TypeOf,
  UnknownKeysParam,
  ZodError,
  ZodObject,
  ZodRawShape,
  ZodTypeAny,
} from "zod";
import { object } from "zod";

export type ErrorMessage<T extends string> = T;
export type Simplify<T> = {
  [P in keyof T]: T[P];
} & {};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type Impossible<T extends Record<string, any>> = Partial<
  Record<keyof T, never>
>;

type UnReadonlyObject<T> = T extends Readonly<infer U> ? U : T;

type Reduce<
  TArr extends Array<Record<string, unknown>>,
  TAcc = {},
> = TArr extends []
  ? TAcc
  : TArr extends [infer Head, ...infer Tail]
    ? Tail extends Array<Record<string, unknown>>
      ? Head & Reduce<Tail, TAcc>
      : never
    : never;

export interface BaseOptions<
  TShared extends SchemaObject,
  TExtends extends Array<Record<string, unknown>>,
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
   * Extend presets
   */
  extends?: TExtends;

  /**
   * Called when validation fails. By default the error is logged,
   * and an error is thrown telling what environment variables are invalid.
   */
  onValidationError?: (error: ZodError) => never;

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
   * By default, this library will feed the environment variables directly to
   * the Zod validator.
   *
   * This means that if you have an empty string for a value that is supposed
   * to be a number (e.g. `PORT=` in a ".env" file), Zod will incorrectly flag
   * it as a type mismatch violation. Additionally, if you have an empty string
   * for a value that is supposed to be a string with a default value (e.g.
   * `DOMAIN=` in an ".env" file), the default value will never be applied.
   *
   * In order to solve these issues, we recommend that all new projects
   * explicitly specify this option as true.
   */
  emptyStringAsUndefined?: boolean;
}

export interface LooseOptions<
  TShared extends SchemaObject,
  TExtends extends Array<Record<string, unknown>>,
> extends BaseOptions<TShared, TExtends> {
  runtimeEnvStrict?: never;

  /**
   * What object holds the environment variables at runtime. This is usually
   * `process.env` or `import.meta.env`.
   */
  // Unlike `runtimeEnvStrict`, this doesn't enforce that all environment variables are set.
  runtimeEnv: Record<string, string | boolean | number | undefined>;
}

export interface StrictOptions<
  TPrefix extends string | undefined,
  TServer extends SchemaObject,
  TClient extends SchemaObject,
  TShared extends SchemaObject,
  TExtends extends Array<Record<string, unknown>>,
> extends BaseOptions<TShared, TExtends> {
  /**
   * Runtime Environment variables to use for validation - `process.env`, `import.meta.env` or similar.
   * Enforces all environment variables to be set. Required in for example Next.js Edge and Client runtimes.
   */
  runtimeEnvStrict: Record<
    | {
        [TKey in keyof SchemaShape<TClient>]: TPrefix extends undefined
          ? never
          : TKey extends `${TPrefix}${string}`
            ? TKey
            : never;
      }[keyof SchemaShape<TClient>]
    | {
        [TKey in keyof SchemaShape<TServer>]: TPrefix extends undefined
          ? TKey
          : TKey extends `${TPrefix}${string}`
            ? never
            : TKey;
      }[keyof SchemaShape<TServer>]
    | {
        [TKey in keyof SchemaShape<TShared>]: TKey extends string
          ? TKey
          : never;
      }[keyof SchemaShape<TShared>],
    string | boolean | number | undefined
  >;
  runtimeEnv?: never;
}

export interface ClientOptions<
  TPrefix extends string | undefined,
  TClientSchema extends SchemaObject,
> {
  /**
   * The prefix that client-side variables must have. This is enforced both at
   * a type-level and at runtime.
   */
  clientPrefix: TPrefix;

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app isn't
   * built with invalid env vars.
   */
  client: TClientSchema extends ZodObject<
    infer R1,
    infer R2,
    infer R3,
    infer R4,
    unknown
  >
    ? TClientSchema extends never
      ? TClientSchema
      : ZodObject<
          R1,
          R2,
          R3,
          R4,
          {
            [TKey in keyof TClientSchema["_input"]]: TKey extends `${TPrefix}${string}`
              ? TClientSchema[TKey]
              : ErrorMessage<`${TKey extends string
                  ? TKey
                  : never} is not prefixed with ${TPrefix}.`>;
          }
        >
    : never;
}

export type SchemaShape<T extends SchemaObject> = T["_input"]; // extends Schema<any, any, infer Shape> ? Shape : never

export type SchemaObject = ZodObject<
  ZodRawShape,
  UnknownKeysParam,
  ZodTypeAny,
  {},
  {}
>;

export interface ServerOptions<
  TPrefix extends string | undefined,
  TServerSchema extends SchemaObject,
> {
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app isn't
   * built with invalid env vars.
   */
  server: TServerSchema extends ZodObject<
    infer R1,
    infer R2,
    infer R3,
    infer R4,
    unknown
  >
    ? TServerSchema extends never
      ? TServerSchema
      : TPrefix extends undefined
        ? TServerSchema
        : TPrefix extends ""
          ? TServerSchema
          : ZodObject<
              R1,
              R2,
              R3,
              R4,
              {
                [TKey in keyof TServerSchema["_input"]]: TKey extends `${TPrefix}${string}`
                  ? ErrorMessage<`${TKey extends `${TPrefix}${string}`
                      ? TKey
                      : never} should not prefixed with ${TPrefix}.`>
                  : TServerSchema["_input"][TKey];
              }
            >
    : never;
}

export type ServerClientOptions<
  TPrefix extends string | undefined,
  TServer extends SchemaObject,
  TClient extends SchemaObject,
> =
  | (ClientOptions<TPrefix, TClient> & ServerOptions<TPrefix, TServer>)
  | (ServerOptions<TPrefix, TServer> & Impossible<ClientOptions<never, never>>)
  | (ClientOptions<TPrefix, TClient> & Impossible<ServerOptions<never, never>>);

export type EnvOptions<
  TPrefix extends string | undefined,
  TServer extends SchemaObject,
  TClient extends SchemaObject,
  TShared extends SchemaObject,
  TExtends extends Array<Record<string, unknown>>,
> =
  | (LooseOptions<TShared, TExtends> &
      ServerClientOptions<TPrefix, TServer, TClient>)
  | ((StrictOptions<TPrefix, TServer, TClient, TShared, TExtends> &
      ServerClientOptions<TPrefix, TServer, TClient>) & {
      a?: ServerClientOptions<TPrefix, TServer, TClient>["client"];
    });

type TPrefixFormat = string | undefined;
type TServerFormat = SchemaObject;
type TClientFormat = SchemaObject;
type TSharedFormat = SchemaObject;
type TExtendsFormat = Array<Record<string, unknown>>;

export type CreateEnv<
  TServer extends TServerFormat,
  TClient extends TClientFormat,
  TShared extends TSharedFormat,
  TExtends extends TExtendsFormat,
> = Readonly<
  Simplify<
    TypeOf<TServer> &
      TypeOf<TClient> &
      TypeOf<TShared> &
      UnReadonlyObject<Reduce<TExtends>>
  >
>;

export function createEnv<
  TPrefix extends TPrefixFormat,
  TServer extends TServerFormat = SchemaObject,
  TClient extends TClientFormat = SchemaObject,
  TShared extends TSharedFormat = SchemaObject,
  const TExtends extends TExtendsFormat = [],
>(
  opts: EnvOptions<TPrefix, TServer, TClient, TShared, TExtends>,
): CreateEnv<TServer, TClient, TShared, TExtends> {
  const runtimeEnv = opts.runtimeEnvStrict ?? opts.runtimeEnv ?? process.env;

  const emptyStringAsUndefined = opts.emptyStringAsUndefined ?? false;
  if (emptyStringAsUndefined) {
    for (const [key, value] of Object.entries(runtimeEnv)) {
      if (value === "") {
        delete runtimeEnv[key];
      }
    }
  }

  const skip = !!opts.skipValidation;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  if (skip) return runtimeEnv as any;

  const client = typeof opts.client === "object" ? opts.client : object({});
  const server = typeof opts.server === "object" ? opts.server : object({});
  const shared = typeof opts.shared === "object" ? opts.shared : object({});
  const isServer =
    opts.isServer ?? (typeof window === "undefined" || "Deno" in window);

  const allClient = client.merge(shared);
  const allServer = server.merge(shared).merge(client);
  const parsed = isServer
    ? allServer.safeParse(runtimeEnv) // on server we can validate all env vars
    : allClient.safeParse(runtimeEnv); // on client we can only validate the ones that are exposed

  const onValidationError =
    opts.onValidationError ??
    ((error: ZodError) => {
      console.error(
        "❌ Invalid environment variables:",
        error.flatten().fieldErrors,
      );
      throw new Error("Invalid environment variables");
    });

  const onInvalidAccess =
    opts.onInvalidAccess ??
    ((_variable: string) => {
      throw new Error(
        "❌ Attempted to access a server-side environment variable on the client",
      );
    });

  if (parsed.success === false) {
    return onValidationError(parsed.error);
  }

  const isServerAccess = (prop: string) => {
    if (!opts.clientPrefix) return true;
    return !prop.startsWith(opts.clientPrefix) && !(prop in shared.shape);
  };
  const isValidServerAccess = (prop: string) => {
    return isServer || !isServerAccess(prop);
  };
  const ignoreProp = (prop: string) => {
    return prop === "__esModule" || prop === "$$typeof";
  };

  const extendedObj = (opts.extends ?? []).reduce((acc, curr) => {
    return Object.assign(acc, curr);
  }, {});
  const fullObj = Object.assign(parsed.data, extendedObj);

  const env = new Proxy(fullObj, {
    get(target, prop) {
      if (typeof prop !== "string") return undefined;
      if (ignoreProp(prop)) return undefined;
      if (!isValidServerAccess(prop)) return onInvalidAccess(prop);
      return Reflect.get(target, prop);
    },
    // Maybe reconsider this in the future:
    // https://github.com/t3-oss/t3-env/pull/111#issuecomment-1682931526
    // set(_target, prop) {
    //   // Readonly - this is the error message you get from assigning to a frozen object
    //   throw new Error(
    //     typeof prop === "string"
    //       ? `Cannot assign to read only property ${prop} of object #<Object>`
    //       : `Cannot assign to read only property of object #<Object>`
    //   );
    // },
  });

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  return env as any;
}
