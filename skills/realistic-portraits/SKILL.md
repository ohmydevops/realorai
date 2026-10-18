---
name: realistic-portraits
description: Reference-first workflow to plan, generate, evaluate, and select believable photographic portraits for the Real or AI guessing game. Prioritize distinctive facial identity, coherent anatomy and expression, camera realism, honest provenance, and cross-collection anti-repetition checks.
---

# Realistic portrait photography

## Purpose, scope, and priority

This skill governs portrait research, prompting, generation, review, and selection for the Real or AI game. Its objective is **a believable photograph of a specific human being**, not an idealized, conventionally attractive face with photographic effects applied afterward.

**Current collection direction:** only **Cars** and **Portrait** are active subject categories. This skill covers portraits; it does not authorize generating other categories. New portraits must show a clear face, preferably head-and-shoulders or uncomplicated upper body against a white or neutral background. A plausible close-up or naturally supported seated portrait is also appropriate when requested. Keep real and AI photographs comparable in framing, background, pose, demographics, processing, and overall difficulty. Environmental and full-body examples below explain photography technique; they are not permission to expand the game's current categories or to prioritize crowd, feet, silhouette, or face-obscured images.

- User instructions and approved references determine the subject, expression, framing, attire, and look. Do not override a specific creative request with generic defaults.
- Preserve the current project preference to favor women when expanding the portrait set, but vary ages, actual facial anatomy, expressions, and photographic setups. For women, default to visible natural hair and no obvious makeup unless requested or justified by the reference; do not automatically add a head covering.
- Do not start an unrequested generation, download, replacement batch, publication, or collection rebalance. Respect a request to stop.
- Review this file **before** making portrait prompts or accepting new portraits. When selecting photographic effects, also read [Photographic effects and capture looks](references/photographic-effects.md).
- Visual plausibility never establishes authenticity. Generated assets remain labeled **AI**, even when they resemble an actual camera photograph. Verify **real** provenance from source records, not a visual guess. Never invent EXIF, photographers, locations, or documentary history.

## Core principle: identity before beauty, photography before effects

A credible face is a coherent three-dimensional individual. The skull, soft tissue, eyes, eyelids, nose, mouth, jaw, neck, expression, age, perspective, and illumination must all describe **the same person in the same moment**.

Do not treat realism as a checklist of visible pores, freckles, wrinkles, asymmetry, grain, or imperfections. Real people may be youthful, conventionally attractive, carefully groomed, symmetrical, made up, studio-lit, sharp, or retouched. Those properties are not evidence of AI. Conversely, adding defects to a generic model-like face rarely repairs its underlying identity.

The two most important failure modes are:

1. **Synthetic facial structure despite plausible details:** attractive or intricate eyes, lips, nose, and skin do not form one anatomically convincing face; the expression, lighting, or overall facial rendering feels assembled.
2. **Same-face convergence across a batch:** multiple AI portraits share the same orbital shape, eyelid pattern, nose-mouth relationship, cheeks, jaw, or default expression, even when their hair, clothing, skin tones, ages, or surroundings differ.

Either failure can justify rejection **without** obvious broken fingers, melted features, or other gross artifacts.

## Mandatory real-reference-first workflow

Do not generate a new AI portrait from text alone for this project. Every candidate must start with a **reviewed real photograph** selected for an appropriate photographic situation. The real photograph is a **capture and realism reference**, not an identity to duplicate.

