const fs = require('fs');
const file = 'frontend/src/app/admin/(panel)/banners/page.jsx';
let c = fs.readFileSync(file, 'utf8');

// Replace call site to pass onDelete
const oldCall = 'onSave={handleSave}';
const newCall = 'onSave={handleSave} onDelete={(id) => deleteMut.mutate(id)}';
if (c.includes(oldCall)) {
  c = c.replace(oldCall, newCall);
  console.log('Passed onDelete prop to BannerModal');
}

// Replace footer layout in BannerModal
const idx = c.indexOf('className="btn btn-primary"');
if (idx !== -1) {
  const start = c.lastIndexOf('<div style={{ display: \'flex\', gap: \'0.75rem\', justifyContent: \'flex-end\'', idx);
  if (start !== -1) {
    const end = c.indexOf('</div>', idx) + 6;
    const oldFooter = c.substring(start, end);
    const newFooter = `<div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'space-between', marginTop: '0.5rem' }}>
            {banner && <button type="button" onClick={() => { if (confirm('Xoá nội dung này?')) { onDelete(banner._id); onClose(); } }} className="btn btn-sm" style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)' }}><Trash2 size={14} /> Xóa</button>}
            <div style={{ display: 'flex', gap: '0.75rem', marginLeft: banner ? 'auto' : '0' }}>
              <button type="button" onClick={onClose} className="btn btn-ghost">Huỷ</button>
              <button type="submit" className="btn btn-primary">Lưu</button>
            </div>
          </div>`;
    c = c.substring(0, start) + newFooter + c.substring(end);
    fs.writeFileSync(file, c, 'utf8');
    console.log('Successfully replaced banner footer by indices!');
  } else {
    console.log('Could not find start of div');
  }
} else {
  console.log('Could not find submit button');
}
