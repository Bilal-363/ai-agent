# "12:40" — 30-second advertisement

`vocryn-casey-30s.mp4` · 1080×1920 (9:16) · 30.0s · 6.6 MB · H.264 + AAC

Ready for Reels, TikTok, YouTube Shorts and paid social. Rebuild with `node build/ad.js`.

## The cut

| Time | Shot | Source |
|---|---|---|
| 0:00–04 | Empty desk, phone ringing. *"Nobody's answering this."* | Kling, live |
| 0:04–09 | Woman in a car, no answer, lowers the phone. *67% hang up* | Kling, live |
| 0:09–13 | *"She just became someone else's patient."* | Graphic |
| 0:13–18 | The arithmetic: 150 → ~30 → ~15 → $9k+ | Graphic |
| 0:18–25 | Casey answers. **Her real recording plays.** | Kling, live |
| 0:25–28 | HIPAA-ready · BAA signed · athenahealth | Graphic |
| 0:28–30 | Logo, vocryn.com | Graphic |

The bookend is the idea: it opens on a desk nobody answers and returns to the
same desk at the same time, answered.

## Audio

No voiceover. At 0:18 you hear **Casey's actual recording** from
`assets/audio/demo-1.mp3` — the same one on the website. The product demonstrates
itself, which beats any claim a narrator could make, and she introduces herself
as the practice assistant in her own voice, so disclosure is handled without
spending a line on it.

The ring tone is synthesised (440 Hz + 480 Hz, the real North-American cadence)
rather than sourced, so no licence is attached to the ad.

## Credits spent

24.5 total — 2 for the car still, then 7.5 × 3 for the clips (Kling 3.0 Turbo,
5s, 720p). Everything else is composed here and costs nothing.

## Two things before you run it as a paid ad

**The 67%** is an industry hold-abandonment figure, not a measurement of your
callers. Fine organically; for paid, be ready to substantiate it.

**"athenahealth"** appears as plain text, deliberately — no logo. Using vendor
marks in a *paid* ad implies a partnership. Naming an integration in text is safe.

## Notes for whoever rebuilds this

Kling returns video in the **start image's** aspect ratio and ignores the
`aspect_ratio` parameter. The Casey and desk stills were 4:5, so those clips came
back 860×1068 and are centre-cropped to 9:16 in `buildSegments()`. Feed it 9:16
start frames if you want 9:16 out.
