import type { Course, Deadline } from '../types'
import { COURSE_COLORS } from '../lib/colors'
import { formatDate, relativeLabel } from '../lib/dates'

type DeadlineItemProps = {
  deadline: Deadline
  course?: Course // can be missing if the course was deleted
  onToggle: () => void
  // optional: the Dashboard shows deadlines without Edit / Delete buttons
  onEdit?: () => void
  onDelete?: () => void
}

// A small icon for each deadline type
const typeIcons = { assignment: '📄', exam: '📝', project: '🛠️' }

// Shows ONE deadline as a row: checkbox, title, course badge, date, delete button.
function DeadlineItem({ deadline, course, onToggle, onEdit, onDelete }: DeadlineItemProps) {
  const color = course ? COURSE_COLORS[course.color] : null

  return (
    <li className="flex items-center gap-4 rounded-xl bg-white dark:bg-slate-800 p-4 shadow-sm">
      <input
        type="checkbox"
        checked={deadline.done}
        onChange={onToggle}
        className="h-5 w-5 shrink-0 accent-emerald-500"
        aria-label="Mark as done"
      />

      {/* min-w-0 lets long titles shrink instead of pushing the buttons off screen */}
      <div className="min-w-0 flex-1">
        {/* Done items get a line through them */}
        <p className={`font-medium ${deadline.done ? 'text-slate-400 line-through' : 'text-slate-800 dark:text-slate-100'}`}>
          {typeIcons[deadline.type]} {deadline.title}
        </p>

        <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          {/* Course badge in the course's own color */}
          {course && color ? (
            <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${color.light} ${color.text}`}>
              {course.code}
            </span>
          ) : (
            <span className="rounded-full bg-slate-100 dark:bg-slate-700 px-2 py-0.5 text-xs text-slate-500 dark:text-slate-400">Deleted course</span>
          )}
          <span>{formatDate(deadline.dueDate)}</span>
          {!deadline.done && <span>· {relativeLabel(deadline.dueDate)}</span>}
        </div>
      </div>

      {onEdit && (
        <button
          onClick={onEdit}
          className="shrink-0 rounded-lg px-3 py-1 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
        >
          Edit
        </button>
      )}
      {onDelete && (
        <button
          onClick={onDelete}
          className="shrink-0 rounded-lg px-3 py-1 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
        >
          Delete
        </button>
      )}
    </li>
  )
}

export default DeadlineItem
