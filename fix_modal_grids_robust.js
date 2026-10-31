const fs = require('fs');

// Helper to replace matching multi-line blocks irrespective of CRLF/LF and exact indentation
function replaceBlock(filePath, startMarker, endMarker, newContent) {
  if (!fs.existsSync(filePath)) return false;
  let c = fs.readFileSync(filePath, 'utf8');
  
  // Normalize line endings to LF for easier replacement
  let normalized = c.replace(/\r\n/g, '\n');
  
  // Find start and end indices
  const startIdx = normalized.indexOf(startMarker);
  if (startIdx === -1) return false;
  
  const endIdx = normalized.indexOf(endMarker, startIdx);
  if (endIdx === -1) return false;
  
  const actualEndIdx = endIdx + endMarker.length;
  
  // Replace the block
  normalized = normalized.substring(0, startIdx) + newContent + normalized.substring(actualEndIdx);
  
  // Write back preserving standard CRLF if that was the original
  if (c.includes('\r\n')) {
    normalized = normalized.replace(/\n/g, '\r\n');
  }
  
  fs.writeFileSync(filePath, normalized, 'utf8');
  return true;
}

// --- Fix Products Modal ---
const productsFile = 'frontend/src/app/admin/(panel)/products/page.jsx';
const prodStart = '<div className="grid-split-3" style={{ gap: \'1rem\' }}>';
const prodEnd = '<div className="form-group"><label className="form-label">Thứ tự</label><input {...register(\'order\')} type="number" className="form-input" /></div>\n          </div>';
const prodNew = `<div className="grid-split-2" style={{ gap: '1rem' }}>
            <div className="form-group"><label className="form-label">Danh mục (VI)</label><input {...register('categoryVi')} className="form-input" placeholder="Camera công nghiệp" /></div>
            <div className="form-group"><label className="form-label">Category (EN)</label><input {...register('categoryEn')} className="form-input" placeholder="Industrial Camera" /></div>
          </div>
          <div className="form-group"><label className="form-label">Thứ tự</label><input {...register('order')} type="number" className="form-input" /></div>`;

if (replaceBlock(productsFile, prodStart, prodEnd, prodNew)) {
  console.log('Fixed Products Modal Grid Layout!');
} else {
  console.log('Failed to fix Products Modal Grid Layout');
}

// --- Fix Projects Modal ---
const projectsFile = 'frontend/src/app/admin/(panel)/projects/page.jsx';
const projStart = '<div className="grid-split-3" style={{ gap: \'1rem\' }}>';
const projEnd = '<div className="form-group"><label className="form-label">Thứ tự</label><input {...register(\'order\')} type="number" className="form-input" style={{ width: 80 }} /></div>\n          </div>';
const projNew = `<div className="form-group"><label className="form-label">Khách hàng</label><input {...register('client')} className="form-input" placeholder="Samsung, Vincom..." /></div>
          <div className="grid-split-2" style={{ gap: '1rem' }}>
            <div className="form-group"><label className="form-label">Ngành (VI)</label><input {...register('industryVi')} className="form-input" placeholder="Điện tử" /></div>
            <div className="form-group"><label className="form-label">Industry (EN)</label><input {...register('industryEn')} className="form-input" placeholder="Electronics" /></div>
          </div>
          <div className="form-group"><label className="form-label">Thứ tự</label><input {...register('order')} type="number" className="form-input" /></div>`;

if (replaceBlock(projectsFile, projStart, projEnd, projNew)) {
  console.log('Fixed Projects Modal Grid Layout!');
} else {
  console.log('Failed to fix Projects Modal Grid Layout');
}

// --- Fix Partners Modal ---
const partnersFile = 'frontend/src/app/admin/(panel)/partners/page.jsx';
const partStart = '<div style={{ display: \'grid\', gridTemplateColumns: \'1fr 1fr\', gap: \'1rem\' }}>';
const partEnd = '<span style={{ color: \'var(--color-text-muted)\', fontSize: \'0.875rem\' }}>Kích hoạt</span>\n              </label>\n            </div>\n          </div>';
const partNew = `<div className="form-group"><label className="form-label">Thứ tự</label><input {...register('order')} type="number" className="form-input" /></div>
          <div className="form-group">
            <label className="form-label">Trạng thái</label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginTop: '0.5rem' }}>
              <input {...register('isActive')} type="checkbox" defaultChecked style={{ accentColor: 'var(--color-primary)', width: 16, height: 16 }} />
              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Kích hoạt</span>
            </label>
          </div>`;

if (replaceBlock(partnersFile, partStart, partEnd, partNew)) {
  console.log('Fixed Partners Modal Grid Layout!');
} else {
  console.log('Failed to fix Partners Modal Grid Layout');
}
