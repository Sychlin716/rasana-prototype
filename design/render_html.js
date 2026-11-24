'use strict';
const fs = require('fs');
const path = require('path');
const { C } = require('./lib');

const px = (n) => (typeof n === 'number' ? n + 'px' : n);
const col = (c) => (c ? C[c] || c : 'transparent');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function padCss(p) {
  if (p === undefined || p === null) return '';
  if (typeof p === 'number') return `padding:${p}px;`;
  if (p.length === 2) return `padding:${p[0]}px ${p[1]}px;`;
  return `padding:${p.map((x) => x + 'px').join(' ')};`;
}
const AX = { start: 'flex-start', center: 'center', end: 'flex-end', stretch: 'stretch' };
const JX = { start: 'flex-start', center: 'center', end: 'flex-end', between: 'space-between' };

function sizeCss(n, parentDir) {
  let s = '';
  // width
  if (n.w === 'fill') s += parentDir === 'h' ? 'flex:1 1 0;min-width:0;' : parentDir === 'v' ? 'align-self:stretch;' : 'width:100%;';
  else if (typeof n.w === 'number') s += `width:${n.w}px;flex:none;`;
  // height
  if (n.h === 'fill') s += parentDir === 'v' ? 'flex:1 1 0;min-height:0;' : parentDir === 'h' ? 'align-self:stretch;' : 'height:100%;';
  else if (typeof n.h === 'number') s += `height:${n.h}px;` + (parentDir === 'v' ? 'flex:none;' : '');
  return s;
}

