'use strict';

/**
 * Single source of truth for every piece of site content.
 * Edit here, run `node build/build.js`, and every page updates.
 */

const site = {
  name: 'Vocryn AI',
  legalName: 'Vocryn AI, Inc.',
  product: 'Casey',
  tagline: 'AI Front Desk for Dental & Primary Care Clinics',
  url: 'https://www.vocryn.com',
  phone: '1-571-703-4510',
  phoneHref: '+15717034510',
  email: 'care@vocryn.com',
  founded: '2024',
  social: {
    tiktok: 'https://www.tiktok.com/@vocrynai',
    youtube: 'https://www.youtube.com/@Vocrynai',
    twitter: 'https://x.com/Vocrynai',
    linkedin: 'https://www.linkedin.com/company/vocryn',
  },
};

/* ---------------------------------------------------------- headline metrics */

const heroStats = [
  { value: 24847, label: 'Calls answered', suffix: '', format: 'int' },
  { value: 18203, label: 'Appointments booked', suffix: '', format: 'int' },
  { value: 94.2, label: 'Positive sentiment', suffix: '%', format: 'dec' },
];

const keyStats = [
  { value: 94, suffix: '%', label: 'of calls answered', note: 'No hold music. No voicemail.', icon: 'phone' },
  { value: 3, suffix: '×', label: 'more bookings', note: 'Every caller gets to a calendar.', icon: 'trending-up' },
  { value: 2, prefix: '<', suffix: 's', label: 'to pick up', note: 'Faster than any human front desk.', icon: 'zap' },
  { value: 99.3, suffix: '%', label: 'intent accuracy', note: 'Casey understands what patients mean.', icon: 'target' },
];

const trustBadges = [
  { label: 'HIPAA-ready', icon: 'shield-check' },
  { label: 'BAA available', icon: 'file-text' },
  { label: 'TLS 1.3 + AES-256', icon: 'lock' },
  { label: 'US-based servers', icon: 'server' },
  { label: '99.9% uptime SLA', icon: 'activity' },
];

/* ------------------------------------------------------------------ services */

const services = [
  {
    slug: 'appointment-booking',
    title: 'AI Appointment Booking',
    icon: 'calendar-check',
    short: 'Books straight into your EHR while the patient is still on the line.',
    lead: 'Casey reads your real availability, offers the right slot for the right provider, and writes the appointment into your practice management system before the call ends.',
    bullets: [
      'Live two-way sync with your scheduling rules, not a copy of them',
      'Respects provider, operatory, and appointment-type constraints',
      'Handles new and returning patients, including chart lookup',
      'Confirms by SMS and email the moment the call ends',
    ],
    stat: { value: '3.2×', label: 'more appointments booked in month one' },
  },
  {
    slug: 'insurance-verification',
    title: 'Insurance Verification',
    icon: 'shield-check',
    short: 'Captures and checks coverage on the call, not three days later.',
    lead: 'Casey collects carrier, member ID, group number, and subscriber details in a structured format, then flags anything that needs a human to verify.',
    bullets: [
      'Structured capture — no more squinting at handwritten notes',
      'Reads back details to the patient to confirm accuracy',
      'Flags out-of-network and expired plans before the visit',
      'Drops a clean summary into the patient chart',
    ],
    stat: { value: '9 min', label: 'of staff time saved per new patient' },
  },
  {
    slug: 'prescription-refills',
    title: 'Prescription Refill Requests',
    icon: 'pill',
    short: 'Takes the request, checks the chart, routes it to the provider.',
    lead: 'The single most common reason patients call — and the one that most often ends in voicemail. Casey takes the request properly the first time.',
    bullets: [
      'Confirms medication, dose, and preferred pharmacy',
      'Retrieves the current medication list from the chart',
      'Routes to the right provider queue with full context',
      'Never gives clinical advice — always defers to your team',
    ],
    stat: { value: '62%', label: 'of refill calls resolved without staff' },
  },
  {
    slug: 'rescheduling',
    title: 'Rescheduling & Cancellations',
    icon: 'refresh',
    short: 'Cancellations become openings, not empty chairs.',
    lead: 'When a patient cancels, Casey immediately offers the slot to your waitlist by outbound call and text — often filling it within the hour.',
    bullets: [
      'Automatic waitlist backfill, ranked by your rules',
      'Patients reschedule themselves, 24 hours a day',
      'Enforces your cancellation policy and notice windows',
      'Escalates repeat no-shows to the practice manager',
    ],
    stat: { value: '41%', label: 'of cancelled slots refilled same day' },
  },
  {
    slug: 'reminders-recalls',
    title: 'Patient Reminders & Recalls',
    icon: 'bell',
    short: 'Outbound confirmations and hygiene recall that actually reach people.',
    lead: 'Casey calls and texts ahead of appointments, and reaches back out to patients who are overdue for hygiene, labs, or follow-up.',
    bullets: [
      'Multi-touch cadence: call, then SMS, then call again',
      'Confirms, reschedules, or cancels in the same conversation',
      'Recall lists pulled straight from your PMS',
      'Respects quiet hours and per-patient contact preferences',
    ],
    stat: { value: '<5%', label: 'no-show rate for reminded patients' },
  },
  {
    slug: 'sms-followups',
    title: 'SMS Confirmations & Follow-ups',
    icon: 'message-square',
    short: 'Every call ends with something in the patient’s pocket.',
    lead: 'Voice and text work as one thread. Casey sends confirmations, directions, forms, and prep instructions automatically.',
    bullets: [
      'Appointment confirmations with an add-to-calendar link',
      'Intake forms and pre-visit instructions delivered ahead of time',
      'Two-way replies handled by the same assistant',
      'Full transcript and message history in one timeline',
    ],
    stat: { value: '87%', label: 'of patients open the follow-up text' },
  },
  {
    slug: 'new-patient-intake',
    title: 'New Patient Intake',
    icon: 'user-plus',
    short: 'Creates the chart over the phone, before they walk in.',
    lead: 'Casey gathers demographics, insurance, pharmacy, and consent, then creates the patient record in your system — so the first visit starts on time.',
    bullets: [
      'Full demographic and insurance capture over the phone',
      'Creates the chart directly in your EHR or PMS',
      'Sends digital forms for anything that needs a signature',
      'Screens for the right provider and visit type',
    ],
    stat: { value: '11 min', label: 'shorter check-in for new patients' },
  },
  {
    slug: 'clinical-documentation',
    title: 'Clinical Documentation',
    icon: 'file-text',
    short: 'Structured telephone encounters your providers can actually use.',
    lead: 'Instead of a sticky note that says "patient called", your provider gets a clean, structured summary in the chart with the reason, the details, and the ask.',
    bullets: [
      'Structured telephone encounter notes, not raw transcripts',
      'Reason for call, symptoms reported, and requested action',
      'Full recording and transcript attached for review',
      'Written to the chart in your existing note template',
    ],
    stat: { value: '0', label: 'rounds of phone tag to get the message' },
  },
  {
    slug: 'call-routing',
    title: 'Call Routing & Escalation',
    icon: 'phone-forwarded',
    short: 'Anything urgent reaches a human in seconds.',
    lead: 'Casey knows the limits of its job. Emergencies, angry callers, and anything outside its scope get a warm transfer with full context.',
    bullets: [
      'Emergency keyword detection with immediate live transfer',
      'Warm handoff — your staff hear the summary before they speak',
      'Per-department, per-provider, and after-hours routing rules',
      'Anyone can ask for a human at any moment and get one',
    ],
    stat: { value: '<8s', label: 'average time to reach a live person' },
  },
  {
    slug: 'after-hours',
    title: 'After-Hours & Overflow Coverage',
    icon: 'moon',
    short: 'Nights, weekends, lunch breaks, and the 9am rush.',
    lead: 'Casey picks up when nobody else can — and sits quietly in the background the rest of the time, catching only what overflows.',
    bullets: [
      'Answer-all mode or overflow-only mode, your choice',
      'Covers evenings, weekends, holidays, and staff lunch',
      'Absorbs the Monday-morning call spike without a queue',
      'Handles 20+ languages without a translation line',
    ],
    stat: { value: '38%', label: 'of bookings happen outside office hours' },
  },
];

