# Talal Shah | Production Portfolio & Systems Engineering

A responsive, high-performance developer portfolio showcasing full-stack capabilities, procedural Three.js graphics, interactive GLSL fragment shaders, and automated CI/CD pipelines.

* **Live Production URL:** https://foundation-app-rose.vercel.app
* **Status:** Production Deployed & Monitored
* **Target Audience:** Engineering Leads, Technical Recruiters, and Mentors

---

## Architecture Overview

* **Frontend:** Next.js 16 (App Router), TypeScript, Tailwind CSS, Vercel Analytics
* **Graphics Pipeline:** Vanilla Three.js, Custom GLSL Fragment Shader, Procedural Noise, DPR clamped to 1.5, Reduced-Motion Detection
* **Backend Route Handler:** POST /api/contact with in-memory sliding-window IP rate limiting (3 req/min), character payload bounds, and Resend serverless email dispatch
* **Testing & Quality:** Vitest unit/component suites, Playwright E2E browser automation, GitHub Actions CI blocking failed builds

---

## Environment Variables

| Variable Name | Required | Context | Description |
| :--- | :--- | :--- | :--- |
| RESEND_API_KEY | Yes | Server | Resend API token for transactional email dispatch. |
| CONTACT_RECEIVER_EMAIL | Yes | Server | Destination inbox address. |
| NEXT_PUBLIC_APP_NAME | Optional | Client | Application branding metadata flag. |

---

## Local Setup

`ash
git clone [https://github.com/TalalDevHub/foundation-app.git](https://github.com/TalalDevHub/foundation-app.git)
cd foundation-app
npm install --legacy-peer-deps
npm run dev
`

### Running Tests
`ash
npm run test:run
npm run test:e2e
`

---

## Key Architectural Decisions

1. **Vanilla Three.js Over Fiber:** Eliminates React 19 peer-dependency conflicts in CI/CD, keeps bundle size small, and provides exact control over WebGL garbage collection.
2. **Procedural Math Over 3D Assets:** Procedural GLSL shaders and geometry require zero network overhead compared to multi-megabyte GLB models.
3. **Deferred API Client Initialization:** Initializing Resend inside request handlers prevents module-evaluation crashes during headless Playwright test runs.

---

## AI Collaboration Disclosure

* **GLSL Shader Synthesis:** Co-designed Fractional Brownian Motion and domain-warping algorithms with Claude and Gemini.
* **Stress Testing:** Identified edge cases including whitespace-only input, rapid double-submits, and high-DPR battery consumption.
* **CI/CD Debugging:** Diagnosed Turbopack dynamic import constraints and webserver lifecycle bugs through automated runner log analysis.

---

## License

MIT (c) 2026 Talal Shah
