// Flat illustrations (no outlines, flat fills, one mascot). Pure SVG strings.
'use strict';
const { C, S } = require('./lib');

const K = {
  ink: C.ink, gold: C.gold, goldD: '#E09B12', goldL: C.goldL, goldH: '#FFD86B', wheat: '#C98A0A',
  olive: C.olive, oliveD: C.oliveD, oliveL: C.oliveL, sage: C.sage, sageD: C.sageD, sageL: C.sageL, lime: C.lime,
  orange: C.orange, orangeD: C.orangeD, orangeL: C.orangeL, cream: C.cream, paper: C.paper, white: '#FFFFFF',
};
const svg = (w, h, inner, vb) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="${vb || `0 0 ${w} ${h}`}" fill="none">${inner}</svg>`;

// ---------- mascot ----------
function eyes(mood) {
  const dot = (x, y, dx = 0, dy = 0) => `<ellipse cx="${x}" cy="${y}" rx="6.2" ry="8" fill="${K.ink}"/><circle cx="${x + 2.2 + dx}" cy="${y - 2.8 + dy}" r="2.4" fill="#fff"/>`;
  if (mood === 'joy') return `<path d="M52 82q8-12 16 0M92 82q8-12 16 0" stroke="${K.ink}" stroke-width="4.6" stroke-linecap="round"/>`;
  if (mood === 'sleepy') return `<path d="M52 78q8 9 16 0M92 78q8 9 16 0" stroke="${K.ink}" stroke-width="4.6" stroke-linecap="round"/>`;
  if (mood === 'sad') return dot(60, 80) + dot(100, 80) + `<path d="M49 71l17-6M111 71l-17-6" stroke="${K.ink}" stroke-width="4" stroke-linecap="round"/>`;
  if (mood === 'think') return dot(60, 80, 1.6, -1.4) + dot(100, 80, 1.6, -1.4);
  return dot(60, 80) + dot(100, 80);
}
function mouth(mood) {
  if (mood === 'joy') return `<path d="M68 92q12 20 24 0z" fill="${K.ink}"/><path d="M73 100q7 8 14 0q-7-3-14 0z" fill="${K.orange}"/>`;
  if (mood === 'sleepy') return `<ellipse cx="80" cy="98" rx="5" ry="4.2" fill="${K.ink}"/>`;
  if (mood === 'sad') return `<path d="M70 102q10-10 20 0" stroke="${K.ink}" stroke-width="4.4" stroke-linecap="round"/>`;
  if (mood === 'think') return `<path d="M74 98h12" stroke="${K.ink}" stroke-width="4.4" stroke-linecap="round"/>`;
  return `<path d="M70 93q10 12 20 0" stroke="${K.ink}" stroke-width="4.6" stroke-linecap="round"/>`;
}
// returns inner markup in a 160 x 146 box
function rotiInner(mood = 'happy', arms = 'down') {
  const armsBack = arms === 'up'
    ? `<path d="M24 90L8 52" stroke="${K.goldD}" stroke-width="14" stroke-linecap="round"/><path d="M136 90l16-38" stroke="${K.goldD}" stroke-width="14" stroke-linecap="round"/>`
    : `<ellipse cx="17" cy="100" rx="9" ry="13" fill="${K.goldD}" transform="rotate(14 17 100)"/><ellipse cx="143" cy="100" rx="9" ry="13" fill="${K.goldD}" transform="rotate(-14 143 100)"/>`;
  return `
  <ellipse cx="80" cy="137" rx="56" ry="7" fill="${K.oliveD}" opacity=".16"/>
  ${armsBack}
  <path d="M16 94C16 44 44 8 80 8s64 36 64 86c0 24-17 34-64 34S16 118 16 94z" fill="${K.gold}"/>
  <path d="M16 94c0 24 17 34 64 34s64-10 64-34c-9 15-31 22-64 22S25 109 16 94z" fill="${K.goldD}"/>
  <path d="M32 60c4-20 18-34 37-40-13 11-21 25-23 44z" fill="${K.goldH}"/>
  <path d="M63 22l-5 17M82 19l-1 18M101 22l5 17" stroke="${K.goldD}" stroke-width="6" stroke-linecap="round"/>
  <ellipse cx="47" cy="96" rx="8" ry="5" fill="${K.orange}" opacity=".5"/><ellipse cx="113" cy="96" rx="8" ry="5" fill="${K.orange}" opacity=".5"/>
  ${eyes(mood)}${mouth(mood)}`;
}
const roti = (w, mood = 'happy', arms = 'down') => svg(w, Math.round(w * 146 / 160), rotiInner(mood, arms), '0 0 160 146');
const rotiN = (w, mood, arms, n = 'Maskot roti') => S(roti(w, mood, arms), { w, h: Math.round(w * 146 / 160), n });

// ---------- scene helpers ----------
const hill = (w, y, amp, h, fill) => `<path d="M0 ${y}Q${w * 0.28} ${y - amp} ${w * 0.55} ${y - amp * 0.2}T${w} ${y - amp * 0.5}V${h}H0z" fill="${fill}"/>`;
const furrow = (w, y, amp, stroke, op = 1) => `<path d="M-6 ${y}Q${w * 0.3} ${y - amp} ${w * 0.6} ${y - amp * 0.3}T${w + 6} ${y - amp * 0.7}" stroke="${stroke}" stroke-width="3" stroke-linecap="round" opacity="${op}"/>`;
const wheat = (x, y, s = 1, col = K.goldD) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0V-62" stroke="${K.sageD}" stroke-width="3" stroke-linecap="round"/>${[-52, -40, -28, -16].map((yy, i) => `<ellipse cx="-6" cy="${yy}" rx="4" ry="8" fill="${col}" transform="rotate(-28 -6 ${yy})"/><ellipse cx="6" cy="${yy - 4}" rx="4" ry="8" fill="${col}" transform="rotate(28 6 ${yy - 4})"/>`).join('')}<ellipse cx="0" cy="-68" rx="4" ry="9" fill="${col}"/></g>`;
const cloud = (x, y, s = 1, f = K.paper) => `<g transform="translate(${x} ${y}) scale(${s})" fill="${f}"><circle cx="0" cy="0" r="10"/><circle cx="14" cy="-5" r="13"/><circle cx="30" cy="0" r="10"/><rect x="-10" y="0" width="50" height="10" rx="5"/></g>`;
const sunRays = (cx, cy, r1, r2, n, col, wdt = 9) => Array.from({ length: n }, (_, i) => { const a = (Math.PI * i) / (n - 1); const x1 = cx - Math.cos(a) * r1, y1 = cy - Math.sin(a) * r1, x2 = cx - Math.cos(a) * r2, y2 = cy - Math.sin(a) * r2; return `<path d="M${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}" stroke="${col}" stroke-width="${wdt}" stroke-linecap="round"/>`; }).join('');

