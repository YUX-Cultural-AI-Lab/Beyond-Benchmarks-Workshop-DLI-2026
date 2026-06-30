# Beyond Benchmarks: Deep Learning Indaba 2026 Workshop

Website for the Deep Learning Indaba 2026 workshop **Beyond Benchmarks: Scaling Multi-Turn Participatory AI Evaluations in Health and Education**.

The landing page can be hosted statically. Participant registration saving works through either the included local Node server for development or a Google Sheets Apps Script endpoint for production.

## What's Included

- `index.html` - semantic single-page workshop website
- `styles.css` - responsive design system, immersive branding, animations, and layout
- `script.js` - mobile navigation, scroll reveal behavior, and registration submission
- `config.js` - production registration endpoint configuration
- `server.js` - local server that saves registration submissions to CSV
- `data/registrations.csv` - Excel-compatible registration spreadsheet
- `spreadsheet-apps-script.gs` - Google Apps Script receiver for production spreadsheet storage
- `assets/` - SVG logo placeholders plus raster organizer and publication placeholders
- `.nojekyll` - keeps GitHub Pages from processing the site with Jekyll

## Local Preview

For the full site with registration saving enabled, run:

```bash
npm start
```

Then visit:

```text
http://localhost:8000
```

Participant submissions are appended to:

```text
data/registrations.csv
```

Open that CSV in Excel to review registrations.

Opening `index.html` directly or using `python3 -m http.server 8000` will preview the page, but registration submissions will not be saved.

## Production Registration Setup

GitHub Pages cannot write to files in this repository at runtime. For production, connect the form to a hosted spreadsheet endpoint:

1. Create a Google Sheet for workshop registrations.
2. In the Sheet, go to **Extensions** -> **Apps Script**.
3. Copy the contents of `spreadsheet-apps-script.gs` into the Apps Script editor.
4. Save the project.
5. Click **Deploy** -> **New deployment**.
6. Select **Web app**.
7. Set **Execute as** to **Me**.
8. Set **Who has access** to **Anyone**.
9. Deploy and copy the Web app URL.
10. Paste that URL into `config.js`:

```js
window.REGISTRATION_ENDPOINT = "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec";
```

After that, push the updated `config.js` to production. Form submissions from the landing page will append rows to the Google Sheet, which can be downloaded or opened as an Excel spreadsheet.

## Deploying to GitHub Pages

1. Push this repository to GitHub.
2. Open the repository on GitHub.
3. Go to **Settings** -> **Pages**.
4. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
5. Select the branch you want to deploy, usually `main`.
6. Select the root folder `/`.
7. Save the settings.

GitHub Pages will publish the static site at the Pages URL shown in the settings screen. Registration saving requires the production setup above.

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