1. **Find and inspect the real reference.** Download real Unsplash portraits first when expanding the collection. Inspect the actual pixels, not just search-result text or metadata. Record source URL, creator, original asset ID, and permitted usage/attribution. Do not treat all Unsplash images as a single visual style.
2. **Classify its capture situation.** Note framing, head angle, gaze direction, expression type, camera height and distance, lighting source, focus behavior, background complexity, image processing, and natural constraints. Notice how facial features work together; avoid extracting a supposed universal face template from one photograph.
3. **Check the intended real/AI match.** Use references comparable to the AI target in age range, presentation, background, lighting, crop, and capture style. Do not systematically allocate neutral-background DSLR headshots to AI and candid phones to real, or vice versa.
4. **Build a new facial identity blueprint.** Describe a _different individual_ with the anatomical decisions outlined below. Keep the useful capture characteristics from the reference while changing the person's identity and any requested clothing or environmental details. Do not intentionally recreate an identifiable reference person's face.
5. **Construct one coherent photographic prompt.** Lead with the individual and their facial structure, then expression, pose and setting, camera position, illumination, focus, and processing. Include only details that materially guide the output.
6. **Generate according to the tool's actual capabilities.** Supply the reviewed local reference image/path to the generation tool when the tool supports reference input. If reference input is unavailable, disclose that limitation; do not claim that a path or image was supplied when it was not. Do not silently bypass the reference requirement.
7. **Review, reject, or revise.** Apply the face-first, full-image, and collection-level checks below. A good reference does not guarantee a usable generated face. If review fails and no edit is requested or authorized, report the issue; do not automatically create more batches.
8. **Record provenance.** Keep the original real image unchanged and labeled real; save generated variations separately under permanent unique IDs with AI labels, generation credit, and a private reference/prompt record outside deployable image folders. Never generatively edit a real quiz photo while preserving its real label.

### Real-reference audit notes

For each reference, briefly record what is genuinely present, rather than assuming it has to be documentary, imperfect, or unretouched:

- What is distinctive about the person's **structural** facial anatomy?
- How are eyelids, brows, sockets, cheeks, and gaze related?
- What physical facial changes produce the expression?
- How do light, lens distance, and focus alter the appearance of features?
- What is specific to this photograph, and what should **not** be copied as a generic realism rule?

## Facial identity blueprint — mandatory before prompting

Design a plausible **individual** before adding skin texture, camera brands, an outfit, or flattering light. Use roughly **three to five** meaningful, mutually compatible anatomical descriptors, not a dense catalog of isolated traits. Details should describe relationships and volumes rather than a random pile of distinctive features.

Consider the following, using only what is relevant to the angle and crop:

- **Head silhouette and proportions:** rounder, longer, broader, narrower, or more angular craniofacial structure; forehead height; how the face changes from temples through cheekbones to chin.
- **Orbital architecture:** depth of the eye sockets, brow ridge and eyebrow placement, upper-lid fold, lower-lid contour, under-eye and upper-cheek transition, and the relationship between the two eyes.
- **Nose structure:** bridge height/width and profile, tip projection, nostril/alar shape, and transition from the brow to midface and upper lip.
- **Midface and mouth:** cheek volume, philtrum, upper/lower lip relationship, mouth width, corners, chin projection, and visible jaw tension appropriate to expression.
- **Jaw, chin, ears, and neck:** mandibular width and contour, soft tissue below the jaw, ear orientation where visible, and head-to-neck attachment.
- **Age and tissue distribution:** age is conveyed by changing facial volumes, lids, skin elasticity, nasolabial and neck regions as well as texture. Do not create an 'older person' by applying wrinkle marks to a youthful base face.

Make the traits anatomically compatible. For example, changes in orbital depth affect brow shadow, eyelid visibility, and cheek transition together; changes in cheek volume affect the under-eye region, nasolabial fold, and expression. Avoid precise arbitrary measurements and exaggerated combinations made solely to look unique.

### Identity brief example

> An adult woman in her early forties with a slightly broad upper face narrowing to a soft jaw, somewhat deep-set eyes with heavier upper lids, a low-to-medium nasal bridge with a rounded tip, and subtly uneven cheek volume. A calm, direct expression. No obvious makeup; ordinary uncovered hair. She should look like a particular person rather than a standardized fashion model.

This is a _pattern_ for writing identity briefs, not a reusable default face. Change the underlying anatomy in the next portrait. Do not keep repeating these same traits.

### Facial diversity without stereotypes

