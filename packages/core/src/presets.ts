/**
 * This contains presets for common environment variables used
 * in 3rd party services so you don't have to write them yourself.
 * Include them in your `createEnv.extends` option array.
 * @module
 */
import { z } from "zod";
import { createEnv } from "./index";

/**
 * Vercel System Environment Variables
 * @see https://vercel.com/docs/projects/environment-variables/system-environment-variables#system-environment-variables
 */
export const vercel = (): Readonly<{
  VERCEL?: string;
  VERCEL_ENV?: "development" | "preview" | "production";
  VERCEL_URL?: string;
  VERCEL_BRANCH_URL?: string;
  VERCEL_REGION?: string;
  VERCEL_AUTOMATION_BYPASS_SECRET?: string;
  VERCEL_GIT_PROVIDER?: string;
  VERCEL_GIT_REPO_SLUG?: string;
  VERCEL_GIT_REPO_OWNER?: string;
  VERCEL_GIT_REPO_ID?: string;
  VERCEL_GIT_COMMIT_REF?: string;
  VERCEL_GIT_COMMIT_SHA?: string;
  VERCEL_GIT_COMMIT_MESSAGE?: string;
  VERCEL_GIT_COMMIT_AUTHOR_LOGIN?: string;
  VERCEL_GIT_COMMIT_AUTHOR_NAME?: string;
  VERCEL_GIT_PREVIOUS_SHA?: string;
  VERCEL_GIT_PULL_REQUEST_ID?: string;
}> => {
  return createEnv({
    server: {
      VERCEL: z.string().optional(),
      VERCEL_ENV: z.enum(["development", "preview", "production"]).optional(),
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
    runtimeEnv: process.env,
  });
};

/**
 * @see https://docs.uploadthing.com/getting-started/appdir#add-env-variables
 */
export const uploadthing = (): Readonly<{
  UPLOADTHING_SECRET: string;
  UPLOADTHING_APP_ID?: string;
}> => {
  return createEnv({
    server: {
      UPLOADTHING_SECRET: z.string(),
      UPLOADTHING_APP_ID: z.string().optional(),
    },
    runtimeEnv: process.env,
  });
};
