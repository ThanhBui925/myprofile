const fs = require('fs');
let content = fs.readFileSync('frontend/src/app/admin/(panel)/courses/page.jsx', 'utf8');

// 1. Add handleDelete
if (!content.includes('const handleDelete =')) {
    content = content.replace('const handleSave = (data) => { if (modal?._id) updateMut.mutate({ id: modal._id, data }); else createMut.mutate(data); };',
    `const handleSave = (data) => { if (modal?._id) updateMut.mutate({ id: modal._id, data }); else createMut.mutate(data); };
  const handleDelete = (id) => { deleteMut.mutate(id, { onSuccess: () => setModal(null) }); };`);
}

// 2. Fix the table
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

const oldTableRegex = /<div style=\{\{ background: 'var\(--color-surface\)', border: '1px solid var\(--color-border-muted\)', borderRadius: 'var\(--radius-xl\)', overflow: 'hidden' \}\}>[\s\S]*?<table className="admin-table">[\s\S]*?<\/table>[\s\S]*?<\/div>/;

if (oldTableRegex.test(content)) {
    content = content.replace(oldTableRegex, newTable);
    console.log('Replaced table');
}

fs.writeFileSync('frontend/src/app/admin/(panel)/courses/page.jsx', content, 'utf8');
console.log('Fixed courses page');
