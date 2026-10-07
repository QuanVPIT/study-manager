# 📚 Study Manager

A colorful study management web app with AI features, built while learning full-stack development.

Manage your courses, track deadlines by urgency, write Markdown notes, and let AI summarize your notes and quiz you on them.

## ✨ Features

| Feature | Description |
|---|---|
| 🏠 **Dashboard** | Today's overview: counts, urgent deadlines, recent notes |
| 📘 **Courses** | Add, edit and delete courses, each with its own color |
| ⏰ **Deadlines** | Grouped by urgency: Overdue / Today / This week / Later / Done |
| 📝 **Notes** | Markdown editor with live preview, auto-saved, organized by course |
| ✨ **AI Summary** | Summarizes a note into its key points (in the note's language) |
| 🧠 **AI Quiz** | Generates multiple-choice questions from a note, with scoring and explanations |
| 🌙 **Dark mode** | Light / Dark / System, remembered between visits |

## 🛠️ Tech stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, React Router, react-markdown
- **Backend:** Node.js, Express 5 (a small server that keeps the AI API key secret)
- **AI:** Claude API (`claude-opus-5-5`) via the Anthropic TypeScript SDK, with structured outputs (Zod) for quizzes
- **Storage:** the browser's `localStorage` (data stays on your device)

## 📁 Project structure

```
WebApp/
├── client/                 # React app (what you see in the browser)
│   └── src/
│       ├── components/     # reusable UI pieces (forms, cards, quiz, theme toggle...)
│       ├── pages/          # one file per page (Dashboard, Courses, Deadlines, Notes)
│       ├── lib/            # helpers: dates, colors, API calls, custom hooks
│       └── types.ts        # TypeScript types for Course, Deadline, Note, QuizQuestion
└── server/                 # Express server (AI requests)
    ├── src/index.ts        # routes: POST /api/summarize, POST /api/quiz
    └── .env.example        # template for your secret API key
```

## 🚀 Getting started

**Requirements:** [Node.js](https://nodejs.org) 22.18 or newer (the server runs TypeScript directly with Node).

### 1. Install

```bash
cd client && npm install
cd ../server && npm install
```

### 2. Add your AI API key (only needed for AI features)

1. Create a key at [console.anthropic.com](https://console.anthropic.com).
2. Copy the template and paste your key into it:
   ```bash
   cd server
   cp .env.example .env
   ```
   ⚠️ Never commit `.env`. It is already in `.gitignore`.

### 3. Run (2 terminals)

```bash
# Terminal 1 — AI server on http://localhost:3001
cd server && npm run dev

# Terminal 2 — React app on http://localhost:5173
cd client && npm run dev
```

Open **http://localhost:5173**. Courses, deadlines and notes work without the server. Only the AI buttons need it.

## 🧪 Checks

```bash
cd client && npm run build && npm run lint   # type-check, build, lint
cd server && npm run typecheck               # type-check the server
```

## 🗺️ Roadmap

- [ ] AI study plan based on upcoming deadlines
- [ ] Real database so data syncs across devices
- [ ] Deploy online

## 📖 What I learned

React components and props, state and custom hooks, TypeScript types, Tailwind CSS, client-side routing, CRUD with immutable updates, linked data and cascade delete, working with local dates, REST APIs with Express, keeping secrets on the server, and getting structured JSON from an AI model.
