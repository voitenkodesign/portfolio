# CASE-TEMPLATE.md — one structure for every case study

Read this together with `CLAUDE.md`. `CLAUDE.md` says **how** the site is built (tokens, classes, typography,
deploy). This file says **what a case page contains and in what order**. When the two disagree about case
structure, this file wins; for everything else `CLAUDE.md` wins.

Status: v1, 2026-10-15. First case to migrate: `white-label-app.html` (plan in Appendix A).

---

## 1. Principles

1. **Say each thing once.** The header (facts + summary) is the only place for role, problem, what I did and the
   result in one line. Body sections go deeper; they never repeat the header in other words.
2. **Decisions over deliverables.** A recruiter looks for *why this and not that*. Every case has at least one
   decision shown as options → choice → cost.
3. **Every image earns a sentence.** Each figure or group has a caption that states the decision or the takeaway
   ("The error names the cause and the fix"), not the screen name ("Error screen").
4. **Show the system, not a pile of screens.** A flow is one strip; states are one grid; a brand change is a side-by-side.
   No more than 6 phones in one gallery.
5. **Honest numbers.** Product numbers are labelled as product numbers, with the source. Concepts get
   "Metrics I would track" instead of results. Never invent a metric, a team member or a quote — ask the owner.

---

## 2. Page skeleton (in this order)

`R` = required, `O` = optional. Word budgets are for body text in that block, captions not counted.

| # | Block | | What goes in | Budget |
|---|---|---|---|---|
| 0 | **Case facts** | R | Role · Platform · Domain · Team (no Timeline row — it says nothing about the work) | — |
| 1 | **Case summary** | R | Problem / What I did / Result — one or two sentences each | 25 words each |
| 2 | **Lead** | R | One sentence: what the product is and for whom. Not a repeat of Problem | 30 |
| 3 | **Hero image** | R | One composition that explains the case in 2 seconds (see §4) | caption ≤ 10 |
| 4 | **Context** | R | Who the users are, what existed before, **what my part was** (replaces "My role" + "The problem") | 120 |
| 5 | **Constraints** | R | 3–5 bullets. Each one must show up later in a decision or a solution block | 60 |
| 6 | **Process** | O | 1–3 real artifacts (board, map, benchmark) — each with one line: what it changed | 80 |
| 7 | **Key decisions** | R | 1–3 decisions: options → choice → what it cost (see §3.3) | 80 per decision |
| 8 | **Solution blocks** | R | 2–4 `h2` sections. The title names what is solved, not the screen | 80 per block |
| 9 | **States and edge cases** | O | Empty, error, loading, permission, first-time hint — as one grid. Can live inside a solution block instead | 40 |
| 10 | **Result** | R | Shipped: stats + source link. Concept: "Metrics I would track" (3–4 bullets) | 60 |
| 11 | **What I learned** | R | 2–3 lessons from *this* project, each one sentence. No general truths | 60 |
| 12 | Pager, CTA, footer | R | As in `CLAUDE.md` §6 | — |

**Removed everywhere:** the "What I designed" bullet list (the solution block titles do its job), the separate
"My role" and "The problem" sections, the long paragraph "I don’t treat these numbers as my personal score"
(the stats kicker already says it).

### Heading names (fixed, so all cases read the same)

`Context` · `Constraints` · `Process` · `Key decisions` · *(solution titles, free)* · `States and edge cases` ·
`Result` · `What I learned`. Section numbers are added by CSS — never type them.

---

## 3. HTML patterns (existing classes only)

No new CSS without asking the owner. Everything below uses classes that already exist in `styles.css`.

### 3.1 Header (facts + summary)

As in `CLAUDE.md` §6. Four facts only: Role, Platform, Domain, Team.

### 3.2 Lead + hero

```html
<div class="prose wrap">
<p class="reveal">Lead sentence.</p>
<div class="media reveal"><figure class="fig"><img src="img/<slug>/hero.webp" alt="What is shown, in words" width="2048" height="1152" loading="eager" decoding="async"><figcaption>Short takeaway</figcaption></figure></div>
<h2 class="reveal">Context</h2>
…
```

