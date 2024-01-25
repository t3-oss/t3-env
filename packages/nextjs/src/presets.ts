export * from "@t3-oss/env-core/presets";

import { z } from "zod";
import { createEnv } from ".";

const vercelEnv = z.enum(["development", "preview", "production"]);

/**
 * Vercel System Environment Variables
 * @see https://vercel.com/docs/projects/environment-variables/system-environment-variables#system-environment-variables
 */
export const vercel = createEnv({
  server: {
    VERCEL: z.string().optional(),
    VERCEL_ENV: vercelEnv.optional(),
    VERCEL_URL: z.string().optional(),
    VERCEL_BRANCH_URL: z.string().optional(),
    VERCEL_REGION: z.string().optional(),
    VERCEL_AUTOMATION_BYPASS_SECRET: z.string().optional(),
    VERCEL_GIT_PROVIDER: z.string().optional(),
    VERCEL_GIT_REPO_SLUG: z.string().optional(),
    VERCEL_GIT_REPO_OWNER: z.string().optional(),
    VERCEL_GIT_REPO_ID: z.string().optional(),
    VERCEL_GIT_COMMIT_REF: z.string().optional(),
    VERCEL_GIT_COMMIT_SHA: z.string().optional(),
    VERCEL_GIT_COMMIT_MESSAGE: z.string().optional(),
    VERCEL_GIT_COMMIT_AUTHOR_LOGIN: z.string().optional(),
    VERCEL_GIT_COMMIT_AUTHOR_NAME: z.string().optional(),
    VERCEL_GIT_PREVIOUS_SHA: z.string().optional(),
    VERCEL_GIT_PULL_REQUEST_ID: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_VERCEL_ENV: vercelEnv.optional(),
    NEXT_PUBLIC_VERCEL_URL: z.string().optional(),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_VERCEL_ENV: process.env.VERCEL_ENV,
    NEXT_PUBLIC_VERCEL_URL: process.env.VERCEL_URL,
  },
});
