// The colors a course can have.
// Remember the Tailwind rule: write class names IN FULL so Tailwind can find them.
export const COURSE_COLORS = {
  sky: { dot: 'bg-sky-500', light: 'bg-sky-50 dark:bg-sky-950/40', border: 'border-sky-500', text: 'text-sky-700 dark:text-sky-300' },
  violet: { dot: 'bg-violet-500', light: 'bg-violet-50 dark:bg-violet-950/40', border: 'border-violet-500', text: 'text-violet-700 dark:text-violet-300' },
  rose: { dot: 'bg-rose-500', light: 'bg-rose-50 dark:bg-rose-950/40', border: 'border-rose-500', text: 'text-rose-700 dark:text-rose-300' },
  amber: { dot: 'bg-amber-500', light: 'bg-amber-50 dark:bg-amber-950/40', border: 'border-amber-500', text: 'text-amber-700 dark:text-amber-300' },
  emerald: { dot: 'bg-emerald-500', light: 'bg-emerald-50 dark:bg-emerald-950/40', border: 'border-emerald-500', text: 'text-emerald-700 dark:text-emerald-300' },
  pink: { dot: 'bg-pink-500', light: 'bg-pink-50 dark:bg-pink-950/40', border: 'border-pink-500', text: 'text-pink-700 dark:text-pink-300' },
  indigo: { dot: 'bg-indigo-500', light: 'bg-indigo-50 dark:bg-indigo-950/40', border: 'border-indigo-500', text: 'text-indigo-700 dark:text-indigo-300' },
  teal: { dot: 'bg-teal-500', light: 'bg-teal-50 dark:bg-teal-950/40', border: 'border-teal-500', text: 'text-teal-700 dark:text-teal-300' },
}

// CourseColor = "sky" | "violet" | "rose" | ... (TypeScript builds this list from the keys above)
export type CourseColor = keyof typeof COURSE_COLORS

// A list of the color names, handy for showing color buttons in a form
export const COLOR_NAMES = Object.keys(COURSE_COLORS) as CourseColor[]
