# Stage 1: Install dependencies
FROM oven/bun:latest AS deps
WORKDIR /app

# Copy root configuration and lockfile
COPY package.json bun.lock ./

# Copy package.json files for all workspace members to enable efficient caching
COPY docs/package.json ./docs/
COPY packages/core/package.json ./packages/core/
COPY packages/nextjs/package.json ./packages/nextjs/
COPY packages/nuxt/package.json ./packages/nuxt/

# Install dependencies
RUN bun install --frozen-lockfile

# Stage 2: Build the application
FROM oven/bun:latest AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the docs package
# We use turbo to handle monorepo dependencies
RUN bun run turbo build --filter @t3-env/docs

# Stage 3: Runner
FROM node:24-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy standalone build and static assets
# Next.js standalone output includes node_modules and the server entry point
COPY --from=builder /app/docs/public ./docs/public
COPY --from=builder --chown=nextjs:nodejs /app/docs/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/docs/.next/static ./docs/.next/static

USER nextjs

EXPOSE 3000

# The entry point for the standalone build is server.js
# In a monorepo, it's usually inside the package directory in standalone
CMD ["node", "docs/server.js"]
