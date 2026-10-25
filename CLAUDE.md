# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

QR-code menu for AMORI Cafe & Lounge (Heliopolis, Cairo), served as a static site on GitHub Pages. Customers scan a per-table QR code on their phone. Frontend only: vanilla HTML/CSS/JS, no build step, no framework, no backend, no package.json, no tests or linter. The only external resource allowed is Google Fonts.

Files: `index.html` (markup), `styles.css`, `script.js`. They must stay in the same folder (relative links). `Amori-Design-System.pdf` is the source of truth for colours, type, logo rules and component specs; read it before visual changes. It, `logo.jpg` and `loogo.png` are local-only (in `.gitignore`). `make-qr-links.py` and the test QR images in `qr/` are committed.

## Running / checking

- Serve locally: `python3 -m http.server 8765` in the repo root, then open `http://localhost:8765/index.html?table=5&k=fqz5w` (a signed table link; see below). Opening via `file://` mostly works, but history/URL syncing is skipped.
- There is no automated test suite. Verify with a headless browser at 360px and 414px, in both `ar` (RTL) and `en` (LTR) locales. Things worth re-checking after changes: per-category item counts (`window.__amoriOK` is true when the render matches), no horizontal overflow, no console errors, behaviour with `localStorage` blocked, and the table flows.
- Generate per-table QR links: `python3 make-qr-links.py 1-20 A3` (prints `table<TAB>url`).

## Architecture (script.js)

`script.js` is one file with numbered banner sections (config, menu data, i18n, state/storage, search normalisation, table, persistence, order math, render, filters, scroll-spy, language, fab/toast, sheets, order/WhatsApp, surprise, quiz, events, init). Key ideas that span sections:

- **Data-driven**: `MENU` (id, category, nameAr, nameEn, price, tags) and `CATEGORIES` at the top are the only content source; everything renders from them. Menu text and prices come from the original cafe page and must not be altered or invented. Expected counts: 179 items in 12 categories (`EXPECTED_COUNTS`, checked by `verifyCounts()` at load).
- **Tags** in `MENU` drive the Mood quiz: temperature `hot|cold`, taste `sweet|fresh|strong`, extras `dessert|fruity|creamy|vip|savory|shisha`. Quiz and Surprise-me exclusions are the constants `QUIZ_EXCLUDED` / `SURPRISE_EXCLUDED_DEFAULT`; budget tiers are `BUDGET_LEVELS`.
- **Rendering model**: the whole menu DOM is built once per language change (`renderMenu`), then search/price/category/favourite filters only toggle `hidden` (`applyFilters`). Cart/favourite changes patch a single card (`refreshItem`). Order, surprise and quiz are generic bottom sheets (`openSheet`/`closeSheet`, which set `inert` on `#app`).
- **i18n**: `I18N.en` / `I18N.ar`; static elements use `data-i18n`, `data-i18n-ph`, `data-i18n-aria`; dynamic text uses `t(key, vars)`. Language auto-detects from `navigator.language` (`ar*` → Arabic), persisted in `localStorage`, and `applyLang` flips `lang`/`dir` on `<html>` and re-renders. The active language is the main line on each item, the other is a subtitle; search matches both (Arabic normalised in `norm()`). Use CSS logical properties (`inline-start/end`, `text-align:start/end`) so RTL works; item names carry their own `lang`/`dir` attributes.
- **Storage**: all access goes through the `store` wrapper (try/catch with in-memory fallback); keys are `amori.lang|cart|favs|table`. Everything must keep working with storage blocked.
- **Signed table links** (the non-obvious part): QR links are `?table=N&k=<key>`, where `k = tableKey(N)` (FNV-1a of `TABLE_SECRET|N`). `initTable()` accepts a table only with a valid key; unsigned/wrong-key `?table=` values are ignored. A scanned table is remembered for `TABLE_TTL_MS` (6 h) and wins over any URL edit; scanning a different valid QR switches table and clears the cart. With no valid table the order buttons are disabled (there is no manual table entry). `TABLE_SECRET` and the hash exist in both `script.js` and `make-qr-links.py` and must match. This is a deterrent only (no backend); don't describe it as secure.
- **WhatsApp**: `WHATSAPP_NUMBER` (digits, international format) builds `https://wa.me/<n>?text=...` via `orderMessage()`; if empty, only "Copy order" is offered. The UI must state that the order is only sent when the customer presses Send in WhatsApp, and that totals (14% VAT) are an estimate.
- **Logo**: the real logo file is not in the repo. The wordmark is text; set `LOGO_SRC` in `script.js` to swap in an image (an `<img id="logoImg">` slot already exists).

## Design guardrails (from the design system)

Colours are CSS variables in `styles.css` (`--amori-forest/ink/sand/gold/cream/mist/blush/shadow`); don't add a new primary colour. Gold = names/prices, cream = headlines, mist = secondary text (never darker than mist, English sub-label ≥ 12px), sand = pills/buttons. Never place the cream logo on sand/white; large pure-white fills are not allowed (use cream). Tap targets ≥ 44px. Respect `prefers-reduced-motion`. Text only, no photos. Decoration (arcs, ribbon, watermark) must stay within the palette; the watermark stays at 6–10% brightness.

## Deployment

Static files at the repo root on GitHub Pages (`main`, `/ (root)`). The page URL is encoded in the printed QR codes, so changing the host/path means regenerating the QR links (`BASE` in `make-qr-links.py`).
