import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import DeadlineForm, { type DeadlineFormData } from '../components/DeadlineForm'
import DeadlineItem from '../components/DeadlineItem'
import { useLocalStorage } from '../lib/useLocalStorage'
import { GROUPS, getGroup, sortByDueDate } from '../lib/deadlines'
import type { Course, Deadline } from '../types'

function DeadlinesPage() {
  const [deadlines, setDeadlines] = useLocalStorage<Deadline[]>('deadlines', [])
  // Read the courses too (same "courses" key as the Courses page), for the dropdown and colors
  const [courses] = useLocalStorage<Course[]>('courses', [])
  // The deadline being edited right now (null = we are adding a new one)
  const [editing, setEditing] = useState<Deadline | null>(null)

  function addDeadline(data: DeadlineFormData) {
    setDeadlines([...deadlines, { id: crypto.randomUUID(), done: false, ...data }])
  }

  // UPDATE: same pattern as the Courses page
  function updateDeadline(data: DeadlineFormData) {
    if (!editing) return
    setDeadlines(deadlines.map((d) => (d.id === editing.id ? { ...d, ...data } : d)))
    setEditing(null)
  }

  // Flip done: true → false, false → true
  function toggleDone(id: string) {
    setDeadlines(deadlines.map((d) => (d.id === id ? { ...d, done: !d.done } : d)))
  }

  function deleteDeadline(deadline: Deadline) {
    if (!confirm(`Delete "${deadline.title}"?`)) return
    setDeadlines(deadlines.filter((d) => d.id !== deadline.id))
    if (editing?.id === deadline.id) setEditing(null)
  }

  const sorted = sortByDueDate(deadlines)

  return (
    <>
      <PageHeader title="⏰ Deadlines" subtitle="Assignments, exams and projects — sorted by urgency." />

      {/* key: rebuild the form when we switch which deadline we edit */}
      <DeadlineForm
        key={editing?.id ?? 'new'}
        courses={courses}
        initial={editing ?? undefined}
        onSubmit={editing ? updateDeadline : addDeadline}
        onCancel={editing ? () => setEditing(null) : undefined}
      />

      {deadlines.length === 0 && (
        <p className="text-center text-slate-400">No deadlines yet. Enjoy the free time! 🎉</p>
      )}

      {GROUPS.map((group) => {
        const items = sorted.filter((d) => getGroup(d) === group.id)
        if (items.length === 0) return null // hide empty groups

        return (
          <section key={group.id} className="mb-8">
            <h3 className={`mb-3 text-lg font-bold ${group.style}`}>
              {group.label} <span className="text-sm font-normal text-slate-400">({items.length})</span>
            </h3>
            <ul className="space-y-2">
              {items.map((d) => (
                <DeadlineItem
                  key={d.id}
                  deadline={d}
                  course={courses.find((c) => c.id === d.courseId)} // find the linked course
                  onToggle={() => toggleDone(d.id)}
                  onEdit={() => {
                    setEditing(d)
                    window.scrollTo({ top: 0, behavior: 'smooth' }) // jump up to the form
                  }}
                  onDelete={() => deleteDeadline(d)}
                />
              ))}
            </ul>
          </section>
        )
      })}
    </>
  )
}

export default DeadlinesPage
