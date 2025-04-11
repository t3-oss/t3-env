import { z } from "zod";
import type { StandardSchemaDictionary } from ".";
import { createEnv } from ".";
import type {
  FlyEnv,
  NeonVercelEnv,
  NetlifyEnv,
  RailwayEnv,
  RenderEnv,
  UploadThingEnv,
  UploadThingV6Env,
  VercelEnv,
} from "./presets";

/**
 * Vercel System Environment Variables
 * @see https://vercel.com/docs/projects/environment-variables/system-environment-variables#system-environment-variables
 */
export const vercel = () =>
  createEnv({
    server: {
      VERCEL: z.string().optional(),
      CI: z.string().optional(),
      VERCEL_ENV: z.enum(["development", "preview", "production"]).optional(),
      VERCEL_URL: z.string().optional(),
      VERCEL_PROJECT_PRODUCTION_URL: z.string().optional(),
      VERCEL_BRANCH_URL: z.string().optional(),
      VERCEL_REGION: z.string().optional(),
      VERCEL_DEPLOYMENT_ID: z.string().optional(),
      VERCEL_SKEW_PROTECTION_ENABLED: z.string().optional(),
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
    } satisfies StandardSchemaDictionary.Matching<VercelEnv>,
    runtimeEnv: process.env,
  });

/**
 * Neon for Vercel Environment Variables
 * @see https://neon.tech/docs/guides/vercel-native-integration#environment-variables-set-by-the-integration
 */
export const neonVercel = () =>
  createEnv({
    server: {
      DATABASE_URL: z.string(),
      DATABASE_URL_UNPOOLED: z.string().optional(),
      PGHOST: z.string().optional(),
      PGHOST_UNPOOLED: z.string().optional(),
      PGUSER: z.string().optional(),
      PGDATABASE: z.string().optional(),
      PGPASSWORD: z.string().optional(),
      POSTGRES_URL: z.string().url().optional(),
      POSTGRES_URL_NON_POOLING: z.string().url().optional(),
      POSTGRES_USER: z.string().optional(),
      POSTGRES_HOST: z.string().optional(),
      POSTGRES_PASSWORD: z.string().optional(),
      POSTGRES_DATABASE: z.string().optional(),
      POSTGRES_URL_NO_SSL: z.string().url().optional(),
      POSTGRES_PRISMA_URL: z.string().url().optional(),
    } satisfies StandardSchemaDictionary.Matching<NeonVercelEnv>,
    runtimeEnv: process.env,
  });

/**
 * @see https://v6.docs.uploadthing.com/getting-started/nuxt#add-env-variables
 */
export const uploadthingV6 = () =>
  createEnv({
    server: {
      UPLOADTHING_TOKEN: z.string(),
    } satisfies StandardSchemaDictionary.Matching<UploadThingV6Env>,
    runtimeEnv: process.env,
  });

/**
 * @see https://docs.uploadthing.com/getting-started/appdir#add-env-variables
 */
export const uploadthing = () =>
  createEnv({
    server: {
      UPLOADTHING_TOKEN: z.string(),
    } satisfies StandardSchemaDictionary.Matching<UploadThingEnv>,
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
    } satisfies StandardSchemaDictionary.Matching<RenderEnv>,
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
    } satisfies StandardSchemaDictionary.Matching<RailwayEnv>,
    runtimeEnv: process.env,
  });

/**
 * Fly.io Environment Variables
 * @see https://fly.io/docs/machines/runtime-environment/#environment-variables
 */
export const fly = () =>
  createEnv({
    server: {
      FLY_APP_NAME: z.string().optional(),
      FLY_MACHINE_ID: z.string().optional(),
      FLY_ALLOC_ID: z.string().optional(),
      FLY_REGION: z.string().optional(),
      FLY_PUBLIC_IP: z.string().optional(),
      FLY_IMAGE_REF: z.string().optional(),
      FLY_MACHINE_VERSION: z.string().optional(),
      FLY_PRIVATE_IP: z.string().optional(),
      FLY_PROCESS_GROUP: z.string().optional(),
      FLY_VM_MEMORY_MB: z.string().optional(),
      PRIMARY_REGION: z.string().optional(),
    } satisfies StandardSchemaDictionary.Matching<FlyEnv>,
    runtimeEnv: process.env,
  });

/**
 * Netlify Environment Variables
 * @see https://docs.netlify.com/configure-builds/environment-variables
 */
export const netlify = () =>
  createEnv({
    server: {
      NETLIFY: z.string().optional(),
      BUILD_ID: z.string().optional(),
      CONTEXT: z
        .enum(["production", "deploy-preview", "branch-deploy", "dev"])
        .optional(),
      REPOSITORY_URL: z.string().optional(),
      BRANCH: z.string().optional(),
      URL: z.string().optional(),
      DEPLOY_URL: z.string().optional(),
      DEPLOY_PRIME_URL: z.string().optional(),
      DEPLOY_ID: z.string().optional(),
      SITE_NAME: z.string().optional(),
      SITE_ID: z.string().optional(),
    } satisfies StandardSchemaDictionary.Matching<NetlifyEnv>,
    runtimeEnv: process.env,
  });
