const fs = require('fs');
const file = 'frontend/src/index.css';
let css = fs.readFileSync(file, 'utf8');

// Only add if not already there
if (!css.includes('@media (max-width: 640px)')) {
  const INSERT_AFTER = '  h1 { font-size: 2rem; }\r\n  h2 { font-size: 1.5rem; }\r\n}\r\n';
  const NEW_CSS = `  h1 { font-size: 2rem; }
  h2 { font-size: 1.5rem; }
}

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
  css = css.replace(INSERT_AFTER, NEW_CSS);
  fs.writeFileSync(file, css, 'utf8');
  console.log('CSS updated successfully');
} else {
  console.log('Already exists, skipping');
}
