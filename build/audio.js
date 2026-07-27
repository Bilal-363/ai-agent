#!/usr/bin/env node
'use strict';

/**
 * Builds the demo-call audio from the per-line TTS clips in build/audio-src/.
 *
 *   node build/audio.js
 *
 * For each scenario it trims silence off every line, applies telephone-band EQ so
 * it sounds like an actual phone call, normalises loudness, joins the lines with a
 * natural pause, and emits:
 *   assets/audio/demo-<n>.mp3      the playable call
 *   build/lib/demo-calls.json      cue times per line + waveform peaks
 *
 * Durations are derived from PCM byte counts (bytes - 44) / (rate * 2) because
 * ffprobe is not executable in this environment. ffmpeg alone is enough.
 */

const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(__dirname, 'audio-src');
const WORK = path.join(__dirname, 'audio-work');
const OUT = path.join(ROOT, 'assets', 'audio');

const FFMPEG = 'C:/Users/Arshad Computer Lab/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-8.1.2-full_build/bin/ffmpeg.exe';

const RATE = 24000;          // Hz, mono 16-bit
const BYTES_PER_SEC = RATE * 2;
const GAP = 0.34;            // seconds of pause between turns
const PEAKS = 96;            // waveform buckets

fs.mkdirSync(WORK, { recursive: true });
fs.mkdirSync(OUT, { recursive: true });

const ff = (args) => execFileSync(FFMPEG, ['-y', '-loglevel', 'error', ...args], { stdio: 'pipe' });
const durationOf = (wav) => (fs.statSync(wav).size - 44) / BYTES_PER_SEC;

/* ------------------------------------------------------------------ script */

const SCENARIOS = [
  {
    id: 1,
    slug: 'emergency-booking',
    label: 'Emergency booking',
    blurb: 'A chipped tooth at 8am. Casey finds a same-day slot and checks the insurance.',
    tag: 'Dental',
    outcome: 'Booked with Dr. Alvarez at 2:40pm · written to Dentrix · SMS sent',
    lines: [
      ['casey',  'Good morning, Lakeview Dental. This is Casey, the practice assistant. How can I help you today?'],
      ['caller', 'Hi. I chipped a tooth last night and it’s pretty sore. Is there any chance someone could see me today?'],
      ['casey',  'Oh, I’m sorry, that sounds painful. Let me check today’s emergency slots for you. I have an opening with Doctor Alvarez at two forty this afternoon. Would that work?'],
      ['caller', 'Yes, please. And do you take Delta Dental?'],
      ['casey',  'We do. I’ll take your member ID to check your benefits, and I’ll text you a confirmation with directions before we hang up.'],
    ],
  },
  {
    id: 2,
    slug: 'prescription-refill',
    label: 'Prescription refill',
    blurb: 'Casey reads the chart, confirms the pharmacy, and routes it to the provider.',
    tag: 'Primary care',
    outcome: 'Refill request routed to Dr. Mehta · telephone encounter written to chart',
    lines: [
      ['casey',  'Thanks for calling Lakeview Primary Care. This is Casey, the practice assistant. How can I help?'],
      ['caller', 'Hi, I need a refill on my blood pressure medication. I’m nearly out.'],
      ['casey',  'Of course. I can see the lisinopril ten milligram on your chart, last filled in April at the Walgreens on Fifth Street. Shall I send the request to Doctor Mehta at that same pharmacy?'],
      ['caller', 'Yes, that’s the one. How long will that take?'],
      ['casey',  'Doctor Mehta reviews refill requests twice a day, so you should hear from the pharmacy by this evening. I’m adding this to your chart now, and I’ll text you the moment it’s approved.'],
    ],
  },
  {
    id: 3,
    slug: 'human-escalation',
    label: 'Escalation to a human',
    blurb: 'After hours, a caller wants a person. Casey stops and transfers immediately.',
    tag: 'After hours',
    outcome: 'Transferred to the on-call dentist in 6 seconds · no triage attempted',
    lines: [
      ['casey',  'You’ve reached Lakeview Dental after hours. This is Casey, the practice assistant. I can book appointments or take a message. What do you need?'],
      ['caller', 'Honestly, I’d rather just speak to a person. My son fell and his front tooth is bleeding.'],
      ['casey',  'That needs a person right now. I’m connecting you to the on-call dentist this second. Please stay on the line, you’ll hear ringing in just a moment.'],
    ],
  },
];

