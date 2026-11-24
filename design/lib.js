// RASANA V4 design DSL. One tree, two renderers (HTML preview, Figma plugin).
// Token discipline: 6 type sizes, 6 spacing steps, 6 radii. Enforced by validate().
'use strict';

// ============ COLOR ============
// Core (3): olive = action, cream/white = surface, ink = text. Accent (1): orange.
// gold / lime / sage are illustration and data-viz tokens only, never UI chrome.
const C = {
  // surface
  bg: '#FFFCF5', white: '#FFFFFF', paper: '#FFFFFF', cream: '#FFF2D9',
  line: '#EDE2CA', lineD: '#D9CBA8',
  // text
  ink: '#16240D', ink2: '#53624A', ink3: '#667459',
  // brand action
  olive: '#4C7A1E', oliveD: '#35570F', oliveL: '#E9F6D2',
  // accent
  orange: '#FF6A1F', orangeD: '#C7410A', orangeL: '#FFE4D3',
  // illustration / data
  gold: '#FFC224', goldD: '#A8740A', goldL: '#FFF0C0',
  lime: '#B7E34E', sage: '#8CC152', sageD: '#5E8A2C', sageL: '#E6F4CE',
  // semantic
  err: '#C22A11', errL: '#FFE2DB',
};

// ============ SCALES ============
const SP = [0, 4, 8, 12, 16, 24, 32];            // spacing
const RA = [0, 8, 12, 16, 20, 28, 36, 999];      // radius
const TS = [12, 14, 16, 20, 28];                 // type size
const LH = { 12: 16, 14: 20, 16: 22, 20: 26, 28: 36 };
const GUTTER = 24;

// ============ NODES ============
const flat = (a) => a.flat(Infinity).filter((x) => x !== null && x !== undefined && x !== false);
const F = (p, ...c) => ({ k: 'f', ...p, c: flat(c) });
const T = (s, p = {}) => ({ k: 't', s, ...p });
const S = (svg, p = {}) => ({ k: 's', svg, ...p });
const I = (src, p = {}) => ({ k: 'i', src, ...p });
const V = (p, ...c) => F({ dir: 'v', ...p }, ...c);
const H = (p, ...c) => F({ dir: 'h', ...p }, ...c);

// ============ TYPE ============
// Poppins Bold: display, titles, section heads, numbers. DM Sans: everything else.
const FONT = {
  disp: { family: 'Poppins', w: 'Bold' },
  body: { family: 'DM Sans', w: 'Regular' },
  bodyM: { family: 'DM Sans', w: 'Medium' },
  bodyB: { family: 'DM Sans', w: 'Bold' },
};
const txt = (s, size, font, color, p = {}) => {
  const f = FONT[font];
  return T(s, { size, family: f.family, weight: f.w, color, lh: p.lh || LH[size] || Math.round(size * 1.35), ...p });
};
// semantic text roles. Use these, not raw txt(), for anything structural.
const display = (s, p = {}) => txt(s, 28, 'disp', 'ink', { w: 'fill', ls: -0.5, ...p });
const title = (s, p = {}) => txt(s, 20, 'disp', 'ink', { w: 'fill', ls: -0.3, ...p });
const section = (s, p = {}) => txt(s, 16, 'disp', 'ink', { ls: -0.1, ...p });
const rowTitle = (s, p = {}) => txt(s, 16, 'bodyB', 'ink', { ...p });
const body = (s, p = {}) => txt(s, 16, 'body', 'ink2', { w: 'fill', ...p });
const small = (s, p = {}) => txt(s, 14, 'bodyM', 'ink2', { ...p });
const caption = (s, p = {}) => txt(s, 12, 'bodyM', 'ink2', { ...p });
const label = (s, p = {}) => txt(s, 14, 'bodyB', 'ink', { ...p });
const num = (s, size, p = {}) => txt(s, size, 'disp', 'ink', { ls: -0.4, ...p });

// Title block: the one allowed title + subtitle pairing. Gap is always 8.
const TitleBlock = (t, sub, p = {}) => V({ w: 'fill', gap: 8, ...p }, title(t), sub ? body(sub) : null);

