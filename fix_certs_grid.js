const fs = require('fs');
const file = 'frontend/src/app/admin/(panel)/company/page.jsx';
let c = fs.readFileSync(file, 'utf8');

const certStart = c.indexOf("activeTab === 'certs'");

if (certStart !== -1) {
  let certSection = c.substring(certStart);
  
  // Replace the inline grid styles for certs
  // It's currently: gridTemplateColumns: '1fr 1fr 1fr 1fr auto'
  certSection = certSection.replace(/gridTemplateColumns:\s*'1fr 1fr 1fr 1fr auto'/g, "gridTemplateColumns: '1fr', position: 'relative'");
  
  // Wait, if I replace `1fr 1fr 1fr 1fr auto` with `1fr`, the delete button will be at the bottom but maybe not styled correctly. Let's see the cert container padding.
  certSection = certSection.replace(/padding: '1.25rem', display: 'grid'/g, "padding: '0.75rem 1rem', display: 'grid'");
  
  // The delete button in cert is:
  // `<button type="button" onClick={() => setCerts(p => p.filter((_, idx) => idx !== i))} style={{ color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer', paddingBottom: '0.25rem' }}><MinusCircle size={20} /></button>`
  // Let's position it absolute top right, like in Experience and Team.
  const oldDeleteBtn = `<button type="button" onClick={() => setCerts(p => p.filter((_, idx) => idx !== i))} style={{ color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer', paddingBottom: '0.25rem' }}><MinusCircle size={20} /></button>`;
  const newDeleteBtn = `<button type="button" onClick={() => setCerts(p => p.filter((_, idx) => idx !== i))} style={{ position: 'absolute', top: '1rem', right: '1rem', color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer' }}><MinusCircle size={18} /></button>`;
  
  certSection = certSection.replace(oldDeleteBtn, newDeleteBtn);

  c = c.substring(0, certStart) + certSection;
  fs.writeFileSync(file, c, 'utf8');
  console.log('Fixed Certs Grid successfully');
} else {
  console.log('Bounds not found');
}