The hero is the only image with `loading="eager"`. Export it also as the case `og:image` (1200×630,
`img/<slug>/og.jpg`) and point `og:image` / `og:image:alt` to it.

### 3.3 Key decision

```html
<h3 class="reveal">Decision as a question: how does a fan confirm a transfer?</h3>
<p class="reveal">Options: a button, a confirm dialog, a swipe. Chose the swipe: a transfer can’t be undone and the stadium is crowded, so it must be hard to trigger by accident. Cost: one extra gesture to learn.</p>
<div class="media reveal"><figure class="fig"><img src="img/<slug>/decision-<name>.webp" alt="…" width="2048" height="1152" loading="lazy" decoding="async"><figcaption>Three options. I picked the swipe.</figcaption></figure></div>
```

Rule: the paragraph always has the three parts — **options**, **choice + reason**, **cost**.

### 3.4 Solution block

```html
<h2 class="reveal">Title that names what is solved</h2>
<p class="reveal">1–2 sentences: the problem in this area and the idea of the solution.</p>
<h3 class="reveal">Step or sub-area</h3>
<div class="gallery gallery--phones reveal" style="--cols:3">
  <figure class="fig"><img … alt="Wallet before the account is linked: one message and one action" …><figcaption>Nothing to show until the account is linked</figcaption></figure>
  …
</div>
```

- A flow (happy path) = one gallery, screens left to right in order, `--cols` = number of screens (max 4 per row).
- States = a separate gallery after the flow, captions name the state *and* what the user can do.
- Brand comparison = one `.media` composition with the same screen in 2–3 brands (made in Figma, exported as one image).

### 3.5 Result

Shipped case — keep the existing `.stats` component; one kicker line, source link in a sentence after it:

```html
<div class="stats reveal"><p class="stats__kicker"><strong>Platform results.</strong> Product numbers, not personal ones.</p><div class="stats__grid">…</div></div>
<p class="reveal">Source: <a href="…" target="_blank" rel="noopener">Sports Innovation case</a>. My part: one sentence.</p>
```

Concept case — no stats grid:

```html
<p class="reveal">Concept screens only. Nothing here is a live metric.</p>
<h3 class="reveal">Metrics I would track</h3>
<ul class="reveal"><li><strong>Metric.</strong> Why it shows the design works.</li></ul>
```

---

## 4. Image rules

| Type | Rule |
|---|---|
| Hero | One composition: 3 phones (or the key screen + context). Real content, no lorem ipsum, no grey placeholders. 2048×1152 |
| Phone screens | Without device frames (owner is preparing frameless exports). Same width in one gallery. Real copy |
| Flow strip | Happy path only, left to right, max 4 per row |
| States grid | Empty / error / loading / permission / success. Caption = state + what the user can do |
| Boards and maps | Crop to the readable part; never the whole FigJam board. Caption = what it changed in the design |
| Before / after, options | Side by side in one image, labelled inside the image (A / B / C or Before / After) |
| Alt text | Describes content: "Home before the match: next game, ticket button, live quiz card". Never "screen 1 of 3" |
| Captions | ≤ 10 words, a takeaway, sentence case, no full stop if it is a fragment |

Export: `cwebp` settings and folders exactly as in `CLAUDE.md` §6.2.

---

## 5. Writing rules (on top of `CLAUDE.md` §5)

- Headings of solution blocks say what is solved: "Ticketing: two providers, many states", not "Wallet screens".
- "I" for my own work, "we" for team work — and say which is which in Context. Never claim the team’s work as mine.
- One idea per paragraph, 1–3 sentences. Plain words; no "seamless", "intuitive", "delightful", "leverage".
- Every constraint must be answered later. If it isn’t, cut the constraint.
- Lessons are specific: "Provider rules decide the UX — Eventii forced an email path", not "Simplicity matters".
- The neutral theme every feature is designed in is the **base theme** on the site (the `TEST` group in Figma). The reader never sees TEST: not in copy, alts or images — images show BASE (e.g. `BASE/alpha/color/bgPrimary`). Never "skeleton" either. Pass on the idea, not the file’s internal names.

