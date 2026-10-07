import type { Deadline } from '../types'
import { daysUntil } from './dates'

// Deadline grouping, shared by the Deadlines page AND the Dashboard
// (moved here so we don't write the same logic twice).

// The groups, in the order they appear on screen. Full Tailwind class names, as always!
export const GROUPS = [
  { id: 'overdue', label: '🔴 Overdue', style: 'text-rose-600' },
  { id: 'today', label: '🟠 Today', style: 'text-orange-500' },
  { id: 'week', label: '🟡 This week', style: 'text-amber-500' },
  { id: 'later', label: '🟢 Later', style: 'text-emerald-600' },
  { id: 'done', label: '✅ Done', style: 'text-slate-400' },
] as const

export type GroupId = (typeof GROUPS)[number]['id'] // "overdue" | "today" | "week" | "later" | "done"

// Decide which group a deadline belongs to
export function getGroup(deadline: Deadline): GroupId {
  if (deadline.done) return 'done'
  const days = daysUntil(deadline.dueDate)
  if (days < 0) return 'overdue'
  if (days === 0) return 'today'
  if (days <= 7) return 'week'
  return 'later'
}

// Sort by due date. "YYYY-MM-DD" text sorts correctly as text: "2026-10-07" < "2026-10-15"
// [...list] makes a copy first, because .sort() changes the array it is called on.
export function sortByDueDate(list: Deadline[]): Deadline[] {
  return [...list].sort((a, b) => a.dueDate.localeCompare(b.dueDate))
}