/* ------------------------------------------------------------ silence clip */

const silence = path.join(WORK, 'gap.wav');
ff(['-f', 'lavfi', '-i', `anullsrc=r=${RATE}:cl=mono`, '-t', String(GAP),
    '-c:a', 'pcm_s16le', silence]);

/* --------------------------------------------------------------- per clip */

// Trim silence at both ends, then telephone band-pass, then normalise level.
const CHAIN = [
  'silenceremove=start_periods=1:start_silence=0.04:start_threshold=-45dB:detection=peak',
  'areverse',
  'silenceremove=start_periods=1:start_silence=0.10:start_threshold=-45dB:detection=peak',
  'areverse',
  'highpass=f=250',
  'lowpass=f=3600',
  'loudnorm=I=-16:TP=-1.5:LRA=11',
  `aresample=${RATE}`,
].join(',');

const manifest = [];

for (const sc of SCENARIOS) {
  const parts = [];
  const cues = [];
  let t = 0;

  sc.lines.forEach(([who, text], i) => {
    const src = path.join(SRC, `s${sc.id}-${i + 1}.wav`);
    if (!fs.existsSync(src)) throw new Error(`Missing source clip: ${src}`);
    const dst = path.join(WORK, `c${sc.id}-${i + 1}.wav`);
    ff(['-i', src, '-af', CHAIN, '-ac', '1', '-c:a', 'pcm_s16le', dst]);

    const d = durationOf(dst);
    cues.push({ who, text, start: +t.toFixed(3), end: +(t + d).toFixed(3) });
    parts.push(dst);
    t += d;
    if (i < sc.lines.length - 1) { parts.push(silence); t += GAP; }
  });

  // Join, then encode a small mono MP3 for the web.
  const listFile = path.join(WORK, `list-${sc.id}.txt`);
  fs.writeFileSync(listFile, parts.map((p) => `file '${p.replace(/\\/g, '/')}'`).join('\n'));

  const joined = path.join(WORK, `joined-${sc.id}.wav`);
  ff(['-f', 'concat', '-safe', '0', '-i', listFile, '-c:a', 'pcm_s16le', '-ac', '1', joined]);

  const mp3 = path.join(OUT, `demo-${sc.id}.mp3`);
  ff(['-i', joined, '-c:a', 'libmp3lame', '-b:a', '56k', '-ac', '1', '-ar', '24000', mp3]);

  // Real waveform peaks, straight off the joined PCM.
  const raw = path.join(WORK, `raw-${sc.id}.pcm`);
  ff(['-i', joined, '-f', 's16le', '-ac', '1', '-ar', String(RATE), raw]);
  const buf = fs.readFileSync(raw);
  const samples = buf.length / 2;
  const per = Math.floor(samples / PEAKS);
  const peaks = [];
  for (let b = 0; b < PEAKS; b++) {
    let max = 0;
    for (let s = b * per; s < (b + 1) * per && s < samples; s += 3) {
      const v = Math.abs(buf.readInt16LE(s * 2));
      if (v > max) max = v;
    }
    peaks.push(max);
  }
  const loudest = Math.max(...peaks, 1);
  const norm = peaks.map((p) => Math.max(6, Math.round((p / loudest) * 100)));

  const total = durationOf(joined);
  manifest.push({
    id: sc.id, slug: sc.slug, label: sc.label, blurb: sc.blurb, tag: sc.tag,
    outcome: sc.outcome, src: `assets/audio/demo-${sc.id}.mp3`,
    duration: +total.toFixed(2), peaks: norm, cues,
  });

  const mm = Math.floor(total / 60);
  const ss = String(Math.round(total % 60)).padStart(2, '0');
  console.log(`  demo-${sc.id}.mp3  ${mm}:${ss}  ${sc.lines.length} lines  ` +
              `${(fs.statSync(mp3).size / 1024).toFixed(0)} KB  — ${sc.label}`);
}

fs.writeFileSync(
  path.join(__dirname, 'lib', 'demo-calls.json'),
  JSON.stringify(manifest, null, 2)
);

const totalKb = manifest.reduce(
  (n, m) => n + fs.statSync(path.join(ROOT, m.src)).size / 1024, 0);
console.log(`\n  ${manifest.length} calls, ${totalKb.toFixed(0)} KB total -> build/lib/demo-calls.json\n`);
