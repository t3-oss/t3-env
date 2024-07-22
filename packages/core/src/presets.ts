import { z } from "zod";
import { createEnv } from ".";

/**
 * Vercel System Environment Variables
 * @see https://vercel.com/docs/projects/environment-variables/system-environment-variables#system-environment-variables
 */
export const vercel = () =>
  createEnv({
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

/**
 * @see https://docs.uploadthing.com/getting-started/appdir#add-env-variables
 */
export const uploadthing = () =>
  createEnv({
    server: {
      UPLOADTHING_SECRET: z.string(),
      UPLOADTHING_APP_ID: z.string().optional(),
    },
    runtimeEnv: process.env,
  });

/**
 * Render System Environment Variables
 * @see https://docs.render.com/environment-variables#all-runtimes
 */
export const render = () =>
  createEnv({
    server: {
      IS_PULL_REQUEST: z.string().optional(),
      RENDER_DISCOVERY_SERVICE: z.string().optional(),
      RENDER_EXTERNAL_HOSTNAME: z.string().optional(),
      RENDER_EXTERNAL_URL: z.string().url().optional(),
      RENDER_GIT_BRANCH: z.string().optional(),
      RENDER_GIT_COMMIT: z.string().optional(),
      RENDER_GIT_REPO_SLUG: z.string().optional(),
      RENDER_INSTANCE_ID: z.string().optional(),
      RENDER_SERVICE_ID: z.string().optional(),
      RENDER_SERVICE_NAME: z.string().optional(),
      RENDER_SERVICE_TYPE: z
        .enum(["web", "pserv", "cron", "worker", "static"])
        .optional(),
      RENDER: z.string().optional(),
    },
    runtimeEnv: process.env,
  });

/**
 * Railway Environment Variables
 * @see https://docs.railway.app/reference/variables#railway-provided-variables
 */
export const railway = () =>
  createEnv({
    server: {
      RAILWAY_PUBLIC_DOMAIN: z.string().optional(),
      RAILWAY_PRIVATE_DOMAIN: z.string().optional(),
      RAILWAY_TCP_PROXY_DOMAIN: z.string().optional(),
      RAILWAY_TCP_PROXY_PORT: z.string().optional(),
      RAILWAY_TCP_APPLICATION_PORT: z.string().optional(),
      RAILWAY_PROJECT_NAME: z.string().optional(),
      RAILWAY_PROJECT_ID: z.string().optional(),
      RAILWAY_ENVIRONMENT_NAME: z.string().optional(),
      RAILWAY_ENVIRONMENT_ID: z.string().optional(),
      RAILWAY_SERVICE_NAME: z.string().optional(),
      RAILWAY_SERVICE_ID: z.string().optional(),
      RAILWAY_REPLICA_ID: z.string().optional(),
      RAILWAY_DEPLOYMENT_ID: z.string().optional(),
      RAILWAY_SNAPSHOT_ID: z.string().optional(),
      RAILWAY_VOLUME_NAME: z.string().optional(),
      RAILWAY_VOLUME_MOUNT_PATH: z.string().optional(),
      RAILWAY_RUN_UID: z.string().optional(),
      RAILWAY_GIT_COMMIT_SHA: z.string().optional(),
      RAILWAY_GIT_AUTHOR_EMAIL: z.string().optional(),
      RAILWAY_GIT_BRANCH: z.string().optional(),
      RAILWAY_GIT_REPO_NAME: z.string().optional(),
      RAILWAY_GIT_REPO_OWNER: z.string().optional(),
      RAILWAY_GIT_COMMIT_MESSAGE: z.string().optional(),
    },
    runtimeEnv: process.env,
  });
