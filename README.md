# Beyond Benchmarks: Deep Learning Indaba 2026 Workshop

Static website for the Deep Learning Indaba 2026 workshop **Beyond Benchmarks: Scaling Multi-Turn Participatory AI Evaluations in Health and Education**.

The site is designed for GitHub Pages: no build step, no backend, and no framework-specific deployment requirements.

## What's Included

- `index.html` - semantic single-page workshop website
- `styles.css` - responsive design system, immersive branding, animations, and layout
- `script.js` - mobile navigation and scroll reveal behavior
- `assets/` - SVG logo placeholders plus raster organizer and publication placeholders
- `.nojekyll` - keeps GitHub Pages from processing the site with Jekyll

## Local Preview

Open `index.html` directly in a browser, or run a simple static server:

```bash
python3 -m http.server 8000
```

Then visit:

```text
http://localhost:8000
```

## Deploying to GitHub Pages

1. Push this repository to GitHub.
2. Open the repository on GitHub.
3. Go to **Settings** -> **Pages**.
4. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
5. Select the branch you want to deploy, usually `main`.
6. Select the root folder `/`.
7. Save the settings.

GitHub Pages will publish the static site at the Pages URL shown in the settings screen.

## Replacing Placeholder Assets

The logo placeholders are SVG files and are intentionally isolated so they can be replaced easily:

- `assets/logo-yux-placeholder.svg`
- `assets/logo-kitala-placeholder.svg`
- `assets/logo-msr-placeholder.svg`

The image placeholders are raster files so they behave like the final photos and thumbnails:

- `assets/person-placeholder.png`
- `assets/publication-placeholder.jpg`

To replace a placeholder, add the final image file to `assets/` and update the matching `<img src="...">` in `index.html`.

## Editing Content

Most workshop content is organized by section in `index.html`:

- Hero
- Partners and organizers
- About
- Objectives
- Takeaways
- Organizers
- Publications and resources
- Agenda
- Speakers
- Keywords
- Repository
- Footer

Cards use repeated HTML patterns, so adding organizers, speakers, or publications is a matter of duplicating an existing card and changing its content.

## Design Notes

The visual system uses the updated presentation-inspired palette:

- White background: `#ffffff`
- Deep navy: `#06172b`
- Accent cyan: `#63e3e4`
- Supporting indigo: `#4f5cf5`

Cyan and indigo are used as accents for calls to action, highlights, logos, chips, and illustration details while keeping light mode spacious and white.
