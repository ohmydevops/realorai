# Photographic effects and capture looks

Use this reference before making a portrait or car-image batch involving black-and-white, film-inspired color, flash, unusual light, or deliberate grading. It complements [Realistic portrait photography](../SKILL.md). It is **not** a substitute for that skill's facial identity, eye-region, expression, camera, and source-provenance checks.

## Governing principle: photograph first, effects second

Photographic realism is not the same as a low-contrast, grainy, faded, or poorly framed image. Real photographs can be pristine, sharp, softly lit, strongly lit, professionally retouched, or highly stylized. AI photographs can imitate a film preset while still having a synthetic face.

Effects may help tell the photographic story, but they must **never** be used to hide unconvincing anatomy, repeating AI faces, incoherent illumination, or incorrect camera geometry.

### Mandatory selection rules

- Choose **one primary capture/rendering look** per image. Optionally add one subtle, compatible secondary treatment, rather than stacking presets.
- Retain plenty of ordinary color images. Use monochrome, film-style, flash, contrast, and restrained cinematic treatments across **both real and AI subsets**; otherwise the style itself becomes a guessing-game clue.
- Evaluate the **unadorned facial structure** and expression before deciding to add grain, softness, monochrome, diffusion, or grading. Do not approve a face simply because an effect makes defects less noticeable.
- Distinguish effects of **capture** (camera viewpoint, exposure, focus, flash, shutter movement, optical flare) from **post-processing** (color response, print tones, contrast adjustments). Grading cannot invent a physically plausible capture setup.
- Preserve relationships across face, hair, clothes, background, reflections, and shadows. The face must not be rendered with a different contrast, texture, color science, or sharpness from objects on the same focal plane.
- For real photographs, select an existing look or apply only appropriate conventional photographic adjustments. Preserve credits and provenance; do not generatively change a real quiz photograph while keeping a real label. Log any material conventional adjustments where needed.
- Do not apply randomized filters at game runtime. Save each asset's final selected version under its permanent image ID.
- Do not make camera brand, film stock, lens model, or fictional metadata an authenticity claim.

## Face-specific checks that no effect may bypass

1. **Identity:** the face is a specific, anatomically consistent individual, not a standardized attractive facial template.
2. **Eyes:** sockets, brows, eyelids, visible eyeballs, catchlights, gaze, and cheeks agree; darkness or monochrome does not excuse mismatched eye geometry.
3. **Expression:** mouth, cheeks, eyes, brow, and jaw act together; a blurred or shadowed mouth does not excuse a frozen expression.
4. **Age:** facial volume and tissue transitions make sense; grain and wrinkle-like texture do not create age anatomy.
5. **Face–scene integration:** camera focus, lighting, shadows, exposure, color, and processing agree across the whole frame.
6. **Batch variety:** different subjects have genuinely different facial construction, not one repeated face disguised by presets.

If any of these fundamentally fails, **reject or make a targeted structural revision** before choosing effects. Do not stack blur, grain, sepia, or hard contrast to cover the failure.

## Monochrome and tonal treatments

| Look                      | How to request or apply it                                          | Check before accepting                                                   |
| ------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Neutral black-and-white   | Balanced grayscale with natural midtones                            | Face and surroundings remain separated; no mandatory crushed blacks      |
| Soft monochrome           | Mild contrast and smooth but visible tonal transitions              | Skin and eyelid structure remain legible, not airbrushed                 |
| Contrast-rich monochrome  | Stronger separation for compatible sunlight, flash, or street light | Shadows follow the source and do not obscure essential anatomy           |
| Documentary monochrome    | Observed ordinary framing with restrained grayscale                 | Looks like a plausible captured event, not a cinematic poster            |
| Warm monochrome           | Subtle warm print tone                                              | Toning is consistent, without patches that look like restored skin color |
| Cool monochrome           | Subtle cool print tone                                              | Neutral surfaces and skin render coherently throughout the frame         |
| Sepia print               | Intentionally brown-toned monochrome                                | An aesthetic, never proof of archival age or camera origin               |
| Selenium-like tone        | Small cool-purple bias in darker print values                       | Avoid overt purple coloration of facial tissues                          |
| Matte black point         | Slightly raised shadow floor with preserved midtones                | Do not cover the image in a uniform gray veil                            |
| Deep black point          | Deeper shadows when the capture has strong contrast                 | Do not hide mismatched eyes, hands, or background geometry               |
| Gentle highlight roll-off | Soft transition near bright values                                  | Do not invent recovered information inside fully clipped source areas    |
| High-key photograph       | Naturally bright background and balanced subject light              | Retain face structure; avoid simply overexposing the skin                |
| Low-key photograph        | Darker environment with a real motivated light source               | Face remains credible and independently visible enough for the game      |

