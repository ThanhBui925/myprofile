const fs = require('fs');
const file = 'frontend/src/index.css';
let css = fs.readFileSync(file, 'utf8');

// The 768px media query sets width: 0 which kills the sidebar when open.
// Override it by adding width: 260px to .admin-sidebar.open
const OLD = '  .admin-sidebar.open {\n    transform: translateX(0);\n  }';
const NEW = '  .admin-sidebar.open {\n    transform: translateX(0);\n    width: 260px !important;\n  }';

if (css.includes(OLD)) {
  css = css.replace(OLD, NEW);
  fs.writeFileSync(file, css, 'utf8');
  console.log('Fixed: sidebar.open now has width: 260px');
} else {
  console.log('Pattern not found, current .open rule:');
  const idx = css.indexOf('.admin-sidebar.open');
  if (idx !== -1) console.log(css.substring(idx, idx + 100));
}
