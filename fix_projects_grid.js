const fs = require('fs');
const file = 'frontend/src/app/admin/(panel)/projects/page.jsx';
let c = fs.readFileSync(file, 'utf8');

// Replace the 4-col inline grid (client + industryVi + industryEn + order)
// with grid-split-3 for first 3 fields, and a separate row for order
const OLD = `<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '1rem' }}>`;
const NEW = `<div className="grid-split-3" style={{ gap: '1rem' }}>`;

if (c.includes(OLD)) {
  c = c.replace(OLD, NEW);
  fs.writeFileSync(file, c, 'utf8');
  console.log('Fixed projects modal grid');
} else {
  console.log('Pattern not found, checking what is there...');
  const idx = c.indexOf('gridTemplateColumns');
  if (idx !== -1) console.log(c.substring(idx - 20, idx + 80));
}
