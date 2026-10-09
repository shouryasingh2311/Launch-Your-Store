# Launch-Your-Store — Frontend Development Guide

## Project Overview
No-code store builder frontend. React 18 + Vite + Tailwind + shadcn/ui.
See `.planning/PROJECT.md` for full context.

## Planning Artifacts
- `.planning/PROJECT.md` — project context
- `.planning/config.json` — workflow preferences
- `.planning/REQUIREMENTS.md` — scoped requirements with REQ-IDs
- `.planning/ROADMAP.md` — 6-phase roadmap
- `.planning/STATE.md` — current progress

## Key Conventions
1. **Design tokens first** — use the defined palette, spacing, radii. No ad-hoc colors.
2. **Component library** — build from shadcn/ui components. No raw HTML for interactive elements.
3. **Mock data** — use mock data matching the API contract until backend endpoints are ready.
4. **Complete states** — every screen must have loading (skeleton), empty, and error states.
5. **Mobile-first** — design at 360px, then add 768px and 1280px breakpoints.
6. **Theme system** — storefront uses CSS custom properties, not hardcoded values.

## Workflow
Follow GSD workflow: `/gsd-plan-phase N` → `/gsd-execute-phase N` → `/gsd-verify-work`.
