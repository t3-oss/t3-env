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
  VERCEL?: string | undefined;
  VERCEL_ENV?: "development" | "preview" | "production" | undefined;
  VERCEL_URL?: string | undefined;
  VERCEL_BRANCH_URL?: string | undefined;
  VERCEL_REGION?: string | undefined;
  VERCEL_AUTOMATION_BYPASS_SECRET?: string | undefined;
  VERCEL_GIT_PROVIDER?: string | undefined;
  VERCEL_GIT_REPO_SLUG?: string | undefined;
  VERCEL_GIT_REPO_OWNER?: string | undefined;
  VERCEL_GIT_REPO_ID?: string | undefined;
  VERCEL_GIT_COMMIT_REF?: string | undefined;
  VERCEL_GIT_COMMIT_SHA?: string | undefined;
  VERCEL_GIT_COMMIT_MESSAGE?: string | undefined;
  VERCEL_GIT_COMMIT_AUTHOR_LOGIN?: string | undefined;
  VERCEL_GIT_COMMIT_AUTHOR_NAME?: string | undefined;
  VERCEL_GIT_PREVIOUS_SHA?: string | undefined;
  VERCEL_GIT_PULL_REQUEST_ID?: string | undefined;
}> => {
  return createEnv({
    server: {
      VERCEL: z.string().optional(),
      VERCEL_ENV: z.enum(["development", "preview", "production"]).optional(),
      VERCEL_URL: z.string().optional(),
      VERCEL_PROJECT_PRODUCTION_URL: z.string().optional(),
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
  UPLOADTHING_APP_ID?: string | undefined;
}> => {
  return createEnv({
    server: {
      UPLOADTHING_SECRET: z.string(),
      UPLOADTHING_APP_ID: z.string().optional(),
    },
    runtimeEnv: process.env,
  });
};
