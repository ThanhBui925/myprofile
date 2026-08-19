const fs = require('fs');

const companyFile = 'frontend/src/app/admin/(panel)/company/page.jsx';
if (fs.existsSync(companyFile)) {
  let c = fs.readFileSync(companyFile, 'utf8');
  
  // Find the exact line for team grid container:
  // <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }}>
  const oldGrid = `<div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }}>`;
  const newGrid = `<div className="grid-split-2" style={{ gap: '1.25rem' }}>`;
  
  if (c.includes(oldGrid)) {
    c = c.replace(oldGrid, newGrid);
    fs.writeFileSync(companyFile, c, 'utf8');
    console.log('Successfully replaced Team container grid columns in company/page.jsx');
  } else {
    console.log('Pattern not found');
  }
} else {
  console.log('Company file does not exist');
}
