const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'frontend/src/app/admin/(panel)');
const files = fs.readdirSync(dir);

files.forEach(folder => {
  const p = path.join(dir, folder, 'page.jsx');
  if (fs.existsSync(p)) {
    let content = fs.readFileSync(p, 'utf8');

    // Find the button
    const btnRegex = /<button onClick=\{onClose\} style=\{\{ position: 'absolute', top: '(1\.25rem|0\.75rem)', right: '(1\.25rem|0\.75rem)',[^>]+><X size=\{16\} \/><\/button>/;
    
    if (btnRegex.test(content)) {
       // Check if the modal wrapper has overflowY: 'auto'
       const match = content.match(btnRegex);
       const btnStr = match[0];
       
       // Find the start of the modal wrapper which is the div immediately containing the button
       // Usually it's something like <div style={{ ... overflowY: 'auto' }}>\n <button...
       
       const btnIdx = content.indexOf(btnStr);
       const beforeBtn = content.substring(0, btnIdx);
       const wrapperStart = beforeBtn.lastIndexOf('<'); // could be <div or <motion.div
       const wrapperEnd = beforeBtn.lastIndexOf('>') + 1; // should be just before the button (maybe with some spaces)
       
       let wrapperTag = content.substring(wrapperStart, wrapperEnd);
       
       if (wrapperTag.includes("overflowY: 'auto'")) {
          // It needs fixing!
          // Replace wrapper style
          let newWrapperTag = wrapperTag.replace(/overflowY:\s*'auto'/, "display: 'flex', flexDirection: 'column'");
          // Replace padding
          newWrapperTag = newWrapperTag.replace(/padding:\s*'[^']+'/, "padding: 0");
          
          // Modify button
          let newBtnStr = btnStr.replace(/top:\s*'[^']+'/, "top: '0.75rem'");
          newBtnStr = newBtnStr.replace(/right:\s*'[^']+'/, "right: '0.75rem'");
          if (!newBtnStr.includes('zIndex')) {
             newBtnStr = newBtnStr.replace(/cursor:\s*'pointer'/, "cursor: 'pointer', zIndex: 10");
          }
          
          // Find the closing tag of the wrapper
          const isMotion = wrapperTag.startsWith('<motion.div');
          const closingTag = isMotion ? '</motion.div>' : '</div>';
          
          const afterBtn = content.substring(btnIdx + btnStr.length);
          // We need to find the matching closing tag.
          // Since it's JSX, we can just find the LAST closing tag before the end of the return statement? No, just the last closing tag of that type.
          // Because usually the modal is the outermost element in the return of the Modal component.
          
          // Actually, let's just find the last occurrence of closingTag before export default or unction Admin
          const modalFuncEnd = content.indexOf('export default');
          const searchArea = modalFuncEnd !== -1 ? content.substring(0, modalFuncEnd) : content;
          const lastClosingIdx = searchArea.lastIndexOf(closingTag);
          
          if (lastClosingIdx !== -1) {
             const innerContent = content.substring(btnIdx + btnStr.length, lastClosingIdx);
             const tail = content.substring(lastClosingIdx);
             
             let newContent = content.substring(0, wrapperStart) + 
                newWrapperTag + '\n' +
                newBtnStr + '\n' +
                '<div style={{ padding: \'2.25rem\', overflowY: \'auto\', flex: 1 }}>' +
                innerContent +
                '</div>\n' + tail;
                
             fs.writeFileSync(p, newContent, 'utf8');
             console.log('Fixed ' + folder);
          }
       }
    }
  }
});
