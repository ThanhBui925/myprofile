const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'frontend/src/app/admin/(panel)');
const files = fs.readdirSync(dir);

files.forEach(folder => {
  const p = path.join(dir, folder, 'page.jsx');
  if (fs.existsSync(p)) {
    let content = fs.readFileSync(p, 'utf8');

    const regex = /<motion\.div\s+initial=\{\{ opacity: 0, scale: 0\.95 \}\}\s+animate=\{\{ opacity: 1, scale: 1 \}\}\s+style=\{\{\s*background: 'var\(--color-bg-2\)', border: '1px solid var\(--color-border-muted\)', borderRadius: 'var\(--radius-xl\)', padding: '2\.25rem', width: '100%', maxWidth: (\d+), position: 'relative', maxHeight: '90vh', overflowY: 'auto'\s*\}\}>\s*<button onClick=\{onClose\} style=\{\{\s*position: 'absolute', top: '1\.25rem', right: '1\.25rem', background: 'var\(--color-surface\)', border: '1px solid var\(--color-border-muted\)', borderRadius: '50%', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var\(--color-text-muted\)'\s*\}\}><X size=\{16\} \/><\/button>([\s\S]*?)<\/motion\.div>/g;

    if (regex.test(content)) {
      content = content.replace(regex, (match, maxWidth, innerContent) => {
        return "<motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ background: 'var(--color-bg-2)', border: '1px solid var(--color-border-muted)', borderRadius: 'var(--radius-xl)', padding: 0, width: '100%', maxWidth: " + maxWidth + ", position: 'relative', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>\n" +
        "<button onClick={onClose} style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', background: 'var(--color-surface)', border: '1px solid var(--color-border-muted)', borderRadius: '50%', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--color-text-muted)', zIndex: 10 }}><X size={16} /></button>\n" +
        "<div style={{ padding: '2.25rem', overflowY: 'auto', flex: 1 }}>\n" +
        innerContent + "\n" +
        "</div>\n" +
        "</motion.div>";
      });
      fs.writeFileSync(p, content, 'utf8');
      console.log('Fixed ' + folder);
    } else {
      console.log('Regex did not match for ' + folder);
    }
  }
});
