# Project requirements

## Product and design

- Whenever adding or editing user-facing text, apply the same content change in all supported site languages (Persian, English, Arabic, Turkish, French, and Russian), including article content, titles, descriptions, and other localized metadata. Do not leave new pages or text available in only some languages.

- Keep this a simple, mobile-friendly English/Persian image guessing game.
- Keep Home minimal: a compact illustration comparing analog photography and neural-network image generation, one short friendly description, and a Start game button. Keep extra headings and explanatory sections off Home.
- Keep the existing branded title visible on every page, including the game, results, and image sources. The title links to the current language's Home.
- Keep the shared title text-only, without a logo or icon alongside it.
- On mobile, keep primary actions at the bottom of the available content area: Start game, real/AI answers, and the next-game button. Respect safe-area insets, use comfortable touch targets, and prevent content from hiding behind buttons.
- Keep language and theme controls visually small. Preserve light/dark themes, readable contrast, and keyboard focus indicators.
- Use the shared corner-radius design token consistently for visible buttons, compact controls, dropdowns, dialogs, images, and section surfaces. Keep the same treatment across every page and language.
- Align theme, language, and settings controls with consistent sizes and SVG strokes. Use EN and FA as language labels, readable type on desktop and mobile, and a high-contrast sage/forest palette.
- Do not show a creator-credit line in the footer. In RTL layouts, place About on the right and Image sources on the left, across the footer width.
- Keep the footer visible at the bottom on every page, including Sources, while the main content scrolls separately. All footer destinations must remain available in both languages.
- Support narrow screens from 320px, short screens, portrait/landscape orientation, and both RTL and LTR layouts without horizontal scrolling. Check Home, gameplay, results, and the sources page when changing layout.
- Persian copy should be friendly, conversational, and spelled correctly. Preserve the user's chosen dialect in the real/AI answer buttons unless asked to change it. Avoid formal or awkward wording.

## Game and images

- Gameplay has no timer or automatic timeout. Players answer at their own pace.
- Display the running image number (for example, عکس ۳) directly below the image.
- Save each answered image, the player’s choice, the correct answer, and the date in browser storage and show them in History.

- Each language has a dedicated /play/ page; do not use #play routes.
- Gameplay is a continuous feed of individual images, starting with a car and alternating Cars and Portrait. If one category has no unseen images, continue with the other. Do not impose rounds or fixed real/AI ratios.
- Use only Cars and Portrait images in new games, with at most 150 active car images and 400 active portrait images. Cars should be the main subject. Portraits should show a clear face, preferably head-and-shoulders against a white or neutral background. Keep real and AI examples visually comparable within each category.
- Retired images may remain available for saved game reviews, but must not enter new gameplay or the current Sources collection. Preserve their permanent IDs, seen records, and completed history.
- Export real and AI quiz images using the same size and compression policy: JPEG, at most 1000 pixels on the longest edge, and at most 140 KiB per file. Preserve aspect ratios and compare the file-size distributions to avoid loading-speed clues. Do not pad files or delay downloads artificially to make sizes match.
- Never repeat answered images or silently reset progress to match categories. Save each answer immediately and show whether it was correct before the player moves to the next image.
- Continue until no unseen images remain, regardless of real/AI type. Preserve loading/error handling and browser-local progress across languages. Use the new per-image storage format without migration or backward compatibility for old round history.
- Existing image IDs are permanent. When adding images, supply unique IDs, bilingual categories, honest real/AI labels, local files, and credits. Add real and AI examples in the same category where possible.
- Choose and generate highly realistic images that look like ordinary photographs taken with DSLR cameras or mobile phones. Favor natural lighting, believable textures, candid framing, and subtle camera imperfections. Avoid polished studio styling, heavy retouching, excessive HDR, and a glossy or artificially perfect appearance, especially in AI images.
- Always download real Unsplash portraits first, then review and select some of those downloaded photographs as inspiration and references for new AI portraits. Do not generate the AI portraits before downloading and reviewing their references.
- Before creating, selecting, or reviewing portrait images, read the project skill at `skills/realistic-portraits/SKILL.md`. Always use a reviewed real photograph as the generation reference for a new AI portrait, preserving photographic composition while changing the person and details. Use plausible real-world places, natural supported poses, and consistent camera perspective.
- Give faces and lighting a strict realism review before accepting people images. Avoid synthetic facial structure, fixed glossy eyes, a repeated posed smile, sculpted beauty lighting, and cinematic warm/cool separation. Adding pores, grain, or camera names does not fix an artificial-looking face; judge the face at gameplay size and close up, together with its surroundings.
- Include occasional photographic effects such as black-and-white, restrained film looks, and subtle cinematic grading alongside ordinary color images. Before generating an effects batch, read `skills/realistic-portraits/references/photographic-effects.md`. Use a coherent look per image, preserve realistic faces and physical scenes, and distribute styles across real and AI images so effects do not reveal the answer.
- Target 400 portraits (320 real + 80 AI) and at most 150 cars (120 real + 30 AI). Keep all existing restored images active while expanding; do not retire images solely to enforce the collection ratio. Do not show category or answer clues during play. Warn before revealing image sources.

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
- Keep the site browser-only: do not add an installable-app manifest or offer installation prompts.
- Always use the configured proxy at http://127.0.0.1:2080 for network downloads and Git operations.
- Publish through the existing GitHub Pages workflow when requested. The user requested a one-time history reset for this cleanup; do not reset or force-push history again without a new explicit request.
