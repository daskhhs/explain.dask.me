# Explain My Code

**Paste in confusing code. Get a human explanation of what it does — without it rewriting your code for you.**

Part of the [dask.me](https://dask.me) tool collection.

---

## What it does

Drop in a function, a file, or a snippet you inherited and don't fully trust, and Explain My Code breaks it down like a senior developer sitting next to you would: what it does in one sentence, how it works step by step, its time and space complexity, and the things worth watching out for — edge cases, surprising behavior, likely bugs. There's an optional deeper walkthrough if you want more than the summary.

It never touches or "fixes" your code. Understanding is the entire point — rewriting is a different tool.

## How it works

1. **Submit** — your code (with an optional language hint, or auto-detected) is sent to an LLM with a system prompt that's explicit about the required structure: what it does, how it works, complexity, things to watch, and an optional deeper explanation.
2. **Structure, not prose** — the model is required to return JSON matching a fixed shape rather than free-form text, so the UI can reliably render each section (a numbered "how it works" walkthrough, a complexity card, a warnings list) instead of parsing paragraphs.
3. **Validate** — if the model skips a required field or returns something malformed, that's surfaced as an error rather than silently showing an incomplete explanation.

The result renders as a real report — a one-line summary, a numbered walkthrough, side-by-side complexity cards, and a "things to watch" section — with the deeper explanation tucked behind a toggle so the default view stays scannable.

## Tech stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- A small provider abstraction (`lib/ai/`) supporting Gemini, Groq, and OpenRouter

## Running locally

```bash
npm install
cp .env.example .env.local
# add at least one API key to .env.local
npm run dev
```

Environment variables (see `.env.example`):

| Variable | Required | Notes |
|---|---|---|
| `AI_PROVIDER` | No | `gemini` \| `groq` \| `openrouter`. Defaults to `gemini`. |
| `GEMINI_API_KEY` | One of these three | |
| `GROQ_API_KEY` | | |
| `OPENROUTER_API_KEY` | | |

## Design notes

A calm, legible palette (Lexend for headings, Source Sans 3 for body, Source Code Pro for the code editor) — closer to a study guide than a debugger.
