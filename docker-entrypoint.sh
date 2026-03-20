#!/bin/sh
set -e

echo "[entrypoint] Pushing DB schema if needed..."
node /app/db/push-schema.mjs

echo "[entrypoint] Starting Next.js..."
exec npx next start
