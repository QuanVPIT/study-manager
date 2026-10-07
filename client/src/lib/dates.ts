// Helpers for working with dates.
// We store dates as text "YYYY-MM-DD" (easy to save and to sort).

const ONE_DAY_MS = 24 * 60 * 60 * 1000 // milliseconds in one day

// Turn "2026-10-07" into a Date at 00:00 LOCAL time.
// (new Date("2026-10-07") would use UTC time, which is 7 hours off in Vietnam!)
export function parseDate(text: string): Date {
  const [year, month, day] = text.split('-').map(Number)
  return new Date(year, month - 1, day) // months start at 0 in JavaScript (0 = January)
}

// Today's date as "YYYY-MM-DD" in LOCAL time.
// (We avoid toISOString(): it gives the UTC date, which is "yesterday" before 7am in Vietnam.)
export function todayString(): string {
  const now = new Date()
  const mm = String(now.getMonth() + 1).padStart(2, '0') // 7 → "07"
  const dd = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${mm}-${dd}`
}

// How many days from today until the date? (negative = in the past)
export function daysUntil(text: string): number {
  const diff = parseDate(text).getTime() - parseDate(todayString()).getTime()
  return Math.round(diff / ONE_DAY_MS) // round: daylight-saving days can be 23 or 25 hours
}

// "Wed, 7 Oct" — a short, friendly date
export function formatDate(text: string): string {
  return parseDate(text).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
}

// "Wednesday, 7 October" — today's date in long form
export function todayLong(): string {
  return new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })
}

// "Due today", "Due tomorrow", "In 3 days", "2 days overdue"
export function relativeLabel(text: string): string {
  const days = daysUntil(text)
  if (days === 0) return 'Due today'
  if (days === 1) return 'Due tomorrow'
  if (days > 1) return `In ${days} days`
  if (days === -1) return '1 day overdue'
  return `${-days} days overdue`
}
