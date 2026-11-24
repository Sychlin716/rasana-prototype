'use strict';
// Regenerates ../screens.js from the design source. Run: node design/build.js
const fs = require('fs');
const path = require('path');
const { render, checkContrast } = require('./render_html');
const { validate } = require('./lib');
const { screens } = require('./screens');

const ROOT = path.join(__dirname, '..');
const offScale = validate(screens);
if (offScale.length) { console.error('OFF-SCALE:', offScale.slice(0, 20)); process.exit(1); }
const contrast = checkContrast(screens);
if (contrast.fails.length) { console.error('CONTRAST FAILS:', contrast.fails.slice(0, 10)); process.exit(1); }

const ctx = { assets: { logo: 'assets/logo.png' } };
const data = screens.map((s) => ({ key: s.key, name: s.name, section: s.section, html: render(s.root, null, ctx) }));

const keys = new Set(data.map((d) => d.key));
const dead = [];
data.forEach((d) => [...d.html.matchAll(/data-(?:go|after)="([^"]+)"/g)]
  .forEach((m) => { if (!keys.has(m[1])) dead.push(`${d.key} -> ${m[1]}`); }));
if (dead.length) { console.error('DEAD LINKS:', dead); process.exit(1); }

fs.writeFileSync(path.join(ROOT, 'screens.js'), 'window.RASANA = ' + JSON.stringify({ screens: data }) + ';\n');
console.log('scale PASS · contrast min', contrast.min, '· links PASS ·', data.length, 'screens written');
