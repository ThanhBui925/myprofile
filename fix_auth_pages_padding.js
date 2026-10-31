const fs = require('fs');

const targets = [
  'frontend/src/app/(public)/login/page.jsx',
  'frontend/src/app/(public)/register/page.jsx'
];

targets.forEach(file => {
  if (fs.existsSync(file)) {
    let c = fs.readFileSync(file, 'utf8');
    let normalized = c.replace(/\r\n/g, '\n');
    
    const oldPaddingStyle = `      padding: '2rem 1rem',`;
    const newPaddingStyle = `      padding: 'calc(var(--nav-height) + 2rem) 1rem 2rem',`;
    
    if (normalized.includes(oldPaddingStyle)) {
      normalized = normalized.replace(oldPaddingStyle, newPaddingStyle);
      console.log(`Updated padding in ${file}`);
    } else {
      console.log(`Padding pattern not found in ${file}`);
    }
    
    if (c.includes('\r\n')) {
      normalized = normalized.replace(/\n/g, '\r\n');
    }
    fs.writeFileSync(file, normalized, 'utf8');
  }
});