/* ------------------------------------------------- sample exchanges per service
 * Feeds the interactive capability explorer on the home page. `call` points at a
 * demo recording in build/lib/demo-calls.json where one exists, so the panel can
 * offer to play the real thing instead of only showing text.
 * `channels` marks whether the capability works on voice, SMS, or both.
 */
const samples = {
  'appointment-booking': {
    call: 1, channels: ['voice', 'sms'],
    meta: "Handled in 41s · no transfer",
    actions: [
      ['search', "Read live availability from Epic"],
      ['calendar-check', "Wrote the appointment to the chart"],
      ['message-square', "Texted a confirmation and directions"],
    ],
    turns: [
      ['patient', 'Hi, I need to come in for a cleaning. Do you have anything next week?'],
      ['casey', 'I do — Tuesday at 10:20 with Dr. Alvarez, or Thursday at 3:00. Which suits you better?'],
    ],
  },
  'insurance-verification': {
    channels: ['voice', 'sms'],
    meta: "Handled in 1m 12s · no transfer",
    actions: [
      ['file-text', "Captured carrier, member ID and group"],
      ['shield-check', "Checked eligibility against the plan"],
      ['activity', "Flagged the plan change for the front desk"],
    ],
    turns: [
      ['patient', 'Do you take Delta Dental? I switched plans in January.'],
      ['casey', 'We do. Let me take your new member ID and group number, and I’ll verify your benefits before the visit.'],
    ],
  },
  'prescription-refills': {
    call: 2, channels: ['voice'],
    meta: "Handled in 58s · no transfer",
    actions: [
      ['database', "Pulled the medication list from the chart"],
      ['phone-forwarded', "Routed the request to the provider queue"],
      ['message-square', "Texted the patient once approved"],
    ],
    turns: [
      ['patient', 'I need a refill on my blood pressure medication.'],
      ['casey', 'I can see the lisinopril on your chart, last filled in April. Shall I send the request to Dr. Mehta at your usual pharmacy?'],
    ],
  },
  rescheduling: {
    channels: ['voice', 'sms'],
    meta: "Handled in 47s · slot refilled in 22m",
    actions: [
      ['refresh', "Released the old slot back to the calendar"],
      ['calendar-check', "Booked the new time and wrote it back"],
      ['bell', "Offered the freed slot to the waitlist"],
    ],
    turns: [
      ['patient', 'Something’s come up — can I move Thursday’s appointment?'],
      ['casey', 'Of course. I have Monday at 9:40 or Wednesday at 2:15. And I’ll offer your Thursday slot to the waitlist.'],
    ],
  },
  'reminders-recalls': {
    channels: ['voice', 'sms'], outbound: true,
    meta: "Outbound · three-touch cadence",
    actions: [
      ['database', "Pulled the overdue recall list from the PMS"],
      ['phone', "Called, then texted when there was no answer"],
      ['calendar-check', "Booked and wrote it back"],
    ],
    turns: [
      ['casey', 'Hello, this is Casey calling from Lakeview Dental. You’re due for your six-month cleaning — shall I book that now?'],
      ['patient', 'Yes please, sometime after work if you have it.'],
    ],
  },
  'sms-followups': {
    channels: ['sms'],
    meta: "Delivered in 4s",
    actions: [
      ['message-square', "Sent the address and a map link"],
      ['calendar-check', "Attached an add-to-calendar file"],
      ['file-text', "Logged the message on the chart timeline"],
    ],
    turns: [
      ['patient', 'Can you text me the address? I’m driving.'],
      ['casey', 'Sent. You’ll have the address, a map link, and your appointment time on your phone now.'],
    ],
  },
  'new-patient-intake': {
    channels: ['voice', 'sms'],
    meta: "Handled in 3m 20s · chart created",
    actions: [
      ['user-plus', "Created the chart with demographics and insurance"],
      ['file-text', "Sent the two forms needing a signature"],
      ['calendar-check', "Booked the first visit"],
    ],
    turns: [
      ['patient', 'I’m a new patient. Do I need to fill anything in before I come?'],
      ['casey', 'I can take your details now and create your chart, then text you the two forms that need a signature. Check-in will take about a minute.'],
    ],
  },
  'clinical-documentation': {
    channels: ['voice'],
    meta: "Routed in 34s · provider notified",
    actions: [
      ['file-text', "Wrote a structured telephone encounter"],
      ['phone-forwarded', "Routed it to the provider queue"],
      ['eye-off', "Gave no clinical advice, by design"],
    ],
    turns: [
      ['patient', 'I’ve had a sore throat for four days and it’s getting worse.'],
      ['casey', 'I’m not able to advise on that, but I’ll pass it to your provider now with everything you’ve told me, and someone will call you back today.'],
    ],
  },
  'call-routing': {
    call: 3, channels: ['voice'],
    meta: "Transferred in 6s · no triage attempted",
    actions: [
      ['zap', "Recognised the request for a person"],
      ['phone-forwarded', "Warm transferred with a summary"],
      ['check', "Stayed on the line until it connected"],
    ],
    turns: [
      ['patient', 'I’d rather just speak to a person.'],
      ['casey', 'Of course — I’m connecting you now. Please stay on the line.'],
    ],
  },
  'after-hours': {
    channels: ['voice', 'sms'],
    meta: "Answered at 20:52 · booked",
    actions: [
      ['moon', "Answered outside opening hours"],
      ['calendar-check', "Booked into the next day’s availability"],
      ['message-square', "Texted the confirmation"],
    ],
    turns: [
      ['patient', 'Are you open? It’s nearly nine at night.'],
      ['casey', 'The practice is closed, but I can still book you in. I have tomorrow at 8:10 or Friday at 11:30 — or I can take a message for the team.'],
    ],
  },
};