- Vary **actual morphology**, not just hair color, clothing, accessories, age labels, skin tones, or background.
- Avoid treating any ethnicity, nationality, gender presentation, age, complexion, or facial feature as intrinsically more or less real-looking. For Iranian or other Middle Eastern subjects, represent ordinary regional diversity rather than one stereotyped face.
- Neither beautify everyone toward the same facial proportions nor force scars, acne, freckles, prominent wrinkles, crooked teeth, or exaggerated asymmetry onto everyone.
- Preserve requested complexion and individual characteristics. Do not lighten skin or idealize bone structure automatically.
- A believable, smooth-skinned, symmetrical face can pass. An extremely textured face can fail.

## Periorbital anatomy: treat the eye region as one system

The region around the eyes is a high-priority check because the entire expression and facial identity can fail there even when the eyeballs themselves look detailed.

- Eyeballs occupy sockets; upper and lower lids wrap their visible curvature. The degree of iris exposure, sclera visibility, lid opening, and gaze should be mutually consistent.
- Brow ridge, eyebrow position, orbital depth, upper-lid fold, under-eye tissue, and cheek surface form a connected anatomical system. Their shadows and transitions should follow head shape and light.
- The eyes need a target: the lens, someone nearby, a page, or a plausible off-frame point. Both eyes must support a compatible viewing direction without requiring rigid mechanical symmetry.
- Avoid recurring oversized bright irises, uniformly exposed whites, cosmetically outlined eyes, identical almond-shaped openings, thick symmetric lash fans, eyebrow shapes copied from beauty illustrations, and an unblinking glossy stare.
- Catchlights should correspond to real or implied light sources; they need not be identical across both eyes. Do not add decorative white dots as a shortcut to life.
- Natural asymmetry has reasons: head rotation, expression, anatomy, or light. Do **not** generate random differences just to make the face imperfect.
- Eyeglasses must sit correctly at nose and ears, obey perspective, and reflect the environment plausibly. Lenses may obscure eyes; do not force them to be perfectly transparent.

**Reject when:** the eye region resembles a highly polished illustration or repeated AI archetype, even if it contains anatomically recognizable eyes and plausible skin texture. First inspect whether this impression is a repeated pattern across outputs rather than an unusual but real human feature.

## Expression biomechanics: the whole face participates

Choose an expression appropriate to the moment and describe what it does **physically**. Avoid making the subject perform 'natural candidness' as a staged aesthetic.

- A genuine smile can lift and reshape the cheeks, change lower-lid contour, create compression near the corners of the eyes, and alter mouth corners and nasolabial folds. These effects vary between people and smile intensities.
- A squint involves eyelids and surrounding muscles and should fit the visible light or expression.
- Concentration, concern, amusement, or rest changes brows, gaze, lips, jaw tension, and/or cheek shape in compatible ways. Do not demand all changes at once.
- A neutral resting face is valid; it need not be smiling, frowning, intentionally awkward, or 'interesting'.
- Visible teeth, gums, tongue, lips, and jaw must occupy plausible positions. Teeth do not need perfectly distinct edges or perfect alignment.
- Avoid defaulting every image to a slight head tilt, close-lipped friendly smile, directly centered gaze, lifted cheeks, and a perfectly relaxed jaw. Avoid a changed mouth pasted onto an otherwise frozen face.

Expressions should be modest when the scene calls for modesty, stronger when the real reference and requested situation support them. Do not add facial asymmetry or exaggerated strain as decoration.

## Skin is a consequence of anatomy, light, and capture

- Preserve appropriate local variation in skin tone, sheen, pores, fine facial hair, lip texture, and under-eye texture. The eyelids, cheeks, forehead, lips, and nose should not share one repeated texture stamp.
- Skin folds follow anatomy and expression; do not distribute 'realism wrinkles' evenly.
- Highlights and subsurface color should match actual lighting, skin curvature, exposure, and camera processing. Avoid plastic smoothing, oily metallic sheen, painted highlights, or uniformly sharpened pores.
- Skin detail must exist at the **resolution the camera and focus would permit**. At gameplay size, genuinely real skin may look smooth.
- Do not fix a synthetic face by adding freckles, scars, fine lines, pores, grain, blur, dark under-eyes, facial hair, or fake film damage.
- Makeup, well-groomed skin, professional lighting, and retouching exist in genuine photography. The issue is inconsistency, not cleanliness or attractiveness by itself.

