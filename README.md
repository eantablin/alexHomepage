# Alexandra Blair Antablin — Portfolio

A personal portfolio site for Alexandra Blair Antablin: junior software engineer,
biochemist, and devoted marine-biology (and dolphin) enthusiast.

Live at **[alex.antablin.com](https://alex.antablin.com)**.

## What it is

A hand-built, **zero-build static site** — just HTML, CSS, and a single vanilla
JavaScript file. No frameworks, no bundler, nothing to compile. That keeps it fast,
dependency-free, and bulletproof to host on GitHub Pages.

The theme is a deep-ocean look in purple and blue, with:

- An animated canvas ocean (rising bubbles + bioluminescent specks)
- A dolphin that swims across the hero along a motion path
- Scroll-driven reveal animations and a glassmorphism UI
- A side "diving depth" gauge that tracks your scroll position
- Scroll-spy navigation, a typing role rotator, and pointer-reactive project cards
- Full keyboard accessibility, `prefers-reduced-motion` support, and print styles

## Structure

```
index.html              # the whole page (single-page, anchor-nav sections)
assets/css/styles.css   # all styling + design tokens
assets/js/main.js       # interactions (canvas, scroll-spy, reveals, etc.)
assets/img/             # favicon + social (Open Graph) image, both SVG
CNAME                   # custom domain (alex.antablin.com)
```

## Running it locally

It's static, so any local server works. With Node installed:

```bash
npm install   # only needed once, just for the local dev server (sirv)
npm start     # serves at http://localhost:4321
```

Or with Python:

```bash
python3 -m http.server 4321
```

Then open <http://localhost:4321>.

## Editing content

- **Text** (bio, projects, résumé, etc.) lives directly in `index.html`.
- **Recommendations** (products & media) are data arrays near the top of
  `assets/js/main.js` — add or edit entries there.
- **Colors / fonts / spacing** are CSS custom properties in `:root` at the top of
  `assets/css/styles.css`.

## Deploying

This site is served by GitHub Pages. The simplest setup is to point Pages at the
default branch root (Settings → Pages → Source: deploy from branch → `main` → `/root`).
The `CNAME` file keeps the `alex.antablin.com` custom domain attached.
