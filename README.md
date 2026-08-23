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
├── css/                # Styles
├── js/                 # Scripts
├── assets/             # Icons + OG image
├── manifest.json
├── sw.js               # Service worker (must stay at root)
├── robots.txt
├── sitemap.xml
└── vercel.json
```

## Stack

HTML · CSS · Tailwind (CDN) · Vanilla JavaScript · Service Worker · Web App Manifest

No build step required.

## Local preview

Open the project root (`index.html`) via a local static server (required for service worker):

```bash
npx serve .
# or
python3 -m http.server 5500
```

Then visit `http://localhost:5500`.

## Deploy (Vercel)

1. Push this folder to GitHub
2. Import the repo in [Vercel](https://vercel.com)
3. Framework preset: **Other** (static)
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
