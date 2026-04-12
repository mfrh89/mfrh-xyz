FROM node:22-alpine AS base

# ── Dependencies ─────────────────────────────────────────
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ── Build ────────────────────────────────────────────────
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG DATABASE_URI
ARG PAYLOAD_SECRET=build-secret
ENV DATABASE_URI=${DATABASE_URI}
ENV PAYLOAD_SECRET=${PAYLOAD_SECRET}

RUN npm run build

# ── Production deps ──────────────────────────────────────
FROM base AS prod-deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# ── Runner ───────────────────────────────────────────────
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/package.json ./
COPY --from=builder /app/content ./content
COPY --from=prod-deps --chown=nextjs:nodejs /app/node_modules ./node_modules

# Payload CLI needs config + migrations at runtime
COPY --from=builder /app/src/payload.config.ts ./src/
COPY --from=builder /app/src/seed.ts ./src/
COPY --from=builder /app/src/migrations ./src/migrations
COPY --from=builder /app/tsconfig.json ./

COPY --chown=nextjs:nodejs docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

# su-exec for dropping privileges in entrypoint
RUN apk add --no-cache su-exec

# Writable media directory for uploads (ownership fixed at runtime for mounted volumes)
RUN mkdir -p /app/media && chown nextjs:nodejs /app/media

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

ENTRYPOINT ["./docker-entrypoint.sh"]
