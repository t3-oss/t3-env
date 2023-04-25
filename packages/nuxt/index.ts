import type { ZodError, ZodType } from "zod";
import { createEnv as createEnvCore, type ErrorMessage } from "../core";

export function createEnv<
  TServer extends Record<string, ZodType>,
  TClient extends Record<string, ZodType>
>(opts: {
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app isn't
   * built with invalid env vars.
   */
  server: TServer;

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app isn't
   * built with invalid env vars. To expose them to the client, prefix them with `NEXT_PUBLIC_`.
   */
  client: {
    [TKey in keyof TClient]: TKey extends `NUXT_PUBLIC_${string}`
      ? TClient[TKey]
      : ErrorMessage<`${TKey extends string
          ? TKey
          : never} is not prefixed with NUXT_PUBLIC_.`>;
  };

  /**
   * Whether to skip validation of environment variables.
   * @default !!process.env.SKIP_ENV_VALIDATION && process.env.SKIP_ENV_VALIDATION !== "false" && process.env.SKIP_ENV_VALIDATION !== "0"
   */
  skipValidation?: boolean;

  /**
   * Called when validation fails. By default the error is logged,
   * and an error is thrown telling what environment variables are invalid.
   * Function must throw an error at the end.
   */
  onValidationError?: (error: ZodError) => never;

  /**
   * Called when a server-side environment variable is accessed on the client.
   * By default an error is thrown.
   */
  onInvalidAccess?: (variable: string) => never;
}) {
  return createEnvCore({
    ...opts,
    // @ts-expect-error TODO: Fix this
    client: opts.client,
    clientPrefix: "NUXT_PUBLIC_",
  });
}
