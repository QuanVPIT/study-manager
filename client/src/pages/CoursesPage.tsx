import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import CourseForm, { type CourseFormData } from '../components/CourseForm'
import CourseCard from '../components/CourseCard'
import { useLocalStorage } from '../lib/useLocalStorage'
import type { Course, Deadline, Note } from '../types'

function CoursesPage() {
  // The list of courses, saved in localStorage under the name "courses"
  const [courses, setCourses] = useLocalStorage<Course[]>('courses', [])
  // We also need deadlines and notes: deleting a course deletes its deadlines and notes too
  const [deadlines, setDeadlines] = useLocalStorage<Deadline[]>('deadlines', [])
  const [notes, setNotes] = useLocalStorage<Note[]>('notes', [])
  // The course being edited right now (null = we are adding a new one)
  const [editing, setEditing] = useState<Course | null>(null)

  // CREATE: add a new course with a random unique id
  function addCourse(data: CourseFormData) {
    const newCourse: Course = { id: crypto.randomUUID(), ...data }
    setCourses([...courses, newCourse]) // make a NEW array — never change state directly
  }

  // UPDATE: replace the course that has the same id
  function updateCourse(data: CourseFormData) {
    if (!editing) return
    setCourses(courses.map((c) => (c.id === editing.id ? { ...c, ...data } : c)))
    setEditing(null)
  }

  // DELETE: remove the course AND everything that belongs to it ("cascade delete").
  // Otherwise its deadlines and notes would be left behind as "orphans" pointing to nothing.
  function deleteCourse(course: Course) {
    const deadlineCount = deadlines.filter((d) => d.courseId === course.id).length
    const noteCount = notes.filter((n) => n.courseId === course.id).length

    // Tell the user exactly what will be deleted before doing it
    let message = `Delete "${course.code} - ${course.name}"?`
    if (deadlineCount + noteCount > 0) {
      message += `\n\nThis will also delete ${deadlineCount} deadline(s) and ${noteCount} note(s).`
    }
    if (!confirm(message)) return

    setCourses(courses.filter((c) => c.id !== course.id))
    setDeadlines(deadlines.filter((d) => d.courseId !== course.id))
    setNotes(notes.filter((n) => n.courseId !== course.id))
    if (editing?.id === course.id) setEditing(null)
  }

  return (
    <>
      <PageHeader title="📘 Courses" subtitle="All the courses you are taking this semester." />

      {/* key={...}: when we switch which course we edit, React rebuilds the form
          so it starts with that course's data */}
      <CourseForm
        key={editing?.id ?? 'new'}
        initial={editing ?? undefined}
        onSubmit={editing ? updateCourse : addCourse}
        onCancel={editing ? () => setEditing(null) : undefined}
      />

      {courses.length === 0 ? (
        <p className="text-center text-slate-400">No courses yet. Add your first one above! 👆</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onEdit={() => {
                setEditing(course)
                window.scrollTo({ top: 0, behavior: 'smooth' }) // jump up to the form
              }}
              onDelete={() => deleteCourse(course)}
            />
          ))}
        </div>
      )}
    </>
  )
}

export default CoursesPage
