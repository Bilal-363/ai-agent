'use strict';

/**
 * Inline SVG icon set. Stroke-based, 24x24, currentColor.
 * Keeping icons inline means zero extra network requests and perfect theming.
 */

const P = {
  'calendar-check': '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18M9 16l2 2 4-4"/>',
  'shield-check': '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/>',
  pill: '<path d="M10.5 20.5a6.36 6.36 0 0 1-9-9l7-7a6.36 6.36 0 0 1 9 9z"/><path d="M8.5 8.5l7 7"/>',
  refresh: '<path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 3v6h-6"/>',
  bell: '<path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>',
  'message-square': '<path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M8 9h8M8 13h5"/>',
  'user-plus': '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6M22 11h-6"/>',
  'file-text': '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M9 13h6M9 17h6"/>',
  'phone-forwarded': '<path d="M18 2l4 4-4 4M15 6h7"/><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.5 2.8.6a2 2 0 0 1 1.7 2.1z"/>',
  moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  tooth: '<path d="M12 5.5c-1.7-1.9-4.4-2.6-6.2-1.2C3.7 5.9 3.4 9.4 4.4 12c.7 1.9.9 3.5 1 5.6.1 1.9.4 3.4 1.6 3.4 1.4 0 1.6-2.1 1.9-4 .3-1.7.6-3 1.9-3s1.6 1.3 1.9 3c.3 1.9.5 4 1.9 4 1.2 0 1.5-1.5 1.6-3.4.1-2.1.3-3.7 1-5.6 1-2.6.7-6.1-1.4-7.7-1.8-1.4-4.5-.7-6.2 1.2z"/>',
  stethoscope: '<path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6 6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.3.3 0 1 0 .3.3"/><path d="M8 15v1a6 6 0 0 0 6 6 6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/>',
  building: '<rect x="3" y="2" width="8" height="20" rx="1"/><path d="M11 8h9a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-9"/><path d="M6 6h2M6 10h2M6 14h2M6 18h2M15 12h2M15 16h2"/>',
  network: '<rect x="9" y="2" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="16" y="16" width="6" height="6" rx="1"/><path d="M12 8v4M12 12H5v4M12 12h7v4"/>',
  activity: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
  'heart-handshake': '<path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7z"/><path d="M12 5.4l-2 2a2 2 0 0 0 0 2.8 2 2 0 0 0 2.8 0l1.3-1.3 2.4 2.3"/>',
  headset: '<path d="M3 14v-3a9 9 0 0 1 18 0v3"/><path d="M21 16a2 2 0 0 1-2 2h-1v-6h1a2 2 0 0 1 2 2zM3 16a2 2 0 0 0 2 2h1v-6H5a2 2 0 0 0-2 2z"/><path d="M18 18v1a3 3 0 0 1-3 3h-3"/>',
  'phone-missed': '<path d="M22 2l-6 6M16 2l6 6"/><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.5 2.8.6a2 2 0 0 1 1.7 2.1z"/>',
  'calendar-x': '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18M10 15l4 4M14 15l-4 4"/>',
  'user-check': '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M16 11l2 2 4-4"/>',
  'arrow-right': '<path d="M5 12h14M13 5l7 7-7 7"/>',
  'arrow-up': '<path d="M12 19V5M5 12l7-7 7 7"/>',
  check: '<path d="M20 6L9 17l-5-5"/>',
  'chevron-down': '<path d="M6 9l6 6 6-6"/>',
  'chevron-right': '<path d="M9 18l6-6-6-6"/>',
  menu: '<path d="M3 12h18M3 6h18M3 18h18"/>',
  x: '<path d="M18 6L6 18M6 6l12 12"/>',
  phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.5 2.8.6a2 2 0 0 1 1.7 2.1z"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 6L2 7"/>',
  play: '<path d="M6 3l14 9-14 9z"/>',
  pause: '<rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/>',
  zap: '<path d="M13 2L3 14h9l-1 8 10-12h-9z"/>',
  lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  server: '<rect x="2" y="3" width="20" height="8" rx="2"/><rect x="2" y="13" width="20" height="8" rx="2"/><path d="M6 7h.01M6 17h.01"/>',
  'eye-off': '<path d="M9.9 4.2A10.9 10.9 0 0 1 12 4c7 0 10 8 10 8a18 18 0 0 1-2.2 3.2M6.6 6.6A18 18 0 0 0 2 12s3 8 10 8a10.9 10.9 0 0 0 4.2-.8"/><path d="M14.1 14.1a3 3 0 1 1-4.2-4.2M2 2l20 20"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20z"/>',
  'trending-up': '<path d="M22 7l-8.5 8.5-5-5L2 17"/><path d="M16 7h6v6"/>',
  star: '<path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/>',
  quote: '<path d="M9 11H5a1 1 0 0 1-1-1V7a3 3 0 0 1 3-3h1a1 1 0 0 1 1 1zM19 11h-4a1 1 0 0 1-1-1V7a3 3 0 0 1 3-3h1a1 1 0 0 1 1 1z"/><path d="M9 11v3a6 6 0 0 1-5 5.9M19 11v3a6 6 0 0 1-5 5.9"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  sparkles: '<path d="M12 3l1.9 4.6L18.5 9.5l-4.6 1.9L12 16l-1.9-4.6L5.5 9.5l4.6-1.9z"/><path d="M19 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8zM5 16l.6 1.4 1.4.6-1.4.6L5 20l-.6-1.4L3 18l1.4-.6z"/>',
  database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.7-4 3-9 3s-9-1.3-9-3"/><path d="M3 5v14c0 1.7 4 3 9 3s9-1.3 9-3V5"/>',
  workflow: '<rect x="3" y="3" width="7" height="6" rx="1"/><rect x="14" y="15" width="7" height="6" rx="1"/><path d="M6.5 9v5a4 4 0 0 0 4 4h3.5"/>',
  sliders: '<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>',
  mic: '<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M19 10v1a7 7 0 0 1-14 0v-1M12 18v4M8 22h8"/>',
  copy: '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
  'map-pin': '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
  users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
  'dollar-sign': '<path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
  languages: '<path d="M5 8h9M9 4v4c0 4-1.8 7.5-5 9"/><path d="M9 11c0 3.5 2.4 6.5 6 8"/><path d="M22 22l-5-11-5 11M14.5 18h5"/>',
  'book-open': '<path d="M12 7v14M2 5h6a4 4 0 0 1 4 2 4 4 0 0 1 4-2h6v13h-6a4 4 0 0 0-4 2 4 4 0 0 0-4-2H2z"/>',
  target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  gauge: '<path d="M12 14l4-4"/><path d="M3.3 18a10 10 0 1 1 17.4 0"/>',
  'plug-zap': '<path d="M13 2l-3 6h5l-3 6"/><path d="M18 12h2a2 2 0 0 1 2 2v2a4 4 0 0 1-4 4h-1v2M6 12H4a2 2 0 0 0-2 2v2a4 4 0 0 0 4 4h1v2"/>',
  tiktok: '<path d="M16 3v1.5a5 5 0 0 0 5 5V13a8.4 8.4 0 0 1-5-1.7V16a5.5 5.5 0 1 1-5.5-5.5c.3 0 .6 0 .9.1v3.1a2.4 2.4 0 1 0 1.7 2.3V3z" stroke="none" fill="currentColor"/>',
  youtube: '<path d="M22.5 6.5a3 3 0 0 0-2.1-2.1C18.6 4 12 4 12 4s-6.6 0-8.4.4A3 3 0 0 0 1.5 6.5C1 8.3 1 12 1 12s0 3.7.5 5.5a3 3 0 0 0 2.1 2.1C5.4 20 12 20 12 20s6.6 0 8.4-.4a3 3 0 0 0 2.1-2.1C23 15.7 23 12 23 12s0-3.7-.5-5.5z"/><path d="M10 8.5l6 3.5-6 3.5z"/>',
  twitter: '<path d="M18.2 2H21l-6.6 7.6L21.8 22h-6.4l-4.4-6-5 6H3.2l7-8L2.6 2H9l4.1 5.6zM16.9 20.3h1.7L7.2 3.6H5.4z" stroke="none" fill="currentColor"/>',
  linkedin: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-13h4v1.7A6 6 0 0 1 16 8z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>',
};

/** @returns {string} inline <svg> markup */
function icon(name, cls = '') {
  const body = P[name];
  if (!body) throw new Error(`Unknown icon: ${name}`);
  return `<svg class="i${cls ? ' ' + cls : ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${body}</svg>`;
}

module.exports = { icon, iconNames: Object.keys(P) };