## Pose, support, and physical interactions

For tight portraits, concentrate on convincing head/neck connection, shoulder level, torso orientation, and any visible hands. An ordinary posed headshot can be fully credible; do not invent an activity just to claim candidness.

When more of the body is visible:

- **Standing:** center of mass and foot-ground contact agree; hips and shoulders respond naturally to weight shift.
- **Sitting:** pelvis is supported, torso and neck respond to the seat, and legs fit the furniture.
- **Leaning:** an arm, shoulder, hand, or back actually contacts a suitable supporting surface.
- **Walking:** leg phase, arm swing, weight transfer, and ground contact describe one moment.
- **Holding objects:** the grip follows size, orientation, weight, occlusion, and contact pressure; shadows and clothing respond appropriately.

Do not use twisted wrists, floating hands, impossible arches, detached elbows, or furniture intersections. Inspect all visible fingers and attachments without demanding every hidden finger appear. Avoid routinely cropping away hands solely to conceal generation problems.

If full-body photographs are explicitly requested, keep both feet and the entire head comfortably inside the frame, with space above and below. Do not crop toes, heels, ankles, or important hand interactions.

## Camera geometry, framing, and scene

Start with a real physical camera position, distance, and orientation. Lens names are secondary descriptions, not a substitute for geometry.

- For a DSLR head-and-shoulders photograph, a normal-to-short-telephoto framing (roughly 50–85 mm full-frame equivalent) from a comfortable distance often produces moderate, believable face perspective; it is not mandatory.
- For environmental portraits, roughly 35–50 mm equivalent from farther away can preserve context.
- For rear-camera phone portraits, allow ordinary wide field of view and substantial background detail. For a selfie, nearer features can appear larger and the arm/camera angle must fit.
- Keep the face, neck, ears, shoulders, hands, glasses, background lines, reflections, and visible surfaces consistent with the same viewpoint.
- Depth of field comes from distance and optics. A turned head may have a slightly softer farther eye; background blur must change with scene depth, not wrap a person like a cutout.
- Slightly imperfect framing is acceptable; forced crooked angles, warped architecture, and fake blur are not inherently more documentary.

### Environments

For current portrait collection work, start with a simple white, gray, muted wall, or similarly neutral setting when it suits the selected real reference. This **does not** imply beauty-campaign lighting or a uniformly synthetic backdrop. Environmental alternatives may include an ordinary room, cafe, library, sidewalk, bus shelter, courtyard, market, or workshop when requested or matched with real examples.

Every visible place needs coherent scale, materials, furnishings, walkable space, lighting, and contact surfaces. Use incidental wear sparingly and with a reason; do not place decorative clutter in every empty area. If a named real location is required, verify architectural and local details rather than inventing them and claiming accuracy. An AI depiction of that location remains an AI depiction.

## Light, exposure, and integration

Choose a physically plausible source such as an overcast sky, open shade, side window, ordinary interior practicals, direct sun, or an intentionally arranged studio light **when the reference is genuinely studio-lit**.

- Facial shadows should reflect orbital depth, nose projection, cheek form, jaw, and source direction. The same source should explain shoulders, hair, glasses, clothing, and background.
- Reflectance, white balance, contrast, and edge sharpness should feel captured through one optical and processing system.
- Mixed lighting can be real, but do not routinely combine a cool bright face, amber glowing background, sculpted cheekbones, and perfect eye catchlights as a generic 'cinematic' portrait formula.
- Default exposure is normal and readable; avoid crushed black areas, universal shadow lifting, and blown skin highlights unless the reference or request supports them.
- Natural shadows may be deep or hard. Soft, flat, and shadowless lighting is **not** a universal realism requirement.

**Face–scene consistency test:** would a camera in this position and light capture the face and nearby objects with these relative tones, focus, sharpness, and color? Reject obvious compositing, separately polished facial lighting, and a face with a different rendering system from its surroundings.

