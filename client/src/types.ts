import type { CourseColor } from './lib/colors'

// A "type" describes the SHAPE of our data.
// TypeScript will warn us if a course is missing a field or has the wrong kind of value.
export type Course = {
  id: string // unique id, so we can find/edit/delete the right course
  code: string // e.g. "IT001"
  name: string // e.g. "Intro to Programming"
  color: CourseColor // one of the colors in lib/colors.ts
  teacher?: string // "?" means optional: it can be missing
  room?: string
}

// A "union type": the value must be EXACTLY one of these 3 words
export type DeadlineType = 'assignment' | 'exam' | 'project'

export type Deadline = {
  id: string
  title: string // e.g. "Lab 3: Loops"
  courseId: string // the id of the Course it belongs to (a "link" between the two)
  dueDate: string // "YYYY-MM-DD", the same format as <input type="date">
  type: DeadlineType
  done: boolean
}

// One multiple-choice question from the AI quiz (same shape as the server's QuizSchema)
export type QuizQuestion = {
  question: string
  options: string[] // the answer choices
  correctIndex: number // which option is right: 0 = first, 1 = second, ...
  explanation: string
}

export type Note = {
  id: string
  courseId: string // which course this note belongs to
  title: string
  content: string // the note text, written in Markdown
  summary?: string // the AI summary (optional: only after you click "Summarize")
  updatedAt: string // when it was last changed (ISO text, e.g. "2026-10-07T13:45:00.000Z")
}