// ============ ICONS (duotone: solid stroke + tinted fill) ============
const ICONS = {
  home: (c, a) => `<path d="M4 11.2 12 4.6l8 6.6V19a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19z" fill="${a}" stroke="${c}" stroke-width="2" stroke-linejoin="round"/><path d="M10 20.5v-5h4v5" stroke="${c}" stroke-width="2" stroke-linejoin="round" fill="none"/>`,
  takar: (c, a) => `<path d="M6 5.5h11.5l-1.4 12.8a2 2 0 0 1-2 1.7H9.4a2 2 0 0 1-2-1.7z" fill="${a}" stroke="${c}" stroke-width="2" stroke-linejoin="round"/><path d="M17.6 9H19a1.8 1.8 0 0 1 0 3.8h-2.2" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round"/><path d="M9.6 10.5h3M9.8 14.2h2.4" stroke="${c}" stroke-width="2" stroke-linecap="round"/>`,
  timbang: (c, a) => `<rect x="3.5" y="8" width="17" height="12" rx="3" fill="${a}" stroke="${c}" stroke-width="2"/><path d="M8.2 15.4a3.8 3.8 0 0 1 7.6 0" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round"/><path d="M12 15.4l1.7-1.9" stroke="${c}" stroke-width="2" stroke-linecap="round"/><path d="M7.5 4.8h9" stroke="${c}" stroke-width="2.4" stroke-linecap="round"/>`,
  tumbuh: (c, a) => `<path d="M12 20.5V12" stroke="${c}" stroke-width="2" stroke-linecap="round"/><path d="M12 13.2C7.6 13.2 5.2 10.6 5 6.6c4.4 0 7 2.4 7 6.6z" fill="${a}" stroke="${c}" stroke-width="2" stroke-linejoin="round"/><path d="M12 11.2c0-4 2.6-6.6 7-6.6-.1 4-2.6 6.6-7 6.6z" fill="${a}" stroke="${c}" stroke-width="2" stroke-linejoin="round"/><path d="M7.5 20.5h9" stroke="${c}" stroke-width="2" stroke-linecap="round"/>`,
  user: (c, a) => `<circle cx="12" cy="8" r="3.6" fill="${a}" stroke="${c}" stroke-width="2"/><path d="M4.8 20.2c.4-3.7 3.2-5.7 7.2-5.7s6.8 2 7.2 5.7z" fill="${a}" stroke="${c}" stroke-width="2" stroke-linejoin="round"/>`,
  back: (c) => `<path d="M14.8 5.5 8.3 12l6.5 6.5" fill="none" stroke="${c}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>`,
  right: (c) => `<path d="M9.2 5.5 15.7 12l-6.5 6.5" fill="none" stroke="${c}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>`,
  down: (c) => `<path d="M5.5 9.2 12 15.7l6.5-6.5" fill="none" stroke="${c}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>`,
  check: (c) => `<path d="M5 12.6l4.6 4.6L19 7.6" fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`,
  plus: (c) => `<path d="M12 5v14M5 12h14" fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round"/>`,
  minus: (c) => `<path d="M5 12h14" fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round"/>`,
  mail: (c, a) => `<rect x="3" y="5.5" width="18" height="13.5" rx="3" fill="${a}" stroke="${c}" stroke-width="2"/><path d="m4 8.2 8 5.4 8-5.4" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
  lock: (c, a) => `<rect x="5" y="10.5" width="14" height="10" rx="3" fill="${a}" stroke="${c}" stroke-width="2"/><path d="M8.2 10.5V8a3.8 3.8 0 0 1 7.6 0v2.5" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round"/>`,
  store: (c, a) => `<path d="M4 9.6 5.6 4.5h12.8L20 9.6z" fill="${a}" stroke="${c}" stroke-width="2" stroke-linejoin="round"/><path d="M5.2 9.6V20h13.6V9.6" fill="none" stroke="${c}" stroke-width="2" stroke-linejoin="round"/><path d="M10 20v-5h4v5" fill="none" stroke="${c}" stroke-width="2" stroke-linejoin="round"/>`,
  pin: (c, a) => `<path d="M12 21s6.6-5.3 6.6-10.8a6.6 6.6 0 0 0-13.2 0C5.4 15.7 12 21 12 21z" fill="${a}" stroke="${c}" stroke-width="2" stroke-linejoin="round"/><circle cx="12" cy="10.2" r="2.4" fill="${c}"/>`,
  clock: (c, a) => `<circle cx="12" cy="12" r="8.6" fill="${a}" stroke="${c}" stroke-width="2"/><path d="M12 7.2V12l3.2 2" fill="none" stroke="${c}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>`,
  calendar: (c, a) => `<rect x="3.5" y="5.5" width="17" height="15" rx="3" fill="${a}" stroke="${c}" stroke-width="2"/><path d="M8 3.5v4M16 3.5v4M3.8 10.4h16.4" stroke="${c}" stroke-width="2" stroke-linecap="round"/>`,
  upload: (c, a) => `<path d="M4.5 15.5v2.2a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-2.2" fill="${a}" stroke="${c}" stroke-width="2" stroke-linecap="round"/><path d="M12 15V4.5M7.8 8.5 12 4.3l4.2 4.2" fill="none" stroke="${c}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`,
  pencil: (c, a) => `<path d="M4.5 19.5 5.4 15 15.6 4.8a2.2 2.2 0 0 1 3.1 0l.5.5a2.2 2.2 0 0 1 0 3.1L9 18.6z" fill="${a}" stroke="${c}" stroke-width="2" stroke-linejoin="round"/><path d="m13.8 6.6 3.6 3.6" stroke="${c}" stroke-width="2"/>`,
  pos: (c, a) => `<rect x="3.5" y="4.5" width="17" height="11.5" rx="2.6" fill="${a}" stroke="${c}" stroke-width="2"/><path d="M8 20h8M12 16v4" stroke="${c}" stroke-width="2" stroke-linecap="round"/><path d="M7.5 9h5M7.5 12h8" stroke="${c}" stroke-width="2" stroke-linecap="round"/>`,
  bun: (c, a) => `<path d="M3.5 16.5C3 10 7 5.5 12 5.5s9 4.5 8.5 11c0 1.7-1.6 2.5-3.6 2.5H7.1c-2 0-3.6-.8-3.6-2.5z" fill="${a}" stroke="${c}" stroke-width="2" stroke-linejoin="round"/><path d="M9 9.5 8 12.5M13 9l-.6 3.4M16.5 10l.8 2.5" stroke="${c}" stroke-width="2" stroke-linecap="round"/>`,
  chart: (c, a) => `<rect x="4" y="11" width="4" height="8.5" rx="1.2" fill="${a}" stroke="${c}" stroke-width="2"/><rect x="10" y="5" width="4" height="14.5" rx="1.2" fill="${a}" stroke="${c}" stroke-width="2"/><rect x="16" y="8.5" width="4" height="11" rx="1.2" fill="${a}" stroke="${c}" stroke-width="2"/>`,
  book: (c, a) => `<path d="M12 6.5C9.8 5 7 4.6 4 5.2v12.6c3-.6 5.8-.2 8 1.3 2.2-1.5 5-1.9 8-1.3V5.2c-3-.6-5.8-.2-8 1.3z" fill="${a}" stroke="${c}" stroke-width="2" stroke-linejoin="round"/><path d="M12 6.5v12.6" stroke="${c}" stroke-width="2"/>`,
  warn: (c, a) => `<path d="M12 4.2 21 19.6H3z" fill="${a}" stroke="${c}" stroke-width="2" stroke-linejoin="round"/><path d="M12 10v4.4" stroke="${c}" stroke-width="2.4" stroke-linecap="round"/><circle cx="12" cy="16.9" r="1.2" fill="${c}"/>`,
  info: (c, a) => `<circle cx="12" cy="12" r="8.6" fill="${a}" stroke="${c}" stroke-width="2"/><path d="M12 11v5.2" stroke="${c}" stroke-width="2.4" stroke-linecap="round"/><circle cx="12" cy="7.9" r="1.3" fill="${c}"/>`,
  file: (c, a) => `<path d="M6.5 3.8h7.2l4.8 4.8V19a1.5 1.5 0 0 1-1.5 1.5h-10.5A1.5 1.5 0 0 1 5 19V5.3a1.5 1.5 0 0 1 1.5-1.5z" fill="${a}" stroke="${c}" stroke-width="2" stroke-linejoin="round"/><path d="M13.5 4v4.8h4.8M8.5 13h7M8.5 16.5h5" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round"/>`,
  coin: (c, a) => `<circle cx="12" cy="12" r="8.6" fill="${a}" stroke="${c}" stroke-width="2"/><path d="M9.2 12h5.6M9.2 9.4h5.6M9.2 14.6h5.6" stroke="${c}" stroke-width="1.8" stroke-linecap="round"/>`,
  box: (c, a) => `<path d="m3.8 8 8.2-4 8.2 4v8.6L12 20.6l-8.2-4z" fill="${a}" stroke="${c}" stroke-width="2" stroke-linejoin="round"/><path d="m3.8 8 8.2 4 8.2-4M12 12v8.4" stroke="${c}" stroke-width="2" stroke-linejoin="round" fill="none"/>`,
  logout: (c, a) => `<path d="M9.5 4.5h-3a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h3" fill="${a}" stroke="${c}" stroke-width="2" stroke-linecap="round"/><path d="M10.5 12h9.5M16.4 8.4 20 12l-3.6 3.6" fill="none" stroke="${c}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`,
  play: (c) => `<path d="M8.5 5.6v12.8a1 1 0 0 0 1.5.9l10.2-6.4a1 1 0 0 0 0-1.7L10 4.7a1 1 0 0 0-1.5.9z" fill="${c}"/>`,
  pause: (c) => `<rect x="6" y="5" width="4.2" height="14" rx="1.6" fill="${c}"/><rect x="13.8" y="5" width="4.2" height="14" rx="1.6" fill="${c}"/>`,
  close: (c) => `<path d="M6.5 6.5l11 11M17.5 6.5l-11 11" fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round"/>`,
  swap: (c) => `<path d="M5 8.5h13l-3.2-3.2M19 15.5H6l3.2 3.2" fill="none" stroke="${c}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`,
  refresh: (c) => `<path d="M19.2 11a7.4 7.4 0 0 0-13.3-3.7L4.5 9M4.8 13a7.4 7.4 0 0 0 13.3 3.7l1.4-1.7M4.5 4.5V9h4.5M19.5 19.5V15H15" fill="none" stroke="${c}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`,
};
function tint(hex) {
  const n = parseInt(hex.slice(1), 16);
  const m = (v) => Math.round(v + (255 - v) * 0.78);
  return '#' + [m(n >> 16), m((n >> 8) & 255), m(n & 255)].map((x) => x.toString(16).padStart(2, '0')).join('');
}
const icon = (name, c = 'ink', size = 24, a) => {
  const cc = C[c] || c;
  const aa = a === 'none' ? 'none' : a ? C[a] || a : tint(cc);
  return S(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none">${ICONS[name](cc, aa)}</svg>`, { w: size, h: size, n: 'Icon / ' + name });
};

// ============ COMPONENTS ============
// Surfaces carry meaning, not decoration:
//   Card     white, r20, no border      -> content you read
//   Panel    solid brand color, r20     -> the one number that matters on the screen
//   Choice   white, r16, 2px border     -> something you pick (border = selectable)
//   Field    white, r12, 1.5px border   -> something you type into
const Card = (p, ...c) => V({ bg: 'white', r: 20, pad: 16, gap: 12, w: 'fill', ...p }, ...c);
const Panel = (bg, p, ...c) => V({ bg, r: 20, pad: 16, gap: 12, w: 'fill', ...p }, ...c);

function Btn(text, { go, kind = 'primary', ic, disabled, cls, attrs } = {}) {
  const map = {
    primary: ['olive', 'white', 'oliveD'],
    accent: ['orange', 'ink', 'orangeD'],
    secondary: ['white', 'olive', null],
    // white label needs a deeper orange to pass 4.5:1 (bright orange + white is only 2.9:1)
    ember: ['orangeD', 'white', '#8F2E05'],
  };
  const [bg, fg, lip] = disabled ? ['sageL', 'ink3', null] : map[kind];
  return H(
    {
      n: 'Button / ' + text, w: 'fill', h: 56, bg, r: 16, ax: 'center', jx: 'center', gap: 8,
      go: disabled ? null : go, role: 'button', comp: 'Button/' + kind, cls, attrs,
      stroke: kind === 'secondary' ? { c: 'olive', w: 2 } : lip ? { c: lip, w: 4, sides: 'b' } : null,
    },
    ic ? icon(ic, fg, 20, 'none') : null,
    txt(text, 16, 'disp', fg, { lh: 22, slot: 'label' }),
  );
}
const LinkBtn = (s, go, color = 'olive') => H({ n: 'Link / ' + s, w: 'fill', h: 44, ax: 'center', jx: 'center', go, role: 'button' }, txt(s, 14, 'bodyB', color, { lh: 20 }));

function Field(lab, value, { ic, state = 'idle', ph, helper, go } = {}) {
  const isErr = state === 'error', isFocus = state === 'focus';
  const shown = value !== undefined && value !== '' && value !== null;
  return V(
    { n: 'Field · ' + lab, w: 'fill', gap: 8, comp: 'Field' },
    label(lab, { slot: 'label' }),
    H(
      {
        n: 'Input', w: 'fill', h: 56, bg: 'white', r: 12, pad: [0, 16], gap: 12, ax: 'center', go, role: go ? 'button' : undefined,
        stroke: isErr ? { c: 'err', w: 2 } : isFocus ? { c: 'olive', w: 2 } : { c: 'lineD', w: 1.5 },
      },
      ic ? icon(ic, isErr ? 'err' : isFocus ? 'olive' : 'ink3', 20) : null,
      txt(shown ? value : ph || '', 16, 'bodyM', shown ? 'ink' : 'ink3', { lh: 22, w: 'fill', slot: 'value', edit: lab, ph: !shown }),
    ),
    helper ? H({ gap: 8, ax: 'center', w: 'fill' }, isErr ? icon('warn', 'err', 16) : null, txt(helper, 12, 'bodyM', isErr ? 'err' : 'ink2', { lh: 16, w: 'fill' })) : null,
  );
}

function Chip(s, sel, mode = 'single') {
  return H(
    { n: 'Chip / ' + s, h: 44, pad: [0, 16], r: 999, ax: 'center', jx: 'center', gap: 8, role: 'button', chip: mode, sel,
      bg: sel ? 'olive' : 'white', stroke: { c: sel ? 'oliveD' : 'lineD', w: 1.5 } },
    { ...icon('check', 'white', 16, 'none'), cls: 'ck', hide: !sel },
    txt(s, 14, sel ? 'bodyB' : 'bodyM', sel ? 'white' : 'ink', { lh: 20 }),
  );
}

const IconTile = (ic, tone = 'oliveL', color = 'olive', size = 48) =>
  H({ n: 'Icon tile', w: size, h: size, r: 12, bg: tone, ax: 'center', jx: 'center' }, icon(ic, color, size >= 48 ? 24 : 20));

// Row: content you read or open. No border; white on warm bg is enough separation.
function Row(t, desc, { ic, tone = 'oliveL', iconColor = 'olive', go, tag, bare = false } = {}) {
  return H(
    { n: 'Row · ' + t, w: 'fill', pad: bare ? [12, 0] : 16, gap: 12, bg: bare ? null : 'white', r: bare ? 0 : 16, ax: 'center', go, role: go ? 'button' : undefined, comp: 'Row' },
    ic ? IconTile(ic, tone, iconColor) : null,
    V({ gap: 4, w: 'fill' }, rowTitle(t, { w: 'fill', slot: 'title' }), desc ? caption(desc, { w: 'fill', slot: 'desc' }) : null),
    tag || null,
    go ? icon('right', 'ink3', 20) : null,
  );
}
// Grouped list: one white container, hairline dividers. Replaces stacks of identical cards.
function ListGroup(...rows) {
  const r = flat(rows);
  const kids = [];
  r.forEach((row, i) => { if (i) kids.push(F({ w: 'fill', h: 1.5, bg: 'line' })); kids.push(row); });
  return V({ n: 'List group', w: 'fill', bg: 'white', r: 20, pad: [4, 16], clip: true }, ...kids);
}
// Choice: something you pick. The 2px border is the affordance.
function Choice(t, desc, { ic, tone = 'oliveL', iconColor = 'olive', go, selected = false, state } = {}) {
  const stroke = state === 'error' ? { c: 'orange', w: 2 } : selected ? { c: 'olive', w: 2 } : { c: 'lineD', w: 1.5 };
  return H(
    { n: 'Choice · ' + t, w: 'fill', pad: 16, gap: 12, bg: 'white', r: 16, ax: 'center', stroke, go, role: go ? 'button' : undefined },
    ic ? IconTile(ic, tone, iconColor) : null,
    V({ gap: 4, w: 'fill' }, rowTitle(t, { w: 'fill' }), desc ? caption(desc, { w: 'fill' }) : null),
    go ? icon('right', 'ink3', 20) : null,
  );
}

const Tag = (s, tone = 'goldL', fg = 'ink') => H({ n: 'Tag / ' + s, h: 24, pad: [0, 8], r: 8, bg: tone, ax: 'center', jx: 'center' }, txt(s, 12, 'bodyB', fg, { lh: 16 }));
const Meter = (filled, total = 4, tone = 'olive', rest = 'line') =>
  H({ n: 'Meter', w: 'fill', gap: 4, h: 8 }, ...Array.from({ length: total }, (_, i) => F({ w: 'fill', h: 8, r: 8, bg: i < filled ? tone : rest, cls: i < filled ? 'r-grow' : null })));

function TopBar(backGo, step, total = 4) {
  return H(
    { n: 'Top bar', w: 'fill', h: 44, ax: 'center', jx: 'between' },
    backGo === null ? F({ w: 44, h: 44 }) : H({ n: 'Kembali', w: 44, h: 44, r: 12, bg: 'white', stroke: { c: 'lineD', w: 1.5 }, ax: 'center', jx: 'center', go: backGo, role: 'button' }, icon('back', 'ink', 22)),
    step ? txt(`Langkah ${step} dari ${total}`, 12, 'bodyB', 'ink2', { lh: 16 }) : null,
  );
}

const SIGNAL = (c) => `<svg xmlns="http://www.w3.org/2000/svg" width="66" height="14" viewBox="0 0 66 14" fill="${c}"><rect x="0" y="9" width="3.4" height="5" rx="1.1"/><rect x="5.4" y="6.4" width="3.4" height="7.6" rx="1.1"/><rect x="10.8" y="3.6" width="3.4" height="10.4" rx="1.1"/><rect x="16.2" y="0.6" width="3.4" height="13.4" rx="1.1"/><path d="M28.5 5.2a10.6 10.6 0 0 1 13 0l-1.7 1.9a8 8 0 0 0-9.6 0zm2.8 3.2a6.2 6.2 0 0 1 7.4 0L35 12.6z"/><rect x="47.5" y="1.4" width="16" height="10.4" rx="3" fill="none" stroke="${c}" stroke-width="1.2" opacity=".55"/><rect x="49.2" y="3.1" width="11.6" height="7" rx="1.8"/><rect x="64.6" y="5.2" width="1.4" height="3.6" rx=".7" opacity=".55"/></svg>`;
const StatusBar = (fg = 'ink') => H({ n: 'Status bar', w: 'fill', h: 52, pad: [16, 32, 0, 32], jx: 'between', ax: 'center' }, txt('9:41', 14, 'bodyB', fg, { lh: 20 }), S(SIGNAL(C[fg]), { w: 66, h: 14, n: 'Status icons' }));
const HomeBar = (fg = 'ink') => H({ n: 'Home indicator', w: 'fill', h: 24, jx: 'center', ax: 'end', pad: [0, 0, 8, 0] }, F({ w: 134, h: 4, r: 8, bg: fg, opacity: 0.8 }));

const NAV = [['Beranda', 'home', 'home'], ['Takar', 'takar', 'takar'], ['Timbang', 'timbang', 'timbang'], ['Tumbuh', 'tumbuh', 'tumbuh'], ['Akun', 'user', 'akun']];
function NavBar(active) {
  return H(
    { n: 'Bottom navigation', w: 'fill', pad: [8, 12], bg: 'white', jx: 'between', stroke: { c: 'line', w: 1.5, sides: 't' } },
    ...NAV.map(([lab, ic, go]) => {
      const on = lab === active;
      return V({ n: 'Tab / ' + lab, w: 64, h: 56, ax: 'center', jx: 'center', gap: 4, r: 12, bg: on ? 'oliveL' : null, go, role: 'button' },
        icon(ic, on ? 'olive' : 'ink2', 24, on ? 'lime' : undefined),
        txt(lab, 12, on ? 'bodyB' : 'bodyM', on ? 'olive' : 'ink2', { lh: 16 }));
    }),
  );
}

// Screen scaffold: 390 x 844. Side gutter is always GUTTER. Content gap is always 24
// between groups; tighter rhythm lives inside the components.
function Screen(key, name, o = {}) {
  const { bg = 'bg', body: bodyNodes = [], footer = null, nav = null, gap = 24, status = 'ink', homeFg, section: sec = 'Lainnya', note, after, pad, art = null, footerBg = null } = o;
  // With a full-bleed `art` layer behind, every in-flow block is lifted above it.
  const up = (n) => (art && n ? { ...n, lift: true } : n);
  return {
    key, name, section: sec, note,
    root: V(
      { n: name, w: 390, h: 844, bg, r: 36, clip: true, after },
      art,
      up(StatusBar(status)),
      up(V({ n: 'Content', w: 'fill', h: 'fill', pad: pad === undefined ? [16, GUTTER, 0, GUTTER] : pad, gap }, ...flat([bodyNodes]))),
      footer ? up(V({ n: 'Actions', w: 'fill', pad: [16, GUTTER, 8, GUTTER], gap: 4, bg: footerBg }, ...flat([footer]))) : null,
      up(nav || null),
      up(HomeBar(homeFg || (status === 'white' ? 'white' : 'ink'))),
    ),
  };
}

// ============ VALIDATOR ============
// Proves the scale discipline instead of claiming it.
function validate(screens) {
  const bad = [];
  const ok = (v, set) => set.includes(v);
  const walk = (n, scr) => {
    if (n.k === 't') {
      if (!ok(n.size, TS)) bad.push(`${scr}: type size ${n.size} ("${String(n.s).slice(0, 24)}")`);
      else if (n.lh !== LH[n.size]) bad.push(`${scr}: line-height ${n.lh} for size ${n.size}`);
      return;
    }
    if (n.k !== 'f') return;
    if (n.gap !== undefined && !ok(n.gap, SP)) bad.push(`${scr}: gap ${n.gap} in "${n.n || '?'}"`);
    const pads = n.pad === undefined ? [] : typeof n.pad === 'number' ? [n.pad] : n.pad;
    pads.forEach((p) => { if (!ok(p, SP)) bad.push(`${scr}: padding ${p} in "${n.n || '?'}"`); });
    if (n.r !== undefined && !ok(n.r, RA)) bad.push(`${scr}: radius ${n.r} in "${n.n || '?'}"`);
    (n.c || []).forEach((c) => walk(c, scr));
  };
  screens.forEach((s) => walk(s.root, s.name));
  return bad;
}

module.exports = {
  C, SP, RA, TS, LH, GUTTER, FONT, SIGNAL, ICONS,
  F, T, S, I, V, H, flat, txt, tint, icon,
  display, title, section, rowTitle, body, small, caption, label, num, TitleBlock,
  Card, Panel, Btn, LinkBtn, Field, Chip, IconTile, Row, ListGroup, Choice, Tag, Meter,
  TopBar, StatusBar, HomeBar, NavBar, Screen, validate,
};
