---
name: generate-blog-covers
description: Generate and normalize blog cover image assets for this repository. Use when creating or replacing one or more blog cover images, producing OG cover artwork, exploring a cover direction, or batch-generating technical blog covers. This skill stops at inspected local WebP assets and does not upload files, edit frontmatter, validate site references, or build the site.
---

# Generate Blog Covers

Create article-specific covers that match this site's restrained engineering-publication identity. Use the installed `imagegen` skill as the image-generation engine and follow its built-in-tool workflow.

## Invariants

- Generate one distinct image per article. Never reuse a generic placeholder.
- Do not overwrite an existing local cover unless the user explicitly asks to replace it.
- Save the local accepted snapshot under `backups/cdn-images/covers/<slug>.webp`. This ignored directory is the source-of-truth backup for CDN cover assets.
- Produce `1200x630` WebP files. Use libwebp quality 78 and compression level 6; use quality 72 only when the result exceeds 200 KB.
- Stop after local generation, normalization, and visual inspection. Do not upload to a CDN, edit article frontmatter, audit site-wide cover references, or build the site.

## Visual Direction

Use a minimal engineering-publication style:

- light neutral-gray paper background;
- thin black or gray linework;
- engineering grids, flows, system boundaries, state diagrams, hand-drawn explanations, or flat editorial illustration;
- front-facing or orthographic flat 2D composition;
- one restrained accent color per cover;
- a complete focal structure near the center or slightly right of center so the homepage's right-side crop remains useful.

Choose a visual metaphor from the article's title, description, and core execution path. Prefer real relationships such as data flow, module ownership, algorithm paths, lifecycle states, or interaction transitions.

For personal writing, use flat hand-drawn editorial storytelling. For games or cultural subjects, use original line or pixel illustration without copying protected characters or scenes.

Reject all of the following:

- 3D or pseudo-3D rendering;
- isometric views, strong perspective, volumetric lighting, material rendering, or thick shadows;
- glossy devices, floating SaaS marketing objects, or irrelevant people;
- readable words, letters, numbers, code, UI copy, logos, or watermarks;
- random symbols that resemble generated text;
- compositions whose key structure is clipped at the edges.

## Prompt Template

Adapt this template for each article. Keep the topic-specific `Subject` concrete.

```text
Use case: stylized-concept
Asset type: technical blog OG cover
Primary request: Create a cover for an article about <article topic and actual execution path>.
Subject: <specific system relationship, algorithm, interaction, or editorial metaphor>
Style/medium: minimal engineering publication illustration; flat 2D orthographic line drawing on light neutral-gray paper; thin black-gray technical lines; subtle grid; one restrained <accent color> accent
Composition/framing: wide 1200:630 composition; complete focal structure centered or slightly right; generous safe margins; useful when cropped on the right side
Constraints: no readable text; no letters; no numbers; no code; no logo; no watermark; no people unless essential; original imagery
Avoid: 3D, pseudo-3D, isometric perspective, depth rendering, gradients that imply volume, thick shadows, photorealism, glossy objects, SaaS marketing illustration, random UI copy
```

Do not prompt only with broad phrases such as "technology illustration" or "tech style"; those commonly produce the rejected SaaS/3D look.

## Workflow

1. Read only the explicitly selected article's title, description, and enough body content to identify its real subject and execution path. Do not expand the task into a missing-cover audit or metadata cleanup.
2. For a batch or a new visual direction, generate 2-3 variants for one representative article first. Show the samples and wait for direction confirmation before expanding the batch.
3. Use one built-in `image_gen` request per article. Distinct articles require distinct prompts and distinct calls.
4. For a large confirmed batch, split non-overlapping article groups and run them in parallel. Each worker owns only its assigned image assets.
5. Inspect every raw result with `view_image`. Discard and regenerate any result with pseudo-3D, perspective, unexpected characters, bad cropping, weak topic relevance, or inconsistent style.
6. Normalize the accepted source image:

   ```bash
   bash .agents/skills/generate-blog-covers/scripts/process-cover.sh <source-image> <slug>
   ```

   Pass `--force` only when the user explicitly requested replacement:

   ```bash
   bash .agents/skills/generate-blog-covers/scripts/process-cover.sh <source-image> <slug> --force
   ```

7. Inspect the final WebP, not only the raw generated image. Cropping must preserve the focal structure.
8. For a batch, generate a contact sheet and inspect the set for style drift, repeated composition, unexpected text, and remaining 3D cues.
9. Return the generated local paths and stop. CDN upload, article frontmatter updates, reference checks, and site validation belong to the caller's separate workflow.

## Contact Sheet

Create a preview-only contact sheet after batch generation:

```bash
ffmpeg -hide_banner -loglevel error -y \
  -pattern_type glob -i 'backups/cdn-images/covers/*.webp' \
  -vf "scale=240:126:force_original_aspect_ratio=decrease,pad=240:126:(ow-iw)/2:(oh-ih)/2:color=white,tile=8x7:padding=4:margin=4:color=#e5e5e5" \
  -frames:v 1 /tmp/blog-covers-contact.webp
```

Adjust the tile dimensions when the number of images changes. Open the result with `view_image`.

## Completion Report

Report:

- the number of generated, replaced, and failed cover assets;
- the generated local paths;
- the prompt direction and that built-in `image_gen` was used;
- final dimensions, size range, and total size;
- whether per-image inspection and contact-sheet inspection passed;
- an explicit note that CDN upload, article metadata changes, reference checks, and the site build were not performed.