## Real DSLR, phone, film, and processed looks

- DSLR: plausible subject separation, eye-area focus where appropriate, natural lens softness toward an unfocused plane, restrained sharpening. Avoid automatic extremely creamy bokeh.
- Phone rear camera: ordinary handheld perspective, potentially deep focus, normal computational exposure, and no automatic portrait-mode mask. If portrait blur is used, check hair, glasses, arm gaps, and furniture edges.
- Film-inspired: coherent contrast, tonality, subtle grain or color response **only when desired**; film character cannot correct an incoherent face.
- Black-and-white, direct flash, hard sunlight, sharp modern color, and ordinary studio portraiture can all be real photographic looks. Avoid defining 'real' as consistently soft, faded, grainy, documentary, or dim.
- Read [Photographic effects and capture looks](references/photographic-effects.md) before effects batches. Use one primary treatment per image and distribute equivalent looks across real and AI items.

## Prompt construction — identity-led

Before prompting, produce a short **reference + identity + capture** plan. The plan is an internal working note, not text that must appear in the generated photo.

```text
REAL REFERENCE
- Source/ID: [verified real photograph]
- Keep: framing, head angle, expression type, camera perspective, plausible light and capture style
- Change: facial identity; other requested subject, clothing, or scene details

FACIAL IDENTITY
- Age range / presentation: [only what matters]
- Anatomy: [3–5 compatible structural traits with relationships, not a beauty checklist]
- Eye region: [orbital depth, lid behavior, brows, gaze]
- Expression: [emotion + coherent cheek/lid/mouth/jaw changes]
- Anti-repeat: [which facial template in previous AI outputs this avoids]

PHOTOGRAPH
- Subject/pose and any physical support: [...]
- Background: [...]
- Camera position, distance, angle and crop: [...]
- Light and exposure: [...]
- Focus and image processing: [...]
- Constraints: [only relevant failure modes; preserve requested identity and scene]
```

Then write **one concise natural-language image prompt** prioritizing positive, coherent relationships. Do not dump this entire skill into the image prompt. Terms like `masterpiece`, `hyperrealistic`, `8K`, `perfect anatomy`, camera brand names, and long generic negative lists do not compensate for missing structural decisions.

### Example A: simple neutral-background portrait

```text
Using the reviewed real head-and-shoulders photograph as the framing and lighting reference, make a photograph of a different adult woman in her late thirties. Give her an individual head structure: a fairly broad forehead tapering toward a compact jaw, a modestly projecting nose with a rounded tip, slightly deep-set eyes with gently heavier upper lids, and full mid-cheeks that change the transition under the eyes. These features belong to the same face rather than separate idealized features. She has an attentive but neutral resting expression, with relaxed lips and a natural gaze a little beside the lens. Uncovered everyday hair, no obvious makeup, simple cotton shirt. Plain off-white wall with a small normal tonal variation. Camera near eye level from a comfortable portrait distance, modest head turn, normal-to-short-telephoto perspective, ordinary soft daylight from one side with a little room fill. Skin, eyes, hair, and wall obey the same light and focus. Balanced exposure and restrained camera processing, with no added beauty retouching or cinematic glow.
```

Do **not** repeat this sample face as the next subject. Write a different blueprint and use a different reviewed reference.

### Example B: everyday phone portrait

```text
Use the reviewed real phone photograph for camera distance, casual composition, and expression type, but portray a different adult man in his fifties. His face is somewhat long with a narrow lower jaw, a prominent but natural nasal bridge, moderate upper-lid hooding, and cheek volume consistent with his age. He is listening to someone just left of the phone, with a slight change in brow and eyelids and a relaxed mouth rather than a posed smile. Seated on an ordinary chair beside a window, torso and neck naturally supported, one shoulder a little forward. Rear phone camera at conversational distance and seated eye level, recognizable room behind him, balanced daylight and modest indoor fill. No artificial eye outlining, detached facial sharpness, beauty-filter skin, simulated film dirt, or extreme background blur.
```