---

## 6. Migration map for existing cases

| Old section | New place |
|---|---|
| Intro paragraph | Lead (shorten to one sentence, not a copy of Problem) |
| My role + The problem | Context (one section) |
| The constraints | Constraints |
| The process | Process (only with artifacts) or fold into Key decisions |
| What I designed (list) | Delete — solution block titles replace it |
| h3 groups of screens | Solution blocks with decision captions |
| "Why not Kahoot?" (Live Quiz) | Key decisions |
| Result + disclaimer paragraph | Result (kicker + one "My part" sentence) |

Per case:

| Case | Main work |
|---|---|
| White-label | Full rebuild — Appendix A |
| Live Quiz | Move "Why not Kahoot?" to Key decisions; 15 phones → one flow strip + one states grid; decision captions |
| Design system | Hero; Before/after higher up; Context states it was co-owned and existed before |
| Personalized offers | Add one Key decision (offer card options); show sponsor branding |
| Keel | Put each screen next to its 2-line description; add one Key decision |
| 3F Superliga | Rebuild to the skeleton: Context with my part, Constraints, one decision (home as a round board), Result, Learned |
| Kvit | Work in progress — already closest to the template; shorten Process |

---

## 7. Checklist before a case is "done"

- [ ] Summary is ≤ 25 words per item
- [ ] No sentence in the body repeats the summary
- [ ] Hero image exists and is the case `og:image`
- [ ] At least one Key decision with options → choice → cost
- [ ] Every gallery/media has a takeaway caption; every alt describes content
- [ ] No gallery has more than 6 phones; no lorem ipsum or `[placeholder]` text visible in screens
- [ ] Every constraint is answered later
- [ ] Result has a source link (shipped) or "Metrics I would track" (concept)
- [ ] 2–3 specific lessons
- [ ] `CLAUDE.md` §8 checks pass

---

## Appendix A — White-label case, block by block

Facts confirmed by the owner (2026-10-15):

- Joined an existing white-label team after ~2 years of the product; some screens and the design system already
  existed. Over **2 years** the team moved the system to Figma variables and made a plugin to switch a design between
  clubs; on that base the owner designed many club apps and features (Live Quiz, Stories, Onboarding, Vouchers,
  match day). No single fixed role — part of the team that updated, extended and supported the white-label.
  Contract ended; the product continues without him.
- Clubs: write **10+ club apps**. Live in the App Store: ForDanmark, AC Horsens, Brøndby IF, Viborg, FC Midtjylland.
- Everything in the Figma files and boards may be shown publicly.
- Hero clubs: **FCM** (most polished), **FCK** (UX board + public metrics), **DBU** (national team — ForDanmark app).

Figma file `hML2htcfzwCFXafq3E0sh9`. Work page for exports: **White label case** (`44102:118846`).