// ---------- welcome scene ----------
// Sun sits clear of the mascot so the two gold shapes never merge into one blob.
function welcome(w = 390, h = 300) {
  const cx = w / 2, g = h - 38;
  const inner = `<rect width="${w}" height="${h}" fill="#FFF6E2"/>
  ${sunRays(w - 64, 70, 50, 66, 7, K.gold, 7)}
  <circle cx="${w - 64}" cy="70" r="37" fill="${K.gold}"/>
  ${cloud(36, 60, .9, '#fff')}${cloud(130, 42, .7, '#fff')}
  <path d="M0 ${g - 70}Q${w * .26} ${g - 96} ${w * .54} ${g - 74}T${w} ${g - 92}V${h}H0z" fill="${K.lime}"/>
  ${furrow(w, g - 52, 16, '#D6F09F')}
  <path d="M0 ${g - 40}Q${w * .3} ${g - 66} ${w * .6} ${g - 44}T${w} ${g - 58}V${h}H0z" fill="${K.sage}"/>
  ${furrow(w, g - 22, 14, '#CDEA9B')}
  <path d="M0 ${g - 10}Q${w * .34} ${g - 32} ${w * .64} ${g - 12}T${w} ${g - 26}V${h}H0z" fill="${K.olive}"/>
  ${wheat(46, g - 6, 1.05, '#C98A0A')}${wheat(68, g + 2, .8, K.gold)}${wheat(w - 46, g - 8, 1, '#C98A0A')}${wheat(w - 68, g + 2, .78, K.gold)}
  <g transform="translate(${cx - 84} ${g - 164}) scale(1.05)">${rotiInner('joy', 'up')}</g>`;
  return S(svg(w, h, inner), { w, h, n: 'Ilustrasi / Welcome' });
}

