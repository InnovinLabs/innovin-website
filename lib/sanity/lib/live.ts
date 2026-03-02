import { client } from './client'
import type { QueryParams } from '@sanity/client'

/**
 * Static export mode: plain sanityFetch using the published Sanity client.
 *
 * defineLive / Server Actions are not supported with static export.
 * All pages are pre-rendered at build time using published content.
 * SanityLive and live preview are disabled.
 */
export async function sanityFetch<T = unknown>({
  query,
  params = {},
  perspective = 'published',
  stega = false,
}: {
  query: string
  params?: QueryParams
  perspective?: 'published' | 'drafts'
  stega?: boolean
}): Promise<{ data: T }> {
  const data = await client.fetch<T>(query, params, {
    perspective: 'published', // always published in static export
    stega: false,             // never stega in static export
  })
  return { data }
}

// SanityLive is a no-op in static export mode — kept for compatibility if any file imports it
export function SanityLive() {
  return null
}
