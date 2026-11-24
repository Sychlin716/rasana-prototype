'use strict';
// Regenerates ../screens.js from the design tree (lib, art, screens) and re-checks the
// type/spacing scale, contrast and links. Run from the repo root: node design/build.js
const fs = require('fs');
const path = require('path');
const { render, checkContrast } = require('./render_html');
const { validate } = require('./lib');
const { screens } = require('./screens');

const bad = validate(screens);
if (bad.length) { console.error('OFF-SCALE:', bad.slice(0, 20)); process.exit(1); }
const c = checkContrast(screens);
if (c.fails.length) { console.error('CONTRAST FAILS:', c.fails.slice(0, 10)); process.exit(1); }

const data = screens.map((s) => ({ key: s.key, name: s.name, section: s.section, html: render(s.root, null, { assets: { logo: 'assets/logo.png' } }) }));
const keys = new Set(data.map((d) => d.key)); const dead = [];
data.forEach((d) => [...d.html.matchAll(/data-(?:go|after)="([^"]+)"/g)].forEach((m) => { if (!keys.has(m[1])) dead.push(d.key + ' -> ' + m[1]); }));
if (dead.length) { console.error('DEAD LINKS:', dead); process.exit(1); }

fs.writeFileSync(path.join(__dirname, '..', 'screens.js'), 'window.RASANA = ' + JSON.stringify({ screens: data }) + ';\n');
console.log('scale PASS · contrast min', c.min, '· links PASS ·', data.length, 'screens written');