### Example C: wider portrait with physical contact

```text
A realistic photograph based on the reviewed real outdoor portrait's angle and ordinary daylight, featuring a new adult person with a distinct facial identity and coherent eye-region anatomy. The person rests a forearm on a low railing beside a public path, body weight comfortably supported, gaze toward a companion off-frame, mouth and cheeks in a brief natural half-smile. Upper body visible with hands inside the frame. Camera at standing eye level a few steps away, normal field of view. Rail and path recede consistently. Natural daylight and visible contact shadows; realistic local skin texture, fabric folds, and lens focus without theatrical lighting or excessive processing.
```

## Mandatory review — six passes

A candidate is **not** accepted merely because it avoids gross anatomical errors. Examine actual image pixels at both gameplay size and a larger face view. Do not pretend visual detection is certain; use observed flaws and compare with real references of similar style.

### Pass 1 — reference and identity

- Can you identify the reviewed real capture reference and explain which photographic properties were retained?
- Is the generated person meaningfully different from that real person's identity?
- Does the result preserve its own head structure across forehead, orbits, midface, jaw, and neck?
- Are multiple individual features in agreement, rather than isolated attractive parts?

### Pass 2 — gameplay-size face

- Does the face feel like one particular human at the size players actually see?
- Are gaze and expression coherent immediately, without depending on pores or close-up detail?
- Is there a conspicuous generic AI face, frozen gaze, cosmetic eye outline, smile template, or implausible overall face rendering?
- Compare against an **actual real photo of matching style**, not an assumption that real photos must be grittier.

### Pass 3 — close face anatomy

- Check upper and lower eyelids, sclera, orbital depth, brow/eye/cheek transitions, nose nostrils and profile, mouth corners, teeth if visible, jaw/ear/neck attachments.
- Check whether smiling, squinting, or speaking causes consistent muscular and tissue changes.
- Check skin texture, hairline, facial hair, glasses, and local light without equating smoothness, makeup, or attractiveness with AI.
- Reject meaningful structural contradictions or conspicuous plastic/illustrated appearance. Do not overreact to a tiny unresolved pixel that cannot be perceived at gameplay size.

### Pass 4 — full-photograph coherence

- Verify body support, hand/object contact, camera viewpoint, environment geometry, exposure, color, shadows, reflections, focus, and depth of field.
- Ensure the face does not appear independently retouched, lit, sharpened, softened, or pasted onto the scene.
- Do not use film grain, blur, black-and-white, or cinematic grading to disguise failures in the original face.

### Pass 5 — batch and collection-level identity check

- Compare new AI faces side by side with recently accepted AI portraits **at similar face scale**, mentally discounting hair, makeup, clothes, background, and color grading.
- Look for repeated orbital shape, eyebrow–eyelid pairing, nose-to-mouth geometry, cheek contours, jaw shape, expression, and the same 'ideal portrait' template.
- Reject near-identical **underlying facial designs** even if the subjects have different gender labels, ages, hair, lighting, or apparent backgrounds. This is an editorial visual check, not a claim of biometric identity matching.
- Also check that AI portraits do not share a uniquely consistent style not present in the real subset. Match real and AI distributions rather than forcing all AI photos to look unpolished.

### Pass 6 — provenance and delivery

- Confirm truthful source credit and real/AI label, permanent unique ID, appropriate category, and correct game export rules.
- Check target size and compression for both real and AI images using the same policy: JPEG, longest edge at most 1000 px, file at most 140 KiB, preserved aspect ratio. Avoid answer clues through systematic file size or processing differences; do not pad or delay files artificially.
- Keep prompts/references outside deployable image folders and generation disclosures on the intended Sources flow, not overlaid on quiz images.

### Reject/repair table

