const fs = require('fs');
const file = 'frontend/src/index.css';
let css = fs.readFileSync(file, 'utf8');

const FIX = `
/* ===== HIDE LESS IMPORTANT TABLE COLUMNS ON MOBILE ===== */
@media (max-width: 640px) {
  /* Hide: Danh mục (col 3), Chi tiết (col 4), File (col 5), Thứ tự (col 6) */
  .admin-table th:nth-child(3),
  .admin-table td:nth-child(3),
  .admin-table th:nth-child(4),
  .admin-table td:nth-child(4),
  .admin-table th:nth-child(5),
  .admin-table td:nth-child(5),
  .admin-table th:nth-child(6),
  .admin-table td:nth-child(6) {
    display: none;
  }
}
`;

if (!css.includes('HIDE LESS IMPORTANT TABLE COLUMNS')) {
  fs.writeFileSync(file, css + FIX, 'utf8');
  console.log('Hidden extra columns on mobile');
} else {
  console.log('Already done');
}
