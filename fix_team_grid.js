const fs = require('fs');

const companyFile = 'frontend/src/app/admin/(panel)/company/page.jsx';
if (fs.existsSync(companyFile)) {
  let c = fs.readFileSync(companyFile, 'utf8');
  
  // Find the Team section mapping
  // It has `gridTemplateColumns: '1fr 1fr'` for Name and Position rows
  const nameRegex = /<div style=\{\{\s*display:\s*'grid',\s*gridTemplateColumns:\s*'1fr 1fr',\s*gap:\s*'0.75rem'\s*\}\}>\s*<div className="form-group"><label className="form-label">H/g;
  c = c.replace(nameRegex, '<div style={{ display: \'grid\', gridTemplateColumns: \'1fr\', gap: \'0.75rem\' }}>\n                        <div className="form-group"><label className="form-label">H');

  const positionRegex = /<div style=\{\{\s*display:\s*'grid',\s*gridTemplateColumns:\s*'1fr 1fr',\s*gap:\s*'0.75rem'\s*\}\}>\s*<div className="form-group"><label className="form-label">C/g;
  c = c.replace(positionRegex, '<div style={{ display: \'grid\', gridTemplateColumns: \'1fr\', gap: \'0.75rem\' }}>\n                        <div className="form-group"><label className="form-label">C');

  // Change the padding for Team item wrapper
  // `<div key={i} style={{ background: 'var(--color-bg-2)', border: '1px solid var(--color-border-muted)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', position: 'relative' }}>`
  // We can just replace `padding: '1.5rem', position: 'relative'` with `padding: '0.75rem 1rem', position: 'relative'`
  c = c.replace(/padding: '1.5rem', position: 'relative'/g, "padding: '0.75rem 1rem', position: 'relative'");
  
  // Wait, there might be other `gridTemplateColumns: '1fr 1fr'` in Team, let's just replace all `gridTemplateColumns: '1fr 1fr'` in this file if they are for inputs? 
  // No, just the exact regex above is safer.
  
  fs.writeFileSync(companyFile, c, 'utf8');
  console.log('Fixed Team Section in Company Page');
}
