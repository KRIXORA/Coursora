# Coursora

Discover free and paid online courses from Udemy, Coursera, edX, FutureLearn, and more — search, filter, learning paths, and an installable PWA.

**Live:** [coursora-os.vercel.app](https://coursora-os.vercel.app/)

## Features

- 125+ curated courses across IT, Business, Healthcare, Art, and more
- Search, category / type / provider filters, shareable filter URLs
- Curated learning-path roadmaps
- ⌘K command palette
- Favorites (saved locally)
- Dark mode
- Installable Progressive Web App (offline app shell)
- Contact form for broken-link reports

## Project structure

```
├── index.html          # Home
├── privacy.html
├── offline.html
├── 404.html
├── css/
│   ├── style.css            # Hand-written custom CSS
│   └── tailwind-output.css  # Compiled Tailwind (generated — do not edit by hand)
├── src/
│   └── input.css       # Tailwind entry point (@tailwind base/components/utilities)
├── js/                 # Scripts
├── data/
│   └── courses.json    # Course catalog (edit this to add/update courses)
├── assets/             # Icons + OG image
├── manifest.json
├── sw.js               # Service worker (must stay at root)
├── robots.txt
├── sitemap.xml
├── tailwind.config.js  # Tailwind theme (colors, shadows, etc.)
├── package.json
└── vercel.json
```

## Stack

HTML · CSS · Tailwind (CLI build) · Vanilla JavaScript · Service Worker · Web App Manifest

## Local preview

Open the project root (`index.html`) via a local static server (required for service worker):

```bash
npx serve .
# or
python3 -m http.server 5500
```

Then visit `http://localhost:5500`.

## Editing styles (Tailwind)

Tailwind classes used anywhere in `index.html` / `privacy.html` / `js/**/*.js` need a
rebuild before they show up, since `css/tailwind-output.css` is a compiled, purged file
(only the classes actually used in the project are included — this is what keeps it a
few KB instead of the multi-MB CDN build).

```bash
npm install          # first time only
npm run build:css    # one-off build (minified)
npm run watch:css    # rebuilds automatically while you edit
```

If you add a brand-new Tailwind class and forget to rebuild, it'll simply have no
effect until you run one of the commands above.

## Deploy (Vercel)

1. Push this folder to GitHub
2. Import the repo in [Vercel](https://vercel.com)
3. Framework preset: **Other** (static) — the build command (`npm run build:css`) is already set in `vercel.json`, so Tailwind compiles automatically on every deploy
4. Deploy

`vercel.json` maps unknown routes to `404.html` and disables aggressive caching of `sw.js`.

## Google Search Console

1. Add property for your production URL
2. Verify (HTML tag or DNS)
3. Submit `https://your-domain/sitemap.xml`

## PWA checklist

- [ ] Chrome → DevTools → Application → Manifest (icons OK)
- [ ] Service worker registered — check the cache name in DevTools → Application → Cache Storage matches the current `CACHE_NAME` in `sw.js`
- [ ] Install prompt on supported mobile Chrome
- [ ] Lighthouse PWA / Performance / SEO

After each major deploy, bump `CACHE_NAME` in `sw.js` (currently `coursora-v15` — increment it) so clients drop old caches.

## Notes for future edits (things that look wrong but aren't — or the opposite)

- **`<head>` link order matters**: `css/tailwind-output.css` must be the *last* stylesheet, after the Font Awesome `<link>`. Font Awesome's `.fas` rule sets `display: inline-block` at the same CSS specificity as Tailwind's `.hidden` / `dark:hidden` utilities — whichever loads last wins ties. Loading Tailwind after Font Awesome is what makes the dark/light theme-toggle icon (moon/sun) show only one icon at a time instead of both overlapping.
- **Course data is fetched, not inlined**: `data/courses.json` loads asynchronously in `script.js`. Because of that, `displayCourses()` re-calls `initScrollReveal()` (from `reveal.js`) every time it renders — the scroll-reveal `IntersectionObserver` only fires once on `DOMContentLoaded`, which happens *before* the fetch resolves, so newly-added cards would otherwise never animate in. Don't remove that call.
- **No `image` field on course objects on purpose**: course card logos come from `getCourseImage()` (provider-name → Google favicon lookup), not from a per-course image URL. A per-course `image` field used to exist but pointed mostly at `logo.clearbit.com`, which shut down in Dec 2025 — the field was dead code even before that (never read by the renderer) so it was deleted rather than fixed. Don't re-add it expecting it to display anything.
- **Tailwind classes need a rebuild to show up**: see "Editing styles" above — `npm run watch:css` while developing, or changes silently do nothing.

## Disclaimer

Coursora does not host or sell courses. All enrollments happen on the original provider’s website.

## Author

**Krish Parmar** · Creative Developer (KRIXORA) · [Portfolio](https://krixora-portfolio.vercel.app) · [GitHub](https://github.com/KRIXORA)

---

© 2026 Krish Parmar
