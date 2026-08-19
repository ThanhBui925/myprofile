const fs = require('fs');
const file = 'frontend/src/index.css';
let css = fs.readFileSync(file, 'utf8');

const toAdd = `
/* ===== ADMIN MOBILE RESPONSIVE ===== */
@media (max-width: 640px) {
  .admin-main h1 {
    font-size: 1.4rem !important;
  }
  .admin-main .btn {
    flex-shrink: 0;
    white-space: nowrap;
  }
}

/* ===== DASHBOARD GRIDS ===== */
.dashboard-stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
  margin-bottom: 3rem;
}
.dashboard-links-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}
@media (max-width: 1024px) {
  .dashboard-stats-grid { grid-template-columns: repeat(2, 1fr); }
  .dashboard-links-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 640px) {
  .dashboard-stats-grid { grid-template-columns: repeat(2, 1fr); gap: 0.75rem; }
  .dashboard-links-grid { grid-template-columns: 1fr; }
}
`;

if (!css.includes('dashboard-stats-grid')) {
  fs.writeFileSync(file, css + toAdd, 'utf8');
  console.log('CSS appended OK');
} else {
  console.log('Already has dashboard CSS');
}
