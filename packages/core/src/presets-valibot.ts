/**
 * Presets for Valibot
 * @see https://env.t3.gg/docs/customization#extending-presets
 * @module
 */
import { boolean, optional, picklist, pipe, string, url } from "valibot";
import { createEnv } from "./index.ts";
import type {
  CoolifyEnv,
  FlyEnv,
  NeonVercelEnv,
  NetlifyEnv,
  RailwayEnv,
  RenderEnv,
  SupabaseVercelEnv,
  UploadThingEnv,
  UploadThingV6Env,
  UpstashRedisEnv,
  VercelEnv,
  ViteEnv,
  WxtEnv,
} from "./presets";

/**
 * Vercel System Environment Variables
 * @see https://vercel.com/docs/projects/environment-variables/system-environment-variables#system-environment-variables
 */
export const vercel = (): Readonly<VercelEnv> =>
  createEnv({
    server: {
      VERCEL: optional(string()),
      CI: optional(string()),
      VERCEL_ENV: optional(picklist(["development", "preview", "production"])),
      VERCEL_URL: optional(string()),
      VERCEL_PROJECT_PRODUCTION_URL: optional(string()),
      VERCEL_BRANCH_URL: optional(string()),
      VERCEL_REGION: optional(string()),
      VERCEL_DEPLOYMENT_ID: optional(string()),
      VERCEL_SKEW_PROTECTION_ENABLED: optional(string()),
      VERCEL_AUTOMATION_BYPASS_SECRET: optional(string()),
      VERCEL_GIT_PROVIDER: optional(string()),
      VERCEL_GIT_REPO_SLUG: optional(string()),
      VERCEL_GIT_REPO_OWNER: optional(string()),
      VERCEL_GIT_REPO_ID: optional(string()),
      VERCEL_GIT_COMMIT_REF: optional(string()),
      VERCEL_GIT_COMMIT_SHA: optional(string()),
      VERCEL_GIT_COMMIT_MESSAGE: optional(string()),
      VERCEL_GIT_COMMIT_AUTHOR_LOGIN: optional(string()),
      VERCEL_GIT_COMMIT_AUTHOR_NAME: optional(string()),
      VERCEL_GIT_PREVIOUS_SHA: optional(string()),
      VERCEL_GIT_PULL_REQUEST_ID: optional(string()),
    },
    runtimeEnv: process.env,
  });

/**
 * Neon for Vercel Environment Variables
 * @see https://neon.tech/docs/guides/vercel-native-integration#environment-variables-set-by-the-integration
 */
export const neonVercel = (): Readonly<NeonVercelEnv> =>
  createEnv({
    server: {
      DATABASE_URL: string(),
      DATABASE_URL_UNPOOLED: optional(string()),
      PGHOST: optional(string()),
      PGHOST_UNPOOLED: optional(string()),
      PGUSER: optional(string()),
      PGDATABASE: optional(string()),
      PGPASSWORD: optional(string()),
      POSTGRES_URL: optional(pipe(string(), url())),
      POSTGRES_URL_NON_POOLING: optional(pipe(string(), url())),
      POSTGRES_USER: optional(string()),
      POSTGRES_HOST: optional(string()),
      POSTGRES_PASSWORD: optional(string()),
      POSTGRES_DATABASE: optional(string()),
      POSTGRES_URL_NO_SSL: optional(pipe(string(), url())),
      POSTGRES_PRISMA_URL: optional(pipe(string(), url())),
    },
    runtimeEnv: process.env,
  });

/**
 * Supabase for Vercel Environment Variables
 * @see https://vercel.com/marketplace/supabase
 */
