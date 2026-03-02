import { createClient } from '@sanity/client'

import { apiVersion, dataset, projectId, studioUrl } from '@/lib/sanity/lib/api'
import { token } from './token'

/**
 * Sanity client for production use.
 * Stega encoding is disabled to prevent edit overlays in production.
 * For draft mode/live preview, use the client from defineLive which handles stega conditionally.
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
  ...(token && { token }), // Only include token if it exists
  // Disable stega encoding in production to prevent edit overlays
  // Stega is only enabled in draft mode via defineLive
  stega: false,
})

