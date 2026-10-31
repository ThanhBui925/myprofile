const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'frontend/src/app/admin/(panel)');
const files = fs.readdirSync(dir);
files.forEach(folder => {
  const p = path.join(dir, folder, 'page.jsx');
  if (fs.existsSync(p)) {
    let content = fs.readFileSync(p, 'utf8');
    const match = content.match(/<motion\.div[^>]*style=\{\{([^}]+)\}\}/);
    if (match) {
      console.log(folder + ' style: ' + match[1].trim());
    }
  }
});
