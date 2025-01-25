export interface VercelEnv {
  VERCEL?: string;
  CI?: string;
  VERCEL_ENV?: "development" | "preview" | "production";
  VERCEL_URL?: string;
  VERCEL_PROJECT_PRODUCTION_URL?: string;
  VERCEL_BRANCH_URL?: string;
  VERCEL_REGION?: string;
  VERCEL_DEPLOYMENT_ID?: string;
  VERCEL_SKEW_PROTECTION_ENABLED?: string;
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
}

export interface NeonVercelEnv {
  DATABASE_URL: string;
  DATABASE_URL_UNPOOLED?: string;
  PGHOST?: string;
  PGHOST_UNPOOLED?: string;
  PGUSER?: string;
  PGDATABASE?: string;
  PGPASSWORD?: string;
  POSTGRES_URL?: string;
  POSTGRES_URL_NON_POOLING?: string;
  POSTGRES_USER?: string;
  POSTGRES_HOST?: string;
  POSTGRES_PASSWORD?: string;
  POSTGRES_DATABASE?: string;
  POSTGRES_URL_NO_SSL?: string;
  POSTGRES_PRISMA_URL?: string;
}

export interface UploadThingV6Env {
  UPLOADTHING_TOKEN: string;
}

export interface UploadThingEnv {
  UPLOADTHING_TOKEN: string;
}

export interface RenderEnv {
  IS_PULL_REQUEST?: string;
  RENDER_DISCOVERY_SERVICE?: string;
  RENDER_EXTERNAL_HOSTNAME?: string;
  RENDER_EXTERNAL_URL?: string;
  RENDER_GIT_BRANCH?: string;
  RENDER_GIT_COMMIT?: string;
  RENDER_GIT_REPO_SLUG?: string;
  RENDER_INSTANCE_ID?: string;
  RENDER_SERVICE_ID?: string;
  RENDER_SERVICE_NAME?: string;
  RENDER_SERVICE_TYPE?: "web" | "pserv" | "cron" | "worker" | "static";
  RENDER?: string;
}

export interface RailwayEnv {
  RAILWAY_PUBLIC_DOMAIN?: string;
  RAILWAY_PRIVATE_DOMAIN?: string;
  RAILWAY_TCP_PROXY_DOMAIN?: string;
  RAILWAY_TCP_PROXY_PORT?: string;
  RAILWAY_TCP_APPLICATION_PORT?: string;
  RAILWAY_PROJECT_NAME?: string;
  RAILWAY_PROJECT_ID?: string;
  RAILWAY_ENVIRONMENT_NAME?: string;
  RAILWAY_ENVIRONMENT_ID?: string;
  RAILWAY_SERVICE_NAME?: string;
  RAILWAY_SERVICE_ID?: string;
  RAILWAY_REPLICA_ID?: string;
  RAILWAY_DEPLOYMENT_ID?: string;
  RAILWAY_SNAPSHOT_ID?: string;
  RAILWAY_VOLUME_NAME?: string;
  RAILWAY_VOLUME_MOUNT_PATH?: string;
  RAILWAY_RUN_UID?: string;
  RAILWAY_GIT_COMMIT_SHA?: string;
  RAILWAY_GIT_AUTHOR_EMAIL?: string;
  RAILWAY_GIT_BRANCH?: string;
  RAILWAY_GIT_REPO_NAME?: string;
  RAILWAY_GIT_REPO_OWNER?: string;
  RAILWAY_GIT_COMMIT_MESSAGE?: string;
}

export interface FlyEnv {
  FLY_APP_NAME?: string;
  FLY_MACHINE_ID?: string;
  FLY_ALLOC_ID?: string;
  FLY_REGION?: string;
  FLY_PUBLIC_IP?: string;
  FLY_IMAGE_REF?: string;
  FLY_MACHINE_VERSION?: string;
  FLY_PRIVATE_IP?: string;
  FLY_PROCESS_GROUP?: string;
  FLY_VM_MEMORY_MB?: string;
  PRIMARY_REGION?: string;
}

export interface NetlifyEnv {
  NETLIFY?: string;
  BUILD_ID?: string;
  CONTEXT?: "production" | "deploy-preview" | "branch-deploy" | "dev";
  REPOSITORY_URL?: string;
  BRANCH?: string;
  URL?: string;
  DEPLOY_URL?: string;
  DEPLOY_PRIME_URL?: string;
  DEPLOY_ID?: string;
  SITE_NAME?: string;
  SITE_ID?: string;
}
