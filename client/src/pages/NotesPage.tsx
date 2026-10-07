import { useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import PageHeader from '../components/PageHeader'
import NoteEditor from '../components/NoteEditor'
import { useLocalStorage } from '../lib/useLocalStorage'
import { COURSE_COLORS } from '../lib/colors'
import type { Course, Note } from '../types'

function NotesPage() {
  const [courses] = useLocalStorage<Course[]>('courses', [])
  const [notes, setNotes] = useLocalStorage<Note[]>('notes', [])

  // "Search params" = the part of the URL after "?". The Dashboard links to /notes?note=<id>
  // so a note can be opened directly.
  const [searchParams] = useSearchParams()
  const linkedNote = notes.find((n) => n.id === searchParams.get('note'))

  // Which course and which note are selected right now (start with the linked note, if any)
  const [courseId, setCourseId] = useState(linkedNote?.courseId ?? courses[0]?.id ?? '')
  const [noteId, setNoteId] = useState<string | null>(linkedNote?.id ?? null)

  if (courses.length === 0) {
    return (
      <>
        <PageHeader title="📝 Notes" subtitle="Write notes for each course." />
        <p className="text-slate-600 dark:text-slate-300">
          You need a course first.{' '}
          <Link to="/courses" className="font-medium text-sky-600 underline">
            Add a course →
          </Link>
        </p>
      </>
    )
  }

  // "Derived" values: calculated from state every render, not stored separately
  const courseNotes = notes
    .filter((n) => n.courseId === courseId)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)) // newest first
  const selectedNote = notes.find((n) => n.id === noteId)

  function selectCourse(id: string) {
    setCourseId(id)
    setNoteId(null) // close the open note when switching course
  }

  function addNote() {
    const newNote: Note = {
      id: crypto.randomUUID(),
      courseId,
      title: 'Untitled note',
      content: '',
      updatedAt: new Date().toISOString(),
    }
    setNotes([...notes, newNote])
    setNoteId(newNote.id) // open it right away
  }

  // Called on every key press → useLocalStorage saves it = "auto-save"
  // We pass a FUNCTION to setNotes: "prev" is always the LATEST list. This matters for the
  // AI summary, which arrives seconds later — by then you may have typed more text.
  function updateNote(id: string, changes: Partial<Note>) {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, ...changes, updatedAt: new Date().toISOString() } : n)),
    )
  }

  function deleteNote(note: Note) {
    if (!confirm(`Delete "${note.title}"?`)) return
    setNotes(notes.filter((n) => n.id !== note.id))
    setNoteId(null)
  }

  return (
    <>
      <PageHeader title="📝 Notes" subtitle="Write notes for each course, in Markdown." />

      {/* Course tabs, each in its own color */}
      <div className="mb-6 flex flex-wrap gap-2">
        {courses.map((c) => {
          const color = COURSE_COLORS[c.color]
          const isActive = c.id === courseId
          return (
            <button
              key={c.id}
              onClick={() => selectCourse(c.id)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                isActive ? `${color.dot} text-white shadow` : `${color.light} ${color.text} hover:shadow`
              }`}
            >
              {c.code}
            </button>
          )
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-[16rem_1fr]">
        {/* Left: the list of notes for this course */}
        <aside>
          <button
            onClick={addNote}
            className="mb-3 w-full rounded-lg bg-amber-500 px-4 py-2 font-medium text-white hover:bg-amber-600"
          >
            ➕ New note
          </button>
          {courseNotes.length === 0 && <p className="text-sm text-slate-400">No notes for this course yet.</p>}
          <ul className="space-y-2">
            {courseNotes.map((n) => (
              <li key={n.id}>
                <button
                  onClick={() => setNoteId(n.id)}
                  className={`w-full truncate rounded-lg px-3 py-2 text-left text-sm transition ${
                    n.id === noteId ? 'bg-amber-100 dark:bg-amber-900/40 font-semibold text-amber-800 dark:text-amber-200' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-amber-50 dark:hover:bg-amber-950/40'
                  }`}
                >
                  {n.title || 'Untitled note'}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Right: the editor for the selected note */}
        <section className="min-w-0">
          {selectedNote ? (
            <NoteEditor
              key={selectedNote.id}
              note={selectedNote}
              onChange={(changes) => updateNote(selectedNote.id, changes)}
              onDelete={() => deleteNote(selectedNote)}
            />
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 p-10 text-center text-slate-400">
              Pick a note on the left, or create a new one.
            </div>
          )}
        </section>
      </div>
    </>
  )
}

export default NotesPage
