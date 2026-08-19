const fs = require('fs');
const files = [
  'frontend/src/app/admin/(panel)/banners/page.jsx',
  'frontend/src/app/admin/(panel)/partners/page.jsx',
  'frontend/src/app/admin/(panel)/products/page.jsx',
  'frontend/src/app/admin/(panel)/services/page.jsx',
  'frontend/src/app/admin/(panel)/users/page.jsx'
];
for (const f of files) {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(/ToggleRight/g, 'Eye').replace(/ToggleLeft/g, 'EyeOff');
  content = content.split(`? 'var(--color-success)' : 'var(--color-text-muted)'`).join(`? 'var(--color-success)' : '#EF4444'`);
  fs.writeFileSync(f, content, 'utf8');
}
console.log('Done replacement');
