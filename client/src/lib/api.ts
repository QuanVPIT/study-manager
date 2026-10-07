import type { QuizQuestion } from '../types'

// Functions that talk to OUR server (never directly to the AI — the key lives on the server).

// Shared helper: send JSON to our server and get JSON back (or throw a friendly error).
// <T> = the type of data we expect back, chosen by whoever calls this function.
async function postJson<T>(url: string, body: unknown): Promise<T> {
  // fetch = send an HTTP request. "await" waits for the answer without freezing the page.
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  // The server always answers with JSON: the data on success, { error } on failure
  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.error ?? 'Cannot reach the AI server. Is it running? (cd server && npm run dev)')
  }
  return data as T
}

export async function summarizeNote(title: string, content: string): Promise<string> {
  const data = await postJson<{ summary: string }>('/api/summarize', { title, content })
  return data.summary
}

export async function generateQuiz(title: string, content: string, count: number): Promise<QuizQuestion[]> {
  const data = await postJson<{ questions: QuizQuestion[] }>('/api/quiz', { title, content, count })
  return data.questions
}
