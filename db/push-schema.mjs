import { execSync } from 'child_process'
import pg from 'pg'

async function run() {
  console.log('[init] DB Sync Start')
  
  if (!process.env.DATABASE_URI) {
    console.error('[init] DATABASE_URI is missing!')
    process.exit(0)
  }

  // 1. Wait for Postgres
  const client = new pg.Client({ connectionString: process.env.DATABASE_URI })
  let connected = false
  for (let i = 0; i < 10; i++) {
    try {
      await client.connect()
      connected = true
      console.log('[init] Database connected.')
      await client.end()
      break
    } catch (e) {
      console.log('[init] Waiting for database...')
      await new Promise(r => setTimeout(r, 2000))
    }
  }

  if (!connected) {
    console.error('[init] Could not connect to DB. Proceeding anyway...')
  }

  // 2. Force Push Schema
  try {
    console.log('[init] Forcing schema push via local payload binary...')
    // We run the local binary directly to avoid npx issues in production
    execSync('NODE_ENV=development NODE_OPTIONS=--no-deprecation ./node_modules/.bin/payload db:push --force', { 
      stdio: 'inherit'
    })
    console.log('[init] Schema push completed.')
  } catch (e) {
    console.error('[init] Schema push failed:', e.message)
  }
}

run().then(() => process.exit(0))
