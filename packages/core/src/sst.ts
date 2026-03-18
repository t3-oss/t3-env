/**
 * SST (Serverless Stack) utilities for t3-env.
 *
 * Provides helpers to load stage-specific `.env.[stage]` files so that
 * environment variables defined by SST stages are available for validation.
 *
 * @see https://sst.dev/docs/reference/cli#stage
 * @module
 *
 * @note This module uses `node:fs` and is intended for **Node.js server
 * environments only**. Do not import it in edge runtime or browser code.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Parses dotenv-style file content into a key-value record.
 * - Lines starting with `#` are treated as comments and skipped.
 * - Values can be wrapped in single or double quotes (quotes are stripped).
 * @internal
 */
function parseEnvContent(content: string): Record<string, string> {
  const result: Record<string, string> = {};

  for (const line of content.split("\n")) {
    const trimmed = line.trim();

    // Skip empty lines and comments
    if (!trimmed || trimmed.startsWith("#")) continue;

    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;

    const key = trimmed.slice(0, eqIndex).trim();
    let value = trimmed.slice(eqIndex + 1).trim();

    // Strip surrounding single or double quotes
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (key) result[key] = value;
  }

  return result;
}

/**
 * Loads and parses environment variables from a dotenv-style file.
 *
 * Silently returns an empty object if the file does not exist or cannot be
 * read, so it is safe to call even when the file may be absent.
 *
 * @param filePath - Path to the env file. Relative paths are resolved from
 *   `cwd` (defaults to `process.cwd()`).
 * @param cwd - Base directory used to resolve relative `filePath` values.
 *   Defaults to `process.cwd()`.
 * @returns Parsed key-value pairs from the env file, or `{}` on any error.
 *
 * @example
 * ```ts
 * import { createEnv } from "@t3-oss/env-nextjs";
 * import { loadEnvFile } from "@t3-oss/env-core/sst";
 *
 * export const env = createEnv({
 *   runtimeEnv: {
 *     ...process.env,
 *     ...loadEnvFile(".env.dev"),
 *   },
 *   server: { MY_SECRET: z.string() },
 * });
 * ```
 */
export function loadEnvFile(
  filePath: string,
  cwd: string = process.cwd(),
): Record<string, string> {
  try {
    const fullPath = resolve(cwd, filePath);
    const content = readFileSync(fullPath, "utf-8");
    return parseEnvContent(content);
  } catch {
    return {};
  }
}

/**
 * Loads environment variables from the SST stage-specific env file.
 *
 * Reads the current stage from the `SST_STAGE` environment variable (or a
 * custom variable via `options.stageVar`) and loads the corresponding
 * `.env.<stage>` file. Returns an empty object when `SST_STAGE` is not set
 * or the file does not exist.
 *
 * @param options.stageVar - Name of the env var that holds the stage name.
 *   Defaults to `"SST_STAGE"`.
 * @param options.cwd - Directory to look for the env file. Defaults to
 *   `process.cwd()`.
 * @returns Parsed key-value pairs from the stage-specific env file.
 *
 * @example
 * ```ts
 * // env.ts
 * import { createEnv } from "@t3-oss/env-nextjs";
 * import { loadSSTEnv } from "@t3-oss/env-core/sst";
 * import { z } from "zod";
 *
 * // SST sets SST_STAGE=dev, so this reads from .env.dev automatically.
 * export const env = createEnv({
 *   runtimeEnv: {
 *     ...process.env,
 *     ...loadSSTEnv(),
 *   },
 *   server: {
 *     DATABASE_URL: z.string().url(),
 *     MY_SECRET: z.string(),
 *   },
 * });
 * ```
 */
export function loadSSTEnv(options?: {
  /**
   * The environment variable that holds the SST stage name.
   * @default "SST_STAGE"
   */
  stageVar?: string;
  /**
   * Directory in which to look for the `.env.[stage]` file.
   * @default process.cwd()
   */
  cwd?: string;
}): Record<string, string> {
  const stageVar = options?.stageVar ?? "SST_STAGE";
  const cwd = options?.cwd ?? process.cwd();
  const stage = process.env[stageVar];

  if (!stage) return {};

  return loadEnvFile(`.env.${stage}`, cwd);
}
