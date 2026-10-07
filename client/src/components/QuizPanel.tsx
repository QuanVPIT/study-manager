import { useState } from 'react'
import { generateQuiz } from '../lib/api'
import type { Note, QuizQuestion } from '../types'

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'] // labels for the options

// 🧠 Make a multiple-choice quiz from a note, answer it, then see your score.
function QuizPanel({ note }: { note: Note }) {
  const [count, setCount] = useState(5) // how many questions to ask for
  const [questions, setQuestions] = useState<QuizQuestion[] | null>(null) // null = no quiz yet
  // answers[i] = the option you picked for question i (null = not answered yet)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleGenerate() {
    setLoading(true)
    setError('')
    try {
      const result = await generateQuiz(note.title, note.content, count)
      setQuestions(result)
      setAnswers(result.map(() => null)) // one empty answer per question
      setSubmitted(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  // Pick an option (only allowed before you submit)
  function choose(questionIndex: number, optionIndex: number) {
    if (submitted) return
    setAnswers((prev) => prev.map((a, i) => (i === questionIndex ? optionIndex : a)))
  }

  // Try the same questions again
  function retry() {
    setAnswers(answers.map(() => null))
    setSubmitted(false)
  }

  // --- Derived values ---
  const allAnswered = answers.length > 0 && answers.every((a) => a !== null)
  const score = questions ? questions.filter((q, i) => answers[i] === q.correctIndex).length : 0

  // Decide the color of one option button
  function optionStyle(q: QuizQuestion, qi: number, oi: number): string {
    const picked = answers[qi] === oi
    if (!submitted) {
      return picked ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-300' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-300'
    }
    if (oi === q.correctIndex) return 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300' // the right answer: green
    if (picked) return 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300' // your wrong pick: red
    return 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 opacity-60'
  }

  return (
    <div className="mt-6 rounded-xl bg-linear-to-br from-indigo-50 dark:from-indigo-950/40 to-sky-50 dark:to-sky-950/40 p-5">
      {/* Header: title + controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h4 className="font-semibold text-indigo-800 dark:text-indigo-300">🧠 Quiz me</h4>
        <div className="flex items-center gap-2">
          <select
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-2 py-2 text-sm"
            aria-label="Number of questions"
          >
            {[3, 5, 10].map((n) => (
              <option key={n} value={n}>
                {n} questions
              </option>
            ))}
          </select>
          <button
            onClick={handleGenerate}
            disabled={loading || !note.content.trim()}
            className="rounded-lg bg-linear-to-r from-indigo-500 to-sky-500 px-4 py-2 text-sm font-medium text-white shadow hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? '⏳ Creating quiz...' : questions ? '🔄 New quiz' : '🧠 Create quiz'}
          </button>
        </div>
      </div>

      {error && <p className="mt-3 text-sm text-rose-600">⚠️ {error}</p>}

      {!questions && !error && (
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Test yourself with questions made from this note.</p>
      )}

      {/* The questions */}
      {questions && (
        <ol className="mt-4 space-y-5">
          {questions.map((q, qi) => (
            <li key={qi} className="rounded-xl bg-white/70 dark:bg-slate-800/70 p-4">
              <p className="mb-3 font-medium text-slate-800 dark:text-slate-100">
                {qi + 1}. {q.question}
              </p>
              <div className="grid gap-2">
                {q.options.map((option, oi) => (
                  <button
                    key={oi}
                    onClick={() => choose(qi, oi)}
                    disabled={submitted}
                    className={`flex gap-3 rounded-lg border-2 px-3 py-2 text-left text-sm transition ${optionStyle(q, qi, oi)}`}
                  >
                    <span className="font-bold">{LETTERS[oi]}.</span>
                    <span>{option}</span>
                  </button>
                ))}
              </div>
              {/* After submitting: show why */}
              {submitted && <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">💡 {q.explanation}</p>}
            </li>
          ))}
        </ol>
      )}

      {/* Bottom: submit button, or the score */}
      {questions && questions.length > 0 && (
        <div className="mt-5 flex flex-wrap items-center gap-3">
          {!submitted ? (
            <button
              onClick={() => setSubmitted(true)}
              disabled={!allAnswered}
              className="rounded-lg bg-indigo-500 px-5 py-2 font-medium text-white hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {allAnswered ? 'Check answers' : `Answer all questions (${answers.filter((a) => a !== null).length}/${questions.length})`}
            </button>
          ) : (
            <>
              <p className="text-lg font-bold text-indigo-800 dark:text-indigo-300">
                Score: {score}/{questions.length} {score === questions.length ? '🏆' : score >= questions.length / 2 ? '👍' : '📚'}
              </p>
              <button onClick={retry} className="rounded-lg px-4 py-2 text-sm font-medium text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/40">
                ↩️ Try again
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default QuizPanel
