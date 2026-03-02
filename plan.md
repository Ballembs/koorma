# Implementation Plan: Google Cloud AI Integration

## 1. Google Cloud Setup & Dependencies
- Install `@google-cloud/text-to-speech`, `@google-cloud/speech`, and `@google/generative-ai`.
- Create the google credentials JSON based on instructions if needed (or verify they exist).
- Add `generate-audio` scripts to `package.json`.

## 2. Audio Generation (TTS)
- Create `scripts/generate-audio.js` with the provided code.
- Run the script to generate MP3s natively.

## 3. `useTeluguAudio` Hook
- Create `src/hooks/useTeluguAudio.ts` with the provided logic (adapted for TS).
- Search codebase for `speechSynthesis` and replace with `useTeluguAudio`.

## 4. 'Say It!' Phase (Speech-to-Text)
- Create `src/app/api/speech-validate/route.ts`.
- Create `src/components/SayItPhase.tsx`.
- Integrate `SayItPhase` into `src/app/lesson/[pairId]/page.tsx`.
- Update the progress indicator to include 🎤.

## 5. Gemini Content Generation
- Create `src/lib/telugu-system-prompt.ts`.
- Create `src/app/api/generate-words/route.ts`.
- Create `src/app/api/generate-sentences/route.ts`.
- Create `src/app/api/generate-story/route.ts`.
- Create `src/app/api/speak-telugu/route.ts` for dynamic TTS.

## 6. Testing
- Run audio generation script.
- Verify lesson flow includes SayIt phase.
- Verify Speech-to-Text validation works or falls back gracefully.
