import { NextRequest, NextResponse } from 'next/server'

export function proxy(request: NextRequest) {
  // Traefik's Basic Auth adds an Authorization header to every request.
  // Payload CMS picks it up instead of the JWT cookie and rejects it.
  // Strip the Basic auth header so Payload always authenticates via cookie.
  const authHeader = request.headers.get('authorization')
  if (authHeader?.startsWith('Basic ')) {
    const headers = new Headers(request.headers)
    headers.delete('authorization')
    return NextResponse.next({ request: { headers } })
  }

  return NextResponse.next()
}
