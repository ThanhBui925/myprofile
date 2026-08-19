const fs = require('fs');
const file = 'frontend/src/app/admin/(panel)/projects/page.jsx';

if (fs.existsSync(file)) {
  let c = fs.readFileSync(file, 'utf8');
  
  const oldFooter = `<div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} className="btn btn-ghost">Huỷ</button>
            <button type="submit" className="btn btn-primary">Lưu</button>
          </div>`;
          
  const newFooter = `<div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'space-between' }}>
            {project && <button type="button" onClick={() => { if (confirm('Xoá dự án này?')) { onDelete(project._id); onClose(); } }} className="btn btn-sm" style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)' }}><Trash2 size={14} /> Xóa</button>}
            <div style={{ display: 'flex', gap: '0.75rem', marginLeft: project ? 'auto' : '0' }}>
              <button type="button" onClick={onClose} className="btn btn-ghost">Huỷ</button>
              <button type="submit" className="btn btn-primary">Lưu</button>
            </div>
          </div>`;
          
  if (c.includes(oldFooter)) {
    c = c.replace(oldFooter, newFooter);
    fs.writeFileSync(file, c, 'utf8');
    console.log('Successfully added Xóa button to ProjectModal footer');
  } else {
    // Try LF line endings
    const oldFooterLF = oldFooter.replace(/\r\n/g, '\n');
    const newFooterLF = newFooter.replace(/\r\n/g, '\n');
    if (c.includes(oldFooterLF)) {
      c = c.replace(oldFooterLF, newFooterLF);
      fs.writeFileSync(file, c, 'utf8');
      console.log('Successfully added Xóa button to ProjectModal footer (LF)');
    } else {
      console.log('Project footer pattern not found');
    }
  }
} else {
  console.log('File not found:', file);
}