// ---------- envelope 342 x 190 ----------
function envelope(w = 342, h = 200) {
  const inner = `
  <ellipse cx="171" cy="176" rx="104" ry="10" fill="${K.oliveD}" opacity=".12"/>
  <circle cx="171" cy="96" r="84" fill="${K.goldL}"/>
  <rect x="106" y="26" width="130" height="112" rx="12" fill="#fff"/>
  <path d="M126 58h54M126 76h72M126 94h46" stroke="${C.line}" stroke-width="7" stroke-linecap="round"/>
  <path d="M86 78L171 138 256 78V150a14 14 0 0 1-14 14H100a14 14 0 0 1-14-14z" fill="${K.gold}"/>
  <path d="M86 78v72a14 14 0 0 0 14 14h6L171 118z" fill="${K.goldD}" opacity=".35"/>
  <path d="M86 150a14 14 0 0 0 14 14h142a14 14 0 0 0 14-14l-85-44z" fill="${K.goldL}"/>
  <circle cx="236" cy="48" r="28" fill="${K.olive}"/><path d="M223 48l9 9 17-19" stroke="${K.paper}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
  <g transform="translate(44 134)">${wheat(0, 40, 0.8)}</g>
  <circle cx="82" cy="40" r="4.5" fill="${K.orange}"/><circle cx="288" cy="116" r="5" fill="${K.orange}"/><circle cx="268" cy="150" r="3" fill="${K.olive}"/>`;
  return S(svg(w, h, inner), { w, h, n: 'Ilustrasi / Verifikasi' });
}

