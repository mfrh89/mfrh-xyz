export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Eagerly initialize Payload so that push: true creates
    // all database tables before the server accepts requests.
    const { getPayload } = await import('payload')
    const config = await import('@payload-config')
    await getPayload({ config: config.default })
  }
}
