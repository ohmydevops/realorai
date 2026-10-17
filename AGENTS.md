# Project requirements

## Product and design

- Keep this a simple, mobile-friendly English/Persian image guessing game.
- Home contains only one short, friendly description and a Start game button in its main content. Keep extra headings and explanatory sections off Home.
- Keep the existing branded title visible on every page, including the game, results, and image sources. The title links to the current language's Home.
- Keep a small eye-and-sparkle brand icon with the text Real? to the right of the shared title.
- On mobile, keep primary actions at the bottom of the available content area: Start game, real/AI answers, and the next-game button. Respect safe-area insets, use comfortable touch targets, and prevent content from hiding behind buttons.
- Keep language and theme controls visually small. Preserve light/dark themes, readable contrast, and keyboard focus indicators.
- Do not show a creator-credit line in the footer. In RTL layouts, place About on the right and Image sources on the left, across the footer width.
- Support narrow screens from 320px, short screens, portrait/landscape orientation, and both RTL and LTR layouts without horizontal scrolling. Check Home, gameplay, results, and the sources page when changing layout.
- Persian copy should be friendly, conversational, and spelled correctly. Preserve the user's chosen dialect in the real/AI answer buttons unless asked to change it. Avoid formal or awkward wording.

## Game and images

- Each image has a prominent eight-second timer enabled by default, starting only after it loads. When time expires, record it as skipped and advance. Settings can disable the timer; remember that preference across visits and languages. Pause the countdown while dialogs are open and cancel it when leaving gameplay.
- Display the image number (for example, عکس ۳ از ۵) directly below the image; keep the timer above the image.
- Save completed game scores, dates, and skipped counts in browser storage and show them in History. Keep existing history intact across visits and languages.

- A round normally has five images, shown one at a time, with one to three AI images and the remaining images real.
- Categorize real and AI images by actual subject. Prefer two real/AI pairs from two different matching categories and a fifth image from a third category; with one AI image, create one matching pair. Shuffle the presentation.
- Use the remaining unseen collection when matching categories run short. Never silently reset history or repeat seen images just to create a pair.
- New rounds stop when no unseen AI images remain. Preserve partial final rounds, loading/error handling, and browser-local progress across languages.
- Existing image IDs are permanent. When adding images, supply unique IDs, bilingual categories, honest real/AI labels, local files, and credits. Add real and AI examples in the same category where possible.
- Keep the collection 25% AI unless the user changes that requirement. Do not show category or answer clues during play. Warn before revealing image sources.

## Development and delivery

- Use this repository root as the single project root. The deployable static site is in `public/`; tests are in `tests/`.
- `npm run dev` starts Vite at http://127.0.0.1:5174/ with automatic browser reload when site files change. Keep the server running when the user asks for a preview.
- Keep the published site static and self-host fonts, scripts, styles, icons, and quiz images. The user-approved Umami script at https://cloud.umami.is/script.js is the analytics exception, using website ID e334ba0d-1ec4-4ab7-b4c1-2c1f1477f33b on every page. Do not add a framework or a production build without a concrete need.
- Keep localized Open Graph and Twitter metadata, 1200 × 630 sharing images, favicon/touch icons, canonical URLs, language alternates, robots.txt, and sitemap valid for GitHub Pages under `/realorai/`.
- Run `npm test` and `npm run format:check` after relevant changes. Visually verify layout changes at phone and desktop sizes. Use `npm run format` when needed.
- Remove obsolete prototypes and duplicate output rather than maintaining several competing project directories.
- At the end of each task, remove unnecessary scripts and temporary helpers. Keep finished assets, application scripts, tests, and required development configuration; do not retain one-time asset-generation or migration scripts.
- Always remove confirmed dead code, unused translations and dependencies, and duplicate rules before finishing. Preserve compatibility code that still supports saved user data and work currently in use by another active chat.
- Publish through the existing GitHub Pages workflow when requested. The user requested a one-time history reset for this cleanup; do not reset or force-push history again without a new explicit request.
