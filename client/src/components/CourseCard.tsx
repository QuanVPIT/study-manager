import type { Course } from '../types'
import { COURSE_COLORS } from '../lib/colors'

type CourseCardProps = {
  course: Course
  onEdit: () => void
  onDelete: () => void
}

// Shows ONE course as a colored card with Edit / Delete buttons.
function CourseCard({ course, onEdit, onDelete }: CourseCardProps) {
  const color = COURSE_COLORS[course.color] // e.g. { dot: 'bg-sky-500', ... }

  return (
    <div className={`rounded-2xl border-l-8 ${color.border} ${color.light} p-5 shadow-sm`}>
      <span className={`text-sm font-bold ${color.text}`}>{course.code}</span>
      <h3 className="mt-1 text-lg font-semibold text-slate-800 dark:text-slate-100">{course.name}</h3>

      {/* Optional info: only shown if it was filled in */}
      <div className="mt-2 space-y-1 text-sm text-slate-500 dark:text-slate-400">
        {course.teacher && <p>👩‍🏫 {course.teacher}</p>}
        {course.room && <p>📍 {course.room}</p>}
      </div>

      <div className="mt-4 flex gap-2">
        <button onClick={onEdit} className="rounded-lg bg-white dark:bg-slate-800 px-3 py-1 text-sm text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-100 dark:hover:bg-slate-700">
          Edit
        </button>
        <button onClick={onDelete} className="rounded-lg bg-white dark:bg-slate-800 px-3 py-1 text-sm text-rose-600 shadow-sm hover:bg-rose-100 dark:hover:bg-rose-950/40">
          Delete
        </button>
      </div>
    </div>
  )
}

export default CourseCard