/* ----------------------------------------------------------------- use cases */

const useCases = [
  {
    slug: 'primary-care',
    title: 'Primary Care',
    group: 'By practice type',
    icon: 'stethoscope',
    short: 'Refills, results, and routine scheduling handled on the first call.',
    lead: 'Primary care call volume is relentless and mostly routine. Casey resolves the routine and escalates the rest with proper documentation.',
    bullets: [
      'Refill requests captured and routed with the medication list attached',
      'Annual wellness and chronic-care follow-up scheduling',
      'Structured telephone encounters written to the chart',
      'Epic, athenahealth, eClinicalWorks, Practice Fusion',
    ],
    outcome: 'Front-desk staff report getting back 2+ hours a day for in-person patient care.',

  },
  {
    slug: 'urgent-care',
    title: 'Urgent Care',
    group: 'By practice type',
    icon: 'zap',
    short: 'Wait times, walk-in expectations, and unpredictable surges.',
    lead: 'Urgent care demand arrives in waves nobody can roster for. Casey answers through the surge, tells walk-ins what they are actually walking into, and gets anything clinical to a person immediately.',
    bullets: [
      'Current wait time and capacity read live from your queue',
      'Walk-in callers told what to expect before they set off',
      'Evening, weekend, and post-work surges absorbed without a hold queue',
      'Emergency language transfers to a clinician at once — never triaged by software',
    ],
    outcome: 'Fewer callers abandoning at the peak, and fewer arriving to a wait they were not told about.',

  },
  {
    slug: 'athenahealth-primary-care',
    title: 'athenahealth Primary Care',
    group: 'By practice type',
    icon: 'database',
    short: 'Deep two-way integration with athenaOne, tuned for primary care.',
    lead: 'For practices running athenahealth, Casey reads live availability and writes confirmed appointments, refill requests, and telephone encounters straight back into the chart — no middle layer, no overnight sync, no staff re-keying anything.',
    bullets: [
      'Live two-way sync with athenaOne scheduling, not a nightly copy',
      'Appointment types, provider rules, and visit durations all respected',
      'Refill requests routed to the provider queue with the medication list attached',
      'Structured telephone encounters written in your existing note template',
      'New patient charts created over the phone before the first visit',
    ],
    outcome: 'Bookings land in athenaOne while the patient is still on the line, so the schedule your team sees is always the real one.',

  },
  {
    slug: 'multi-location',
    title: 'Multi-Location Groups',
    group: 'By practice type',
    icon: 'building',
    short: 'One assistant, every location, consistent every time.',
    lead: 'Casey enforces the same scheduling rules and the same standard of service across every site, and gives you one dashboard to see all of it.',
    bullets: [
      'Location-aware routing and per-site scheduling rules',
      'Consolidated reporting across every clinic',
      'Load-balances patients to the nearest site with availability',
      'Roll out to one location, then clone the configuration',
    ],
    outcome: 'Groups get one consistent patient experience without hiring per-site reception staff.',

  },
  {
    slug: 'dso',
    title: 'DSOs',
    group: 'By practice type',
    icon: 'network',
    short: 'Standardised patient access across the whole portfolio.',
    lead: 'For dental service organisations, Casey is a central patient-access layer that scales with acquisitions instead of requiring a hiring round for each one.',
    bullets: [
      'Central configuration with per-practice overrides',
      'New acquisitions live in days, not quarters',
      'Portfolio-level KPIs: answer rate, conversion, recall performance',
      'Predictable per-location cost with no turnover risk',
    ],
    outcome: 'Onboard an acquired practice’s phone line in under a week.',

  },
  {
    slug: 'specialty-clinics',
    title: 'Specialty Clinics',
    group: 'By practice type',
    icon: 'activity',
    short: 'Referral intake and pre-visit prep, done properly.',
    lead: 'Specialty practices live or die on clean referral intake. Casey captures the referral, chases the records, and prepares the patient.',
    bullets: [
      'Referral intake with referring-provider capture',
      'Pre-visit instructions and prep confirmation calls',
      'Long-cycle follow-up sequences for procedures',
      'Prior-authorisation status calls and reminders',
    ],
    outcome: 'Fewer visits cancelled on the day for missing records or missed prep.',

  },
  {
    slug: 'community-health',
    title: 'FQHCs & Community Health',
    group: 'By practice type',
    icon: 'heart-handshake',
    short: '20+ languages, high volume, complex eligibility.',
    lead: 'Community health centres carry the highest call volume and the most complex patient needs. Casey answers in the patient’s language, every time.',
    bullets: [
      '20+ languages with no separate translation line',
      'Sliding-scale and eligibility questions answered consistently',
      'Handles very high inbound volume without a queue',
      'Transportation and interpreter needs flagged in advance',
    ],
    outcome: 'Language is no longer the reason a patient gives up on calling.',

  },
  {
    slug: 'front-desk-relief',
    title: 'Front Desk Relief',
    group: 'By job to be done',
    icon: 'headset',
    short: 'Give your staff their attention back.',
    lead: 'Your front desk was never meant to be a call centre. Casey takes the phone so your team can look after the people standing in front of them.',
    bullets: [
      'Absorbs the routine 70% of inbound call volume',
      'No more choosing between the phone and the patient at the desk',
      'Zero turnover, zero retraining, zero sick days',
      'Staff keep full oversight through the dashboard',
    ],
    outcome: 'Two-plus hours of admin time back, per staff member, per day.',

  },
  {
    slug: 'missed-call-recovery',
    title: 'Missed-Call Recovery',
    group: 'By job to be done',
    icon: 'phone-missed',
    short: 'Every missed call is a patient who called someone else.',
    lead: '67% of callers hang up after two minutes on hold. Casey makes sure there is never a second minute.',
    bullets: [
      'Answers in under two seconds, every time, all day',
      'Overflow coverage for peak hours and lunch',
      'Calls back anyone who abandons before connecting',
      'Recovers after-hours and weekend demand',
    ],
    outcome: '87% fewer missed calls in the first month.',

  },
  {
    slug: 'no-show-reduction',
    title: 'No-Show Reduction',
    group: 'By job to be done',
    icon: 'calendar-x',
    short: 'Confirm, remind, and refill what still falls through.',
    lead: 'A no-show costs more than the visit. Casey reduces them with real conversations, not one-way texts nobody reads.',
    bullets: [
      'Multi-touch reminder cadence across voice and SMS',
      'Patients can reschedule mid-reminder instead of ghosting',
      'Automatic waitlist backfill for late cancellations',
      'No-show risk surfaced to the practice manager weekly',
    ],
    outcome: 'No-show rates held under 5% for reminded patients.',

  },
  {
    slug: 'patient-reactivation',
    title: 'Patient Reactivation',
    group: 'By job to be done',
    icon: 'user-check',
    short: 'Bring back the patients already in your database.',
    lead: 'The cheapest new patient is the one you already had. Casey works your lapsed list with warm, personal outbound calls.',
    bullets: [
      'Outbound campaigns to patients overdue by 6, 12, or 24 months',
      'Personalised by last visit type and provider',
      'Books straight into open capacity you want to fill',
      'Full opt-out handling and contact-preference compliance',
    ],
    outcome: 'A reactivation campaign typically pays for the year in a single month.',

  },
];

