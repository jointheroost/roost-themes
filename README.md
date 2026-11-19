# Roost themes

Themes for [Roost](https://github.com/jointheroost). They show in **Marketplace > Themes** on every Roost hub. A theme changes how Roost looks on the device where you pick it, and nothing else.

```
themes/<name>/theme.json   A theme
LICENSE, NOTICE            Apache 2.0, and the fonts that keep their own license
```

| Theme | Look | Variants | CSS | Shader |
|---|---|---|---|---|
| `tidepool` | Deep sea-green, slow rings behind the chat | Dark | No | Yes |
| `almanac` | Warm paper, black ink, square corners, hard shadows | Light | Yes | No |
| `phosphor` | Green terminal, one monospace face, scan lines | Dark | Yes | Yes |

## Add a theme to this repository

Open a pull request with a new folder under `themes/`. The folder name is the theme's `name`.

```
themes/<name>/
  theme.json        Required. Schema "roost-theme-1".
  preview.png       Required here. Also preview.jpg, preview.jpeg, or preview.webp.
  theme.css         Optional. Desktop and web only.
  background.frag   Optional. A shader for the chat background.
  assets/           Optional. Images and fonts that theme.css uses.
```

**theme.json.** `schema` is `"roost-theme-1"`. `name` uses lowercase letters, digits, and single dashes, at most 64 characters, the same as the folder. `title` is what the lists show. `variants` has `dark`, `light`, or both. Each variant can set three `base` colors (`canvas`, `text`, `accent`, as `#rrggbb`), and Roost works out the other colors from them. `tokens` sets public tokens by name, at the top for both variants or inside a variant. Raise `version` when the theme changes. The token list and the full format are in Roost's `docs/adr/0144-*.md` and `packages/protocol/src/theme.ts`.

A token value is one CSS value of at most 400 characters. It cannot contain `;`, `{`, `}`, `\`, `!`, `<`, `@`, `url(`, `image-set(`, a comment, a line break, or a quote or bracket that does not close. An unknown key at the top fails. An unknown token name is kept and ignored.

**Text contrast.** Text on `canvas` must be 4.5:1 or more in each variant. With a shader, text must also be 4.5:1 or more on the brightest part of the shader behind the chat.

**theme.css.** Plain CSS. Select with the `data-slot` attributes and the `--r-*` tokens. Class names change between Roost builds, so a theme that uses them will break. Themes from this repository are filtered: Roost removes these before it uses the CSS, and lists what it removed when someone adds the theme:

- `@import`, `@namespace`, `@property`, and every at-rule except `@media`, `@supports`, `@container`, `@layer`, `@keyframes`, `@font-face`, `@scope`, and `@starting-style`.
- Any `url()`, `src()`, or `image-set()` that points outside the theme's own `assets/` folder. A `data:` image or font under 64 KB is allowed. This applies everywhere, including custom properties, `var()` fallbacks, `@keyframes`, and `@font-face`.
- Any declaration the parser cannot read.

We merge a theme only if its CSS loses nothing to the filter.

**background.frag.** One pass in Shadertoy form: define `void mainImage(out vec4 fragColor, in vec2 fragCoord)`. Roost adds `#version 300 es`, the precision lines, the uniforms, and `main()`. The uniforms are `iResolution`, `iTime`, `iTimeDelta`, `iFrame`, `iMouse`, `iDate`, and `roostAccent` (the variant's accent, in linear sRGB). There are no `iChannel` inputs. Use GLSL ES 3.00 only: no `#version`, `#extension`, or `#line`, no `uniform` declarations, no `gl_FragColor` or `texture2D`. The shader shows only where the opacity tokens (`sidebar-opacity`, `panel-opacity`, `chat-opacity`) are under 1. Keep it dark or light enough for the text, and cheap. It runs at the display's frame rate.

**preview.** A screenshot of the chat screen with the theme on, 1440 x 900 pixels (16:10), at most 1 MB.

**Fonts and images** go in `assets/`. Include each font's license file next to it. Only fonts whose license allows bundling (for example the SIL Open Font License) are accepted.

**Limits.** At most 60 files and 20 MB per theme. No file over 16 MB. `theme.json` up to 64 KB, `theme.css` up to 256 KB, `background.frag` up to 64 KB, the preview up to 1 MB. Allowed types: `.json`, `.css`, `.frag`, `.png`, `.jpg`, `.jpeg`, `.webp`, `.gif`, `.avif`, `.svg`, `.woff2`, `.woff`, `.ttf`, `.otf`, `.md`, and `LICENSE`. File names are ASCII: letters, digits, `.`, `_`, `-`, and spaces, each part starting with a letter or digit. No links.

Someone reads every theme, its CSS, and its shader before it is merged. Roost never updates a theme by itself: a newer version shows **Update** with a list of what changed.

## License

Apache License 2.0. See `LICENSE` and `NOTICE`. Bundled fonts keep their own license.
