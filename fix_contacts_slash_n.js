const fs = require('fs');
const file = 'frontend/src/app/admin/(panel)/contacts/page.jsx';

if (fs.existsSync(file)) {
  let c = fs.readFileSync(file, 'utf8');
  
  // Replace the literal \n with a real newline
  const target = '</div>\\n      </motion.div>';
  const replacement = '</div>\n      </motion.div>';
  
  if (c.includes(target)) {
    c = c.replace(target, replacement);
    fs.writeFileSync(file, c, 'utf8');
    console.log('Successfully fixed stray \\n in contacts/page.jsx');
  } else {
    console.log('Target literal \\n not found. Let\'s try direct replace.');
    // Let's do a replace of '</div>\\n' with '</div>\n'
    c = c.replace('</div>\\n', '</div>\n');
    fs.writeFileSync(file, c, 'utf8');
    console.log('Replaced by partial string');
  }
} else {
  console.log('File not found:', file);
}
