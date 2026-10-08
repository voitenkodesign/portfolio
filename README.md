# Voitenko Design — Portfolio

Static portfolio site: plain HTML + one shared `styles.css`. No framework, no npm, no build step. Case pages load one small script, `motion.js` (image fade-in, progressive enhancement: the page works without it).

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

## Images

Site images live in `img/<case>/` as WebP with ASCII kebab-case names (home card covers are 1200px wide, case images at most 2048px). `og.jpg` (1200×630) is the share image.

## Source

Text and original images come from the Notion/Super export in `Voitenko Design — Portfolio/` and the root markdown file. The export is kept in git unchanged as the source of truth, but it is not deployed (see `.assetsignore`).

## Deploy

Cloudflare Workers static assets, configured in `wrangler.json`:

- `assets.directory: "."`: the repo root is the site; no build command.
- `html_handling: "none"`: URLs are exactly the file names (`/live-quiz.html`, not `/live-quiz`). `_redirects` serves `/` as `index.html`.
- `not_found_handling: "404-page"`: unknown paths get `404.html` (it uses root-absolute paths so it works at any depth).
- `previews: {}`: required by `npx wrangler preview`, which Workers Builds runs for non-`main` branches (PR previews).
- `.assetsignore` keeps `.git`, `.wrangler` (build temp files), the Notion export, `*.md` and `wrangler.json` out of the deployed assets.

SEO files: `robots.txt` and `sitemap.xml` (add a new page to the sitemap when you add a case).

## Preview

Any static server in the repo root, e.g. `python3 -m http.server`, then open http://localhost:8000