/* --------------------------------------------------------------- integrations */

const integrations = [
  { name: 'Epic', logo: 'epic', mark: 'Ep', tint: '#B4232F', category: 'Medical EHR', note: 'Scheduling, chart write-back, telephone encounters' },
  { name: 'athenahealth', logo: 'athenahealth', mark: 'ah', tint: '#6E2C8F', category: 'Medical EHR', note: 'Two-way scheduling and patient record sync' },
  { name: 'eClinicalWorks', logo: 'eclinicalworks', mark: 'eC', tint: '#B45A1A', category: 'Medical EHR', note: 'Appointments, refills, and documentation' },
  { name: 'Practice Fusion', logo: 'practice-fusion', mark: 'PF', tint: '#21799B', category: 'Medical EHR', note: 'Appointment booking and chart updates' },
  { name: 'Dentrix', logo: 'dentrix', mark: 'Dx', tint: '#1257A6', category: 'Dental PMS', note: 'Operatory-aware booking and hygiene recall' },
  { name: 'Dentrix Ascend', logo: 'dentrix-ascend', mark: 'DA', tint: '#0E77AB', category: 'Dental PMS', note: 'Cloud scheduling and recall automation' },
  { name: 'NexHealth', logo: 'nexhealth', mark: 'Nx', tint: '#4B3FD4', category: 'Dental PMS', note: 'Real-time availability and instant booking' },
  { name: 'Curve Dental', logo: 'curve-dental', mark: 'Cv', tint: '#0D826F', category: 'Dental PMS', note: 'Scheduling, recall, and patient records' },
  { name: 'Open Dental', logo: 'open-dental', mark: 'OD', tint: '#17639E', category: 'Dental PMS', note: 'Full read/write scheduling integration' },
];

