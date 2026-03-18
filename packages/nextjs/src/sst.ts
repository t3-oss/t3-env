/**
 * SST (Serverless Stack) utilities re-exported from `@t3-oss/env-core/sst`
 * for convenience when using the Next.js package.
 *
 * @see https://sst.dev/docs/reference/cli#stage
 * @module
 *
 * @note This module uses `node:fs` and is intended for **Node.js server
 * environments only**. Do not import it in edge runtime or browser code.
 */
export { loadEnvFile, loadSSTEnv } from "@t3-oss/env-core/sst";
