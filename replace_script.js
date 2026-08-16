const fs = require('fs');
const path = require('path');

const directory = '.';
const ignoreDirs = ['node_modules', '.next', '.git', 'dist', 'build'];

function replaceInFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let newContent = content;
    
    // Replace ERATECH with THANHTDH
    newContent = newContent.replace(/ERATECH/g, 'THANHTDH');
    // Replace eratech with thanhtdh
    newContent = newContent.replace(/eratech/g, 'thanhtdh');
    // Replace Eratech with Thanhtdh
    newContent = newContent.replace(/Eratech/g, 'Thanhtdh');
    
    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`Updated: ${filePath}`);
    }
  } catch (err) {
    // Ignore binary files or permission issues
  }
}

function traverse(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    try {
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        if (!ignoreDirs.includes(file)) {
          traverse(fullPath);
        }
      } else {
        replaceInFile(fullPath);
      }
    } catch (e) {
      // Ignore
    }
  }
}

traverse(directory);
console.log('Done replacing!');
