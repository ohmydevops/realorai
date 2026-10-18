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
- Save each answered image, the player's choice, the correct answer, and the date in browser storage and show them in History.
- Each language has a dedicated `/play/` page; do not use `#play` routes.
- Gameplay is a continuous feed of individual images, starting with a car and alternating Cars and Portrait. If one category has no unseen images, continue with the other. Do not impose rounds or fixed real/AI ratios.
- Use only Cars and Portrait images in new games, with at most 150 active car images and 850 active portrait images. Cars should be the main subject. Portraits should show a clear face, preferably head-and-shoulders against a white or neutral background. Keep real and AI examples visually comparable within each category.
- Retired images may remain available for saved game reviews, but must not enter new gameplay or the current Sources collection. Preserve their permanent IDs, seen records, and completed history.
- Export real and AI quiz images using the same size and compression policy: JPEG, at most 1000 pixels on the longest edge, and at most 140 KiB per file. Preserve aspect ratios and compare the file-size distributions to avoid loading-speed clues. Do not pad files or delay downloads artificially to make sizes match.
- Never repeat answered images or silently reset progress to match categories. Save each answer immediately and show whether it was correct before the player moves to the next image.
- Continue until no unseen images remain, regardless of real/AI type. Preserve loading/error handling and browser-local progress across languages. Use the new per-image storage format without migration or backward compatibility for old round history.
- Existing image IDs are permanent. When adding images, supply unique IDs, bilingual categories, honest real/AI labels, local files, and credits. Add real and AI examples in the same category where possible.
- Target 850 portraits (620 real + 230 AI) and at most 150 cars (120 real + 30 AI), for 1000 active images in total. Keep all existing restored images active while expanding; do not retire images solely to enforce the collection ratio. Do not show category or answer clues during play. Warn before revealing image sources.

## Mandatory portrait reference and identity workflow

- **Read `skills/realistic-portraits/SKILL.md` before creating, selecting, or reviewing portraits.** It is the authority for portrait quality, facial identity design, generation prompting, and acceptance. This root file states the requirements; do not replace the detailed skill with a short generic prompt.
- **Reference first:** download and inspect real Unsplash portraits before generating corresponding AI portraits. Every AI portrait requires a reviewed real-photo capture reference. Preserve useful framing, head angle, expression type, camera perspective, and plausible lighting while creating a different individual. Never pretend a tool received a reference image if it did not.
- **Identity before styling:** prepare a concise blueprint of the new face's coherent structural traits before camera effects, beauty descriptors, or skin texture. Define underlying head/face shape, orbital structure, nose-to-midface relationship, mouth/cheek volume, jaw/chin, and age-related tissue only as relevant. Do not assemble a face from independent 'perfect' features.
- **Eye-region realism:** evaluate eyelids, eyeballs, eye sockets, brows, gaze, catchlights, and upper cheeks together. Reject the repeated outlined/oversized glossy-eye pattern and structural mismatches even when individual eyes look detailed. Do not reject a naturally unusual real feature merely because it is distinctive.
- **Expression coherence:** eyes, cheek volume, mouth corners, jaw, and brows must respond compatibly to the expression. A smile is not just a curved mouth. Neutral faces are valid; do not use one default slightly tilted friendly smile for every portrait.
- **Anti-same-face requirement:** before accepting new AI portraits, compare them with existing AI faces at similar scale while disregarding hair, clothing, makeup, lighting, and background. Reject repeated underlying face templates. Changing age labels, skin tone, hairstyle, or accessories is not sufficient individuality.
- **Texture is not a repair:** pores, wrinkles, blemishes, freckles, grain, blur, black-and-white, lens names, or exaggerated asymmetry cannot compensate for synthetic anatomy or an incoherent expression. Real photos may also be smooth, symmetrical, studio-lit, retouched, or conventionally attractive.
- **Physical and photographic consistency:** match face geometry to viewpoint, focus, light, skin tone, and surroundings. For visible bodies, check pose support, hands, contact shadows, furniture, and reflections. Reject faces that look composited or separately beauty-lit from the scene.
- **Honor rejected project examples:** inspect `skills/realistic-portraits/references/rejected-ai-face-20261017.jpg` when available, and treat `ai-collection-20261017-32` as a rejected negative example. Do not recycle their generic polished face template or treat good hands and plausible environment as proof of a convincing face.
- **Use `skills/realistic-portraits/references/photographic-effects.md` before an effects batch.** Include occasional black-and-white, restrained film looks, and subtle cinematic grading alongside ordinary color images. A coherent look may vary per photograph, but style distribution must not reveal the real/AI answer. Effects are never a repair for facial structure.
- **Honest provenance:** preserve downloaded real photos and credits; save all generated variants separately and label them AI. Never generatively modify a real quiz image while leaving it labeled real. Do not fabricate capture metadata or source information.
- Do not create or replace images, launch new generation batches, rebalance categories, or publish without the user's current authorization. A request to analyze or revise skills does not authorize producing new portraits.
- When authorized to generate images, provide exactly three **separate single-scene photographs** per image request, not a collage, grid, or multi-panel image. Use 4:5 portrait orientation by default where supported, with plausible variations of the same concept, unless the user expressly changes that output rule. Process accepted game assets separately to the quiz export limits.

