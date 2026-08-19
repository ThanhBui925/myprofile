const fs = require('fs');

// 1. Fix Navbar.css
const cssFile = 'frontend/src/components/layout/Navbar.css';
if (fs.existsSync(cssFile)) {
  let c = fs.readFileSync(cssFile, 'utf8');
  let normalized = c.replace(/\r\n/g, '\n');
  
  const oldMenuBtnStyle = `.navbar__menu-btn {
  display: none;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(255,255,255,0.06);
  border: 1px solid var(--color-border-muted);
  border-radius: var(--radius-sm);
  color: var(--color-text);
  cursor: pointer;
}`;

  const newMenuBtnStyle = `.navbar__menu-btn {
  display: none;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  background: rgba(255,255,255,0.06);
  border: 1px solid var(--color-border-muted);
  border-radius: var(--radius-md);
  color: var(--color-text);
  cursor: pointer;
}`;

  if (normalized.includes(oldMenuBtnStyle)) {
    normalized = normalized.replace(oldMenuBtnStyle, newMenuBtnStyle);
    console.log('Updated Menu Button CSS style!');
  } else {
    console.log('Menu Button CSS pattern not found!');
  }
  
  if (c.includes('\r\n')) {
    normalized = normalized.replace(/\n/g, '\r\n');
  }
  fs.writeFileSync(cssFile, normalized, 'utf8');
}

// 2. Fix Navbar.jsx
const jsxFile = 'frontend/src/components/layout/Navbar.jsx';
if (fs.existsSync(jsxFile)) {
  let c = fs.readFileSync(jsxFile, 'utf8');
  let normalized = c.replace(/\r\n/g, '\n');
  
  const oldJsxPattern = `<button className="navbar__menu-btn" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>`;
          
  const newJsxPattern = `<button className="navbar__menu-btn" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>`;
          
  if (normalized.includes(oldJsxPattern)) {
    normalized = normalized.replace(oldJsxPattern, newJsxPattern);
    console.log('Updated Menu Button JSX icons size!');
  } else {
    console.log('Menu Button JSX pattern not found!');
  }
  
  if (c.includes('\r\n')) {
    normalized = normalized.replace(/\n/g, '\r\n');
  }
  fs.writeFileSync(jsxFile, normalized, 'utf8');
}
