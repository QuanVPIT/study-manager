import { Link } from 'react-router'
import PageHeader from '../components/PageHeader'
import DeadlineItem from '../components/DeadlineItem'
import { useLocalStorage } from '../lib/useLocalStorage'
import { COURSE_COLORS } from '../lib/colors'
import { getGroup, sortByDueDate } from '../lib/deadlines'
import { todayLong } from '../lib/dates'
import type { Course, Deadline, Note } from '../types'

// A greeting that depends on the time of day
function greeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning ☀️'
  if (hour < 18) return 'Good afternoon 🌤️'
  return 'Good evening 🌙'
}

function DashboardPage() {
  // Read ALL our data. Same keys as the other pages, so it's the same data.
  const [courses] = useLocalStorage<Course[]>('courses', [])
  const [deadlines, setDeadlines] = useLocalStorage<Deadline[]>('deadlines', [])
  const [notes] = useLocalStorage<Note[]>('notes', [])

  // --- Derived values (calculated from the data, not stored) ---
  const pending = deadlines.filter((d) => !d.done)
  const overdueCount = pending.filter((d) => getGroup(d) === 'overdue').length
  // "Needs attention" = overdue + today + this week, soonest first
  const urgent = sortByDueDate(pending.filter((d) => getGroup(d) !== 'later'))
  // 3 most recently edited notes
  const recentNotes = [...notes].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 3)

  // The 3 colorful stat cards (full Tailwind class names!)
  const stats = [
    { to: '/courses', label: 'Courses', value: courses.length, icon: '📘', color: 'from-sky-400 to-blue-500', extra: '' },
    {
      to: '/deadlines',
      label: 'Deadlines to do',
      value: pending.length,
      icon: '⏰',
      color: 'from-rose-400 to-pink-500',
      extra: overdueCount > 0 ? `⚠️ ${overdueCount} overdue` : '',
    },
    { to: '/notes', label: 'Notes', value: notes.length, icon: '📝', color: 'from-amber-400 to-orange-500', extra: '' },
  ]

  function toggleDone(id: string) {
    setDeadlines((prev) => prev.map((d) => (d.id === id ? { ...d, done: !d.done } : d)))
  }

  return (
    <>
      <PageHeader title={greeting()} subtitle={`Today is ${todayLong()}.`} />

      {/* First time here? Show a short "getting started" guide */}
      {courses.length === 0 && (
        <div className="mb-8 rounded-2xl border-2 border-dashed border-violet-300 dark:border-violet-700 bg-violet-50 dark:bg-violet-950/40 p-6 text-violet-900 dark:text-violet-200">
          <h3 className="mb-2 font-semibold">👋 Welcome! Let's get started:</h3>
          <ol className="list-inside list-decimal space-y-1 text-sm">
            <li>
              <Link to="/courses" className="font-medium underline">Add your courses</Link>
            </li>
            <li>Add deadlines for assignments and exams</li>
            <li>Write notes and let the AI summarize them ✨</li>
          </ol>
        </div>
      )}

      {/* Stat cards: 1 column on phones, 3 on medium screens and up */}
      <div className="mb-10 grid gap-4 md:grid-cols-3">
        {stats.map((s) => (
          <Link
            key={s.to}
            to={s.to}
            className={`rounded-2xl bg-linear-to-br ${s.color} p-6 text-white shadow-md transition hover:-translate-y-1 hover:shadow-lg`}
          >
            <div className="flex items-center justify-between">
              <span className="text-4xl">{s.icon}</span>
              <span className="text-4xl font-extrabold">{s.value}</span>
            </div>
            <div className="mt-3 text-lg font-semibold">{s.label}</div>
            {s.extra && <div className="mt-1 text-sm font-medium text-white/90">{s.extra}</div>}
          </Link>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left: deadlines that need attention */}
        <section>
          <h3 className="mb-3 text-lg font-bold text-slate-800 dark:text-slate-100">🔥 Needs attention (next 7 days)</h3>
          {urgent.length === 0 ? (
            <p className="rounded-xl bg-white dark:bg-slate-800 p-4 text-slate-400 shadow-sm">Nothing urgent. Nice work! 🎉</p>
          ) : (
            <ul className="space-y-2">
              {urgent.map((d) => (
                <DeadlineItem
                  key={d.id}
                  deadline={d}
                  course={courses.find((c) => c.id === d.courseId)}
                  onToggle={() => toggleDone(d.id)} // tick it here → it disappears from this list
                />
              ))}
            </ul>
          )}
        </section>

        {/* Right: recently edited notes */}
        <section>
          <h3 className="mb-3 text-lg font-bold text-slate-800 dark:text-slate-100">🕘 Recent notes</h3>
          {recentNotes.length === 0 ? (
            <p className="rounded-xl bg-white dark:bg-slate-800 p-4 text-slate-400 shadow-sm">No notes yet.</p>
          ) : (
            <ul className="space-y-2">
              {recentNotes.map((n) => {
                const course = courses.find((c) => c.id === n.courseId)
                return (
                  <li key={n.id}>
                    {/* Link with "?note=..." so the Notes page opens this exact note */}
                    <Link
                      to={`/notes?note=${n.id}`}
                      className="flex items-center gap-3 rounded-xl bg-white dark:bg-slate-800 p-4 shadow-sm transition hover:bg-amber-50 dark:hover:bg-amber-950/40"
                    >
                      {course && (
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-bold ${COURSE_COLORS[course.color].light} ${COURSE_COLORS[course.color].text}`}
                        >
                          {course.code}
                        </span>
                      )}
                      <span className="min-w-0 flex-1 truncate font-medium text-slate-700 dark:text-slate-200">{n.title || 'Untitled note'}</span>
                      {n.summary && <span title="Has an AI summary">✨</span>}
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      </div>
    </>
  )
}

export default DashboardPage