// ---------- service art (panel with object) ----------
function objTakar() {
  return `
  <g transform="translate(-58 -6) rotate(-18)"><rect x="-4" y="-5" width="60" height="9" rx="4.5" fill="${K.ink}"/><ellipse cx="-12" cy="0" rx="16" ry="11" fill="${K.ink}"/><ellipse cx="-12" cy="-1" rx="11" ry="7" fill="${K.goldL}"/></g>
  <path d="M-34 -80H34L28.4 -7a10 10 0 0 1-10 9H-18.4a10 10 0 0 1-10-9z" fill="#FFF9E8"/>
  <path d="M-31 -44H31.2L28.4 -7a10 10 0 0 1-10 9H-18.4a10 10 0 0 1-10-9z" fill="${K.goldL}"/>
  <path d="M33 -68H46a13 13 0 0 1 0 38H29" stroke="#FFF9E8" stroke-width="9" stroke-linecap="round"/>
  <rect x="-37" y="-85" width="74" height="9" rx="4.5" fill="#EAD9A8"/>
  <path d="M-29 -66h9M-29 -57h5M-29 -48h9" stroke="${K.goldD}" stroke-width="3" stroke-linecap="round"/>
  <ellipse cx="-11" cy="-30" rx="3.6" ry="4.8" fill="${K.ink}"/><ellipse cx="11" cy="-30" rx="3.6" ry="4.8" fill="${K.ink}"/>
  <circle cx="-9.8" cy="-31.6" r="1.4" fill="#fff"/><circle cx="12.2" cy="-31.6" r="1.4" fill="#fff"/>
  <path d="M-6 -20q6 7 12 0" stroke="${K.ink}" stroke-width="3" stroke-linecap="round"/>
  <ellipse cx="-19" cy="-21" rx="4.5" ry="3" fill="${K.orange}" opacity=".5"/><ellipse cx="19" cy="-21" rx="4.5" ry="3" fill="${K.orange}" opacity=".5"/>`;
}
function objTimbang() {
  return `
  <rect x="-3.5" y="-84" width="7" height="14" fill="${K.goldD}"/>
  <ellipse cx="0" cy="-70" rx="50" ry="8" fill="#EAD9A8"/>
  <g transform="translate(0 -74) scale(.34)"><path d="M-80 36C-80 -2 -56 -30 0 -30S80 -2 80 36c0 14-24 22-80 22S-80 50-80 36z" fill="${K.gold}"/><path d="M-60 -6c4-14 16-22 30-24-10 8-16 16-18 28z" fill="${K.goldH}"/><path d="M-26 -22l-4 14M-4 -26l0 14M20 -22l5 14" stroke="${K.goldD}" stroke-width="9" stroke-linecap="round"/></g>
  <path d="M-48 -62H48V-16a16 16 0 0 1-16 16H-32a16 16 0 0 1-16-16z" fill="#FFF9E8"/>
  <path d="M-48 -14H48a16 16 0 0 1-16 14H-32a16 16 0 0 1-16-14z" fill="#EAD9A8"/>
  <path d="M-20 -46a20 20 0 0 1 40 0" stroke="${K.ink}" stroke-width="3.4" stroke-linecap="round" opacity=".85"/><path d="M0 -46l8 -9" stroke="${K.orange}" stroke-width="3.6" stroke-linecap="round"/><circle cx="0" cy="-46" r="3" fill="${K.orange}"/>
  <ellipse cx="-14" cy="-28" rx="3.6" ry="4.8" fill="${K.ink}"/><ellipse cx="14" cy="-28" rx="3.6" ry="4.8" fill="${K.ink}"/>
  <circle cx="-12.8" cy="-29.6" r="1.4" fill="#fff"/><circle cx="15.2" cy="-29.6" r="1.4" fill="#fff"/>
  <path d="M-6 -20q6 7 12 0" stroke="${K.ink}" stroke-width="3" stroke-linecap="round"/>
  <ellipse cx="-26" cy="-21" rx="4.5" ry="3" fill="${K.orange}" opacity=".5"/><ellipse cx="26" cy="-21" rx="4.5" ry="3" fill="${K.orange}" opacity=".5"/>`;
}
function objTumbuh() {
  return `
  <path d="M0 -50V-96" stroke="${K.oliveD}" stroke-width="5" stroke-linecap="round"/>
  <path d="M0 -76C-30 -76 -42 -94 -42 -110 -14 -110 0 -96 0 -76z" fill="${K.olive}"/>
  <path d="M0 -62C0 -86 16 -102 44 -102 44 -80 28 -62 0 -62z" fill="${K.sageD}"/>
  <path d="M0 -96c-6-8-6-16 0-22 6 6 6 14 0 22z" fill="${K.olive}"/>
  <path d="M-30 -44H30L24 -5a8 8 0 0 1-8 7H-16a8 8 0 0 1-8-7z" fill="${K.orange}"/>
  <rect x="-35" y="-52" width="70" height="13" rx="6.5" fill="${K.orangeD}"/>
  <ellipse cx="-10" cy="-25" rx="3.6" ry="4.8" fill="${K.ink}"/><ellipse cx="10" cy="-25" rx="3.6" ry="4.8" fill="${K.ink}"/>
  <circle cx="-8.8" cy="-26.6" r="1.4" fill="#fff"/><circle cx="11.2" cy="-26.6" r="1.4" fill="#fff"/>
  <path d="M-5 -16q5 6 10 0" stroke="${K.ink}" stroke-width="3" stroke-linecap="round"/>
  <ellipse cx="-18" cy="-17" rx="4" ry="2.8" fill="${K.paper}" opacity=".55"/><ellipse cx="18" cy="-17" rx="4" ry="2.8" fill="${K.paper}" opacity=".55"/>`;
}
const PANEL = {
  takar: { bg: K.gold, blob: '#FFE49A', g1: '#F0AE16', g2: '#D9910D', line: '#FFD86B', obj: objTakar },
  timbang: { bg: K.orange, blob: '#FFB184', g1: '#E8551A', g2: '#CE4310', line: '#FF9159', obj: objTimbang },
  tumbuh: { bg: K.sage, blob: '#CDEA9B', g1: '#76A83E', g2: '#5E8A2C', line: '#AEDC72', obj: objTumbuh },
};
const OBJH = { takar: 92, timbang: 104, tumbuh: 124 };
function serviceArt(kind, w, h, { radius = [24, 24, 0, 0], scale, dx = 0 } = {}) {
  const p = PANEL[kind];
  if (!scale) scale = Math.min((h * 0.78) / OBJH[kind], (w * 0.86) / 140);
  const [tl, tr, br, bl] = radius;
  const clip = `<clipPath id="c${kind}${w}"><path d="M${tl} 0H${w - tr}Q${w} 0 ${w} ${tr}V${h - br}Q${w} ${h} ${w - br} ${h}H${bl}Q0 ${h} 0 ${h - bl}V${tl}Q0 0 ${tl} 0z"/></clipPath>`;
  const gy = h * 0.74;
  const inner = `${clip}<g clip-path="url(#c${kind}${w})"><rect width="${w}" height="${h}" fill="${p.bg}"/>
  <circle cx="${w / 2 + dx}" cy="${h * 0.5}" r="${Math.min(w, h) * 0.46}" fill="${p.blob}" opacity=".55"/>
  ${hill(w, gy, 12, h, p.g1)}${furrow(w, gy + 12, 8, p.line, 0.9)}${hill(w, gy + 18, 10, h, p.g2)}${furrow(w, gy + 30, 6, p.g1, 0.8)}
  <g transform="translate(${w / 2 + dx} ${h - 10}) scale(${scale.toFixed(3)})">${p.obj()}</g></g>`;
  return S(svg(w, h, inner), { w, h, n: 'Ilustrasi / ' + kind });
}

