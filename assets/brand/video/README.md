# Vocryn Ai — films

Two 9:16 films, built to be a pair. Rebuild with `node build/ad.js` and
`node build/ad2.js`.

| File | Length | Idea |
|---|---|---|
| `vocryn-casey-30s.mp4` | 30.6s | **"12:40"** — the call nobody answers |
| `vocryn-writes-to-chart-40s.mp4` | 40.0s | **"Writes to the Chart"** — the work actually landing |

They mirror each other on purpose. The first ends on an *empty desk* to prove
nobody was there. The second ends on a *filled schedule slot* to prove the job got
done. Run the first as the hook and the second as the proof.

---

## "Writes to the Chart" — 40s

`1080×1920 · 40.0s · 6.2 MB · H.264 + AAC`

| Time | Beat | Source |
|---|---|---|
| 0:00–04 | Split screen. *"Most AI receptionists take a message."* | Animated |
| 0:04–08 | *"This one writes to the chart."* | Animated |
| 0:08–13 | Casey answers · **her real recording** · *answered in 1.8s* | Live footage |
| 0:13–18 | **0:14** — patient matched from caller ID | Animated UI |
| 0:18–23 | **0:38** — live availability read off the schedule | Animated UI |
| 0:23–28 | insurance verified on the call | Animated UI |
| 0:28–33 | **1:12** — appointment tile drops into the 2:40 slot | Animated UI |
| 0:33–37 | Hold. *"And she's still on the phone."* | Live footage |
| 0:37–40 | End card | Animated |

**The hero is the screen, not a face.** The most persuasive thing here is an
appointment tile landing in a real slot while the caller is still talking, so the
middle twenty seconds is one continuous animated schedule rather than footage.

**The logo is on every single frame** — mark and wordmark top-left, `vocryn.com`
top-right, all 40 seconds, including over the UI and the live footage.

### How the UI scene is rendered

The page is loaded once, then a progress value `0..1` is pushed in before each
capture. That is roughly ten times faster than re-navigating per frame, and
deterministic — frame *n* always produces the same pixels, so a rebuild is
byte-comparable.

### Credits

**1.8** — voiceover only. All footage is reused from the first film; the UI, cards
and end card are composed in HTML, which is also *better* than generating them:
image models garble text, and this film is entirely about text landing correctly
in a chart.

---

## Two bugs worth remembering

**Voices doubled at the end.** VO line 7 ran 5.17s from 33.2s and collided with
line 8 at 37.2s — 1.17 seconds of two voices at once. The copy also read out
"one minute twelve seconds", which the on-screen timer already showed, so cutting
that fixed the overlap and the redundancy together. `buildAudio()` now **detects
overlaps and pushes the later line clear, printing a warning** — cue points are
hand-placed against the picture but line lengths come from the generator and shift
whenever copy changes.

**The stamp covered the payoff.** "Written to chart" was centred vertically and
landed squarely on the appointment tile — hiding the one moment the film exists
for. It now sits at 63%, in the panel's empty space below the slots.

## Before running as a paid ad

**The schedule is a neutral mock**, deliberately not any vendor's real interface,
and is labelled *"Demo practice · illustrative schedule, not a real patient"*
on screen throughout. Mimicking a real EHR's UI is a trademark question.

**"HIPAA-ready", never "HIPAA-compliant."** Several of the reference creatives
said compliant. There is no certifying body for HIPAA, and the stronger claim is
the one that gets challenged in comments.

**athenahealth appears as plain text, not a logo** — vendor marks in a paid ad
imply a partnership.
