# Launch carousel — 8 slides, 1080×1350

Upload `slide-01.png` → `slide-08.png` in order. Instagram, LinkedIn, Facebook.
Regenerate with `node build/carousel.js`.

## Why it's built this way

**Framework: Hack List** — a contrarian stat opens, the problem gets named, each
fix re-earns the swipe, a synthesis closes. Chosen because this is a first post
from a brand nobody knows yet: the hook has to be a fact about *the reader's*
business, not a claim about ours. "We built an AI receptionist" earns no swipes.
"67% of your callers hang up" does.

**One visual template.** Every slide shares the same navy base, the same header
bar, the same type scale and the same orange accent. Only the content changes.
An earlier version used five different looks — photo, white, navy, gradient, logo
wall — and read as five unrelated posts rather than one argument.

**Slide 1 is the thumbnail.** It competes in the feed alone, before anyone knows
a carousel follows, so the number is set at 340px and fills the top third.

**Nothing below 32px.** At feed thumbnail size anything smaller is texture, not
text. The first version had a 23px label that simply vanished.

## The sequence

| # | Job |
|---|---|
| 1 | **Hook** — 67%, big enough to stop a scroll |
| 2 | **Consequence** — they call the practice down the road |
| 3 | **Quantify** — the arithmetic, in money |
| 4 | **Solution** — meet Casey |
| 5 | **Substance** — what it actually does |
| 6 | **Proof** — month one |
| 7 | **Objection** — "will it work with my system?" |
| 8 | **Ask** — one CTA, nothing else |

Slide 3 is the one that converts. Everyone claims to save time; almost nobody
shows the maths.

## Caption

> Your phone is the most expensive thing in your practice.
>
> Not the chair. Not the imaging. The phone — because two thirds of the people
> who call you hang up after two minutes on hold. They don't leave a voicemail.
> They call the practice down the road, and that practice answers.
>
> We built Casey for exactly that gap. It answers in under two seconds, books
> straight into your EHR, verifies insurance while the patient is still on the
> line, and hands anything urgent to a real person.
>
> Nights, weekends, lunch breaks, and the Monday-morning rush.
>
> Hear it handle a real call, unedited → vocryn.com
>
> #dentalpractice #primarycare #practicemanagement #healthcareAI #frontdesk

Post the caption as its own hook — don't just repeat slide 1.

## Before you post

**The 67%** is an industry hold-abandonment statistic, not a measurement of your
callers. Have a source ready, or soften it to "two thirds of callers".

**The $9k on slide 3** is labelled illustrative at a $600 new-patient value. If
you know your real number, use it — a figure you can defend in the comments beats
a bigger one you can't.

## Measuring it

Judge this on **saves and completion**, not likes. If it underperforms, the fix is
almost always slide 1 (didn't stop the scroll), not the middle slides.

## Production

Four photographs from Higgsfield (`nano_banana_pro`, 4:5, 8 credits). Every word,
number, icon and logo is composed in HTML and rendered through headless Chrome —
image models garble text, and a carousel is mostly text. The EHR marks are the
real vendor logos already in the repo.