const telephony = ['RingCentral', 'Twilio', 'Zoom Phone', '8x8', 'Vonage', 'Dialpad', 'Nextiva', '3CX'];

/* --------------------------------------------------------------- how it works */

const steps = [
  {
    n: '01',
    title: 'Discovery call',
    time: 'Day 1 · 30 minutes',
    icon: 'headset',
    body: 'We listen to how your practice actually runs — your providers, appointment types, scheduling rules, and the questions patients ask most. No forms to fill in first.',
  },
  {
    n: '02',
    title: 'Connect your systems',
    time: 'Days 2–4',
    icon: 'plug-zap',
    body: 'We connect Casey to your EHR or practice management system and your phone line. Nothing changes for your staff — same software, same number, same workflow.',
  },
  {
    n: '03',
    title: 'Train Casey on your practice',
    time: 'Days 5–9',
    icon: 'sparkles',
    body: 'Casey learns your scripts, your policies, your escalation rules, and your tone. You review every conversation flow and sign off before a single patient hears it.',
  },
  {
    n: '04',
    title: 'Go live and tune',
    time: 'Day 10 onward',
    icon: 'gauge',
    body: 'Start in overflow-only mode, then expand as confidence grows. You see every call, every transcript, and every booking — and we tune weekly with you.',
  },
];

/* -------------------------------------------------------------------- pricing */

const pricing = [
  {
    name: 'Starter',
    sub: 'Single location',
    price: 'From $399',
    unit: '/month',
    blurb: 'For a solo practice that keeps missing calls at lunch and after five.',
    cta: 'Book a demo',
    features: [
      'Up to 500 patient calls a month',
      'Appointment booking, rescheduling, cancellations',
      'One EHR or PMS integration',
      'SMS confirmations and reminders',
      'After-hours and overflow coverage',
      'Call recordings, transcripts, and dashboard',
      'Email support, next business day',
    ],
  },
  {
    name: 'Practice',
    tag: 'Most popular',
    sub: 'Busy single location',
    price: 'From $899',
    unit: '/month',
    featured: true,
    blurb: 'For a busy practice that wants the phone genuinely handled.',
    cta: 'Book a demo',
    features: [
      'Up to 2,000 patient calls a month',
      'Everything in Starter, plus:',
      'Insurance verification and new patient intake',
      'Prescription refill triage and routing',
      'Outbound reminders, recall, and waitlist backfill',
      'Clinical documentation to the chart',
      '20+ languages',
      'Custom escalation and routing rules',
      'Dedicated onboarding specialist',
    ],
  },
  {
    name: 'Groups & DSOs',
    sub: 'Multi-location',
    price: 'Custom',
    unit: '',
    blurb: 'For groups and DSOs standardising patient access across every site.',
    cta: 'Talk to our team',
    features: [
      'Unlimited call volume',
      'Everything in Practice, plus:',
      'Unlimited locations with per-site rules',
      'Multiple EHR and PMS integrations',
      'Portfolio-level reporting and KPIs',
      'Signed BAA and security review support',
      '99.9% uptime SLA',
      'Named account manager and quarterly reviews',
    ],
  },
];

const pricingIncludes = [
  'Full onboarding and configuration',
  'Unlimited staff dashboard seats',
  'Every call recorded and transcribed',
  'Live human escalation, always',
  'HIPAA-ready infrastructure and BAA',
  'No per-seat charges, ever',
  'Month-to-month — cancel any time',
  'Weekly tuning for the first 90 days',
];

/* ------------------------------------------------------------------- security */

const securityItems = [
  { icon: 'shield-check', title: 'HIPAA-ready by design', body: 'PHI is handled under a signed Business Associate Agreement, with least-privilege access and documented data flows from the first call.' },
  { icon: 'lock', title: 'Encrypted end to end', body: 'TLS 1.3 for everything in transit and AES-256 for everything at rest. Keys are rotated and managed separately from application access.' },
  { icon: 'server', title: 'US-based infrastructure', body: 'All processing and storage stays inside US regions. No offshore call centres and no offshore data processing.' },
  { icon: 'eye-off', title: 'Zero-retention option', body: 'Choose how long recordings and transcripts live — down to discarding audio the moment the call ends and keeping only the structured outcome.' },
  { icon: 'users', title: 'Role-based access control', body: 'Granular permissions per staff member, with SSO available and every permission change written to the audit log.' },
  { icon: 'file-text', title: 'Complete audit trail', body: 'Every call, transcript, chart write, and configuration change is logged and exportable for your compliance reviews.' },
  { icon: 'activity', title: '99.9% uptime SLA', body: 'Redundant regions with automatic failover, plus a fallback route to your existing phone system if anything degrades.' },
  { icon: 'heart-handshake', title: 'Human escalation, always', body: 'Any caller can reach a person at any point. Emergency language triggers an immediate live transfer, never a hold queue.' },
];

/* ----------------------------------------------------------------------- FAQs */

