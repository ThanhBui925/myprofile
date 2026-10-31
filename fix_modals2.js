const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'frontend/src/app/admin/(panel)');
const files = fs.readdirSync(dir);

files.forEach(folder => {
  const p = path.join(dir, folder, 'page.jsx');
  if (fs.existsSync(p)) {
    let content = fs.readFileSync(p, 'utf8');

    // More generic regex. 
    // We look for <motion.div ... style={{... maxHeight: '...vh', overflowY: 'auto' }}>
    // And <button onClick={onClose} style={{ position: 'absolute'... }}><X ... /></button>
    
    // We will do this manually with string splitting to be robust.
    const startIdx = content.indexOf('<motion.div initial={{ opacity: 0, scale: 0.95 }}');
    if (startIdx !== -1) {
      const endMotion = content.indexOf('>', startIdx);
      let motionTag = content.substring(startIdx, endMotion + 1);
      
      if (motionTag.includes('overflowY: \'auto\'')) {
        // It needs fixing
        // Extract inner content
        const innerStart = endMotion + 1;
        // Find the close button
        const btnStart = content.indexOf('<button onClick={onClose}', innerStart);
        if (btnStart !== -1 && btnStart < innerStart + 500) {
          const btnEnd = content.indexOf('</button>', btnStart) + 9;
          
          let modifiedMotionTag = motionTag.replace(/overflowY:\s*'auto'/, "display: 'flex', flexDirection: 'column'");
          modifiedMotionTag = modifiedMotionTag.replace(/padding:\s*'[^']+'/, "padding: 0");
          
          let btnTag = content.substring(btnStart, btnEnd);
          // change button position
          btnTag = btnTag.replace(/top:\s*'[^']+'/, "top: '0.75rem'");
          btnTag = btnTag.replace(/right:\s*'[^']+'/, "right: '0.75rem'");
          btnTag = btnTag.replace(/zIndex:\s*\d+,?/, ""); // remove existing zIndex if any
          btnTag = btnTag.replace(/cursor:\s*'pointer'/, "cursor: 'pointer', zIndex: 10"); // inject zIndex
          
          const restOfFile = content.substring(btnEnd);
          const lastMotionEnd = restOfFile.lastIndexOf('</motion.div>');
          
          if (lastMotionEnd !== -1) {
             const innerContent = restOfFile.substring(0, lastMotionEnd);
             const tail = restOfFile.substring(lastMotionEnd);
             
             let newContent = content.substring(0, startIdx) +
                 modifiedMotionTag + '\n' +
                 btnTag + '\n' +
                 '<div style={{ padding: \'2.25rem\', overflowY: \'auto\', flex: 1 }}>' +
                 innerContent +
                 '</div>\n' + tail;
                 
             fs.writeFileSync(p, newContent, 'utf8');
             console.log('Fixed ' + folder);
          }
        }
      }
    }
  }
});
