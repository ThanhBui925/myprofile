const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('.jsx') || file.endsWith('.js') || file.endsWith('.css')) results.push(file);
        }
    });
    return results;
}

const files = walk('frontend/src/app/admin/(panel)');
files.push('frontend/src/app/(public)/contact/page.jsx');
files.push('frontend/src/app/(public)/documents/[slug]/page.jsx');
files.push('frontend/src/app/(public)/documents/page.jsx');
files.push('frontend/src/app/(public)/layout.jsx');
files.push('frontend/src/app/(public)/products/[slug]/page.jsx');
files.push('frontend/src/app/(public)/products/page.jsx');
files.push('frontend/src/components/home/Hero3DScene.jsx');
files.push('frontend/src/components/layout/Navbar.css');
files.push('frontend/src/components/layout/Navbar.jsx');
files.push('frontend/src/index.css');
files.push('frontend/src/services/api.js');

let fixedCount = 0;

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');
  
  // A simple heuristic for this specific double-encoding:
  // If the file contains Ã¡, Ãª, Ã½, Ã¢, Ã´, Ã¬, Ä‘, it's corrupted.
  // Wait, "Tài liệu" -> "TÃ i liá»‡u" -> Ã, á, », ‡
  if (content.includes('Ã') || content.includes('Ä') || content.includes('á»')) {
     // Wait, maybe some legitimate files contain Ã? Unlikely in our codebase.
     // Let's test if restoring it works.
     let restored = Buffer.from(content, 'latin1').toString('utf8');
     
     // Double check if restored text makes sense (contains typical Vietnamese words)
     if (restored.includes('Quản lý') || restored.includes('Tài liệu') || restored.includes('Sản phẩm') || restored.includes('Trạng thái') || restored.includes('Thêm') || restored.includes('Xoá') || restored.includes('Liên hệ') || restored.includes('Thành công')) {
         fs.writeFileSync(file, restored, 'utf8');
         console.log('Fixed:', file);
         fixedCount++;
     } else {
         console.log('Skipped (no VN keywords after restore):', file);
     }
  }
}
console.log('Total fixed:', fixedCount);