const faqs = [
  { q: 'Will patients know they are talking to an AI?', a: 'Yes — Casey identifies itself as your practice’s automated assistant at the start of the call. We have found that being upfront builds trust, and patients care far more about getting a real answer quickly than about who gave it to them.', cat: 'Patients' },
  { q: 'What happens if Casey does not understand a caller?', a: 'Casey asks a clarifying question once, and if it still is not confident it transfers the caller to your staff with a summary of what it heard. It never guesses at clinical or scheduling decisions.', cat: 'Patients' },
  { q: 'Can a patient ask for a human?', a: 'Always. Saying "speak to someone", "receptionist", or "human" transfers the call immediately. There is no maze and no gatekeeping.', cat: 'Patients' },
  { q: 'How does Casey handle emergencies?', a: 'Emergency language triggers an immediate live transfer, and out of hours it follows your on-call protocol. Casey never triages clinically and never advises a caller to wait.', cat: 'Patients' },
  { q: 'What languages are supported?', a: 'Over 20, including Spanish, Mandarin, Vietnamese, Tagalog, Arabic, Russian, Portuguese, French, and Korean. Casey detects the caller’s language and switches automatically — no separate line, no interpreter wait.', cat: 'Patients' },
  { q: 'Does Casey give medical advice?', a: 'No. Casey does not diagnose, advise, or prescribe, and it will not interpret results. Anything clinical is routed to your team.', cat: 'Patients' },

  { q: 'Which EHR and practice management systems do you support?', a: 'On the medical side: Epic, athenahealth, eClinicalWorks, and Practice Fusion. On the dental side: Dentrix, Dentrix Ascend, NexHealth, Curve Dental, and Open Dental. If yours is not listed, ask — we add integrations regularly.', cat: 'Setup' },
  { q: 'Do we have to change our phone number?', a: 'No. We forward your existing number, so patients call exactly what they have always called and your printed material stays valid.', cat: 'Setup' },
  { q: 'How long does setup take?', a: 'Ten business days from discovery call to going live for a single location. Multi-location groups run in parallel after the first site is configured.', cat: 'Setup' },
  { q: 'How much work is this for my staff?', a: 'About two hours total: one thirty-minute discovery call, one review session to sign off the conversation flows, and one short dashboard walkthrough. We do the configuration.', cat: 'Setup' },
  { q: 'Can we start small?', a: 'Yes, and we recommend it. Most practices begin in overflow-only mode — Casey answers only what your team cannot pick up — then expand once they have listened to a few hundred calls.', cat: 'Setup' },
  { q: 'Can we customise what Casey says?', a: 'Every word. Greeting, tone, policies, escalation rules, and which services it handles are all yours to set, and you can change them any time.', cat: 'Setup' },
  { q: 'What if we already have an IVR or answering service?', a: 'Casey usually replaces both. If you want to keep your IVR, Casey can sit behind a specific menu option instead of answering the main line.', cat: 'Setup' },

  { q: 'Is Vocryn HIPAA compliant?', a: 'We are built for HIPAA from the ground up and we sign a Business Associate Agreement with every clinic. HIPAA has no certifying body, so treat any vendor claiming to be "HIPAA certified" with suspicion — ask for their BAA and their security documentation instead. We are happy to provide both.', cat: 'Security' },
  { q: 'Where is our patient data stored?', a: 'In US-based data centres only. Nothing is processed or stored outside the United States, and no offshore staff have access to it.', cat: 'Security' },
  { q: 'Are calls recorded, and can we turn that off?', a: 'Recording is on by default because practices find the transcripts valuable for quality review. You can shorten retention or switch to a zero-retention mode where audio is discarded at the end of the call and only the structured outcome is kept.', cat: 'Security' },
  { q: 'Do you train AI models on our patient data?', a: 'No. Your patient data is never used to train shared or third-party models. It is used to serve your practice and nothing else.', cat: 'Security' },
  { q: 'Are you SOC 2 certified?', a: 'Our controls are built to SOC 2 Type II criteria and we can share our current security documentation and posture under NDA. We will tell you plainly where we are in that process rather than overstate it.', cat: 'Security' },

  { q: 'How is pricing structured?', a: 'A fixed monthly fee based on call volume and the features you need. No per-seat pricing, no per-minute surprises, and no charge for staff dashboard access.', cat: 'Commercial' },
  { q: 'Is there a long-term contract?', a: 'Starter and Practice plans are month-to-month. Groups and DSOs usually prefer an annual agreement for the volume pricing, but it is not required.', cat: 'Commercial' },
  { q: 'What happens if we exceed our call volume?', a: 'Nothing breaks and no call gets dropped. We flag it and talk to you about the right plan — we do not bill surprise overages.', cat: 'Commercial' },
  { q: 'How quickly does this pay for itself?', a: 'Most practices are net positive inside the first month. A single recovered hygiene appointment or new patient usually covers a meaningful share of the monthly fee — our ROI calculator lets you run your own numbers.', cat: 'Commercial' },
  { q: 'Will this replace our front desk staff?', a: 'That is not what we sell and not what happens. Casey takes the routine phone volume so your staff can look after the patients in the building. Practices tell us the job gets better, not scarcer.', cat: 'Commercial' },
  { q: 'What if it does not work for us?', a: 'Month-to-month plans cancel with 30 days’ notice and we hand back your call data and transcripts on request. We would rather you leave cleanly than stay unhappy.', cat: 'Commercial' },
];

/* --------------------------------------------------------------- testimonials */

const testimonials = [
  {
    quote: 'We went from 8–10 missed calls a day to zero, and bookings are up 41%. My front desk finally gets to look after the patient standing in front of them instead of apologising to the phone.',
    name: 'Dr. Priya Mehta',
    role: 'Lakeview Primary Care, Chicago',
    metric: '+41% bookings',
    verified: true,
  },
  {
    quote: 'Monday mornings used to be triage. Casey absorbs the spike and my team never sees a queue. Setup took about two hours of our time in total.',
    name: 'Practice Manager',
    role: 'Multi-location dental group, Texas',
    metric: '87% fewer missed calls',
    verified: false,
  },
  {
    quote: 'The hygiene recall list used to be the thing we never got to. Now it works itself, every week, and the chairs are full.',
    name: 'Operations Lead',
    role: 'Dental practice, Arizona',
    metric: '+22 recall appointments / month',
    verified: false,
  },
];

