# Real or AI?

A friendly English/Persian game: decide whether five images are real photographs or AI-generated, then review your score.

## Development

Requires Node.js 22+.

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:5174/. Vite watches all files in `public/` and refreshes the browser automatically; CSS changes are applied directly. Development tooling stays out of the published website.

```sh
npm test
npm run format
npm run format:check
```

## Structure

- `public/`: deployable static website, local images, fonts, and English/Persian pages.
- `tests/`: game behavior and site integrity checks.
- `vite.config.mjs`: local development server and reload settings.
- `.github/workflows/`: checks and GitHub Pages deployment.

Home introduces the game; Start game opens `#play`. The shared title always links Home. Saved rounds and seen-image history remain in browser storage.

## Image selection

Each test includes one to three AI images. Selection prefers two different subject categories containing both an AI image and a real photo, plus a fifth image from a third category. With only one AI image, it creates one matching pair. When unseen categories run short, it fills the round from the remaining unseen collection without repeating images. New tests pause when no unseen AI images remain.

## Add images

Save each file in `public/`, then add an entry to `public/images.js` with a permanent unique ID, local image path, real/AI answer, English and Persian subject category, and credit. Use the same English category for matching real and AI subjects. Add real and AI examples together where possible. New IDs become available automatically; never rename existing IDs. Categories are hidden during play.

## Deploy

Push to `main`. GitHub Actions checks and deploys `public/` to GitHub Pages. No build step is needed.

## Sharing previews

Every page includes localized Open Graph and Twitter cards, plus favicon and touch icons. The English and Persian preview PNGs in `public/social/` are 1200 × 630 pixels. Sharing URLs use the production GitHub Pages address.

To regenerate the artwork on Windows after installing dependencies, run `./scripts/create-social-assets.ps1`. To refresh metadata after changing page titles or descriptions, run `node scripts/update-social-metadata.cjs`, followed by `npm run format`.

## Credits

75 photos from [Unsplash](https://unsplash.com/license) via [Lorem Picsum](https://picsum.photos/), plus 25 OpenAI-generated images. Individual credits are in `public/images.js`; the Sources page warns before revealing them. Local Vazir fonts include their license in `public/fonts/OFL.txt`.
