const fs = require('fs');
const file = 'frontend/src/app/admin/(panel)/banners/page.jsx';
let c = fs.readFileSync(file, 'utf8');

// Replace the submit button in banners - find it by unique context
const idx = c.indexOf('type="submit" className="btn btn-primary"');
if (idx !== -1) {
  const start = c.lastIndexOf('<button', idx);
  const end = c.indexOf('</button>', idx) + '</button>'.length;
  const oldBtn = c.substring(start, end);
  const newBtn = '<button type="submit" className="btn btn-primary">Lưu</button>';
  c = c.substring(0, start) + newBtn + c.substring(end);
  fs.writeFileSync(file, c, 'utf8');
  console.log('Fixed. Old:', oldBtn.substring(0, 60));
} else {
  console.log('Not found');
}
