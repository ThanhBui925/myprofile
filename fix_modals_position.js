const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'frontend/src/app/admin/(panel)');
const files = fs.readdirSync(dir);

files.forEach(folder => {
  const p = path.join(dir, folder, 'page.jsx');
  if (fs.existsSync(p)) {
    let content = fs.readFileSync(p, 'utf8');
    
    // Find button
    const btnRegex = /<button onClick=\{onClose\} style=\{\{ position: 'absolute', top: '1\.25rem', right: '1\.25rem',[^>]+><X size=\{16\} \/><\/button>/;
    if (btnRegex.test(content)) {
       const match = content.match(btnRegex);
       let btnStr = match[0];
       
       let newBtnStr = btnStr.replace(/top:\s*'1\.25rem'/, "top: '0.75rem'");
       newBtnStr = newBtnStr.replace(/right:\s*'1\.25rem'/, "right: '0.75rem'");
       
       content = content.replace(btnStr, newBtnStr);
       fs.writeFileSync(p, content, 'utf8');
       console.log('Moved close button in ' + folder);
    }
  }
});
