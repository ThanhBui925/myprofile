const fs = require('fs');

function replaceBlock(filePath, startMarker, endMarker, newContent) {
  if (!fs.existsSync(filePath)) return false;
  let c = fs.readFileSync(filePath, 'utf8');
  let normalized = c.replace(/\r\n/g, '\n');
  const startIdx = normalized.indexOf(startMarker);
  if (startIdx === -1) return false;
  const endIdx = normalized.indexOf(endMarker, startIdx);
  if (endIdx === -1) return false;
  const actualEndIdx = endIdx + endMarker.length;
  normalized = normalized.substring(0, startIdx) + newContent + normalized.substring(actualEndIdx);
  if (c.includes('\r\n')) {
    normalized = normalized.replace(/\n/g, '\r\n');
  }
  fs.writeFileSync(filePath, normalized, 'utf8');
  return true;
}

// --- Fix Banners Page ---
const bannersFile = 'frontend/src/app/admin/(panel)/banners/page.jsx';
if (fs.existsSync(bannersFile)) {
  let c = fs.readFileSync(bannersFile, 'utf8');
  let normalized = c.replace(/\r\n/g, '\n');
  
  // Find the form body inside BannerModal
  const formStart = '<form onSubmit={handleSubmit(d => onSave(d))} style={{ display: \'flex\', flexDirection: \'column\', gap: \'1rem\' }}>';
  const formEnd = '<div style={{ display: \'flex\', gap: \'0.75rem\', justifyContent: \'space-between\', marginTop: \'0.5rem\' }}>';
  
  const idxStart = normalized.indexOf(formStart);
  const idxEnd = normalized.indexOf(formEnd);
  
  if (idxStart !== -1 && idxEnd !== -1) {
    const newFormBody = `${formStart}
          <div className="grid-split-2" style={{ gap: '1rem' }}>
            <div className="form-group"><label className="form-label">Tiêu đề (VI) *</label><input {...register('titleVi', { required: true })} className="form-input" placeholder="Tiêu đề tiếng Việt" />{errors.titleVi && <span className="form-error">Bắt buộc</span>}</div>
            <div className="form-group"><label className="form-label">Tiêu đề (EN) *</label><input {...register('titleEn', { required: true })} className="form-input" placeholder="Title in English" />{errors.titleEn && <span className="form-error">Required</span>}</div>
          </div>
          <div className="grid-split-2" style={{ gap: '1rem' }}>
            <div className="form-group"><label className="form-label">Phụ đề (VI)</label><input {...register('subtitleVi')} className="form-input" placeholder="Phụ đề" /></div>
            <div className="form-group"><label className="form-label">Phụ đề (EN)</label><input {...register('subtitleEn')} className="form-input" placeholder="Subtitle" /></div>
          </div>
          <div className="form-group"><label className="form-label">Link (tuỳ chọn)</label><input {...register('link')} className="form-input" placeholder="/services" /></div>
          <div className="form-group"><label className="form-label">Thứ tự</label><input {...register('order', { valueAsNumber: true })} type="number" className="form-input" defaultValue={0} /></div>
          `;
    
    normalized = normalized.substring(0, idxStart) + newFormBody + normalized.substring(idxEnd);
    if (c.includes('\r\n')) {
      normalized = normalized.replace(/\n/g, '\r\n');
    }
    fs.writeFileSync(bannersFile, normalized, 'utf8');
    console.log('Fixed Banners Modal Grids!');
  } else {
    console.log('Banners form start/end not found');
  }
}

// --- Fix Services Page ---
const servicesFile = 'frontend/src/app/admin/(panel)/services/page.jsx';
if (fs.existsSync(servicesFile)) {
  let c = fs.readFileSync(servicesFile, 'utf8');
  let normalized = c.replace(/\r\n/g, '\n');
  
  // 1. Pass onDelete prop to ServiceModal declaration
  normalized = normalized.replace('function ServiceModal({ service, onClose, onSave })', 'function ServiceModal({ service, onClose, onSave, onDelete })');
  
  // 2. Change grid-split-3 to separate rows
  const oldGrid = `<div className="grid-split-3" style={{ gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Icon</label>
              <select {...register('icon')} className="form-select">
                {ICON_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div className="form-group"><label className="form-label">Thứ tự</label><input {...register('order')} type="number" className="form-input" /></div>
            <div className="form-group" style={{ justifyContent: 'center' }}>
              <label className="form-label">Hiển thị</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginTop: '0.5rem' }}>
                <input {...register('isActive')} type="checkbox" style={{ accentColor: 'var(--color-primary)', width: 18, height: 18 }} />
                <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Kích hoạt</span>
              </label>
            </div>
          </div>`;
          
  const newGrid = `<div className="form-group">
            <label className="form-label">Icon</label>
            <select {...register('icon')} className="form-select">
              {ICON_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div className="form-group"><label className="form-label">Thứ tự</label><input {...register('order')} type="number" className="form-input" /></div>
          <div className="form-group">
            <label className="form-label">Hiển thị</label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginTop: '0.5rem' }}>
              <input {...register('isActive')} type="checkbox" style={{ accentColor: 'var(--color-primary)', width: 18, height: 18 }} />
              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Kích hoạt</span>
            </label>
          </div>`;
  
  normalized = normalized.replace(oldGrid, newGrid);
  
  // 3. Add Delete button to footer
  const oldFooter = `<div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} className="btn btn-ghost">Huỷ</button>
            <button type="submit" className="btn btn-primary">Lưu</button>
          </div>`;
          
  const newFooter = `<div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'space-between' }}>
            {service && <button type="button" onClick={() => { if (confirm('Xoá dịch vụ này?')) { onDelete(service._id); onClose(); } }} className="btn btn-sm" style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)' }}><Trash2 size={14} /> Xóa</button>}
            <div style={{ display: 'flex', gap: '0.75rem', marginLeft: service ? 'auto' : '0' }}>
              <button type="button" onClick={onClose} className="btn btn-ghost">Huỷ</button>
              <button type="submit" className="btn btn-primary">Lưu</button>
            </div>
          </div>`;
          
  normalized = normalized.replace(oldFooter, newFooter);
  
  // 4. Pass onDelete at call site
  normalized = normalized.replace('onSave={handleSave} />', 'onSave={handleSave} onDelete={(id) => deleteMut.mutate(id)} />');
  
  if (c.includes('\r\n')) {
    normalized = normalized.replace(/\n/g, '\r\n');
  }
  fs.writeFileSync(servicesFile, normalized, 'utf8');
  console.log('Fixed Services Page Grid & Added Delete Button!');
}
