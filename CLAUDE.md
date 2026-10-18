# CLAUDE.md — voitenkodesign.com portfolio

Read this whole file before changing anything. It is the project's memory: how the site is built, the design system,
content rules, the workflow with the owner, and mistakes that already happened once and must not happen again.

## 1. Project and owner

- Static portfolio of **Igor Voitenko, UI/UX & Product Designer** (Kyiv). Plain HTML + one `styles.css` + one small
  `motion.js`. No framework, no npm, no build step.
- Live: https://voitenkodesign.com — repo: `voitenkodesign/portfolio`, branch `main` deploys automatically.
- The owner is a designer, **not a developer**. Talk to him in **Russian**, plain words, no jargon without explanation.
  He often reviews on his phone (Remote Control) — send phone screenshots of results with SendUserFile.
- He loves **systems**: one rule for many elements. Never add a one-off value when a token or an existing rule fits.
- Case pages: the main picture sits in the header between the facts and the summary (`.case-hero__media`; no picture
  yet = a `.cover cover--<slug> case-cover` composition). From 1000px section headings sit in the left column, text right.
- CV: every "CV" link points to `/cv`, which `_redirects` sends to the current file (now a Google Drive link). Dropping a
  `cv.pdf` into the repo root is enough: `motion.js` checks for it and sends the links there instead.
- Home hero is a layered scene (`.scene` in `styles.css`, `img/home/hero/`): Figma components of the club app as
  separate layers with entrance, scroll drift and mouse lean (`motion.js`). To change a card, re-export that node.
- Football appears only as **work context** (club apps at Sports Innovation). He is not a football fan: no football in
  personal touches (statuses, easter eggs, About copy).

## 2. Deploy and environment

- Cloudflare Workers static assets (`wrangler.json`): repo root is the site, `html_handling: "none"` → URLs are file
  names (`/live-quiz.html`); `_redirects` serves `/` as `index.html`; unknown paths get `404.html` (uses root-absolute paths).
- `.assetsignore` keeps out of the deploy: `.git`, `.wrangler`, the Notion export folder `Voitenko Design*`,
  `about.png`, `*.md` (so this file is not public on the site, but the repo itself is public on GitHub), `wrangler.json`.
- Every pushed branch gets a preview: `https://<branch>-portfolio.cloudflare-crusher442.workers.dev/`.
- Build status: `https://api.github.com/repos/voitenkodesign/portfolio/commits/<sha>/check-runs` ("Workers Builds: portfolio").
- **git is not on PATH.** Use GitHub Desktop's git:
  `$env:LOCALAPPDATA\GitHubDesktop\app-*\resources\app\git\cmd\git.exe` (PowerShell) or `git` in the Bash tool.
  Push auth works through Git Credential Manager. No `gh` CLI.
- WebP encoder: `cwebp` from winget package Google.Libwebp
  (`$env:LOCALAPPDATA\Microsoft\WinGet\Packages\Google.Libwebp_*\libwebp-*\bin\cwebp.exe`).
