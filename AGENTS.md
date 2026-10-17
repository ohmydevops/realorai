# Project requirements

## Product and design

- Keep this a simple, mobile-friendly English/Persian image guessing game.
- Keep Home minimal: a compact illustration comparing analog photography and neural-network image generation, one short friendly description, and a Start game button. Keep extra headings and explanatory sections off Home.
- Keep the existing branded title visible on every page, including the game, results, and image sources. The title links to the current language's Home.
- Keep a small eye-and-sparkle brand icon with the text Real? to the right of the shared title.
- On mobile, keep primary actions at the bottom of the available content area: Start game, real/AI answers, and the next-game button. Respect safe-area insets, use comfortable touch targets, and prevent content from hiding behind buttons.
- Keep language and theme controls visually small. Preserve light/dark themes, readable contrast, and keyboard focus indicators.
- Align theme, language, and settings controls with consistent sizes and SVG strokes. Use EN and FA as language labels, readable type on desktop and mobile, and a high-contrast sage/forest palette.
- Do not show a creator-credit line in the footer. In RTL layouts, place About on the right and Image sources on the left, across the footer width.
- Keep the footer visible at the bottom on every page, including Sources, while the main content scrolls separately. All footer destinations must remain available in both languages.
- Support narrow screens from 320px, short screens, portrait/landscape orientation, and both RTL and LTR layouts without horizontal scrolling. Check Home, gameplay, results, and the sources page when changing layout.
- Persian copy should be friendly, conversational, and spelled correctly. Preserve the user's chosen dialect in the real/AI answer buttons unless asked to change it. Avoid formal or awkward wording.

## Game and images

- Gameplay has no timer or automatic timeout. Players answer at their own pace.
- Display the image number (for example, عکس ۳ از ۵) directly below the image.
- Save completed game scores, dates, and skipped counts in browser storage and show them in History. Keep existing history intact across visits and languages.

- A round normally has five images, shown one at a time, with randomly one or two AI images and the remaining images real. Never exceed two AI images, including partial final rounds.
- Use only Cars and Portrait in new games. Cars should be the main subject; portraits should show a clear face, preferably head-and-shoulders against a white or neutral background, matching the user's references. Keep real and AI examples visually comparable within each category. Prefer two real/AI pairs from the two categories; with one AI image, create one matching pair. Fill the remaining slot from either category and shuffle the presentation.
- Retired images may remain available for saved game reviews, but must not enter new rounds or the current Sources collection. Preserve their permanent IDs, seen records, and completed history.
- Export real and AI quiz images using the same size and compression policy: JPEG, at most 1000 pixels on the longest edge, and at most 140 KiB per file. Preserve aspect ratios and compare the file-size distributions to avoid loading-speed clues. Do not pad files or delay downloads artificially to make sizes match.
- Use the remaining unseen collection when matching categories run short. Never silently reset history or repeat seen images just to create a pair.
- New rounds stop when no unseen AI images remain. Preserve partial final rounds, loading/error handling, and browser-local progress across languages.
- Existing image IDs are permanent. When adding images, supply unique IDs, bilingual categories, honest real/AI labels, local files, and credits. Add real and AI examples in the same category where possible.
- Choose and generate highly realistic images that look like ordinary photographs taken with DSLR cameras or mobile phones. Favor natural lighting, believable textures, candid framing, and subtle camera imperfections. Avoid polished studio styling, heavy retouching, excessive HDR, and a glossy or artificially perfect appearance, especially in AI images.
- Before creating, selecting, or reviewing portrait images, read the project skill at `skills/realistic-portraits/SKILL.md`. Always use a reviewed real photograph as the generation reference for a new AI portrait, preserving photographic composition while changing the person and details. Use plausible real-world places, natural supported poses, and consistent camera perspective.
- Give faces and lighting a strict realism review before accepting people images. Avoid synthetic facial structure, fixed glossy eyes, a repeated posed smile, sculpted beauty lighting, and cinematic warm/cool separation. Adding pores, grain, or camera names does not fix an artificial-looking face; judge the face at gameplay size and close up, together with its surroundings.
- Include occasional photographic effects such as black-and-white, restrained film looks, and subtle cinematic grading alongside ordinary color images. Before generating an effects batch, read `skills/realistic-portraits/references/photographic-effects.md`. Use a coherent look per image, preserve realistic faces and physical scenes, and distribute styles across real and AI images so effects do not reveal the answer.
- Keep the collection 25% AI unless the user changes that requirement. Do not show category or answer clues during play. Warn before revealing image sources.

## Development and delivery

- Use this repository root as the single project root. The deployable static site is in `public/`; tests are in `tests/`.
- `npm run dev` starts Vite at http://127.0.0.1:5174/ with automatic browser reload when site files change. Keep the server running when the user asks for a preview.
- Keep the published site static and self-host fonts, scripts, styles, icons, and quiz images. The user-approved Umami script at https://cloud.umami.is/script.js is the analytics exception, using website ID e334ba0d-1ec4-4ab7-b4c1-2c1f1477f33b on every page. Do not add a framework or a production build without a concrete need.
- Keep localized Open Graph and Twitter metadata, 1200 × 630 sharing images, favicon/touch icons, canonical URLs, language alternates, robots.txt, and sitemap valid for GitHub Pages under `/realorai/`.
- Before every commit, including small text edits, run `npm run format:check` against the exact content being committed and fix failures before committing. Run `npm test` for relevant changes. Visually verify layout changes at phone and desktop sizes. Use `npm run format` when needed.
- Remove obsolete prototypes and duplicate output rather than maintaining several competing project directories.
- At the end of each task, remove unnecessary scripts and temporary helpers. Keep finished assets, application scripts, tests, and required development configuration; do not retain one-time asset-generation or migration scripts.
- Always remove confirmed dead code, unused translations and dependencies, and duplicate rules before finishing. Preserve compatibility code that still supports saved user data and work currently in use by another active chat.
- Keep the README concise: setup, checks, deployment, and credits. Do not add task logs, generation details, expansion narratives, or transient collection counts.
- Use clear, readable fonts in sharing images, with Vazir for Persian. Avoid fixed round lengths in promotional artwork so it remains valid when game length changes.
- Keep the game installable in Chrome with a standalone manifest and matching icons. Offer installation in About when the browser provides an install prompt; keep Home minimal.
- Always use the configured proxy for network downloads and Git operations.
- Publish through the existing GitHub Pages workflow when requested. The user requested a one-time history reset for this cleanup; do not reset or force-push history again without a new explicit request.
