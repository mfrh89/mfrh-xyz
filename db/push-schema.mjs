import pg from 'pg'
import { execSync } from 'child_process'

const client = new pg.Client({ connectionString: process.env.DATABASE_URI })
await client.connect()

try {
  const res = await client.query('SELECT table_name FROM information_schema.tables WHERE table_schema = \'public\'')
  const tables = res.rows.map(row => row.table_name)
  
  if (!tables.includes('users') || !tables.includes('pages')) {
     console.log('[init] Core tables missing. Generating and pushing schema via Payload...')
     execSync('npx payload generate:db-schema', { stdio: 'inherit', env: { ...process.env, NODE_ENV: 'development' } })
     console.log('[init] Base schema pushed successfully')
  } else {
     console.log('[init] Core tables exist, relying on Payload push: true for updates')
  }
} catch (e) {
  console.log('[init] Error checking/pushing schema:', e.message)
}

await client.end()
