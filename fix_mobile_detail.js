const fs = require('fs');

// ====== STEP 1: CSS - Hide action column on mobile ======
const cssFile = 'frontend/src/index.css';
let css = fs.readFileSync(cssFile, 'utf8');
const mobileCss = `
/* ===== HIDE ACTION COLUMN ON MOBILE ===== */
@media (max-width: 768px) {
  .admin-table th:last-child,
  .admin-table td:last-child {
    display: none;
  }
  .admin-table tr {
    cursor: pointer;
  }
}
`;
if (!css.includes('HIDE ACTION COLUMN ON MOBILE')) {
  fs.writeFileSync(cssFile, css + mobileCss, 'utf8');
  console.log('✓ CSS: Ẩn cột Thao tác trên mobile');
} else {
  console.log('  CSS already done');
}

// ====== STEP 2: Add onClick to <tr> rows ======
const pages = [
  { file: 'frontend/src/app/admin/(panel)/courses/page.jsx',  trOld: '<tr key={p._id}>',       trNew: '<tr key={p._id} onClick={() => setModal(p)} style={{ cursor: \'pointer\' }}>' },
  { file: 'frontend/src/app/admin/(panel)/products/page.jsx', trOld: '<tr key={p._id}>',       trNew: '<tr key={p._id} onClick={() => setModal(p)} style={{ cursor: \'pointer\' }}>' },
  { file: 'frontend/src/app/admin/(panel)/projects/page.jsx', trOld: '<tr key={p._id}>',       trNew: '<tr key={p._id} onClick={() => setModal(p)} style={{ cursor: \'pointer\' }}>' },
  { file: 'frontend/src/app/admin/(panel)/partners/page.jsx', trOld: '<tr key={p._id}>',       trNew: '<tr key={p._id} onClick={() => setModal(p)} style={{ cursor: \'pointer\' }}>' },
  { file: 'frontend/src/app/admin/(panel)/services/page.jsx', trOld: '<tr key={svc._id}>',     trNew: '<tr key={svc._id} onClick={() => setModal(svc)} style={{ cursor: \'pointer\' }}>' },
  { file: 'frontend/src/app/admin/(panel)/banners/page.jsx',  trOld: '<tr key={banner._id}>', trNew: '<tr key={banner._id} onClick={() => setModal(banner)} style={{ cursor: \'pointer\' }}>' },
];

for (const { file, trOld, trNew } of pages) {
  if (!fs.existsSync(file)) { console.log('  SKIP (not found):', file); continue; }
  let c = fs.readFileSync(file, 'utf8');
  if (c.includes(trNew)) { console.log('  Already done:', file); continue; }
  if (!c.includes(trOld)) { console.log('  Pattern not found:', file, '|', trOld); continue; }
  c = c.replace(trOld, trNew);
  fs.writeFileSync(file, c, 'utf8');
  console.log('✓ onClick added:', file.split('/').pop(), '(folder:', file.split('/').at(-2), ')');
}

// ====== STEP 3: Add delete button inside modals (footer area) ======
// Each modal ends with: <button type="button" onClick={onClose} className="btn btn-ghost">Huỷ</button>
// We add a "Xóa" button before it (only when editing, i.e. when item exists)