## Image review and collection quality gates

Before accepting **every new AI portrait**, complete and briefly record these checks:

1. **Real-photo reference:** the source exists and was visually inspected; the generated portrait uses its photographic situation without copying the photographed person's identity.
2. **Gameplay-size face:** the person looks like a coherent, specific individual at actual on-screen size; no conspicuous default AI face, stylized eyes, frozen mouth/cheek expression, or independently polished face.
3. **Close face anatomy:** orbital, eyelid, brow, cheek, nose, mouth, jaw, age, and texture relationships remain plausible. Do not require visible defects for realism.
4. **Full photograph:** physical support, camera perspective, background geometry, focus, shadows, reflections, and processing share one capture logic.
5. **Batch comparison:** the underlying face is distinguishable from previously accepted AI subjects; appearance and capture style do not systematically differ from the real subset.
6. **Metadata and export:** permanent ID, bilingual category, honest real/AI label, credit, source note, file format, resolution, and compression are correct.

Reject a structurally synthetic face even if hands, outfit, environment, and skin detail are plausible. Explain the observed failure and prefer a targeted correction when authorized; otherwise leave the image unaccepted. Do not imply that these checks can prove an image was taken by a camera.

When reviewing game fairness, compare _matched_ real and AI portraits (similar crop, age range, lighting, makeup/retouching, resolution, and background). Distinguish a genuinely more convincing face from a batch that is merely harder because the images are blurred, darker, or processed. For experimental evaluation, use blinded balanced subsets and track both false identification of real photos and successful detection of AI photos; do not claim guarantees from a few samples.

## Development and delivery

- Use this repository root as the single project root. The deployable static site is in `public/`; tests are in `tests/`.
- `npm run dev` starts Vite at `http://127.0.0.1:5174/` with automatic browser reload when site files change. Keep the server running when the user asks for a preview.
- Keep the published site static and self-host fonts, scripts, styles, icons, and quiz images. The user-approved Umami script at `https://cloud.umami.is/script.js` is the analytics exception, using website ID `e334ba0d-1ec4-4ab7-b4c1-2c1f1477f33b` on every page. Do not add a framework or a production build without a concrete need.
- Keep localized Open Graph and Twitter metadata, 1200 × 630 sharing images, favicon/touch icons, canonical URLs, language alternates, `robots.txt`, and sitemap valid for GitHub Pages under `/realorai/`.
- Before every commit, including small text edits, run `npm run format:check` against the exact content being committed and fix failures before committing. Run `npm test` for relevant changes. Visually verify layout changes at phone and desktop sizes. Use `npm run format` when needed.
- Remove obsolete prototypes and duplicate output rather than maintaining several competing project directories.
- At the end of each task, remove unnecessary scripts and temporary helpers. Keep finished assets, application scripts, tests, and required development configuration; do not retain one-time asset-generation or migration scripts.
- Always remove confirmed dead code, unused translations and dependencies, and duplicate rules before finishing. Preserve compatibility code that still supports saved user data and work currently in use by another active chat.
- Keep the README concise: setup, checks, deployment, and credits. Do not add task logs, generation details, expansion narratives, or transient collection counts.
- Use clear, readable fonts in sharing images, with Vazir for Persian. Avoid fixed round lengths in promotional artwork so it remains valid when game length changes.
- Keep the site browser-only: do not add an installable-app manifest or offer installation prompts.
- Always use the configured proxy at `http://127.0.0.1:2080` for network downloads and Git operations.
- Publish through the existing GitHub Pages workflow when requested. The user requested a one-time history reset for this cleanup; do not reset or force-push history again without a new explicit request.
