import { ZodError, ZodType } from "zod";
import { EnvOptions } from "../types";
import { AnySchema } from "joi";

export const onInvalidAccess = <
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
) =>
  opts.onInvalidAccess ??
  ((_variable: string) => {
    throw new Error(
      "❌ Attempted to access a server-side environment variable on the client"
    );
  });

export const onValidationError = <
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
) =>
  opts.onValidationError ??
  ((error: ZodError) => {
    console.error(
      "❌ Invalid environment variables:",
      error.flatten().fieldErrors
    );
    throw new Error("Invalid environment variables");
  });