export const supabaseVercel = (): Readonly<SupabaseVercelEnv> =>
  createEnv({
    server: {
      POSTGRES_URL: pipe(string(), url()),
      POSTGRES_PRISMA_URL: optional(pipe(string(), url())),
      POSTGRES_URL_NON_POOLING: optional(pipe(string(), url())),
      POSTGRES_USER: optional(string()),
      POSTGRES_HOST: optional(string()),
      POSTGRES_PASSWORD: optional(string()),
      POSTGRES_DATABASE: optional(string()),
      SUPABASE_SERVICE_ROLE_KEY: optional(string()),
      SUPABASE_ANON_KEY: optional(string()),
      SUPABASE_URL: optional(pipe(string(), url())),
      SUPABASE_JWT_SECRET: optional(string()),
      NEXT_PUBLIC_SUPABASE_ANON_KEY: optional(string()),
      NEXT_PUBLIC_SUPABASE_URL: optional(pipe(string(), url())),
    },
    runtimeEnv: process.env,
  });

/**
 * @see https://v6.docs.uploadthing.com/getting-started/nuxt#add-env-variables
 */
export const uploadthingV6 = (): Readonly<UploadThingV6Env> =>
  createEnv({
    server: {
      UPLOADTHING_TOKEN: string(),
    },
    runtimeEnv: process.env,
  });

/**
 * @see https://docs.uploadthing.com/getting-started/appdir#add-env-variables
 */
export const uploadthing = (): Readonly<UploadThingEnv> =>
  createEnv({
    server: {
      UPLOADTHING_TOKEN: string(),
    },
    runtimeEnv: process.env,
  });

/**
 * Render System Environment Variables
 * @see https://docs.render.com/environment-variables#all-runtimes
 */
export const render = (): Readonly<RenderEnv> =>
  createEnv({
    server: {
      IS_PULL_REQUEST: optional(string()),
      RENDER_DISCOVERY_SERVICE: optional(string()),
      RENDER_EXTERNAL_HOSTNAME: optional(string()),
      RENDER_EXTERNAL_URL: optional(pipe(string(), url())),
      RENDER_GIT_BRANCH: optional(string()),
      RENDER_GIT_COMMIT: optional(string()),
      RENDER_GIT_REPO_SLUG: optional(string()),
      RENDER_INSTANCE_ID: optional(string()),
      RENDER_SERVICE_ID: optional(string()),
      RENDER_SERVICE_NAME: optional(string()),
      RENDER_SERVICE_TYPE: optional(
        picklist(["web", "pserv", "cron", "worker", "static"]),
      ),
      RENDER: optional(string()),
    },
    runtimeEnv: process.env,
  });

/**
 * Railway Environment Variables
 * @see https://docs.railway.app/reference/variables#railway-provided-variables
 */
export const railway = (): Readonly<RailwayEnv> =>
  createEnv({
    server: {
      RAILWAY_PUBLIC_DOMAIN: optional(string()),
      RAILWAY_PRIVATE_DOMAIN: optional(string()),
      RAILWAY_TCP_PROXY_DOMAIN: optional(string()),
      RAILWAY_TCP_PROXY_PORT: optional(string()),
      RAILWAY_TCP_APPLICATION_PORT: optional(string()),
      RAILWAY_PROJECT_NAME: optional(string()),
      RAILWAY_PROJECT_ID: optional(string()),
      RAILWAY_ENVIRONMENT_NAME: optional(string()),
      RAILWAY_ENVIRONMENT_ID: optional(string()),
      RAILWAY_SERVICE_NAME: optional(string()),
      RAILWAY_SERVICE_ID: optional(string()),
      RAILWAY_REPLICA_ID: optional(string()),
      RAILWAY_DEPLOYMENT_ID: optional(string()),
      RAILWAY_SNAPSHOT_ID: optional(string()),
      RAILWAY_VOLUME_NAME: optional(string()),
      RAILWAY_VOLUME_MOUNT_PATH: optional(string()),
      RAILWAY_RUN_UID: optional(string()),
      RAILWAY_GIT_COMMIT_SHA: optional(string()),
      RAILWAY_GIT_AUTHOR_EMAIL: optional(string()),
      RAILWAY_GIT_BRANCH: optional(string()),
      RAILWAY_GIT_REPO_NAME: optional(string()),
      RAILWAY_GIT_REPO_OWNER: optional(string()),
      RAILWAY_GIT_COMMIT_MESSAGE: optional(string()),
    },
    runtimeEnv: process.env,
  });

