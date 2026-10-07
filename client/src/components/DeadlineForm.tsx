import { useState } from 'react'
import { Link } from 'react-router'
import type { Course, Deadline, DeadlineType } from '../types'
import { todayString } from '../lib/dates'

// What the form gives back: a Deadline without id and done (the page adds those)
export type DeadlineFormData = Omit<Deadline, 'id' | 'done'>

type DeadlineFormProps = {
  courses: Course[] // needed for the "Course" dropdown
  initial?: DeadlineFormData // if given, we are EDITING (same idea as CourseForm)
  onSubmit: (data: DeadlineFormData) => void
  onCancel?: () => void
}

const inputClass =
  'w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-200'

function DeadlineForm({ courses, initial, onSubmit, onCancel }: DeadlineFormProps) {
  // Start with the deadline's values when editing, or defaults when adding
  const [title, setTitle] = useState(initial?.title ?? '')
  const [courseId, setCourseId] = useState(initial?.courseId ?? courses[0]?.id ?? '') // default: first course
  const [dueDate, setDueDate] = useState(initial?.dueDate ?? todayString())
  const [type, setType] = useState<DeadlineType>(initial?.type ?? 'assignment')
  const [error, setError] = useState('')

  const isEditing = initial !== undefined

  // You can't add a deadline without a course, so show a helpful message instead
  if (courses.length === 0) {
    return (
      <div className="mb-8 rounded-2xl bg-white dark:bg-slate-800 p-6 text-slate-600 dark:text-slate-300 shadow-sm">
        You need a course first.{' '}
        <Link to="/courses" className="font-medium text-sky-600 underline">
          Add a course →
        </Link>
      </div>
    )
  }

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!title.trim() || !dueDate) {
      setError('Please enter a title and a due date.')
      return
    }
    onSubmit({ title: title.trim(), courseId, dueDate, type })
    setTitle('') // clear only the title, so adding several deadlines in a row is quick
    setError('')
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8 rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-slate-800 dark:text-slate-100">{isEditing ? '✏️ Edit deadline' : '➕ Add a deadline'}</h3>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block md:col-span-2">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Title *</span>
          <input
            className={inputClass}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Lab 3: Loops"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Course *</span>
          {/* A dropdown: one <option> per course. The value we keep is the course's id. */}
          <select className={inputClass} value={courseId} onChange={(e) => setCourseId(e.target.value)}>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code} – {c.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Due date *</span>
          {/* type="date" shows the browser's date picker and gives us "YYYY-MM-DD" */}
          <input type="date" className={inputClass} value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Type</span>
          <select
            className={inputClass}
            value={type}
            // e.target.value is just "string", so we tell TypeScript it is a DeadlineType
            onChange={(e) => setType(e.target.value as DeadlineType)}
          >
            <option value="assignment">📄 Assignment</option>
            <option value="exam">📝 Exam</option>
            <option value="project">🛠️ Project</option>
          </select>
        </label>
      </div>

      {error && <p className="mt-4 text-sm text-rose-600">{error}</p>}

      <div className="mt-6 flex gap-3">
        <button type="submit" className="rounded-lg bg-rose-500 px-5 py-2 font-medium text-white hover:bg-rose-600">
          {isEditing ? 'Save changes' : 'Add deadline'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg px-5 py-2 font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

export default DeadlineForm
