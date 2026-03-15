import { format, parseISO, isBefore } from 'date-fns'
import { de } from 'date-fns/locale'

/**
 * Returns true if [start1, end1) and [start2, end2) overlap.
 * Ranges that merely touch (end1 === start2) are NOT considered overlapping.
 */
export function dateRangesOverlap(
  start1: string,
  end1: string,
  start2: string,
  end2: string
): boolean {
  const s1 = parseISO(start1)
  const e1 = parseISO(end1)
  const s2 = parseISO(start2)
  const e2 = parseISO(end2)
  return isBefore(s1, e2) && isBefore(s2, e1)
}

/**
 * Formats a date range in German.
 * Single day: "1. April 2026"
 * Multi day: "1. April – 5. April 2026"
 */
export function formatDateRange(startStr: string, endStr: string): string {
  const start = parseISO(startStr)
  const end = parseISO(endStr)

  if (startStr === endStr) {
    return format(start, 'd. MMMM yyyy', { locale: de })
  }

  const startFormatted = format(start, 'd. MMMM', { locale: de })
  const endFormatted = format(end, 'd. MMMM yyyy', { locale: de })
  return `${startFormatted} – ${endFormatted}`
}

/**
 * Formats a Date object to YYYY-MM-DD string for DB storage.
 */
export function toDateStr(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}

/**
 * Parses a YYYY-MM-DD string to a Date object.
 */
export function parseDateStr(dateStr: string): Date {
  return parseISO(dateStr)
}
