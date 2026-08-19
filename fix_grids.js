const fs = require('fs');
let file, content;

// 1. SERVICES
file = 'frontend/src/app/admin/(panel)/services/page.jsx';
content = fs.readFileSync(file, 'utf8');
content = content.replace(/style=\{\{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' \}\}/g, "className=\"grid-split-2\" style={{ gap: '1rem' }}");
content = content.replace(/style=\{\{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' \}\}/g, "className=\"grid-split-3\" style={{ gap: '1rem' }}");
fs.writeFileSync(file, content, 'utf8');

// 2. PRODUCTS
file = 'frontend/src/app/admin/(panel)/products/page.jsx';
content = fs.readFileSync(file, 'utf8');
content = content.replace(/style=\{\{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' \}\}/g, "className=\"grid-split-2\" style={{ gap: '1rem' }}");
content = content.replace(/style=\{\{ display: 'flex', alignItems: 'center', gap: '0.5rem' \}\}/g, "className=\"grid-specs\"");
fs.writeFileSync(file, content, 'utf8');

// 3. COURSES
file = 'frontend/src/app/admin/(panel)/courses/page.jsx';
content = fs.readFileSync(file, 'utf8');
content = content.replace(/style=\{\{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' \}\}/g, "className=\"grid-split-2\" style={{ gap: '1rem' }}");
content = content.replace(/style=\{\{ display: 'flex', alignItems: 'center', gap: '0.5rem' \}\}/g, "className=\"grid-specs\"");
fs.writeFileSync(file, content, 'utf8');

console.log('Grids restored');
