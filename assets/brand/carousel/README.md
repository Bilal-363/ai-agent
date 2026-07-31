# Launch carousel — 8 slides, 1080×1350

Upload `slide-01.png` → `slide-08.png` in order. Works on Instagram, LinkedIn and
Facebook. Regenerate with `node build/carousel.js`.

## The argument

Each slide does one job, and the sequence is a sales argument rather than a
feature list:

| # | Job | Slide |
|---|---|---|
| 1 | **Hook** — a number that stops the scroll | 67% of callers hang up |
| 2 | **Consequence** — make it hurt | They call the practice down the road |
| 3 | **Quantify** — turn the pain into money | The arithmetic |
| 4 | **Solution** — introduce Casey | Answers in under two seconds |
| 5 | **Substance** — what it actually does | The whole front desk |
| 6 | **Proof** — numbers | Month one |
| 7 | **Objection** — "will it work with my system?" | Writes into your EHR |
| 8 | **Ask** — one clear action | vocryn.com |

Slide 3 is the one that converts. Everyone claims to save time; almost nobody
shows the maths.

## Suggested caption

> Your phone is the most expensive thing in your practice.
>
> Not the chair. Not the imaging. The phone — because two thirds of the people
> who call you hang up after two minutes on hold, and they don't leave a
> voicemail. They call the practice down the road, and that practice answers.
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

## Before you post — two things to check

**The 67% figure.** It is an industry statistic about hold-time abandonment, not
a measurement of your callers. Make sure you can point to a source if someone
asks, or soften it to "two thirds of callers".

**The $9,000 on slide 3.** Labelled illustrative on the slide, at a $600
new-patient value. Swap in your own numbers if you know them — a figure you can
defend in the comments is worth more than a bigger one you can't.

## How these were made

Four photographs generated with Higgsfield (`nano_banana_pro`, 4:5, 8 credits
total). Every word, number, icon and logo is composed in HTML and rendered
through headless Chrome — image models garble text, and a carousel is mostly
text.

The photos were prompted with empty space in the upper third, so the copy sits at
the top and the subject stays visible below it. The gradient darkens only the
band the text occupies.
