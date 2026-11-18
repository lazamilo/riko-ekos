# Riko Ekos – website redesign

Front-end redesign pitch for [riko-ekos.si](https://riko-ekos.si/): a static homepage in Slovenian, built with plain HTML, CSS and JavaScript.

## Run locally

```bash
cd site
python3 -m http.server 5417
```

Then open http://localhost:5417.

## Structure

- `site/index.html` – homepage
- `site/assets/style.css`, `site/assets/main.js` – styles and interactions (GSAP, ScrollTrigger and Lenis are bundled in `site/assets/js/`)
- `site/assets/orig/` – the client's own logo, photos, certificates and reference logos
- `site/assets/gen/` – new graphics generated with Higgsfield
- `site/assets/fonts/` – Maison Neue (commercial typeface; check licence terms before production use)
