# Security Posture

## 1. Threat Model
The application operates as a Client-Side Single Page Application (SPA).
- **Secrets Storage**: API Keys are stored in the browser's `localStorage` (`agent-k-profile`). This is vulnerable to XSS.
- **Risk Level**: HIGH for client-side key exposure if XSS occurs.
- **Mitigation**: Users are responsible for their own keys; keys are not synced to a backend by default.

## 2. Input Validation & Prompt Injection
- **Mechanism**: `GeminiService.analyzeSystemPrompt` performs a pre-flight audit of prompts.
- **Logic**: Calls `gemini-3-flash-preview` to classify input as `SAFE`, `SUSPICIOUS`, or `MALICIOUS`.
- **Enforcement**: `ChatTerminal.tsx` blocks execution if `securityLevel === 'MALICIOUS'`.

## 3. Network Egress
- **Primary**: Direct calls to `generativelanguage.googleapis.com` (Gemini API).
- **Secondary**: External image resources (e.g., `picsum.photos` in `manifest.json`).

## 4. Auth & Identity
- **Local**: `UserProfile` is stored locally.
- **Status**: No remote identity provider identified in current scope.

---
Source: geminiService.ts, hooks/useProfile.ts, components/ChatTerminal.tsx
Confidence: HIGH
Last Verified: 2024-05-23
