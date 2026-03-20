import pg from 'pg'
import { readFileSync } from 'fs'

const client = new pg.Client({ connectionString: process.env.DATABASE_URI })
await client.connect()

try {
  await client.query('SELECT 1 FROM users LIMIT 1')
  console.log('[init] Tables already exist, skipping schema init')
} catch {
  console.log('[init] Tables not found, creating schema...')
  const sql = readFileSync('/app/db/init.sql', 'utf-8')
  await client.query(sql)
  console.log('[init] Schema created successfully')
}

await client.end()
