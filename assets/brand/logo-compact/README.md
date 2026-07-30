# Vocryn Ai — the logo

The mark with **VOCRYN Ai** directly beneath, cropped tight to the ink. No tagline,
no padding, nothing to trim before you use it.

Regenerate with `node build/logo.js`.

> The per-platform social assets in `../social/` and `../lockup/` are a separate
> set and are deliberately not touched by this generator.

## Files

| File | Size | Use |
|---|---|---|
| `vocryn-ai-logo-1600.png` | 1600×1127 | Master. Dark wordmark, transparent. |
| `vocryn-ai-logo-800.png` | 800×563 | Everyday use |
| `vocryn-ai-logo-400.png` | 400×282 | Small / web |
| `vocryn-ai-logo-white-1600.png` | 1600×1127 | **For dark backgrounds.** White wordmark, transparent. |
| `vocryn-ai-logo-white-800.png` | 800×563 | Same, smaller |
| `vocryn-ai-logo-horizontal-1200.png` | 2490×580 | Mark beside the words — email signatures, letterheads, anywhere height is tight |
| `vocryn-ai-logo-light-1200.png` | 1488×1085 | White rounded panel, for placing on photos |
| `vocryn-ai-logo-dark-1200.png` | 1488×1085 | Navy panel |
| `vocryn-ai-logo-brand-1200.png` | 1488×1085 | Gradient panel |

**Default to `vocryn-ai-logo-800.png`** on light backgrounds and
`vocryn-ai-logo-white-800.png` on dark. Both are transparent, so they sit on
anything.

## How it is built

The wordmark is scaled so its width matches the mark's exactly — that is why the
files come out at round widths like 800 and 1600. Without it the text ran ~40%
wider than the ribbon and the lockup sat bottom-heavy.

The crop comes from the rendered element's own bounding box, not from guessed
padding, so it is exact whatever the font metrics do.

## Colours

```
#0B1030   wordmark on light
#FFFFFF   wordmark on dark
#B24C04   the "Ai", on light
#FF9D5C   the "Ai", on dark
```

Typeface: Plus Jakarta Sans ExtraBold (800), tracking −0.022em.
