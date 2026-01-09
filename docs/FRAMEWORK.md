# Framework & Stack

## 1. Core Stack
- **Runtime**: Browser (SPA)
- **Framework**: React 19 (`react`, `react-dom`)
- **Build/Bundler**: Implied Vite/ESM (imports use `esm.sh`)
- **Styling**: Tailwind CSS (CDN loaded) + FontAwesome

## 2. Intelligence
- **SDK**: `@google/genai` v1.34.0
- **Models Used**:
  - `gemini-3-pro-preview` (Reasoning, Architecting)
  - `gemini-3-flash-preview` (Security Audits)

## 3. Visualization
- **Library**: `recharts` v3.6.0
- **Usage**: Performance metrics, latency charts in `ModelRouter`.

---
Source: index.html, package.json (inferred from imports), geminiService.ts
Confidence: HIGH
Last Verified: 2024-05-23
