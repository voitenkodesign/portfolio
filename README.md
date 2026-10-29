# Voitenko Design — Portfolio

Static portfolio site: plain HTML + one shared `styles.css`. No framework, no npm, no build step. Case pages load one small script, `motion.js` (image fade-in, progressive enhancement: the page works without it).

## Pages

| File | Case |
| --- | --- |
| `index.html` | Home: intro, selected work, club apps, results, about |
| `white-label-app.html` | 01. White-label mobile app for football clubs |
| `shtamp-kyc-review-console.html` | 02. Shtamp — a review console that checks before it decides (concept, not shipped) |
| `mira-experiment-results.html` | 03. Mira — experiment results that say when to decide (concept, not shipped) |
| `torba-meal-kit-checkout.html` | 04. Torba — a checkout with no surprise at the end (concept, not shipped) |
| `kabinet-clinic-front-desk.html` | 05. Kabinet — a front desk that works by the day (concept, not shipped) |
| `design-system.html` | 06. Design system for multi-brand club apps |
| `kvit-business-banking-freelancers.html` | 07. Kvit — business banking for Ukrainian freelancers (concept, not shipped) |
| `zgoda-team-onboarding-billing.html` | 08. Zgoda — a team’s first two weeks, from sign-up to a second person (concept, not shipped) |
| `live-quiz.html` | 09. Live Quiz for match-day engagement |
| `personalized-offers.html` | 10. Personalized offers and voucher flows |
| `keel-ai-financial-management.html` | 11. Keel — AI Financial Management (concept, not shipped) |
| `3f-superliga.html` | 12. 3F Superliga website |
| `other-work.html` | Other work (visual and marketing work) |
| `404.html` | Not-found page |

## Images

Site images live in `img/<case>/` as WebP with ASCII kebab-case names (home card covers are CSS compositions of screens in `img/covers/`, 600px wide; case images at most 2048px). `og.jpg` (1200×630) is the share image.

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
