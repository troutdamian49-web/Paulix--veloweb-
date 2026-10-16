# Justice International School — Online Textbook Ordering

**DEMO PROTOTYPE — NOT AN OFFICIAL SCHOOL SERVICE.**

A static, dependency-free prototype of an online textbook ordering service, built so
**Justice International School** can review the idea before any official approval or real
deployment. Navy-blue and gold, mobile-first, no build step: just open `index.html`.

> ⚠️ **Nothing here is real.** No payment is processed, no price is quoted, no class list is
> assigned and no order reaches the school. See [Demo boundaries](#demo-boundaries) below.

---

## What the prototype does

| Page | Purpose |
| --- | --- |
| `index.html` | Landing page: what the demo does and does not do, the seven titles, class-list status, the demo notice, reviewer checklist |
| `books.html` | Catalogue of the seven confirmed titles with live search, subject and series filters, and "add to demo cart" |
| `cart.html` | Interactive demo cart: change quantities, remove items, clear the cart, live count and demo totals |
| `checkout.html` | Simulated checkout: acknowledges the demo, collects **nothing**, then creates a fictional order reference |
| `order.html` | Simulated order confirmation with a `DEMO-JIS-XXXXXX` reference, printable, clearly marked as simulated |
| `class-lists.html` | Class-list status: SS1, SS2 and SS3 are all "To be confirmed by the school." — no titles assigned |
| `how-it-works.html` | Step-by-step walkthrough plus a table of what is interactive, simulated or not built |
| `faq.html` | FAQ, safeguards, what the demo never asks for, and how to clear demo data |
| `404.html` | Branded not-found page |
| `studio/` | Archive of the original Paulix × VeloWeb studio site (kept, untouched, not part of the prototype) |

### The seven confirmed titles

1. New Concept English 1
2. New Concept English 2
3. TONAD Essential Chemistry
4. TONAD Essential Physics
5. New Concept Mathematics 1 (Volume 1)
6. New Concept Mathematics 2 (Volume 2)
7. TONAD Essential Marketing

Nothing else is listed. No authors, editions, ISBNs, stock figures, class allocations or real
prices have been invented: wherever a detail is outstanding the page reads
**"To be confirmed by the school."**

## Demo boundaries

| Item | Status |
| --- | --- |
| Catalogue titles | Seven titles only, as supplied for this review |
| Real prices | **To be confirmed by the school.** No amount is ever payable |
| Class lists (SS1 / SS2 / SS3) | **To be confirmed by the school.** No title is assigned to any class |
| Authors, editions, stock | **To be confirmed by the school.** |
| Cart maths | Uses a **₦1,000 per copy placeholder rate** so totals can be demonstrated — not a price |
| Payments | **Not connected.** No gateway, no receipt, nothing can be paid |
| Order references | **Simulated** in the browser (`DEMO-JIS-XXXXXX`); fictional, not recognised by the school |
| Personal data | **None collected.** No name, contact, bank, card, PIN or OTP fields anywhere |
| Storage | Demo cart and simulated order live in this browser only (`localStorage`) — no server, no accounts |

## Corrections applied in this revision

| # | Correction requested | Where it now stands |
| --- | --- | --- |
| 1 | Only the seven confirmed titles | `assets/js/catalogue.js` (single source) → `books.html`, home page and cart. Nothing else is listed anywhere |
| 2 | No invented authors, class assignments, stock or prices | Every unconfirmed field reads **"To be confirmed by the school."** on the cards, tables and summaries; the only money figure is the labelled demo placeholder rate |
| 3 | No assignment to SS1 / SS2 / SS3 | `class-lists.html` (all three unconfirmed) and `window.JIS_CATALOGUE.classLists` are empty; the catalogue has no class filter, and says why |
| 4 | Replace "SchoolBook" / `[SCHOOL NAME]` | The whole site now uses **"Justice International School — Online Textbook Ordering"** (brand, titles, footer, meta) |
| 5 | Show the demo notice | **"DEMO PROTOTYPE — NOT AN OFFICIAL SCHOOL SERVICE."** in the ribbon, hero, page notices and footer of every page |
| 6 | Interactive cart + demo checkout, verified | `cart.html` / `checkout.html` — add, remove, quantity change, clear, live count and totals. Covered by 85 automated checks (headless browser + jsdom) |
| 7 | Fictional demo orders, clearly simulated | `order.html`: `DEMO-JIS-XXXXXX` reference generated in the browser, status reads "SIMULATED — no payment was received or verified", plus "this page does not mean…" list and "not an official receipt" |
| 8 | Keep the no-payment warning, collect nothing | Payment warning on home, catalogue, cart, checkout and FAQ; zero personal/payment input fields anywhere; no bank, card, PIN or OTP requests |
| 9 | Review buttons, nav, filters, confirmation, mobile | All internal links/anchors resolve (247 checked), filters and reset work, empty states and deep links work, no horizontal overflow at 320/390/768/1280/1600 px, toast and sticky bars verified on mobile |
| 10 | Don't remove working functionality or redesign | Same navy + gold design language, same section structure and typography; the previous portfolio site is preserved untouched under `studio/` |

## Project structure

```
.
├── index.html                  # prototype home page
├── books.html                  # catalogue of the seven confirmed titles
├── cart.html                   # interactive demo cart
├── checkout.html               # simulated checkout (collects nothing)
├── order.html                  # simulated order confirmation
├── class-lists.html            # class-list status (all unconfirmed)
├── how-it-works.html           # walkthrough + real/simulated/missing table
├── faq.html                    # FAQ, safeguards, data notes
├── 404.html                    # branded not-found page
├── robots.txt                  # keeps the prototype out of search engines
├── assets/
│   ├── css/styles.css          # navy + gold design system, mobile-first
│   ├── js/
│   │   ├── catalogue.js        # the seven titles (single source of truth)
│   │   ├── cart.js             # demo cart engine, localStorage, toasts
│   │   ├── cart-page.js        # cart page rendering and interactions
│   │   ├── books.js            # catalogue filters and cart indicators
│   │   ├── checkout.js         # demo checkout + simulated order page
│   │   └── site.js             # mobile nav, reveals, footer year, current page
│   ├── favicon.svg
│   └── img/books/*.svg         # seven placeholder cover illustrations (not real covers)
└── studio/                     # archived original studio site (unchanged)
```

## Preview locally

Any static server works — no build step, no dependencies:

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

Opening `index.html` directly from the file system also works, except that the demo cart
needs `localStorage` and therefore a real origin (`http://…`).

## Where to change things

* **The seven titles, subjects and the placeholder rate** — `assets/js/catalogue.js`. It is the
  single source of truth: the catalogue page, cart, checkout and confirmation all read from it.
* **Cover illustrations** — swap the SVGs in `assets/img/books/` (keep the filenames).
* **Colours, spacing and typography** — the `:root` token block at the top of
  `assets/css/styles.css` (navy `--navy-800`, gold `--gold-500`).
* **Wording of any warning or notice** — search for `DEMO PROTOTYPE` or
  `To be confirmed by the school.` in the HTML pages.
* **What gets shown for an unconfirmed field** — `window.JIS_CATALOGUE.unconfirmed` in
  `assets/js/catalogue.js`, plus the literal text in the HTML pages.

### When the school confirms real information

1. Replace the placeholder rate in `assets/js/catalogue.js` with the confirmed prices (and
   remove the "placeholder rate" wording from `books.html`, `cart.html`, `checkout.html`,
   `order.html`).
2. Fill in the confirmed SS1 / SS2 / SS3 lists in `class-lists.html` and
   `window.JIS_CATALOGUE.classLists`.
3. Only then connect a real payment route arranged by the school — never a form that asks
   families for card PINs, bank codes or OTPs.
4. Remove the demo ribbon and notices **only** when the school has approved an official service.

## Accessibility & performance

* Semantic landmarks, skip link, visible gold focus rings, `aria-pressed` filter chips,
  `aria-live` toasts, labelled quantity controls.
* Everything works with the keyboard, including the mobile menu (closes on `Esc`) and the
  catalogue filters.
* `prefers-reduced-motion` disables reveals and transitions; a `<noscript>` fallback keeps
  revealed content visible.
* No JavaScript libraries, no render-blocking CSS beyond Google Fonts, SVG covers, and
  system-font fallbacks — the prototype stays fast on slow mobile networks.
* Print stylesheet: the simulated confirmation prints cleanly with its demo warnings.

## Deploying

The site is plain HTML/CSS/JS. Both GitHub Pages publishing options work:

* **Deploy from a branch** — Settings → Pages → Source: *Deploy from a branch*,
  branch `main`, folder `/ (root)`.
* **GitHub Actions** — Source: *GitHub Actions*; `.github/workflows/deploy-pages.yml`
  publishes on every push to `main`, and steps aside quietly if Pages is set to publish
  from the branch instead.

## The archived studio site

`studio/` holds the original Paulix × VeloWeb studio website (its own `index.html` and
`assets/`), moved there unchanged so it could be preserved while the repository root hosts
the school prototype. It is a separate, unrelated site: nothing in it relates to Justice
International School and nothing in the prototype links to it.
