import express from 'express'
import type { Response } from 'express'
import Anthropic from '@anthropic-ai/sdk'
import { betaZodOutputFormat } from '@anthropic-ai/sdk/helpers/beta/zod'
import * as z from 'zod/v4'

const app = express()
app.use(express.json({ limit: '1mb' })) // read JSON from the request body (notes can be long)

// The client reads the secret key from the ANTHROPIC_API_KEY environment variable (.env file).
// The key stays HERE on the server — the browser never sees it.
const client = new Anthropic()

// Settings shared by every AI request.
// The type comes from the SDK: "Pick" = only these 4 fields of the full request type.
type SharedSettings = Pick<
  Anthropic.Beta.Messages.MessageCreateParamsNonStreaming,
  'model' | 'max_tokens' | 'betas' | 'fallbacks'
>
const AI_SETTINGS: SharedSettings = {
  model: 'claude-opus-5-5',
  max_tokens: 16000,
  // If the model declines a request, automatically retry on a suitable fallback model
  betas: ['server-side-fallback-2026-07-01'],
  fallbacks: 'default',
}

// ---------- Helpers used by all routes ----------

// Check the note sent by the browser. Returns an error message, or null if everything is OK.
function checkRequest(content: unknown): string | null {
  if (typeof content !== 'string' || !content.trim()) return 'The note is empty — write something first.'
  if (!process.env.ANTHROPIC_API_KEY) return 'No API key yet. Add ANTHROPIC_API_KEY to server/.env and restart the server.'
  return null
}

// Turn API errors into friendly messages (most specific first)
function sendAiError(error: unknown, res: Response) {
  console.error(error)
  if (error instanceof Anthropic.AuthenticationError) {
    res.status(500).json({ error: 'Invalid API key. Check ANTHROPIC_API_KEY in server/.env.' })
  } else if (error instanceof Anthropic.RateLimitError) {
    res.status(429).json({ error: 'Too many requests. Wait a moment and try again.' })
  } else if (error instanceof Anthropic.APIError) {
    res.status(502).json({ error: `AI service error (${error.status}). Try again later.` })
  } else {
    res.status(500).json({ error: 'Something went wrong on the server.' })
  }
}

// ---------- Route 1: summarize a note ----------

const SUMMARY_PROMPT = `You summarize a university student's study notes.
Write the summary in the same language as the notes (often Vietnamese or English).
Format it in Markdown:
- Start with a one-sentence overview.
- Then 3-7 bullet points with the key ideas, definitions and formulas.
- Keep code snippets only if they are essential.
Be concise and accurate. Do not add facts that are not in the notes.`

// POST /api/summarize  — body: { title, content }  → { summary: string }
app.post('/api/summarize', async (req, res) => {
  const { title, content } = req.body ?? {}
  const problem = checkRequest(content)
  if (problem) {
    res.status(400).json({ error: problem })
    return
  }

  try {
    const response = await client.beta.messages.create({
      ...AI_SETTINGS,
      output_config: { effort: 'low' }, // summarizing is a simple task: less thinking = faster + cheaper
      system: SUMMARY_PROMPT,
      messages: [{ role: 'user', content: `Note title: ${title || 'Untitled'}\n\n${content}` }],
    })

    if (response.stop_reason === 'refusal') {
      res.status(422).json({ error: 'The AI could not summarize this note.' })
      return
    }

    // The answer is a list of "blocks"; we keep only the text blocks and join them
    const summary = response.content
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('')

    res.json({ summary })
  } catch (error) {
    sendAiError(error, res)
  }
})

// ---------- Route 2: make a quiz from a note ----------

// The SHAPE of the answer we want, described with Zod.
// "Structured output" forces the AI to answer with JSON that matches this shape exactly,
// so our code can use it directly (no guessing, no messy text to cut apart).
const QuizSchema = z.object({
  questions: z.array(
    z.object({
      question: z.string(),
      options: z.array(z.string()), // the 4 answer choices
      correctIndex: z.number().int(), // position of the right answer: 0, 1, 2 or 3
      explanation: z.string(), // why that answer is right
    }),
  ),
})

const QUIZ_PROMPT = `You create multiple-choice quizzes from a university student's study notes.
Write in the same language as the notes (often Vietnamese or English).
Rules:
- Every question must be answerable from the notes alone.
- Exactly 4 options per question, exactly one correct. Wrong options should be plausible.
- Vary the position of the correct answer.
- Test understanding, not just copying words. Mix easy and harder questions.
- The explanation is 1-2 sentences.`

// POST /api/quiz  — body: { title, content, count }  → { questions: [...] }
app.post('/api/quiz', async (req, res) => {
  const { title, content, count } = req.body ?? {}
  const problem = checkRequest(content)
  if (problem) {
    res.status(400).json({ error: problem })
    return
  }
  // Only allow 3 to 10 questions (default 5)
  const numQuestions = Math.min(Math.max(Number(count) || 5, 3), 10)

  try {
    // .parse() = create + check the JSON against our schema
    const response = await client.beta.messages.parse({
      ...AI_SETTINGS,
      output_config: { effort: 'medium', format: betaZodOutputFormat(QuizSchema) },
      system: QUIZ_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Create ${numQuestions} questions.\n\nNote title: ${title || 'Untitled'}\n\n${content}`,
        },
      ],
    })

    const quiz = response.parsed_output // null if the answer did not match the schema
    if (response.stop_reason === 'refusal' || !quiz) {
      res.status(422).json({ error: 'The AI could not make a quiz from this note. Try again.' })
      return
    }

    // Double-check each question, and drop any broken one (never trust data blindly)
    const questions = quiz.questions.filter(
      (q) => q.options.length >= 2 && q.correctIndex >= 0 && q.correctIndex < q.options.length,
    )
    res.json({ questions })
  } catch (error) {
    sendAiError(error, res)
  }
})

const PORT = Number(process.env.PORT) || 3001
app.listen(PORT, () => {
  console.log(`✅ AI server running on http://localhost:${PORT}`)
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn('⚠️  ANTHROPIC_API_KEY is not set. Copy .env.example to .env and add your key.')
  }
})