let goCount = 0;
const attrStr = (a) => (a ? Object.entries(a).map(([k, v]) => ` ${k}="${esc(v)}"`).join('') : '');
function render(n, parentDir, ctx) {
  if (n.k === 't') {
    const fam = n.family === 'Poppins' ? "'Poppins',sans-serif" : "'DM Sans',sans-serif";
    const wt = { Regular: 400, Medium: 500, SemiBold: 600, Bold: 700 }[n.weight] || 400;
    let st = `font-family:${fam};font-size:${n.size}px;font-weight:${wt};line-height:${n.lh}px;color:${col(n.color)};`;
    if (n.ls) st += `letter-spacing:${n.ls}px;`;
    if (n.align) st += `text-align:${n.align};`;
    const fixed = n.w === 'fill' || typeof n.w === 'number';
    st += fixed ? 'white-space:pre-wrap;' : 'white-space:pre;';
    st += sizeCss({ w: n.w }, parentDir);
    const ed = n.edit ? ` contenteditable="plaintext-only" spellcheck="false" role="textbox" tabindex="0" aria-label="${esc(n.edit)}"${n.ph ? ` data-ph="${esc(n.s)}"` : ''}` : '';
    return `<div class="t${n.cls ? ' ' + n.cls : ''}" style="${st}"${attrStr(n.attrs)}${ed}>${n.ph && n.edit ? '' : esc(n.s)}</div>`;
  }
  if (n.k === 's') {
    const st = `width:${n.w}px;height:${n.h}px;flex:none;${n.hide ? 'display:none;' : 'display:block;'}${n.abs ? `position:absolute;left:${n.abs.x}px;top:${n.abs.y}px;` : ''}`;
    return `<div class="s${n.cls ? ' ' + n.cls : ''}" style="${st}" aria-hidden="true">${n.svg}</div>`;
  }
  if (n.k === 'i') {
    return `<img src="${ctx.assets[n.src]}" width="${n.w}" height="${n.h}" alt="${esc(n.alt || '')}" style="width:${n.w}px;height:${n.h}px;flex:none;display:block;object-fit:contain">`;
  }
  // frame
  const dir = n.dir || 'v';
  let st = `display:flex;flex-direction:${dir === 'h' ? 'row' : 'column'};box-sizing:border-box;`;
  st += `align-items:${AX[n.ax || 'start']};justify-content:${JX[n.jx || 'start']};`;
  if (n.gap) st += `gap:${n.gap}px;`;
  st += padCss(n.pad);
  if (n.bg) st += `background:${col(n.bg)};`;
  if (n.r) st += `border-radius:${n.r}px;`;
  if (n.clip) st += 'overflow:hidden;';
  if (n.opacity !== undefined) st += `opacity:${n.opacity};`;
  if (n.stroke) {
    const sd = n.stroke.sides || 'all';
    const w = n.stroke.w, c = col(n.stroke.c);
    if (n.stroke.dash) st += `border:${w}px dashed ${c};`;
    else if (sd === 'all') st += `box-shadow:inset 0 0 0 ${w}px ${c};`;
    else st += 'box-shadow:' + sd.split('').map((x) => ({ b: `inset 0 -${w}px 0 0 ${c}`, t: `inset 0 ${w}px 0 0 ${c}`, l: `inset ${w}px 0 0 0 ${c}`, r: `inset -${w}px 0 0 0 ${c}` }[x])).join(',') + ';';
  }
  if (n.abs) st += `position:absolute;left:${n.abs.x}px;top:${n.abs.y}px;`;
  st += sizeCss(n, parentDir);
  let attrs = '';
  const tag = n.go || n.chip || n.act ? 'button' : 'div';
  if (tag === 'button') { st = 'border:0;margin:0;background:transparent;text-align:left;font:inherit;color:inherit;' + st; attrs += ' type="button"'; }
  if (n.go) {
    attrs += ` data-go="${n.go}" aria-label="${esc((n.n || '').replace(/^(Button|Link|Row|Tab|Seg|Layanan|Chip) ?[\/·] ?/, ''))}"`;
    goCount++;
  }
  if (n.after) attrs += ` data-after="${n.after.go}" data-after-ms="${n.after.ms}"`;
  if (n.chip) attrs += ` data-chip="${n.chip}" data-sel="${n.sel ? 1 : 0}" aria-pressed="${n.sel ? 'true' : 'false'}"`;
  if (n.edit) attrs += ` contenteditable="plaintext-only" spellcheck="false" role="textbox" tabindex="0" aria-label="${esc(n.edit)}"`;
  attrs += attrStr(n.attrs);
  const kids = (n.c || []).map((c) => render(c, dir, ctx)).join('');
  return `<${tag} class="f${n.go ? ' go' : ''}${n.chip ? ' chip' : ''}${n.act ? ' act' : ''}${n.cls ? ' ' + n.cls : ''}" style="${st}"${attrs}>${kids}</${tag}>`;
}

// ---------- contrast checker ----------
function lum(hex) {
  const n = parseInt(hex.slice(1), 16);
  const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  return 0.2126 * f(n >> 16) + 0.7152 * f((n >> 8) & 255) + 0.0722 * f(n & 255);
}
const ratio = (a, b) => { const l1 = lum(a), l2 = lum(b); return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05); };
function checkContrast(screens) {
  const fails = []; let total = 0; let min = 99;
  const walk = (n, bg, scr) => {
    if (n.k === 't') {
      total++;
      const fg = col(n.color);
      const r = ratio(fg, bg);
      const large = n.size >= 24 || (n.size >= 18.66 && (n.weight === 'Bold'));
      const need = large ? 3 : 4.5;
      if (r < min) min = r;
      if (r < need) fails.push({ screen: scr, text: n.s, size: n.size, fg, bg, ratio: +r.toFixed(2), need });
      return;
    }
    if (n.k !== 'f') return;
    const nb = n.bg && !['transparent'].includes(n.bg) ? col(n.bg) : bg;
    (n.c || []).forEach((c) => walk(c, nb, scr));
  };
  screens.forEach((s) => walk(s.root, C.bg, s.name));
  return { fails, total, min: +min.toFixed(2) };
}

module.exports = { render, checkContrast, ratio, goCount: () => goCount };
