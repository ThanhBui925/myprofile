const fs = require('fs');
const file = 'frontend/src/index.css';
let css = fs.readFileSync(file, 'utf8');

// Fix: prevent horizontal overflow on mobile in admin panel
const FIX = `
/* ===== FIX HORIZONTAL OVERFLOW ON MOBILE ===== */
@media (max-width: 900px) {
  .admin-layout {
    overflow-x: hidden;
    max-width: 100vw;
  }
  .admin-main {
    overflow-x: hidden;
    max-width: 100vw;
  }
}
`;

if (!css.includes('FIX HORIZONTAL OVERFLOW')) {
  fs.writeFileSync(file, css + FIX, 'utf8');
  console.log('Fixed horizontal overflow');
} else {
  console.log('Already fixed');
}