const serviceBadge = (kind, size = 68) => serviceArt(kind, size, size, { radius: [22, 22, 22, 22] });
// ---------- states ----------
function stateScene(kind, outW = 342, outH = 230) {
  const w = 342, h = 230;
  let inner = kind === 'loading' || kind === 'success' ? '' : `<ellipse cx="${w / 2}" cy="${h - 16}" rx="116" ry="9" fill="${K.oliveD}" opacity=".12"/>`;
  if (kind === 'empty') {
    inner += `<circle cx="${w / 2}" cy="104" r="86" fill="${K.goldL}"/>
    <rect x="52" y="140" width="238" height="62" rx="16" fill="#F2E3BC"/><rect x="52" y="140" width="238" height="16" rx="8" fill="#E5CF93"/><rect x="68" y="162" width="206" height="28" rx="8" fill="#FFF8E4"/>
    <g transform="translate(${w / 2 - 49} 40) scale(.62)">${rotiInner('sleepy')}</g>
    <path d="M232 56h14l-14 16h14M256 36h10l-10 12h10" stroke="${K.sageD}" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>`;
  } else if (kind === 'error') {
    inner += `<circle cx="${w / 2}" cy="104" r="86" fill="${K.orangeL}"/>
    <g transform="translate(${w / 2 - 49} 24) scale(.62)">${rotiInner('sad')}</g>
    <rect x="58" y="162" width="64" height="18" rx="9" fill="${K.ink}"/><rect x="118" y="158" width="14" height="26" rx="4" fill="${K.goldD}"/><path d="M132 166h10M132 176h10" stroke="${K.goldD}" stroke-width="3.4" stroke-linecap="round"/>
    <rect x="220" y="162" width="64" height="18" rx="9" fill="${K.ink}"/><rect x="208" y="158" width="14" height="26" rx="4" fill="${K.goldD}"/><path d="M198 166h10M198 176h10" stroke="${K.goldD}" stroke-width="3.4" stroke-linecap="round"/>
    <path d="M152 150l10 10M162 150l-10 10" stroke="${K.err}" stroke-width="4" stroke-linecap="round"/>
    <circle cx="86" cy="54" r="4.5" fill="${K.orange}"/><circle cx="268" cy="70" r="3.5" fill="${K.sageD}"/>`;
  } else if (kind === 'loading') {
    inner += `<circle cx="${w / 2}" cy="108" r="90" stroke="${C.line}" stroke-width="12"/>
    <path class="r-spin" d="M${w / 2} 18a90 90 0 0 1 85 62" stroke="${K.olive}" stroke-width="12" stroke-linecap="round"/>
    <g transform="translate(${w / 2 - 62} 52) scale(.78)">${rotiInner('think')}</g>`;
  } else if (kind === 'success') {
    const conf = [[44, 34, K.orange, 7], [296, 50, K.olive, 8], [70, 104, K.sage, 6], [276, 126, K.gold, 7], [118, 18, K.gold, 5], [228, 22, K.orange, 5], [36, 168, K.olive, 5], [308, 176, K.orange, 5]];
    inner = sunRays(w / 2, 150, 96, 118, 9, K.gold, 10) + `<circle cx="${w / 2}" cy="150" r="80" fill="${K.gold}"/>
    ${hill(w, 176, 18, h, K.sage)}${furrow(w, 192, 14, '#B2DC72')}${hill(w, 206, 14, h, K.olive)}${furrow(w, 218, 10, '#73A833')}
    <g transform="translate(${w / 2 - 70} 52) scale(.88)">${rotiInner('joy', 'up')}</g>
    ${conf.map(([x, y, c, r], i) => (i % 2 ? `<rect x="${x}" y="${y}" width="${r * 1.6}" height="${r * 0.7}" rx="2" fill="${c}" transform="rotate(${i * 37} ${x} ${y})"/>` : `<circle cx="${x}" cy="${y}" r="${r / 1.6}" fill="${c}"/>`)).join('')}`;
  }
  return S(svg(outW, outH, inner, '0 0 342 230'), { w: outW, h: outH, n: 'Ilustrasi / ' + kind });
}

