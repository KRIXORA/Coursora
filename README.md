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
- [ ] Service worker registered, cache `coursora-v1`
- [ ] Install prompt on supported mobile Chrome
- [ ] Lighthouse PWA / Performance / SEO

After each major deploy, bump `CACHE_NAME` in `sw.js` (e.g. `coursora-v2`) so clients drop old caches.

## Disclaimer

Coursora does not host or sell courses. All enrollments happen on the original provider’s website.

## Author

**Krish Parmar** · Creative Developer (KRIXORA) · [Portfolio](https://krixora-portfolio.vercel.app) · [GitHub](https://github.com/KRIXORA)

---

© 2026 Krish Parmar
