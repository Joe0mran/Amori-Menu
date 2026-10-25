# AMORI Cafe & Lounge — QR Menu

Mobile-first, bilingual (Arabic / English) QR-code menu for AMORI Cafe & Lounge, Heliopolis, Cairo. Static site: plain HTML, CSS and JavaScript, no build step and no backend. Hosted on GitHub Pages.

## Features

- Arabic or English, auto-detected from the phone, with a toggle (full RTL/LTR flip)
- Sticky category bar with scroll-spy, instant search (Arabic and English), price range and category filters
- Order list with quantities, 14% VAT estimate, and sending via WhatsApp (or copy)
- Favorites, "Surprise me" random pick, and a 3-step mood quiz
- Per-table QR links (a table number is required to place an order)

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Page markup |
| `styles.css` | All styling (colours and type follow the AMORI design system) |
| `script.js` | Menu data, translations and all behaviour |

The three files must stay in the same folder.

## Running locally

```
python3 -m http.server 8765
```

Open `http://localhost:8765/index.html`. To see the ordering flow you need a signed table link (see below).

## Editing

Settings are at the top of `script.js`:

- `MENU` / `CATEGORIES`: names, prices and quiz tags. Prices are in EGP and exclude 14% VAT.
- `WHATSAPP_NUMBER`: international format, digits only. If empty, the WhatsApp button is hidden and only "Copy order" is offered.
- `LOGO_SRC`: path to the real logo (transparent PNG/SVG). If empty, a text wordmark is shown.
- `TABLE_SECRET`: used to sign table links. Change it only together with the same value in `make-qr-links.py`, then reprint the QR codes.

## Table QR codes

Each table has its own signed link:

```
https://joe0mran.github.io/Amori-Menu/?table=NUMBER&k=KEY
```

`KEY` is generated, not chosen. Create the links with the helper script `make-qr-links.py` (its `TABLE_SECRET` must match `script.js`):

```
python3 make-qr-links.py 1-20 A3
```

Then turn each URL into a QR code with any generator. Changing `?table=` by hand does nothing, and a scanned table is remembered for 6 hours. This is a deterrent, not real security: the site has no backend.

Printing tips: at least 3×3 cm with a clear margin, dark code on a light background, "Table N" printed beside it, matte lamination (glossy glare breaks scanning), and scan every code before printing.

## Deploying

GitHub Pages: Settings → Pages → branch `main`, folder `/ (root)`. If the page address changes, the printed QR codes must be regenerated.
