const fs = require('fs');

// --- 1. Fix Banners Modal ---
const bannersFile = 'frontend/src/app/admin/(panel)/banners/page.jsx';
if (fs.existsSync(bannersFile)) {
  let c = fs.readFileSync(bannersFile, 'utf8');
  
  c = c.replace(/gridTemplateColumns: '1fr 1fr'/g, "gridTemplateColumns: '1fr'");
  c = c.replace(/gridTemplateColumns: '2fr 1fr'/g, "gridTemplateColumns: '1fr'");
  
  if (c.includes('function BannerModal({ banner, onClose, onSave })')) {
    c = c.replace('function BannerModal({ banner, onClose, onSave })', 'function BannerModal({ banner, onClose, onSave, onDelete })');
  }
  
  const oldFooter = `<div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button type="button" onClick={onClose} className="btn btn-ghost">Huỷ</button>`;
  const newFooter = `<div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'space-between', marginTop: '0.5rem' }}>
              {banner && <button type="button" onClick={() => { if (confirm('Xoá nội dung này?')) { onDelete(banner._id); onClose(); } }} className="btn btn-sm" style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)' }}><Trash2 size={14} /> Xóa</button>}
              <div style={{ display: 'flex', gap: '0.75rem', marginLeft: banner ? 'auto' : '0' }}>
                <button type="button" onClick={onClose} className="btn btn-ghost">Huỷ</button>`;
                
  const oldFooterEnd = `<button type="submit" className="btn btn-primary">Lưu</button>
            </div>`;
  const newFooterEnd = `<button type="submit" className="btn btn-primary">Lưu</button>
              </div>
            </div>`;
            
  if (c.includes(oldFooter) && !c.includes('Xóa</button>}')) {
    c = c.replace(oldFooter, newFooter);
    c = c.replace(oldFooterEnd, newFooterEnd);
  }
  
  const passOld = 'onSave={(d) => {';
  const passNew = 'onDelete={(id) => deleteMut.mutate(id)}\n                        onSave={(d) => {';
  if (c.includes(passOld) && !c.includes('onDelete={(id)')) {
    c = c.replace(passOld, passNew);
  }
  
  fs.writeFileSync(bannersFile, c, 'utf8');
  console.log('Fixed Banners Modal');
}

// --- 2. Fix Company Modal (Kinh nghiệm làm việc) ---
const companyFile = 'frontend/src/app/admin/(panel)/company/page.jsx';
if (fs.existsSync(companyFile)) {
  let c = fs.readFileSync(companyFile, 'utf8');
  
  // Replace `gridTemplateColumns: '0.5fr 1fr 1fr'` with `1fr`
  c = c.replace(/gridTemplateColumns: '0.5fr 1fr 1fr'/g, "gridTemplateColumns: '1fr'");
  
  // Fix padding of the experience container
  c = c.replace(/padding: '1.25rem', position: 'relative'/g, "padding: '0.75rem 1rem', position: 'relative'");
  
  // Replace the grid-split-2 near descriptionVi
  const regexDesc = /<div className="grid-split-2" style={{ gap: '1rem' }}>(\s*<div className="form-group"><label className="form-label">M[^<]+<\/label><textarea\s*value=\{item\.descriptionVi\})/g;
  c = c.replace(regexDesc, '<div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1rem" }}>$1');

  fs.writeFileSync(companyFile, c, 'utf8');
  console.log('Fixed Company Page (Kinh nghiệm)');
}

// --- 3. Fix Contacts Modal (Cập nhật trạng thái) ---
const contactsFile = 'frontend/src/app/admin/(panel)/contacts/page.jsx';
if (fs.existsSync(contactsFile)) {
  let c = fs.readFileSync(contactsFile, 'utf8');
  
  const flexRegex = /<div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>\s*<p style={{[^}]+}}>C[^<]+:<\/p>/;
  if (flexRegex.test(c)) {
    c = c.replace(flexRegex, `<div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'nowrap', alignItems: 'center', overflowX: 'auto', paddingBottom: '0.25rem' }}>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', fontWeight: 600, alignSelf: 'center', marginRight: '0.25rem', whiteSpace: 'nowrap' }}>Cập nhật trạng thái:</p>`);
    
    c = c.replace(/padding: '0.4rem 0.875rem'/g, "padding: '0.4rem 0.6rem', whiteSpace: 'nowrap'");
    fs.writeFileSync(contactsFile, c, 'utf8');
    console.log('Fixed Contacts Modal');
  } else {
     console.log('Contacts Modal pattern not found.');
  }
}