## Color and film-inspired looks

| Look                          | How to request or apply it                               | Check before accepting                                               |
| ----------------------------- | -------------------------------------------------------- | -------------------------------------------------------------------- |
| Restrained natural color      | Familiar camera-like color, moderate saturation          | Default for a substantial share of the collection                    |
| Neutral modern camera color   | Clean, relatively sharp, believable white balance        | Do not reject a realistic photo simply because it is clean           |
| Muted documentary color       | Mildly reduced saturation with normal local contrast     | Skin retains lifelike tonal and chromatic variation                  |
| Warm daylight balance         | Moderate warmth consistent with the sun or white balance | No automatic orange complexion or fake golden hour                   |
| Cool daylight balance         | Slightly cooler shade, winter, or overcast rendition     | Preserve credible skin and neutral environmental objects             |
| Faded consumer print          | Gently opened blacks and modestly subdued color          | No obligatory scratches, dust, date stamp, or fake damage            |
| Consumer color negative       | Ordinary family-photo color, moderate contrast           | Avoid advertising-grade polishing as an automatic effect             |
| Fine-grain negative           | Subtle luminance grain matching image resolution         | No repetitive noise pattern or pore-like grain stamps                |
| Higher-speed film impression  | Somewhat stronger noise/grain for appropriate light      | Do not turn skin into sandpaper or erase facial structure            |
| Slide-film contrast           | Crisper color separation in compatible lighting          | No clipped faces, neon plants, or oversaturated irises               |
| Instant-print impression      | Soft contrast and modestly shifted colors                | No fake white border or provenance implication required              |
| Warm highlights, cool shadows | Very mild split toning supported by existing light       | No universal amber-background/cool-face beauty template              |
| Cool highlights, warm shadows | Alternative restrained two-tone balance                  | Consistent skin and neutral-object relationships                     |
| Earth-toned palette           | Restrained high saturation while retaining earth hues    | Do not flatten skin or recolor unrelated surfaces independently      |
| Pastel rendering              | Gentle tones in naturally bright scenes                  | Avoid porcelain faces or washed-out highlights                       |
| Restrained cinematic grade    | Scene-wide subtle color/contrast shaping                 | No glowing eyes, exaggerated teal/orange, or cosmetic face sculpting |
| Bleach-bypass impression      | Mild desaturation and increased tonal contrast           | Use rarely; keep skin and shadow detail coherent                     |
| Cross-processing impression   | Deliberately shifted but coherent color                  | Use as a clear aesthetic exception, not a false natural look         |
| Duotone print                 | Two print colors applied consistently                    | Deliberate rarity; never presented as an untouched photo             |

## Light and optical character

| Look                     | Plausible setup                                             | Check before accepting                                                            |
| ------------------------ | ----------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Overcast softness        | Large diffuse sky outdoors                                  | Soft directional shape remains; facial volume is not erased                       |
| Side window portrait     | Existing window, appropriate room surfaces                  | Eye-socket and nose shadows agree with window direction                           |
| Open shade               | Ambient sky and surrounding bounced light                   | No invisible editorial beauty fill or inexplicable rim                            |
| Hard midday sun          | High direct sun with strong shape-defining shadows          | Eye squint, skin highlights, and nose shadows agree                               |
| Ordinary studio portrait | One or more specified, physically compatible studio sources | Studio light is allowed when matched by real references, not used automatically   |
| Golden-hour light        | Low sun, longer shadows                                     | Occasional; avoid making every AI subject sunset-lit                              |
| Blue-hour ambient light  | Dim cooler light at twilight                                | Sensible exposure and noise; face still readable if needed                        |
| Backlighting             | Light source behind with limited reflected fill             | No uniform glowing outline tracing every hair and shoulder                        |
| Rain/overcast exterior   | Wet surfaces, diffuse sky, compatible reflections           | Water and reflections have plausible perspective and material response            |
| Direct phone flash       | Near-lens source in a dim ordinary scene                    | Plausible light falloff, skin shine, and background darkness                      |
| Bounced flash            | Light redirected by a nearby physical wall or ceiling       | Compatible shadow direction and finite fill range                                 |
| Tungsten interior        | Warm practical sources at plausible positions               | No compulsorily orange complexion or hyper-clean shadow fill                      |
| Mixed practical light    | Windows, bulbs, street/shop sources together                | Color mixture remains modest and consistent across face and room                  |
| Silhouette               | Background brighter than a genuinely underexposed subject   | Only when explicitly suitable; current portraits generally require a visible face |
| Mild optical flare       | Strong source in or near frame                              | Direction follows source; no free-floating halos                                  |
| Mild halation            | Small bright-edge glow appropriate to print/film treatment  | No face-wide radiance or indiscriminate edge bloom                                |
| Subtle vignette          | Believable lens/print falloff                               | Do not spotlight the face or hide flawed corners                                  |
| Gentle optical diffusion | Slight highlight-edge softness while keeping structure      | Not skin smoothing; eyelids, nostrils, and lips remain defined                    |

