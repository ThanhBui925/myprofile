const fs = require('fs');
const path = require('path');

const dir = 'frontend/src/app/admin/(panel)';
const files = fs.readdirSync(dir);

files.forEach(folder => {
  const filePath = path.join(dir, folder, 'page.jsx');
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    content = content.replace(
      /<div style=\{\{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' \}\}>/g,
      '<div className="admin-page-header">'
    );
    
    fs.writeFileSync(filePath, content);
    console.log('Fixed header in ' + folder);
  }
});
