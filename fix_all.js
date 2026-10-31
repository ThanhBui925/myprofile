const fs = require('fs');

const fixLayouts = () => {
    const modules = ['courses', 'products', 'services', 'company', 'projects'];
    for (const mod of modules) {
        let f = `frontend/src/app/admin/(panel)/${mod}/page.jsx`;
        if (!fs.existsSync(f)) continue;
        let content = fs.readFileSync(f, 'utf8');
        content = content.replace(/style=\{\{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' \}\}/g, `className="grid-split-2" style={{ gap: '1rem' }}`);
        content = content.replace(/style=\{\{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' \}\}/g, `className="grid-split-3" style={{ gap: '1rem' }}`);
        content = content.replace(/style=\{\{ display: 'flex', alignItems: 'center', gap: '0.5rem' \}\}/g, 'className="grid-specs"');
        fs.writeFileSync(f, content, 'utf8');
    }
};

const fixEyes = () => {
    const modules = ['banners', 'partners', 'products', 'services', 'users', 'courses'];
    for (const mod of modules) {
        let f = `frontend/src/app/admin/(panel)/${mod}/page.jsx`;
        if (!fs.existsSync(f)) continue;
        let content = fs.readFileSync(f, 'utf8');
        content = content.replace(/ToggleRight/g, 'Eye').replace(/ToggleLeft/g, 'EyeOff');
        content = content.split(`? 'var(--color-success)' : 'var(--color-text-muted)'`).join(`? 'var(--color-success)' : '#EF4444'`);
        fs.writeFileSync(f, content, 'utf8');
    }
};

// courses table
const fixCoursesTable = () => {
    let f = `frontend/src/app/admin/(panel)/courses/page.jsx`;
    if (!fs.existsSync(f)) return;
    let content = fs.readFileSync(f, 'utf8');
    
    // Add Eye to import
    if (!content.includes('EyeOff')) {
       content = content.replace('PlusCircle, MinusCircle } from', 'PlusCircle, MinusCircle, Eye, EyeOff } from');
    }

    // Modal save layout
    content = content.replace(
        `        <form onSubmit={handleSubmit(d => onSave({ ...d, specifications: specs, images, catalogUrl: catalogName, order: Number(d.order) }))} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>`,
        `        <form onSubmit={handleSubmit(d => onSave({ ...d, specifications: specs, images, catalogUrl: catalogName, order: Number(d.order) }))} className={mode === 'view' ? 'read-only-form' : ''} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>`
    );
    
    content = content.replace(
        `          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>\n            <button type="button" onClick={onClose} className="btn btn-ghost">Huỷ</button>\n            <button type="submit" className="btn btn-primary">Lưu Tài liệu</button>\n          </div>`,
        `          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", pointerEvents: "auto", marginTop: '1.5rem' }}>
            {mode === 'view' ? (
              <>
                <button type="button" onClick={() => onDelete(course._id)} className="btn btn-ghost" style={{ color: '#EF4444' }}>Xoá</button>
                <button type="button" onClick={(e) => { e.preventDefault(); setMode('edit'); }} className="btn btn-primary">Sửa</button>
              </>
            ) : (
              <>
                <button type="button" onClick={onClose} className="btn btn-ghost">Huỷ</button>
                <button type="submit" className="btn btn-primary">Lưu Tài liệu</button>
              </>
            )}
          </div>`
    );

    // Table
    const tableRegex = /<div className="table-responsive"[^>]*>[\s\S]*?<\/div>/;
    const newTable = `<div className="table-responsive" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-muted)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
        <table className="admin-table">
          <thead><tr><th>Hình</th><th>Tên tài liệu</th><th>Danh mục</th><th>Chi tiết</th><th>Trạng thái</th></tr></thead>
          <tbody>
            {isLoading && <tr><td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>Đang tải...</td></tr>}
            {courses.map(p => (
              <tr key={p._id} onClick={() => setModal(p)} style={{ cursor: 'pointer' }}>
                <td>{p.images?.[0] ? <img src={\`/uploads/images/\${p.images[0]}\`} alt={p.nameVi} style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} /> : <div style={{ width: 56, height: 56, background: 'var(--color-bg-3)', borderRadius: 'var(--radius-sm)' }} />}</td>
                <td><p style={{ fontWeight: 600, color: '#fff', fontSize: '0.875rem', marginBottom: '0.15rem' }}>{p.nameVi}</p><p style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>{p.nameEn}</p></td>
                <td style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>{p.categoryVi || '—'}</td>
                <td style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>{p.specifications?.length || 0} thông tin</td>
                <td>
                  <button onClick={(e) => { e.stopPropagation(); updateMut.mutate({ id: p._id, data: { isActive: !p.isActive } }); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: p.isActive ? 'var(--color-success)' : '#EF4444', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 600 }}>
                    {p.isActive ? <><Eye size={20} /> Hiện</> : <><EyeOff size={20} /> Ẩn</>}
                  </button>
                </td>
              </tr>
            ))}
            {!isLoading && courses.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '3rem' }}>Chưa có tài liệu nào</td></tr>}
          </tbody>
        </table>
      </div>`;

    content = content.replace(tableRegex, newTable);
    content = content.replace(/<CourseModal course=\{modal\}/g, `<CourseModal course={modal === 'create' ? null : modal}`);
    content = content.replace(/function CourseModal\(\{ course, onClose, onSave \}\)/g, `function CourseModal({ course, onClose, onSave, onDelete })`);
    content = content.replace(/const \[mode, setMode\] = useState\('edit'\);/g, `const [mode, setMode] = useState(course ? 'view' : 'edit');`);
    
    if(!content.includes(`const [mode, setMode] = useState(course ? 'view' : 'edit');`)) {
        content = content.replace(`function CourseModal({ course, onClose, onSave, onDelete }) {`, `function CourseModal({ course, onClose, onSave, onDelete }) {\n  const [mode, setMode] = useState(course ? 'view' : 'edit');`);
    }

    // Pass onDelete to CourseModal
    content = content.replace(/onSave=\{handleSave\} \/\>/g, `onSave={handleSave} onDelete={handleDelete} />`);

    fs.writeFileSync(f, content, 'utf8');
};

fixLayouts();
fixEyes();
fixCoursesTable();
console.log('Restored all changes properly!');
