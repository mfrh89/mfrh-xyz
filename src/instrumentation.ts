export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { getPayload } = await import('payload')
    const configPromise = await import('./payload.config')
    console.log('[instrumentation] Initializing Payload to ensure DB schema is ready...')
    try {
      await getPayload({ config: configPromise.default })
      console.log('[instrumentation] Payload initialized successfully.')
    } catch (e) {
      console.error('[instrumentation] Payload initialization error:', e)
    }
  }
}
