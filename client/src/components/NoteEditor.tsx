import { useState } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Note } from '../types'
import { summarizeNote } from '../lib/api'
import QuizPanel from './QuizPanel'

type NoteEditorProps = {
  note: Note
  // Partial<Note> = "some fields of a Note", e.g. { title: 'New title' }
  onChange: (changes: Partial<Note>) => void
  onDelete: () => void
}

// Edit a note on the left, see the formatted result on the right.
function NoteEditor({ note, onChange, onDelete }: NoteEditorProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // "async" function: it can "await" the server's answer
  async function handleSummarize() {
    setLoading(true)
    setError('')
    try {
      const summary = await summarizeNote(note.title, note.content)
      onChange({ summary }) // save the summary inside the note
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false) // "finally" runs whether it worked or failed
    }
  }

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <input
          className="min-w-0 flex-1 border-b border-transparent bg-transparent text-2xl font-bold text-slate-800 dark:text-slate-100 outline-none focus:border-amber-400"
          value={note.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="Note title"
        />
        <button
          onClick={onDelete}
          className="shrink-0 rounded-lg px-3 py-1 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
        >
          Delete
        </button>
      </div>

      {/* Phone: editor above preview. Large screens: side by side. */}
      <div className="grid gap-4 lg:grid-cols-2">
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Markdown</span>
          <textarea
            className="mt-1 h-96 w-full resize-y rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-3 font-mono text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
            value={note.content}
            onChange={(e) => onChange({ content: e.target.value })}
            placeholder={'# Heading\n\n**bold**, *italic*\n\n- list item\n\n```\ncode\n```'}
          />
        </label>

        <div>
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Preview</span>
          {/* "prose" (from the typography plugin) styles headings, lists, code, tables... */}
          <div className="prose prose-slate dark:prose-invert mt-1 h-96 max-w-none overflow-y-auto rounded-lg border border-slate-200 dark:border-slate-700 p-3">
            {note.content.trim() ? (
              // remarkGfm adds GitHub extras: tables, ~~strikethrough~~, - [ ] checklists
              <Markdown remarkPlugins={[remarkGfm]}>{note.content}</Markdown>
            ) : (
              <p className="text-slate-400">Nothing to preview yet.</p>
            )}
          </div>
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-400">
        Saved automatically · Last edited {new Date(note.updatedAt).toLocaleString('en-GB')}
      </p>

      {/* ✨ AI summary section */}
      <div className="mt-6 rounded-xl bg-linear-to-br from-violet-50 dark:from-violet-950/40 to-pink-50 dark:to-pink-950/40 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h4 className="font-semibold text-violet-800 dark:text-violet-300">✨ AI Summary</h4>
          <button
            onClick={handleSummarize}
            disabled={loading || !note.content.trim()} // can't click while waiting or if the note is empty
            className="rounded-lg bg-linear-to-r from-violet-500 to-pink-500 px-4 py-2 text-sm font-medium text-white shadow hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? '⏳ Summarizing...' : note.summary ? '🔄 Summarize again' : '✨ Summarize'}
          </button>
        </div>

        {error && <p className="mt-3 text-sm text-rose-600">⚠️ {error}</p>}

        {note.summary ? (
          <div className="prose prose-sm prose-slate dark:prose-invert mt-3 max-w-none">
            <Markdown remarkPlugins={[remarkGfm]}>{note.summary}</Markdown>
          </div>
        ) : (
          !error && <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Click “Summarize” to get the key points of this note.</p>
        )}
      </div>

      {/* 🧠 AI quiz section (its own component, so this file stays short) */}
      <QuizPanel note={note} />
    </div>
  )
}

export default NoteEditor
