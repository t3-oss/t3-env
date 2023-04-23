import type { ZodType } from "zod";
import { createEnv as createEnvCore, type ErrorMessage } from "../core";

export function createEnv<
  TServer extends Record<string, ZodType>,
  TClient extends Record<string, ZodType>
>(
  /** TODO: Make options reusable */ opts: {
    /**
     * Specify your server-side environment variables schema here. This way you can ensure the app isn't
     * built with invalid env vars.
     */
    server: TServer;

    /**
     * Specify your client-side environment variables schema here. This way you can ensure the app isn't
     * built with invalid env vars. To expose them to the client, prefix them with `NEXT_PUBLIC_`.
     */
    client?: {
      [TKey in keyof TClient]: TKey extends `NEXT_PUBLIC_${string}`
        ? TClient[TKey]
        : ErrorMessage<`${TKey extends string
            ? TKey
            : never} is not prefixed with NEXT_PUBLIC_.`>;
    };

    /**
     * Manual destruction of `process.env`. Required for Next.js.
     * @default process.env
     */
    processEnv?: Record<keyof TServer | keyof TClient, string | undefined>;

    /**
     * Whether to skip validation of environment variables.
     * @default !!process.env.SKIP_ENV_VALIDATION && process.env.SKIP_ENV_VALIDATION !== "false" && process.env.SKIP_ENV_VALIDATION !== "0"
     */
    skipValidation?: boolean;
  }
) {
  return createEnvCore({
    ...opts,
    // @ts-expect-error TODO: Fix this
    client: opts.client,
    clientPrefix: "NEXT_PUBLIC_",
  });
}