// Full-bleed finish scene on one continuous deep-green field, so the screen behind it
// (same oliveD) reads as one uninterrupted frame. The sun is orange and the mascot gold,
// so the two large shapes stay separate instead of merging.
function readyFull(w = 390, h = 620) {
  const cx = w / 2, g = 544;
  const conf = [[48, 142, K.gold, 1], [338, 176, K.lime, 0], [74, 262, K.gold, 0], [322, 286, K.lime, 1], [144, 98, K.lime, 0], [254, 90, K.gold, 1], [40, 346, K.lime, 1], [350, 362, K.gold, 0]];
  const inner = `<rect width="${w}" height="${h}" fill="${K.oliveD}"/>
  <g class="r-rays">${sunRays(cx, 228, 92, 126, 11, K.orange, 10)}</g>
  <circle cx="${cx}" cy="228" r="72" fill="${K.orange}"/>
  <path d="M0 ${g - 86}Q${w * .26} ${g - 126} ${w * .54} ${g - 92}T${w} ${g - 118}V${h}H0z" fill="${K.lime}"/>
  ${furrow(w, g - 62, 20, '#D6F09F')}
  <path d="M0 ${g - 44}Q${w * .3} ${g - 82} ${w * .6} ${g - 50}T${w} ${g - 72}V${h}H0z" fill="${K.sage}"/>
  ${furrow(w, g - 20, 16, '#CDEA9B')}
  <path d="M0 ${g}Q${w * .34} ${g - 30} ${w * .64} ${g + 4}T${w} ${g - 14}V${h}H0z" fill="${K.olive}"/>
  ${furrow(w, g + 28, 14, '#73A833')}
  <path d="M0 ${g + 46}Q${w * .4} ${g + 22} ${w * .7} ${g + 50}T${w} ${g + 34}V${h}H0z" fill="${K.oliveD}"/>
  ${wheat(44, g + 6, 1.3, '#C98A0A')}${wheat(70, g + 16, 1, K.gold)}${wheat(w - 44, g + 4, 1.25, '#C98A0A')}${wheat(w - 70, g + 16, .95, K.gold)}
  <g transform="translate(${cx - 112} ${g - 202}) scale(1.4)">${rotiInner('joy', 'up')}</g>
  ${conf.map(([x, y, c, sq], i) => (sq ? `<rect class="r-conf" style="--d:${i * 0.4}s" x="${x}" y="${y}" width="11" height="5" rx="2.5" fill="${c}" transform="rotate(${i * 41} ${x} ${y})"/>` : `<circle class="r-conf" style="--d:${i * 0.4}s" cx="${x}" cy="${y}" r="4.5" fill="${c}"/>`)).join('')}`;
  return S(svg(w, h, inner), { w, h, n: 'Ilustrasi / Usahamu siap' });
}