- Local preview: any static server in the repo root. Measure layouts in the browser pane with the **mobile preset**
  (an iframe has a 15px scrollbar that real phones don't — it caused a false "4-line hero" once).

## 3. Workflow with the owner

- **Small tweaks** (a word, an arrow, one spacing fix): commit straight to `main` when he says "в мейн".
- **Bigger or site-wide changes**: new branch → push → give the preview URL + phone screenshots → he says "ок" →
  merge yourself with `git merge --ff-only <branch>` into `main` and push. He does not open PRs himself.
- After every push to `main`: wait for the Cloudflare build, then **check the live site** (fetch the page/CSS and
  confirm the change is there). Say what you verified.
- Commit messages: English, what and why; end with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Before a change, propose options with a recommendation; he decides. If he asks "что думаешь", answer first, don't build.

## 4. Design system (source of truth: the cheat sheet at the top of `styles.css`)

Never write raw values in new CSS. Pick tokens:

| Area | Tokens / rule |
|---|---|
| Colour | `--bg #101010`, `--surface #1c1c1b` (**every** card/panel), `--surface-hover`, `--bg-glass`, `--title`, `--text` (72% white), `--line`, `--fill`, `--stroke`, `--underline`, `--accent #5ce08f` + `--accent-soft` |
| Accent | Green only where it means something: "Open to work", Kyiv clock, result figures, case summary labels |
| Spacing | `--s-1..--s-8` = 4 8 12 16 24 32 48 64; `--space-section` between sections. **Inside a group < between groups.** Card grids (bento) use one 16px gap |
| Type size | `--fs-display` 34–62, `--fs-h1` 28–40, `--fs-h2` 24–32, `--fs-h3` 20, `--fs-body` 17, `--fs-small` 15, `--fs-caption` 13. Exactly 7 sizes on the site |
| Leading | `--lh-tight` 1.1, `--lh-heading` 1.2, `--lh-ui` 1.4, `--lh-body` 1.6 |
| Tracking | `--ls-display` -.03em, `--ls-heading` -.02em, text 0 |
| Font | Mona Sans only (variable). Headings + big figures `font-stretch: 112%`, text 100%. Weights 400/500/600, one italic accent ("actually use.") |
| Radius | `--radius-xs` 4, `--radius-sm` 8, `--radius` 16, `--radius-lg` 24, `--radius-pill` |
| Motion | `--dur-fast` .15s colour, `--dur` .3s movement, `--dur-slow` .6s entrance, `--stagger` .06s; `--ease-out` move, `ease` fade, `ease-in-out` blinks. Everything off under `prefers-reduced-motion` |
| Separators | `.sep` (·, .6em each side ≈ 2.5× a word space). Wrapping lists: `.seplist` / `.seplist__items` (dot hides on wrap, never dangles) |
| Arrows | Never type "→" or "←" in pages. SVG arrow: `.arrow`/`.stat__arrow` centred on cap height (between figures, "40% → 15%"); `.arrow--x` centred on x-height (after lowercase words, links); "View case" uses the CSS mask version; `.arrow--back` mirrored |
| Links | In running text (`.prose a`, `.case-summary a`, `.clubs__text a`): underline 30%, offset .2em, inherit size/weight. UI links (nav, pager, footer, "Other work"): no underline until hover |
| Cards | Boxes only for things that group or click: case cards, stats, About cards, phone galleries |

Breakpoints currently in use: 360, 480, 600, 700, 760, 900, 1000 (cleanup to 480/760/1000 is planned, not done).

## 5. Content rules

- **Never invent facts, metrics, team members or quotes.** Ask the owner.
- Company: Sports Innovation A/S (sportsinnovation.dk). Metrics come from its public site and are labelled
  "Platform results. Product numbers, not personal ones." Correct no-show metric: **"40% → 15% no-show rate after the app
  launch"** (also "50% no-show reduction on season cards"). +€50K ticket / +€20K shop sales per month, +50% active fans,
  1.2M sessions/month, 87% open rate on segmented messages, 13% / 14% offer metrics, Live Quiz: 313 fans at AC Horsens,
  12–30% participation. Public links to Sports Innovation case articles are allowed.
- Team in case facts: **"2 designers, project manager, developers, QA"** (there was a second designer, Edgaras).
  The design system was **co-owned with a second designer** — never "I built it alone". Keel is a **solo concept**.
- Role everywhere: "UI/UX & Product Designer". Domains: "SportTech · …", "FinTech · …".
- No testimonials exist. Stories & Reels case was dropped — don't propose it.
- English typography: curly quotes and apostrophes (“ ” ’); en dash for ranges (12–30%); spaced em dash " — " in
  sentences; sentence case for headings (product/screen names keep their own capitals); `&nbsp;` between club names
  (AC&nbsp;Horsens, Brøndby&nbsp;IF, FC&nbsp;Midtjylland, FC&nbsp;Copenhagen, 3F&nbsp;Superliga) and number+word
  (10+&nbsp;club, 2&nbsp;designers, 313&nbsp;fans); no emoji in site copy; "match-day engagement" (adjective) vs
  "on match day" (noun). Headings use `text-wrap: balance`, text `text-wrap: pretty` (already in CSS).

## 6. Adding a new case — checklist

Case structure: see CASE-TEMPLATE.md (block order, HTML patterns, image and writing rules; it wins over the template below on structure).

1. **Branch** `new-case-<slug>`; file `<slug>.html` (lowercase, kebab-case).
2. **Images**: put source PNG/JPG into `Voitenko Design — Portfolio/<NN Case name>/` (kept in git, not deployed);
   export WebP into `img/<slug>/<kebab-name>.webp`:
   `cwebp -q 82 -m 6 -sharp_yuv -metadata none [-resize 2048 0] in.png -o out.webp` (case images ≤ 2048px wide).
   Home card cover (a CSS composition, no baked cover image): two single phone screens cropped/exported to
   `img/covers/<slug>-<screen>.webp` at 600px wide (a web case: one browser screenshot, 1200px), placed in
   `.card__media.cover.cover--<slug>`; add the product brand colour as `.cover--<slug> { --brand: … }` in `styles.css`.
   Every `<img>` gets real `width`/`height`, `loading="lazy" decoding="async"`, and a readable `alt`
   ("Live Quiz entry point, screen 1 of 3"), not a file name.
3. **Page** from the template below: head meta (title, description, canonical, og:url, og:*), case facts, case summary
   written **only from the case's own text**, numbered sections (`h2` get numbers automatically), galleries/media/stats,
   pager, CTA, footer with the Kyiv clock.
4. **Home** (`index.html`): add a card in `.cards` (client work) or the second `.cards` under "Concepts" — cover, `card__meta` ("Domain<span class="sep">·</span>Platform"),
   title link, one-line description, "View case".
5. **Pager chain**: update Previous/Next on the neighbouring case pages so the order stays continuous; last case links to
   `other-work.html`.
6. **sitemap.xml** (add the URL) and the pages table in **README.md**.
7. **Verify** (section 8), push the branch, send the preview URL + phone screenshots, wait for "ок", merge ff-only.

### Case page template (body part; copy `<head>` from an existing case and change title/description/canonical/og:url)

```html
<main id="main">
<article class="case">
  <header class="case-hero wrap">
    <h1>Case title</h1>
    <dl class="case-facts"><div><dt>Role</dt><dd>UI/UX &amp; Product Designer</dd></div><div><dt>Platform</dt><dd>iOS, Android</dd></div><div><dt>Domain</dt><dd class="seplist"><span class="seplist__items"><span>SportTech</span><span>Commerce</span></span></dd></div><div><dt>Team</dt><dd>2&nbsp;designers, project manager, developers, QA</dd></div></dl>
    <dl class="case-summary" aria-label="Case at a glance"><div><dt>Problem</dt><dd>…</dd></div><div><dt>What I did</dt><dd>…</dd></div><div><dt>Result</dt><dd>…</dd></div></dl>
  </header>
  <div class="prose wrap">
<p class="reveal">Intro sentence (rendered as the lead).</p>
<h2 class="reveal">My role</h2>
<p class="reveal">…</p>
<h2 class="reveal">The problem</h2>
<h2 class="reveal">The constraints</h2>
<ul class="reveal"><li>…</li></ul>
<h2 class="reveal">The process</h2>
<h2 class="reveal">What I designed</h2>
<h3 class="reveal">Sub-section</h3>
<p class="reveal">…</p>
<div class="gallery gallery--phones reveal" style="--cols:3"><figure class="fig"><img src="img/slug/screen-01.webp" alt="…, screen 1 of 3" width="858" height="1776" loading="lazy" decoding="async"></figure>…</div>
<div class="media reveal"><figure class="fig"><img src="img/slug/flow.webp" alt="…" width="2048" height="1152" loading="lazy" decoding="async"><figcaption>…</figcaption></figure></div>
<h2 class="reveal">Result</h2>
<div class="stats reveal"><p class="stats__kicker"><strong>Platform results.</strong> Product numbers, not personal ones.</p><div class="stats__grid"><div class="stat"><p class="stat__value">40%<span class="stat__arrow"><svg viewBox="0 0 22 16" aria-hidden="true" focusable="false"><path d="M2 8h17.5M14.5 3 19.5 8 14.5 13"/></svg><span class="sr-only"> to </span></span>15%</p><p class="stat__label">…</p></div></div></div>
<h2 class="reveal">What I learned</h2>
<p class="reveal">…</p>
  </div>
</article>
<nav class="pager wrap" aria-label="Case navigation"><p class="more pager__prev"><span class="more__label">Previous</span><a href="prev.html">Prev title</a></p><p class="more pager__next"><span class="more__label">Next</span><a href="next.html">Next title</a></p></nav>
<section class="cta wrap" aria-labelledby="cta-h">
  <h2 class="cta__title" id="cta-h">Have a product that needs design?</h2>
  <p class="cta__actions"><a class="btn" href="mailto:voitenko.design@pm.me">Email me</a><a class="btn btn--ghost" href="https://www.linkedin.com/in/voitenkodesign" target="_blank" rel="noopener">LinkedIn</a></p>
</section>
</main>
```
Header and footer: copy them exactly from an existing case page (the footer contains the Kyiv clock markup that
`motion.js` needs).

## 7. Mistakes that already happened — do not repeat

1. **Mojibake (twice on the live site).** Windows PowerShell 5.1 reads `.ps1` files without BOM as ANSI, so non-ASCII
   literals (· — → © ø) in scripts get mangled ("·" became "Â·"). And the Write tool turns `\uXXXX` written into a
   script file into the real character. Rules: edit HTML/JS with the Edit tool or Bash; in PowerShell build characters
   with `[char]0x00B7`; in JS use escapes like `'\u00b7'`; read/write files as UTF-8 without BOM. **After every edit scan
   for U+00C2/U+00C3** in `*.html *.css *.js`.
2. **PowerShell array precedence cut a sentence on the live site.** In `@("a", "b" + "c")` the comma binds before `+`,
   so the text after `+` was dropped ("…12–" in the Live Quiz result). Never concatenate inside array literals.
3. **`git commit -m` with a multi-line message failed in PowerShell** (lines starting with "-" became switches).
   Write the message to a file and use `git commit -F <file>`.
4. **Stray margins**: a component's own margin (stats `--s-7`, a paragraph's 1em) added to the section padding made one
   gap 48px bigger than the others. When placing a block inside a section, check the real gap between neighbours.
5. **Text arrows "→" sat on the baseline.** Always use the SVG arrow classes (section 4).
6. **Separators with plain spaces** looked tighter than elsewhere — always `.sep` / `.seplist`.
7. **Hidden elements kept their space** (header "Email me" left a gap) — collapse width/padding/gap when hiding.
8. **Two greys for cards** crept in — every surface is `--surface`.
9. **Hero title** must stay 3 lines on a 375px phone ("I design apps and / systems that people / actually use.").
10. Don't claim things on behalf of the owner (reply times, team roles, numbers) without asking him.

## 8. Verify before saying "done"

- No horizontal scroll at 320, 375, 800, 1280px; hero title 3 lines at 375; stat figures fit their cards on phones.
- All images and internal links return 200 (fetch each `src`/`href` from every page).
- Mojibake scan clean (U+00C2/U+00C3).
- After deploy: the change is present on https://voitenkodesign.com (fetch with a cache-busting query).
- Send the owner phone screenshots of what changed.
