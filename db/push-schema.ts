import { getPayload } from 'payload'
import configPromise from '../src/payload.config'

async function run() {
  console.log('[init] Starting TypeScript-enabled DB Sync...')
  
  // Set NODE_ENV to development to ensure Payload triggers the push logic
  process.env.NODE_ENV = 'development'
  
  try {
    // getPayload initializes everything and with push: true in config, it syncs the DB
    await getPayload({ config: configPromise })
    console.log('[init] Database sync completed successfully.')
    process.exit(0)
  } catch (error: any) {
    console.error('[init] Database sync failed:', error.message)
    process.exit(1)
  }
}

run()