/* ----------------------------------------------------------------------- blog */

const posts = [
  {
    slug: 'true-cost-of-a-missed-call',
    title: 'The true cost of a missed call at a dental practice',
    date: '2026-06-18',
    dateLabel: 'June 18, 2026',
    read: '7 min read',
    cat: 'Practice growth',
    excerpt: 'A missed call is a new patient who booked with the practice down the road. Here is how to actually put a number on what that costs you.',
    body: [
      ['h2', 'Start with what a patient is worth, not what a call is worth'],
      ['p', 'Most practices think about missed calls as a service problem. It is easier to fix once you treat it as an arithmetic problem. The average new dental patient in the United States is worth somewhere between $600 and $1,200 in first-year production, and considerably more over a full relationship. That is the unit you are losing — not a phone call.'],
      ['p', 'So the question is not "how many calls did we miss?" It is "how many of those callers were new patients, and what fraction of them booked somewhere else?"'],
      ['h2', 'The 67% problem'],
      ['p', 'Two-thirds of callers hang up after roughly two minutes on hold. They do not leave a voicemail and they do not call back later. In a competitive market they simply call the next practice on the search results page, and that practice answers.'],
      ['p', 'This is why voicemail volume is such a misleading metric. The patients who leave a message are the loyal ones. The ones you are losing leave nothing behind at all, which is exactly why the loss stays invisible on your reports.'],
      ['h2', 'Run the numbers on your own practice'],
      ['p', 'Take your monthly unanswered call count. Assume conservatively that 20% were prospective new patients. Multiply that by your new-patient value, then by a 50% assumption that they would have booked. For a practice missing 150 calls a month, that is 30 prospective patients, 15 lost bookings, and somewhere north of $9,000 in monthly production walking out the door.'],
      ['p', 'Then add the quieter losses: unfilled cancellations, hygiene recall you never worked, and the reschedules that became no-shows because nobody picked up.'],
      ['h2', 'Where the calls actually go missing'],
      ['p', 'It is rarely negligence. It is structural. Call volume spikes between 8am and 10am, exactly when your front desk is checking in the morning’s patients. It spikes again over lunch, when you are short-staffed by design. And roughly a third of patient call demand happens outside your opening hours entirely.'],
      ['p', 'No amount of staff discipline fixes a demand curve. You either add capacity at the peaks or you accept the losses.'],
      ['h2', 'What to do about it this month'],
      ['p', 'Pull your call log and get three numbers: total inbound calls, answered calls, and average time to answer. Most practice phone systems will export this in a few clicks. If your answer rate is under 85% or your average time to answer is over 30 seconds, you have a measurable revenue leak, and now you know roughly how big it is.'],
      ['p', 'Fix the peaks first. Whether that is another person, an answering service, or an AI receptionist matters less than making sure the 8am rush and the after-hours window stop going to voicemail.'],
    ],
  },
  {
    slug: 'ai-receptionist-buyers-guide',
    title: 'What to ask before you buy an AI receptionist',
    date: '2026-05-30',
    dateLabel: 'May 30, 2026',
    read: '9 min read',
    cat: 'Buying guide',
    excerpt: 'Every vendor in this category demos beautifully. These are the questions that separate a genuine front-desk replacement from a glorified phone tree with a nicer voice.',
    body: [
      ['h2', 'Does it write to your system, or just read from it?'],
      ['p', 'This is the single most revealing question, and a lot of products fail it. Reading availability is easy. Writing a confirmed appointment back into Dentrix or Epic — respecting operatory constraints, provider rules, and appointment-type duration — is the hard part.'],
      ['p', 'If the assistant only takes a request and emails your front desk to complete it, you have not automated anything. You have moved the work and added a step. Ask to watch an appointment appear in a live test system during the demo.'],
      ['h2', 'What happens on the calls it cannot handle?'],
      ['p', 'No assistant handles everything, and any vendor claiming otherwise is selling you a future disappointment. What matters is the failure mode. Does it transfer to a human with context, or dump the caller into a queue? Does your staff hear a summary before they pick up, or start from scratch?'],
      ['p', 'Ask specifically about emergency handling. The answer should involve an immediate live transfer on emergency language, with no triage attempt and no hold.'],
      ['h2', 'Ask for the BAA before you ask for the price'],
      ['p', 'Any vendor touching PHI must sign a Business Associate Agreement. If that takes more than one email to obtain, treat it as a signal about how seriously they take compliance generally.'],
      ['p', 'Be equally sceptical of the phrase "HIPAA certified". There is no certifying body for HIPAA, so the phrase is at best sloppy and at worst deliberately misleading. Ask instead: where is data stored, how long is it retained, who internally can access it, and is our data used to train shared models? The last one should be a firm no.'],
      ['h2', 'Listen to real recordings, not the demo reel'],
      ['p', 'Every vendor has a polished sample. Ask for unedited recordings from a practice of your size and speciality, including calls that went badly. A vendor confident in their product will share the messy ones, because the recovery is the impressive part.'],
      ['p', 'While you listen, time the pickup. Anything over three seconds feels like dead air to a patient, and the pause before each response matters more to perceived quality than the voice itself.'],
      ['h2', 'Understand the pricing shape, not just the number'],
      ['p', 'Per-minute pricing aligns the vendor’s incentives against yours — they earn more when calls run long. Per-seat pricing punishes you for giving your team visibility. A fixed monthly fee tied to call volume is the cleanest structure, and ask directly what happens when you exceed it.'],
      ['h2', 'Insist on a real pilot'],
      ['p', 'Start in overflow-only mode on a single location. Set a clear success measure before you begin — answer rate, bookings per week, staff hours recovered — and review the actual call transcripts weekly for the first month. A vendor who resists a scoped pilot is telling you something.'],
    ],
  },
  {
    slug: 'hipaa-voice-ai-what-matters',
    title: 'HIPAA and voice AI: what actually matters',
    date: '2026-05-12',
    dateLabel: 'May 12, 2026',
    read: '8 min read',
    cat: 'Compliance',
    excerpt: 'A plain-language guide to the compliance questions worth your time, the vendor claims that mean nothing, and the specific documents you should have on file before going live.',
    body: [
      ['h2', 'There is no such thing as HIPAA certification'],
      ['p', 'Let us clear this up first, because it shapes everything else. HHS does not certify anyone as HIPAA compliant. There is no audit, no badge, and no registry. Compliance is a continuous obligation, not a certificate you hang on the wall.'],
      ['p', 'So when a vendor’s homepage says "HIPAA certified", you have learned something useful — just not what they intended. Look for specific, checkable claims instead.'],
      ['h2', 'The BAA is the actual foundation'],
      ['p', 'Any vendor that creates, receives, maintains, or transmits PHI on your behalf is a business associate and must sign a Business Associate Agreement. This is not optional and it is not negotiable. Without a signed BAA, using the service with patient data puts your practice in breach, regardless of how secure the vendor’s engineering actually is.'],
      ['p', 'Read what the BAA says about subcontractors. Voice AI usually involves several downstream processors for speech recognition, language modelling, and telephony. Each one touching PHI needs to be covered.'],
      ['h2', 'Three questions that reveal the most'],
      ['p', 'First: is our data used to train models? For any shared or third-party model, the answer must be no. Get it in writing in the contract, not in a sales email.'],
      ['p', 'Second: what is the retention policy, and can we change it? You should be able to set how long audio and transcripts live, including discarding audio at the end of the call and keeping only the structured outcome written to the chart.'],
      ['p', 'Third: who internally can access our recordings? The answer should involve named roles, least-privilege access, and an audit log you can request.'],
      ['h2', 'Encryption is table stakes, not a differentiator'],
      ['p', 'TLS 1.3 in transit and AES-256 at rest is the baseline. If a vendor leads with encryption as their headline security feature, they are describing the floor as though it were the ceiling. The more interesting questions are about key management, access control, and data residency.'],
      ['h2', 'Data residency and offshore access'],
      ['p', 'Ask where processing happens and where data rests, and ask separately whether any personnel outside the United States can access recordings or transcripts. These are different questions and a vendor can pass the first while failing the second.'],
      ['h2', 'Your own obligations do not disappear'],
      ['p', 'Update your Notice of Privacy Practices to reflect automated call handling. Check your state’s call-recording consent rules, since roughly a dozen states require all-party consent. Add the vendor to your risk analysis and your incident response plan. Compliance is shared, and the parts that stay yours stay yours.'],
      ['h2', 'A short pre-launch checklist'],
      ['p', 'Signed BAA on file. Written confirmation that your data is not used for model training. Documented retention settings that you chose. A named security contact. Breach notification terms you have actually read. Recording consent language reviewed against your state law. Get those six things and you are in far better shape than most practices going live this year.'],
    ],
  },
];

