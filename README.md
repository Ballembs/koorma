# Koorma — Learn Telugu 🐢

A Telugu language learning app for NRI children ages 4–10. Built with love for the Telugu diaspora.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **State**: Zustand (persisted to localStorage)
- **Styling**: Tailwind CSS
- **AI**: Google Gemini 2.5 Flash (content generation)
- **Audio**: Google Cloud Text-to-Speech (1,276 pre-generated files)
- **Speech**: Google Cloud Speech-to-Text (pronunciation validation)

## Getting Started

1. Clone the repo:
   ```bash
   git clone https://github.com/Ballembs/koorma.git
   cd koorma
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Fill in your `GEMINI_API_KEY` and `GOOGLE_APPLICATION_CREDENTIALS`.

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open http://localhost:3000 (use landscape mode — the app is designed for tablets)

## Learning Sections

1. **అచ్చులు తోట** (Vowel Garden) — 16 vowels
2. **హల్లుల కోట** (Consonant Fort) — 36 consonants
3. **గుణింతాల మాయ** (Magic Workshop) — Vowel marks (guninthalu)
4. **పదాల బజార్** (Word Bazaar) — 91 vocabulary words across 8 categories
5. **వాక్యాల బాట** (Sentence Path) — 4 levels of sentence building
6. **కథల గుడి** (Story Temple) — Hardcoded + AI-generated stories

## Audio Generation

Pre-generate audio files (requires Google Cloud credentials):

```bash
node scripts/generate-audio.js
```

## Key Design Principles

- **వ్యావహారిక Telugu ONLY** — conversational Telugu as spoken in homes, never literary/textbook Telugu
- **"ఇంట్లో" not "ఇల్లు లో"** — sandhi merging enforced everywhere
- **Generous speech validation** — any Telugu attempt from a child = encouragement
- **Hardcoded core content** — all vocabulary, sentences, and Tier-1 stories are hand-verified for linguistic accuracy
- **AI for bonus content only** — Gemini generates supplementary quizzes and Tier-2 stories, with backend validation

## License

Private — All rights reserved.
