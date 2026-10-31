const fs = require('fs');
const file = 'frontend/src/index.css';
let css = fs.readFileSync(file, 'utf8');

// Only add if not already present
if (css.includes('admin-mobile-header')) {
  console.log('Already exists, skipping');
  process.exit(0);
}

const toAdd = `

/* ===== ADMIN MOBILE HEADER ===== */
.admin-mobile-header {
  display: none;
  align-items: center;
  justify-content: space-between;
  padding: 0.875rem 1.25rem;
  background: var(--color-bg-2);
  border-bottom: 1px solid var(--color-border-muted);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1010;
  height: 56px;
}

.admin-mobile-header__brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-heading);
  font-weight: 800;
  font-size: 1rem;
  color: var(--color-text);
}

.admin-mobile-toggle {
  background: none;
  border: none;
  color: var(--color-text);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
}

.admin-sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.6);
  backdrop-filter: blur(4px);
  z-index: 1005;
}

/* ===== ADMIN PANEL MOBILE RESPONSIVE ===== */
@media (max-width: 900px) {
  .admin-mobile-header {
    display: flex;
  }

  .admin-sidebar {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    z-index: 1020;
    top: 0;
  }

  .admin-sidebar.open {
    transform: translateX(0);
  }

  .admin-main {
    margin-left: 0;
    padding: 1.25rem 1rem 2rem 1rem;
    padding-top: 72px;
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
  .dashboard-stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }
  .dashboard-links-grid {
    grid-template-columns: 1fr;
  }
  .admin-main h1 {
    font-size: 1.4rem !important;
  }
  .admin-main .btn {
    flex-shrink: 0;
    white-space: nowrap;
  }
}
`;

fs.writeFileSync(file, css + toAdd, 'utf8');
console.log('CSS added successfully');
