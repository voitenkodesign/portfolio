# Voitenko Design — Portfolio

Static portfolio site: plain HTML + one shared `styles.css` and a tiny optional `script.js` (scroll fade-in, respects `prefers-reduced-motion`). No framework, no npm, no build step.

## Pages

| File | Case |
| --- | --- |
| `index.html` | Home: intro, selected work, club apps, results, about |
| `white-label-app.html` | 01. White-label mobile app for football clubs |
| `live-quiz.html` | 02. Live Quiz for match-day engagement |
| `design-system.html` | 03. Design system for multi-brand club apps |
| `keel-ai-financial-management.html` | 04. Keel — AI Financial Management (concept, not shipped) |
| `personalized-offers.html` | 05. Personalized offers and voucher flows |
| `3f-superliga.html` | 06. 3F Superliga website |
| `other-work.html` | Other work (visual and marketing work) |
| `404.html` | Not-found page |

## Source

Text and images come from the Notion/Super export in `Voitenko Design — Portfolio/` and the root markdown file. Images are referenced in place (URL-encoded paths); the export files are not modified.

## Preview / deploy

- Local: `python3 -m http.server` in the repo root, then open http://localhost:8000
- Cloudflare Pages: no build command, output directory `/` (repo root).
