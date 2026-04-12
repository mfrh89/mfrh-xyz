#!/bin/sh
set -e

# Fix ownership on mounted volumes (runs as root)
chown -R nextjs:nodejs /app/media

echo "[entrypoint] Running database migrations..."
su-exec nextjs npx payload migrate

echo "[entrypoint] Starting Next.js..."
exec su-exec nextjs npm run start
