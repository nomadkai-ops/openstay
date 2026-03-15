import { describe, it, expect } from 'vitest'
import { dateRangesOverlap, formatDateRange, toDateStr } from './datum'

describe('dateRangesOverlap', () => {
  it('returns false for non-overlapping ranges', () => {
    expect(dateRangesOverlap('2026-04-01', '2026-04-05', '2026-04-06', '2026-04-10')).toBe(false)
  })

  it('returns false for touching ranges (end of first = start of second)', () => {
    expect(dateRangesOverlap('2026-04-01', '2026-04-05', '2026-04-05', '2026-04-10')).toBe(false)
  })

  it('returns true for overlapping ranges', () => {
    expect(dateRangesOverlap('2026-04-01', '2026-04-07', '2026-04-05', '2026-04-10')).toBe(true)
  })

  it('returns true when one range contains the other', () => {
    expect(dateRangesOverlap('2026-04-01', '2026-04-10', '2026-04-03', '2026-04-07')).toBe(true)
  })

  it('returns true for identical ranges', () => {
    expect(dateRangesOverlap('2026-04-01', '2026-04-05', '2026-04-01', '2026-04-05')).toBe(true)
  })
})

describe('formatDateRange', () => {
  it('formats a multi-day range in German', () => {
    const result = formatDateRange('2026-04-01', '2026-04-05')
    expect(result).toBe('1. April – 5. April 2026')
  })

  it('formats a single-day range without dash', () => {
    const result = formatDateRange('2026-04-01', '2026-04-01')
    expect(result).toBe('1. April 2026')
  })
})

describe('toDateStr', () => {
  it('formats a Date to YYYY-MM-DD', () => {
    expect(toDateStr(new Date(2026, 3, 15))).toBe('2026-04-15')
  })
})
