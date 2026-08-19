const fs = require('fs');
const pages = [
  'frontend/src/app/admin/(panel)/banners/page.jsx',
  'frontend/src/app/admin/(panel)/contacts/page.jsx',
  'frontend/src/app/admin/(panel)/courses/page.jsx',
  'frontend/src/app/admin/(panel)/partners/page.jsx',
  'frontend/src/app/admin/(panel)/products/page.jsx',
  'frontend/src/app/admin/(panel)/projects/page.jsx',
  'frontend/src/app/admin/(panel)/users/page.jsx',
];
const OLD = "display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem'";
const NEW = "display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem'";
let count = 0;
for (const p of pages) {
  if (!fs.existsSync(p)) continue;
  let c = fs.readFileSync(p, 'utf8');
  if (c.includes(OLD)) {
    c = c.split(OLD).join(NEW);
    fs.writeFileSync(p, c, 'utf8');
    count++;
    console.log('Fixed:', p);
  }
}
console.log('Done. Fixed', count, 'files.');