| # | Block | Content | Source (Figma node / file) |
|---|---|---|---|
| 0 | Facts | Role · iOS, Android, Web · SportTech · B2B white-label · 2&nbsp;designers, project manager, developers, QA | — |
| 1 | Summary | Problem: fans barely used the club app; it had to work for 10+ club brands at once. What I did: club apps and features on a shared variable-based system, ticketing for two providers (wallet, transfer, release). Result: FC&nbsp;Copenhagen release result + platform numbers | — |
| 2 | Lead | One product, 10+ football clubs, each app still feels like the club’s own | — |
| 3 | Hero | Same screen (Home, live match — top 852px only) in FCM, FCK, DBU side by side | TEST source `16814:101201`; FCM Home `37094:56357`; FCK page `35568:85153`; DBU: owner converts `16814:101201` from TEST with the plugin |
| 4 | Context | Fans use the app mostly to buy a ticket. My part: joined a running product, worked on the system and on club apps and features (wording from the facts above) | — |
| 5 | Constraints | Many club brands on one codebase · home and crowded stadium · two ticket providers with different rules · two ways to log in per club: the club profile or LigaLogin (an external league-wide login) · up to 40% of season-card holders need to release or transfer a ticket for each match | Sticky note in TEST › Wallet (`17844:178181`); TEST › Login `17844:179120` |
| 6 | Process | (a) FCK UX board levels: business → journeys → content → wireframes; (b) Brøndby benchmark of buy-ticket journeys (Juventus, Barcelona, Man City, Inter); (c) wallet shaped by fan type: season card / ticket subscription / has tickets / no ticket — **one** clean crop of the Shaping board replaces `ticket-share-flow` and `transfer-ticket-to-a-friend` | FigJam `KSFzlijPDMJtDc035Ua41p`, `VNt8cCz6baXuH8rKVNbcli`, `ZZtOCbpzpy4a9sbOsMvJp9` — crops only |
| 7 | Key decisions | (1) Confirm a transfer or release with a swipe, not a button. (2) Optional: match header style 1 vs 2. Login is **not** a decision — both options ship; it stays a constraint | TEST › Wallet confirm screens; TEST › Match center `17986:297228` |
| 8a | Solution: **One base theme, many clubs** | Base theme screen → same screen with FCM variables; one line on variables (base group → club group, ~14 club sets) and the switching plugin; link to the Design system case | TEST Home `17844:179121` vs FCM Home `37094:56357`; Variables page `91:4447` |
| 8b | Solution: **A home that changes with the match** | Pre-match / live / post-match home in one club (FCM) | FCM › Home section |
| 8c | Solution: **Ticketing: two providers, many states** | Wallet (missing connection → tickets → season card) · Transfer strip (allow contacts → pick → confirm → done) · **Release (confirm → released) — new** · Eventii path (email → account notice) | Existing images + Release `17979:141449`, `17979:140905` (export from FCK page, not TEST) |
| 9 | States | Transfer error toast, inbox empty, first-time QR hint, error screen | Existing `error-transferring.webp`; TEST › Inbox `17998:532074`; Wallet first-time hint `37627:162987`; TEST › Error |
| 8d | Fan web cabinet | Keep as is, short | `fan-web-cabinet.webp` |
| 10 | Result | Link to the FCK release article first, then stats. Allowed figures: +50% active fans · +50K MAU (over 80% of fans use the app each month) · 1.2M sessions/month · +€50K ticket and +€20K shop sales per month · no-show 40% → 15% (or "50% no-show reduction on season cards") | sportsinnovation.dk (owner’s screenshot, 2026-10-15) |
| 11 | What I learned | Confirmed by the owner: provider rules shape the UX (Eventii forced an email path) · in white-label work the system is the product, one screen is a test of it · a feature used by 40% of season-card holders every match deserves its own flow, not a menu item | — |

Current images — keep / replace / drop:

| File | Decision |
|---|---|
| `main-app-flow.webp` | Keep → Process or Context |
| `home-screen-01..03`, `match-day-01..03` | Replace with 8b (FCM pre / live / post) |
| `same-layout-01..03` | Replace with 8a (TEST vs FCM) and the hero |
| `missing-connection`, `tickets`, `season-cards` | Keep (8c Wallet) |
| `start-transfer`, `pick-receiver`, `receiver-picked`, `confirm-ticket-transfer`, `done` | Keep as one strip (max 4: drop `receiver-picked` or `start-transfer`) |
| `error-transferring` | Move to States |
| `tickets-eventii`, `enter-email-eventii`, `sender-notified-account-creation-eventii` | Keep |
| `release-ticket.webp` (FCK board) | Keep → before the ticketing screens, not after |
| `ticket-share-flow`, `transfer-ticket-to-a-friend` | Drop. Pieces of the Shaping board; replaced by one cleaner crop in Process (c) |
| `fan-web-cabinet` | Keep |

UX-writing issues seen in the Figma screens (fix before export):

- Release confirm screen: swipe label says **"Slide to redeem"** → should be about releasing ("Slide to release").
- **"season card even ticket"** (typo for "event") in labels and in the confirm text.
- TEST screens have lorem ipsum and `[platform] [row] [seat]` — export club versions with real content only.