/**
 * Fly.io Environment Variables
 * @see https://fly.io/docs/machines/runtime-environment/#environment-variables
 */
export const fly = (): Readonly<FlyEnv> =>
  createEnv({
    server: {
      FLY_APP_NAME: optional(string()),
      FLY_MACHINE_ID: optional(string()),
      FLY_ALLOC_ID: optional(string()),
      FLY_REGION: optional(string()),
      FLY_PUBLIC_IP: optional(string()),
      FLY_IMAGE_REF: optional(string()),
      FLY_MACHINE_VERSION: optional(string()),
      FLY_PRIVATE_IP: optional(string()),
      FLY_PROCESS_GROUP: optional(string()),
      FLY_VM_MEMORY_MB: optional(string()),
      PRIMARY_REGION: optional(string()),
    },
    runtimeEnv: process.env,
  });

/**
 * Netlify Environment Variables
 * @see https://docs.netlify.com/configure-builds/environment-variables
 */
export const netlify = (): Readonly<NetlifyEnv> =>
  createEnv({
    server: {
      NETLIFY: optional(string()),
      BUILD_ID: optional(string()),
      CONTEXT: optional(
        picklist(["production", "deploy-preview", "branch-deploy", "dev"]),
      ),
      REPOSITORY_URL: optional(string()),
      BRANCH: optional(string()),
      URL: optional(string()),
      DEPLOY_URL: optional(string()),
      DEPLOY_PRIME_URL: optional(string()),
      DEPLOY_ID: optional(string()),
      SITE_NAME: optional(string()),
      SITE_ID: optional(string()),
    },
    runtimeEnv: process.env,
  });

/**
 * Upstash redis Environment Variables
 * @see https://upstash.com/docs/redis/howto/connectwithupstashredis
 */
export const upstashRedis = (): Readonly<UpstashRedisEnv> =>
  createEnv({
    server: {
      UPSTASH_REDIS_REST_URL: pipe(string(), url()),
      UPSTASH_REDIS_REST_TOKEN: string(),
    },
    runtimeEnv: process.env,
  });

/**
 * Coolify Environment Variables
 * @see https://coolify.io/docs/knowledge-base/environment-variables#predefined-variables
 */
export const coolify = (): Readonly<CoolifyEnv> =>
  createEnv({
    server: {
      COOLIFY_FQDN: optional(string()),
      COOLIFY_URL: optional(string()),
      COOLIFY_BRANCH: optional(string()),
      COOLIFY_RESOURCE_UUID: optional(string()),
      COOLIFY_CONTAINER_NAME: optional(string()),
      SOURCE_COMMIT: optional(string()),
      PORT: optional(string()),
      HOST: optional(string()),
    },
    runtimeEnv: process.env,
  });

/**
 * Vite Environment Variables
 * @see https://vite.dev/guide/env-and-mode
 */
export const vite = (): Readonly<ViteEnv> =>
  createEnv({
    server: {
      BASE_URL: string(),
      MODE: string(),
      DEV: boolean(),
      PROD: boolean(),
      SSR: boolean(),
    },
    runtimeEnv: import.meta.env,
  });

/**
 * WXT Environment Variables
 * @see https://wxt.dev/guide/essentials/config/environment-variables.html#built-in-environment-variables
 */
export const wxt = (): Readonly<WxtEnv> =>
  createEnv({
    server: {
      MANIFEST_VERSION: optional(picklist([2, 3])),
      BROWSER: optional(
        picklist(["chrome", "firefox", "safari", "edge", "opera"]),
      ),
      CHROME: optional(boolean()),
      FIREFOX: optional(boolean()),
      SAFARI: optional(boolean()),
      EDGE: optional(boolean()),
      OPERA: optional(boolean()),
    },
    runtimeEnv: import.meta.env,
  });
