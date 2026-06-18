# The Residences at 1428 Brickell

A single-page luxury real estate landing page built with plain HTML, CSS, and JavaScript.

## Quick start

Open `index.html` directly in your browser, or run a local server:

```bash
npx serve .
```

Then visit `http://localhost:3000` (or the port shown).

## Project structure

```
1428-brickell/
├── index.html       # All page sections
├── css/             # Styles (variables, base, components, sections)
├── js/              # main.js (form, weather, scroll) + map.js (Leaflet)
└── assets/images/   # Placeholder note (images load from Unsplash CDN)
```

## Customization

- **Images:** Replace Unsplash URLs in `index.html` with your own assets in `assets/images/`.
- **Colors:** Edit CSS variables in `css/variables.css`.
- **Contact info:** Update header, footer, and form copy in `index.html`.
- **Form:** Currently static — validates client-side and shows a success message. To send emails, integrate Formspree or a backend API in `js/main.js`.

## Map

Uses [Leaflet](https://leafletjs.com/) with CartoDB Dark Matter tiles. No API key required. Center: 1428 Brickell Ave, Miami, FL.

## Weather widget

Fetches live Miami temperature from [Open-Meteo](https://open-meteo.com/) (free, no key). Falls back to static display if offline.

## Browser support

Modern browsers (Chrome, Firefox, Safari, Edge). Requires JavaScript for map, weather, and form validation.