| Area               | Accept when                                                                | Repair or reject when                                                              |
| ------------------ | -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Facial identity    | Facial proportions create a coherent, specific person                      | Generic beauty-template face or features inconsistent with the same skull          |
| Periorbital system | Eyes, lids, sockets, brows, gaze, cheeks, and light agree                  | Stylized or repeated eye shape, pasted-on outline, incompatible lid/gaze anatomy   |
| Expression         | Mouth, cheeks, eyelids, brows, and jaw support one moment                  | Frozen eye region with animated mouth, compressed corners, repeated posed smile    |
| Age and tissue     | Facial volume, soft tissue, texture, and neck agree                        | Youthful base face with decorative age lines or implausible tissue transitions     |
| Skin and hair      | Local detail follows anatomy, optics, and illumination                     | Texture stamps, plastic retouch, fabricated blemishes, fused hair edges            |
| Scene and pose     | Support, object contact, hands, and setting are coherent                   | Floating contact, impossible grip, warped furniture or geometry                    |
| Camera and light   | Perspective, focus, white balance, shadows, and processing belong together | Composite-looking face, cutout blur, implausible catchlights or beauty spotlight   |
| Batch diversity    | Real anatomical differences between generated individuals                  | Same underlying face with superficial changes                                      |
| Real/AI matching   | Comparable capture styles across labels                                    | Consistent label clues from backgrounds, crops, sharpness, effects, or compression |
| Provenance         | Source, credits, IDs, and labels are accurate                              | Visual guesses used as provenance or fabricated photo history                      |

A candidate with a **fundamental facial-identity, eye-region, expression, or face–scene failure does not pass** simply because its background, hands, and skin texture are good. Correct the cause, not the cosmetic symptom. If a targeted edit is appropriate, preserve all unrelated image content. When repeated revisions still fail, reject the candidate and state the limitation. Do not generate new batches without authorization.

## Project-specific negative anchors

Before evaluating new AI faces, inspect [the user-rejected AI face](references/rejected-ai-face-20261017.jpg), if that asset is available. It is a **negative** visual reference only: an overly polished generic face with conspicuous eye/brow styling, sculpted facial shading, and decorative skin detail that fails to make the underlying person convincing. Do not reuse it as a positive identity, style, or prompt template.

The user also rejected `ai-collection-20261017-32`: its otherwise plausible cafe pose and setting did not rescue its synthetic-looking face, expression, and illumination. These are project-specific examples of why **face-first review is stricter than detecting technical breakage**. They do not establish that particular traits in real human faces are inherently artificial.

## Blind validation and iterative improvement

If the user asks to assess whether the revised skill works, compare an authorized test batch made with the old skill against one made with the new skill.

- Use matched reference photographs, subject distributions, framing, resolution, and generation budgets.
- Include real photographs with comparable crop, makeup, lighting, skin treatment, and background. Do not let Unsplash-versus-AI source style supply the answer.
- In a balanced blind evaluation set, present images at the **actual game display size** before allowing optional close inspection. Ask observers for real/AI judgments and, optionally, confidence and a short reason.
- Measure accuracy and obvious recurring cues by style and subject category; inspect both false positives on real photos and correct AI detections. A small sample is preliminary, not proof of indistinguishability.
- Change **one principal strategy at a time** when testing. Track whether identity diversity and facial coherence improve instead of merely adding more texture or filters.
- Do not claim that prompts guarantee photorealism or that a single successful portrait validates a whole batch.

## Integration into Real or AI

- Permanent image IDs and existing player history must be preserved. Retired images can remain for history without re-entering new games.
- Follow the project limits, category ordering, active-image targets, local storage, and credits rules in `AGENTS.md`.
- Real and AI source classes must not be distinguishable because of a systematic image-processing or composition difference.
- Keep original real reference files and generated AI variations separate; do not relabel a generatively modified photograph as real.
- Review diversity in ages, faces, orbital geometry, expressions, capture styles, framing, backgrounds, and lighting across the whole collection.
- Do not confuse **looking photographic** with **having camera provenance**.

**Acceptance standard:** the image should convey an anatomically consistent, specific person in a credible photographic situation, and the collection should not reveal AI origin through recurring facial templates or label-specific photographic styles. Identity, expression, camera consistency, and honest provenance come before effects or cosmetic detail.