/* ------------------------------------------------------------------ nav model */

const nav = {
  services: {
    label: 'Services',
    href: '/services.html',
    items: services,
    promo: {
      title: 'Hear Casey handle a real call',
      body: 'Two minutes, unedited. Booking, insurance, and an escalation to a human.',
      cta: 'Listen to the demo',
      href: '/index.html#demo',
    },
  },
  useCases: {
    label: 'Use Cases',
    href: '/use-cases.html',
    items: useCases,
    promo: {
      title: 'Work out your own numbers',
      body: 'Two sliders, honest maths. See what your missed calls are costing you.',
      cta: 'Open the ROI calculator',
      href: '/roi-calculator.html',
    },
  },
  simple: [
    { label: 'How it works', href: '/how-it-works.html' },
    { label: 'Integrations', href: '/integrations.html' },
    { label: 'Pricing', href: '/pricing.html' },
    { label: 'Results', href: '/results.html' },
  ],
};

const footerNav = [
  {
    title: 'Product',
    links: [
      { label: 'How it works', href: '/how-it-works.html' },
      { label: 'All services', href: '/services.html' },
      { label: 'Use cases', href: '/use-cases.html' },
      { label: 'Integrations', href: '/integrations.html' },
      { label: 'Security', href: '/security.html' },
      { label: 'Pricing', href: '/pricing.html' },
    ],
  },
  {
    title: 'Services',
    links: services.slice(0, 6).map((s) => ({ label: s.title, href: `/services.html#${s.slug}` })),
  },
  {
    title: 'Use cases',
    links: useCases.slice(0, 6).map((u) => ({ label: u.title, href: `/use-cases.html#${u.slug}` })),
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about.html' },
      { label: 'Results', href: '/results.html' },
      { label: 'Blog', href: '/blog.html' },
      { label: 'FAQ', href: '/faq.html' },
      { label: 'Contact', href: '/contact.html' },
      { label: 'ROI calculator', href: '/roi-calculator.html' },
    ],
  },
];

const legalNav = [
  { label: 'Privacy Policy', href: '/privacy.html' },
  { label: 'Terms of Service', href: '/terms.html' },
  { label: 'HIPAA Notice', href: '/hipaa.html' },
];

module.exports = {
  site, heroStats, keyStats, trustBadges, services, useCases, integrations, telephony, samples,
  steps, pricing, pricingIncludes, securityItems, faqs, testimonials, posts,
  nav, footerNav, legalNav,
};
