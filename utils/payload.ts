import { Media } from '@/payload-types'

/**
 * Type guard to check if a media field is populated
 */
export function isPopulatedMedia(media: number | Media | null | undefined): media is Media {
  return typeof media === 'object' && media !== null && 'url' in media
}

/**
 * Get the media URL safely, returning null if not populated or no URL
 */
export function getMediaUrl(media: number | Media | null | undefined): string | null {
  if (isPopulatedMedia(media)) {
    return media.url || null
  }
  return null
}

/**
 * Get the media alt text safely
 */
export function getMediaAlt(
  media: number | Media | null | undefined,
  fallback: string = '',
): string {
  if (isPopulatedMedia(media)) {
    return media.alt || fallback
  }
  return fallback
}

/**
 * Check if a string field is populated (not null/undefined/empty)
 */
export function isPopulatedString(value: string | null | undefined): value is string {
  return typeof value === 'string' && value.length > 0
}

/**
 * Type guard for checking if a field exists and has content
 */
export function hasContent<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined
}