## Focus, exposure, and motion

| Look                            | Plausible setup                                              | Check before accepting                                              |
| ------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------- |
| Moderate shallow depth of field | Subject closer than background, suitable optics and distance | Blur changes with depth, including behind strands or arm gaps       |
| Deep environmental focus        | Phone main camera or stopped-down setup                      | Background can remain recognizable without universal oversharpening |
| Selective foreground softness   | A near object outside the focus plane                        | Blur has a physically present foreground cause                      |
| Panning                         | Camera tracks a moving subject                               | Motion directions are coherent between subject and background       |
| Subject motion blur             | Subject moves during exposure                                | Stationary scene remains relatively steady; no duplicate anatomy    |
| Slight handheld softness        | Ordinary low-light or movement circumstance                  | Not a method of disguising eye or mouth inconsistencies             |
| Long-exposure water             | Stationary camera and moving water                           | Water and static rocks retain coherent relationships                |
| Long-exposure light trails      | Fixed camera and illuminated moving vehicles                 | Trails follow road direction and viewpoint                          |
| Rain on glass                   | Actual foreground pane with droplets                         | Droplet focus and the scene beyond have plausible depth separation  |
| Reflection composition          | Actual mirror, glass, car panel, or water surface            | Reflected face/objects agree with camera and source light           |

## Effects requiring deliberate approval

Strong infrared-style false color, solarization, posterization, aggressive selective color, double exposures, extreme fisheye distortion, tilt-shift miniature simulation, strong light leaks, very heavy vintage damage, and distressed borders are possible creative choices but **not defaults** for this game's real-photo comparison set. Use them only when requested or for an explicitly approved experimental subset. They never authorize bad face geometry or misleading provenance.

## Batch selection and style-matching procedure

Before generating or selecting assets:

1. List the category (Portrait or Cars), verified source/reference, subject, framing, capture method, lighting, and primary look.
2. Choose a real-photo comparison set that contains a comparable distribution of look, crop, facial visibility, subject type, and processing for the intended AI examples.
3. For each AI face, run the parent skill's identity-led prompt and acceptance passes **before** any optional effect. For cars, focus on coherent physical geometry, reflection, perspective, and rendering.
4. Once accepted, apply or select a restrained effect only if it serves the desired photographic look.
5. Check that the effect does not systematically distinguish real from AI in the game, especially in aggregate.
6. Use the same export size and compression rules for both labels. Do not assume JPEG artifacts, grain, or poor resolution make an image real.
7. Keep the chosen final look stable; log material edits and preserve source and generation credits.

### Compact style brief

```text
Source/reference: [verified source or approved real reference]
Category and subject: [Portrait or Cars; short factual description]
Capture situation: [camera position, distance, light, focus, physical scene]
Primary look: [one look from this file]
Optional secondary treatment: [only when physically or editorially justified]
Identity/geometry gate: [portrait anatomy and expression, or car geometry]
Matching real-photo look: [how it compares with real examples]
Provenance: [real source credit or AI generator credit; no fabricated EXIF]
```

## Examples for current collection

**Neutral black-and-white portrait:** A different adult person photographed from the same plausible distance and head angle as a reviewed real monochrome headshot. Distinct orbital anatomy and coherent expression, ordinary background, readable gray midtones, no exaggerated iris shine, beauty rim light, deliberate wrinkles, or strong fake grain.

**Direct-flash everyday portrait:** An adult in an ordinary room, physically plausible direct near-camera flash, subtle shadows behind the subject, face shape and eyes consistent with the flash. Do not smooth the cheeks independently of the rest of the photograph or introduce implausible catchlights.

**Natural-color car photograph:** A car photographed in a believable parking area under overcast daylight, realistic wheel, glass, and body-panel geometry, consistent reflections, clean modern camera color. No requirement to make it grainy or cinematic.

**Restrained film-inspired car photograph:** A car on a plausible street photographed from sidewalk height; gentle consumer-negative warmth and very subtle texture applied across the entire frame. Retain coherent reflections, perspective, shadows, and source label.

**Final rule:** an effect is successful when it is believable for the capture and does not make the real/AI label easier to guess. It cannot turn a structurally unconvincing face into a convincing human.