// books (academy)
function books(w = 342, h = 150) {
  const inner = `<rect width="${w}" height="${h}" rx="24" fill="${K.sage}"/>
  <circle cx="228" cy="76" r="62" fill="${K.sageL}" opacity=".6"/>
  ${hill(w, 118, 12, h, '#8FA462')}${hill(w, 134, 8, h, K.sageD)}
  <g transform="translate(190 104)">
   <rect x="-60" y="-14" width="120" height="26" rx="6" fill="${K.olive}"/><rect x="-54" y="-8" width="108" height="14" rx="3" fill="${K.cream}"/><rect x="-60" y="-14" width="12" height="26" rx="4" fill="${K.oliveD}"/>
   <rect x="-52" y="-40" width="108" height="26" rx="6" fill="${K.orange}"/><rect x="-44" y="-34" width="98" height="14" rx="3" fill="${K.cream}"/><rect x="-52" y="-40" width="12" height="26" rx="4" fill="${K.orangeD}"/>
   <rect x="-44" y="-64" width="96" height="24" rx="6" fill="${K.gold}"/><rect x="-36" y="-58" width="86" height="12" rx="3" fill="${K.cream}"/><rect x="-44" y="-64" width="12" height="24" rx="4" fill="${K.goldD}"/>
  </g>
  <g transform="translate(276 124)"><path d="M0 0V-30" stroke="${K.oliveD}" stroke-width="4" stroke-linecap="round"/><path d="M0 -14C-18 -14 -24 -26 -24 -36 -8 -36 0 -28 0 -14z" fill="${K.olive}"/><path d="M0 -22C0 -36 8 -44 24 -44 24 -30 16 -22 0 -22z" fill="${K.paper}" opacity=".9"/></g>
  <g transform="translate(14 58) scale(.56)">${rotiInner('happy')}</g>`;
  return S(svg(w, h, inner), { w, h, n: 'Ilustrasi / Academy' });
}

// small scene card for step coach: only mascot
const coachRoti = (mood) => rotiN(60, mood, 'down', 'Maskot');

// tail for speech bubble pointing left
const tail = S(`<svg xmlns="http://www.w3.org/2000/svg" width="12" height="20" viewBox="0 0 12 20" fill="none"><path d="M12 0v20L0 12.5Q-1 10 0 8z" fill="${C.white}"/></svg>`, { w: 12, h: 20, n: 'Ekor bubble' });

module.exports = { readyFull, serviceBadge, roti, rotiN, coachRoti, welcome, envelope, serviceArt, stateScene, books, tail, rotiInner, svg, K };
