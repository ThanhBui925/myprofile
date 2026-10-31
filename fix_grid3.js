const fs = require('fs');

// ====== Fix 1: Add grid-split-3 to CSS ======
const cssFile = 'frontend/src/index.css';
let css = fs.readFileSync(cssFile, 'utf8');

const toAdd = `
/* ===== GRID SPLIT 3 ===== */
.grid-split-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

/* ===== MODAL FORM RESPONSIVE ===== */
@media (max-width: 640px) {
  .grid-split-2,
  .grid-split-3,
  .grid-split-1-15,
  .grid-split-2-1 {
    grid-template-columns: 1fr !important;
  }
}
`;

if (!css.includes('grid-split-3')) {
  fs.writeFileSync(cssFile, css + toAdd, 'utf8');
  console.log('✓ CSS: Added grid-split-3 + mobile 1-column override');
} else {
  console.log('  grid-split-3 already exists');
}

// ====== Fix 2: Replace inline 3-col grid with grid-split-3 class in all modal pages ======
const pages = [
  'frontend/src/app/admin/(panel)/courses/page.jsx',
  'frontend/src/app/admin/(panel)/products/page.jsx',
  'frontend/src/app/admin/(panel)/projects/page.jsx',
  'frontend/src/app/admin/(panel)/partners/page.jsx',
  'frontend/src/app/admin/(panel)/services/page.jsx',
  'frontend/src/app/admin/(panel)/banners/page.jsx',
];

// Pattern: any inline 3-column grid style → replace with grid-split-3 class
const INLINE_3COL = `style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}`;
const INLINE_3COL_ALT = `style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '1rem' }}`;

for (const p of pages) {
  if (!fs.existsSync(p)) continue;
  let c = fs.readFileSync(p, 'utf8');
  let changed = false;

  if (c.includes(INLINE_3COL)) {
    c = c.split(INLINE_3COL).join(`className="grid-split-3" style={{ gap: '1rem' }}`);
    changed = true;
  }
  // Keep the 'auto' column for spec rows (labelVi, labelEn, value, remove-btn) — don't touch those
  // Only fix the simple 3-col ones

  if (changed) {
    fs.writeFileSync(p, c, 'utf8');
    console.log('✓ Replaced inline 3-col grid in:', p.split('/').at(-2));
  }
}

console.log('Done!');
