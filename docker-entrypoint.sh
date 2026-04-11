#!/bin/sh
set -e

echo "[entrypoint] Running database migrations..."
npx payload migrate

echo "[entrypoint] Starting Next.js..."
exec npm run start
