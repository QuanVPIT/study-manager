import { useState } from 'react'
import type { Course } from '../types'
import { COLOR_NAMES, COURSE_COLORS } from '../lib/colors'

// The form data = a Course without the id (the id is created when saving)
export type CourseFormData = Omit<Course, 'id'>

type CourseFormProps = {
  initial?: CourseFormData // if given, we are EDITING; if not, we are ADDING
  onSubmit: (data: CourseFormData) => void // the parent decides what "save" means
  onCancel?: () => void
}

const emptyForm: CourseFormData = { code: '', name: '', color: 'sky', teacher: '', room: '' }

// Shared style for all text inputs
const inputClass =
  'w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200'

function CourseForm({ initial, onSubmit, onCancel }: CourseFormProps) {
  // One state object holds every field of the form
  const [form, setForm] = useState<CourseFormData>(initial ?? emptyForm)
  const [error, setError] = useState('')

  const isEditing = initial !== undefined

  // Update ONE field and keep the others: { ...form } copies the old object
  function updateField(field: keyof CourseFormData, value: string) {
    setForm({ ...form, [field]: value })
  }

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault() // stop the browser from reloading the page (default form behavior)

    // Simple validation: code and name are required
    if (!form.code.trim() || !form.name.trim()) {
      setError('Please enter both a course code and a course name.')
      return
    }

    onSubmit({
      ...form,
      code: form.code.trim().toUpperCase(), // "it001 " → "IT001"
      name: form.name.trim(),
      teacher: form.teacher?.trim(),
      room: form.room?.trim(),
    })
    setError('')
    setForm(emptyForm) // clear the form after saving
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8 rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-slate-800 dark:text-slate-100">
        {isEditing ? '✏️ Edit course' : '➕ Add a course'}
      </h3>

      {/* 1 column on phones, 2 columns on bigger screens */}
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Course code *</span>
          <input
            className={inputClass}
            value={form.code}
            onChange={(e) => updateField('code', e.target.value)}
            placeholder="IT001"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Course name *</span>
          <input
            className={inputClass}
            value={form.name}
            onChange={(e) => updateField('name', e.target.value)}
            placeholder="Intro to Programming"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Teacher</span>
          <input
            className={inputClass}
            value={form.teacher ?? ''}
            onChange={(e) => updateField('teacher', e.target.value)}
            placeholder="Optional"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Room</span>
          <input
            className={inputClass}
            value={form.room ?? ''}
            onChange={(e) => updateField('room', e.target.value)}
            placeholder="Optional, e.g. B1.12"
          />
        </label>
      </div>

      {/* Color picker: one round button per color */}
      <div className="mt-4">
        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Color</span>
        <div className="mt-2 flex flex-wrap gap-2">
          {COLOR_NAMES.map((color) => (
            <button
              key={color}
              type="button" // "button", not "submit" — clicking a color must not submit the form
              onClick={() => updateField('color', color)}
              className={`h-8 w-8 rounded-full ${COURSE_COLORS[color].dot} ${
                form.color === color ? 'ring-4 ring-slate-300' : '' // ring = the selected color
              }`}
              aria-label={color}
            />
          ))}
        </div>
      </div>

      {/* Only show the error message when there is one */}
      {error && <p className="mt-4 text-sm text-rose-600">{error}</p>}

      <div className="mt-6 flex gap-3">
        <button type="submit" className="rounded-lg bg-sky-500 px-5 py-2 font-medium text-white hover:bg-sky-600">
          {isEditing ? 'Save changes' : 'Add course'}
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

export default CourseForm
