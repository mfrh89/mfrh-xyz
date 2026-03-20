import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function getCV() {
  const payload = await getPayload({ config: configPromise })
  return payload.findGlobal({ slug: 'cv' })
}

export async function getCoverLetter() {
  const payload = await getPayload({ config: configPromise })
  return payload.findGlobal({ slug: 'cover-letter' })
}
