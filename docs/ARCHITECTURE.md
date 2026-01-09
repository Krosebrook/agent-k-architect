# System Architecture

## 1. Overview
Agent K is a React-based SPA designed for synthesizing AIaaS architectures. It uses a component-based structure with a central service layer for AI interactions.

## 2. Modules
- **UI Layer**: React 19 Components (`Sidebar`, `ModelRouter`, `SecurityDashboard`, `ProductDesigner`).
- **State Management**: React `useState` + Custom Hooks (`useProfile`, `useSystemUptime`).
- **Intelligence Layer**: `GeminiService` class wrapper around `@google/genai` SDK.
- **Persistence**: `localStorage` for profile and settings.

## 3. Data Flow
1. User inputs intent in `ProductDesigner` or `ChatTerminal`.
2. Component calls `geminiService` methods.
3. Service calls Google GenAI API (using local API key).
4. Response is parsed (JSON cleaning applied) and returned to Component.
5. Component updates local state/UI.

## 4. Orchestration
- **Model Router**: `ModelRouter.tsx` defines routing rules (latency vs cost), though actual enforcement logic appears simulated or client-side only in current view.

---
Source: App.tsx, geminiService.ts, components/*
Confidence: HIGH
Last Verified: 2024-05-23
