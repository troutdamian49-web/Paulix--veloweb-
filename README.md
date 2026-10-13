# Paulix × VeloWeb — Studio Website

Marketing site for **Paulix × VeloWeb**, a two-craft studio in Abuja, Nigeria:
**Paulix** (brand identity, logos, print & social design) and **VeloWeb** (websites,
e-commerce, SEO & growth).

Static site — no build step, no dependencies, no framework. Just open `index.html`.

**Live site:** https://troutdamian49-web.github.io/Paulix--veloweb-/

---

## What's inside

| Section | Purpose |
| --- | --- |
| Hero | Headline, positioning copy, dual WhatsApp calls-to-action, rating proof, "120+ projects" card |
| Marquee | Scrolling service keywords (Web Design, Brand Identity, E-Commerce, …) |
| Two crafts | VeloWeb (development) and Paulix (design) split cards with contact numbers |
| Services | Six service cards, tagged by which side of the studio delivers them |
| Process | Four steps: Discover → Design → Develop → Deploy & Grow |
| Stats | Animated counters (projects, clients, years, satisfaction) |
| Work | Three portfolio showcases |
| Testimonials | Four client quotes |
| Contact | WhatsApp CTAs, phone numbers, studio location |
| Footer + floating button | Navigation and a persistent WhatsApp shortcut |

## Project structure

```
.
├── index.html              # the whole page (semantic, single-page)
├── 404.html                # branded not-found page for GitHub Pages
├── assets/
│   ├── css/styles.css      # design system + all layout/responsive rules
│   ├── js/main.js          # mobile nav, scroll reveals, animated counters
│   ├── favicon.svg         # "P×V" mark
│   └── img/
│       ├── work-ecommerce.jpg   # 1600×1000
│       ├── work-branding.jpg    # 1600×1000
│       ├── work-fintech.jpg     # 1600×1000
│       └── og.jpg               # 1200×630 social share image
├── robots.txt
├── sitemap.xml
└── .nojekyll               # tells GitHub Pages to serve files as-is
```

## Preview locally

Any static server works. For example:

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

Or simply double-click `index.html` — everything runs from the file system.

## Editing the content

* **Text, services, testimonials, links** — all in `index.html`, clearly commented by section.
* **Phone numbers / WhatsApp** — search for `wa.me` in `index.html`. Links use the
  international format without a leading `+` (e.g. `wa.me/2348061401149`) and include a
  pre-filled message via `?text=`.
* **Colors and typography** — the `:root` block at the top of `assets/css/styles.css`
  holds every color, radius, shadow and font choice.
* **Stats numbers** — each counter has `data-count` and `data-suffix` attributes in
  `index.html`; the animation lives in `assets/js/main.js`.

## Swapping in your real project photos

Replace the three files in `assets/img/` (keep the same filenames) with your own
screenshots or mockups. Recommended: **1600×1000** (16:10), under ~300 KB each, JPEG.
The cards crop automatically, so any similar aspect ratio works.

## Deploying

Hosting is **GitHub Pages**, published by the workflow in
`.github/workflows/deploy-pages.yml` on every push to `main`.

**One-time setup (repo owner):** open **Settings → Pages** and set
**Build and deployment → Source** to **GitHub Actions**. After that, every push to `main`
republishes the site automatically — or run the workflow manually from the **Actions** tab.

The site is served at https://troutdamian49-web.github.io/Paulix--veloweb-/

To point a custom domain here later: add the domain in **Settings → Pages → Custom domain**
and create a `CNAME` file containing just the domain name.

## Accessibility & performance notes

* Semantic landmarks (`header`, `main`, `nav`, `footer`), skip link, and visible focus rings.
* All interactive controls are reachable by keyboard; the mobile menu closes on `Esc`.
* `prefers-reduced-motion` disables reveals, counters and marquee scrolling.
* No JavaScript libraries, no render-blocking CSS, lazy-loaded images, and system-font
  fallbacks — the page stays fast on slow Nigerian mobile networks.
