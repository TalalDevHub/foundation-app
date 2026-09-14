# Case Studies & Engineering Proof Statements

## 1. Accessible Design System Foundations
* **Problem**: Off-the-shelf component libraries often ship with inaccessible DOM structures or leak keyboard focus.
* **Solution**: Hand-coded ARIA-compliant primitives (Modal, Tabs, Disclosure) verified against W3C Authoring Practices Guide patterns before adopting headless components.
* **Evidence**: Zero keyboard traps, full roving focus management, and a comprehensive architectural comparison against Radix/shadcn in `NOTES.md`.

## 2. Resilient Streaming LLM Interface
* **Problem**: Unbuffered streaming responses can cause jumpy auto-scrolling, broken Markdown rendering, and loss of state when users cancel mid-stream.
* **Solution**: Server-side streaming via Next.js App Router route handlers with Claude 3.5 Sonnet, paired with client-side scroll anchoring and `AbortController` cancellation.
* **Evidence**: Instant stop control preserving partial messages, smooth thinking-to-token handoff, and full mobile viewport responsiveness down to 360px.
