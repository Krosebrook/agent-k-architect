# Framework & Tooling

> _Provenance: Source: package.json | Locator: package.json | Confidence: HIGH | Last Verified: 2024-05-20_

## Stack
- **Frontend**: React, TypeScript, Tailwind CSS, Framer Motion.
- **3D/Viz**: Three.js (@react-three/fiber).
- **AI SDK**: Google GenAI SDK (`@google/genai`).
- **Icons**: Lucide React.

## LLM Models
**Status: UNKNOWN**
- `services/aiService.ts` references:
  - Claude 3.5 Sonnet
  - GPT-4o
  - Gemini 3 Flash / Pro
- Action Required: Confirm which are actually active/provisioned.

## Tooling Boundaries
**Status: UNKNOWN**
- Action Required: Define where local development stops and managed services (Supabase, Vercel) begin.

## CI/CD Hooks
**Status: UNKNOWN**
- Action Required: Document build/deploy pipelines (Vercel?).