const modalPages = [
  {
    file: 'frontend/src/app/admin/(panel)/courses/page.jsx',
    oldFooter: `<button type="button" onClick={onClose} className="btn btn-ghost">Huỷ</button>
            <button type="submit" className="btn btn-primary">Lưu Tài liệu</button>`,
    newFooter: `{course && <button type="button" onClick={() => { if (confirm('Xoá tài liệu này?')) { onDelete(course._id); onClose(); } }} className="btn btn-sm" style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)', marginRight: 'auto' }}><Trash2 size={14} /> Xóa</button>}
            <button type="button" onClick={onClose} className="btn btn-ghost">Huỷ</button>
            <button type="submit" className="btn btn-primary">Lưu Tài liệu</button>`,
    propOld: 'function CourseModal({ course, onClose, onSave })',
    propNew: 'function CourseModal({ course, onClose, onSave, onDelete })',
    passOld: 'onSave={handleSave} />',
    passNew: 'onSave={handleSave} onDelete={(id) => deleteMut.mutate(id)} />',
  },
  {
    file: 'frontend/src/app/admin/(panel)/products/page.jsx',
    oldFooter: `<button type="button" onClick={onClose} className="btn btn-ghost">Huỷ</button>
            <button type="submit" className="btn btn-primary">Lưu Sản phẩm</button>`,
    newFooter: `{product && <button type="button" onClick={() => { if (confirm('Xoá sản phẩm này?')) { onDelete(product._id); onClose(); } }} className="btn btn-sm" style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)', marginRight: 'auto' }}><Trash2 size={14} /> Xóa</button>}
            <button type="button" onClick={onClose} className="btn btn-ghost">Huỷ</button>
            <button type="submit" className="btn btn-primary">Lưu Sản phẩm</button>`,
    propOld: 'function ProductModal({ product, onClose, onSave })',
    propNew: 'function ProductModal({ product, onClose, onSave, onDelete })',
    passOld: 'onSave={handleSave} />',
    passNew: 'onSave={handleSave} onDelete={(id) => deleteMut.mutate(id)} />',
  },
  {
    file: 'frontend/src/app/admin/(panel)/projects/page.jsx',
    oldFooter: `<button type="button" onClick={onClose} className="btn btn-ghost">Huỷ</button>
            <button type="submit" className="btn btn-primary">Lưu Dự án</button>`,
    newFooter: `{project && <button type="button" onClick={() => { if (confirm('Xoá dự án này?')) { onDelete(project._id); onClose(); } }} className="btn btn-sm" style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)', marginRight: 'auto' }}><Trash2 size={14} /> Xóa</button>}
            <button type="button" onClick={onClose} className="btn btn-ghost">Huỷ</button>
            <button type="submit" className="btn btn-primary">Lưu Dự án</button>`,
    propOld: 'function ProjectModal({ project, onClose, onSave })',
    propNew: 'function ProjectModal({ project, onClose, onSave, onDelete })',
    passOld: 'onSave={handleSave} />',
    passNew: 'onSave={handleSave} onDelete={(id) => deleteMut.mutate(id)} />',
  },
  {
    file: 'frontend/src/app/admin/(panel)/partners/page.jsx',
    oldFooter: `<button type="button" onClick={onClose} className="btn btn-ghost">Huỷ</button>
            <button type="submit" className="btn btn-primary">Lưu Đối tác</button>`,
    newFooter: `{partner && <button type="button" onClick={() => { if (confirm('Xoá đối tác này?')) { onDelete(partner._id); onClose(); } }} className="btn btn-sm" style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)', marginRight: 'auto' }}><Trash2 size={14} /> Xóa</button>}
            <button type="button" onClick={onClose} className="btn btn-ghost">Huỷ</button>
            <button type="submit" className="btn btn-primary">Lưu Đối tác</button>`,
    propOld: 'function PartnerModal({ partner, onClose, onSave })',
    propNew: 'function PartnerModal({ partner, onClose, onSave, onDelete })',
    passOld: 'onSave={handleSave} />',
    passNew: 'onSave={handleSave} onDelete={(id) => deleteMut.mutate(id)} />',
  },
];

for (const { file, oldFooter, newFooter, propOld, propNew, passOld, passNew } of modalPages) {
  if (!fs.existsSync(file)) { console.log('  SKIP:', file); continue; }
  let c = fs.readFileSync(file, 'utf8');
  let changed = false;

  if (c.includes(propOld)) { c = c.replace(propOld, propNew); changed = true; }
  if (c.includes(passOld) && !c.includes(passNew)) { c = c.replace(passOld, passNew); changed = true; }
  if (c.includes(oldFooter) && !c.includes('Trash2 size={14} /> Xóa')) { c = c.replace(oldFooter, newFooter); changed = true; }

  if (changed) {
    fs.writeFileSync(file, c, 'utf8');
    console.log('✓ Modal delete button added:', file.split('/').at(-2));
  } else {
    console.log('  Already done or pattern mismatch:', file.split('/').at(-2));
  }
}

console.log('\nAll done!');
