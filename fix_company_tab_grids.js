const fs = require('fs');
const file = 'frontend/src/app/admin/(panel)/company/page.jsx';

if (fs.existsSync(file)) {
  let c = fs.readFileSync(file, 'utf8');
  let normalized = c.replace(/\r\n/g, '\n');
  
  // 1. Fix History tab (Kinh nghiệm)
  // Let's replace the whole inner structure of history mapping
  const histStartMarker = '{history.map((item, i) => (';
  const histEndMarker = '))}';
  
  // Actually, let's find the content of history.map loop and replace the JSX inside.
  // We can target specific elements.
  // Currently:
  // <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', marginBottom: '0.75rem' }}>
  //   <div className="form-group"><label className="form-label">Thời gian</label>...</div>
  //   <div className="form-group"><label className="form-label">Tiêu đề (VI)</label>...</div>
  //   <div className="form-group"><label className="form-label">Title (EN)</label>...</div>
  // </div>
  // <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1rem" }}>
  //   <div className="form-group"><label className="form-label">Mô tả (VI)</label>...</div>
  //   <div className="form-group"><label className="form-label">Description (EN)</label>...</div>
  // </div>
  
  // Let's replace these grid divs.
  // We can find the exact text in normalized:
  const oldHistGrid1 = `<div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', marginBottom: '0.75rem' }}>
                    <div className="form-group"><label className="form-label">Thời gian</label><input value={item.year} onChange={e => setHistory(p => p.map((h, idx) => idx === i ? { ...h, year: e.target.value } : h))} className="form-input" type="text" placeholder="Ví dụ: 05/2023 hoặc 2023" /></div>
                    <div className="form-group"><label className="form-label">Tiêu đề (VI)</label><input value={item.titleVi} onChange={e => setHistory(p => p.map((h, idx) => idx === i ? { ...h, titleVi: e.target.value } : h))} className="form-input" /></div>
                    <div className="form-group"><label className="form-label">Title (EN)</label><input value={item.titleEn} onChange={e => setHistory(p => p.map((h, idx) => idx === i ? { ...h, titleEn: e.target.value } : h))} className="form-input" /></div>
                  </div>`;
                  
  const newHistGrid1 = `<div className="form-group" style={{ marginBottom: '0.75rem' }}><label className="form-label">Thời gian</label><input value={item.year} onChange={e => setHistory(p => p.map((h, idx) => idx === i ? { ...h, year: e.target.value } : h))} className="form-input" type="text" placeholder="Ví dụ: 05/2023 hoặc 2023" /></div>
                  <div className="grid-split-2" style={{ gap: '1rem', marginBottom: '0.75rem' }}>
                    <div className="form-group"><label className="form-label">Tiêu đề (VI)</label><input value={item.titleVi} onChange={e => setHistory(p => p.map((h, idx) => idx === i ? { ...h, titleVi: e.target.value } : h))} className="form-input" /></div>
                    <div className="form-group"><label className="form-label">Title (EN)</label><input value={item.titleEn} onChange={e => setHistory(p => p.map((h, idx) => idx === i ? { ...h, titleEn: e.target.value } : h))} className="form-input" /></div>
                  </div>`;
                  
  if (normalized.includes(oldHistGrid1)) {
    normalized = normalized.replace(oldHistGrid1, newHistGrid1);
    console.log('Fixed History Grid 1');
  } else {
    console.log('Pattern oldHistGrid1 not found');
  }
  
  // Replace the Description grid
  const oldHistGrid2 = `<div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1rem" }}>
                    <div className="form-group"><label className="form-label">Mô tả (VI)</label><textarea value={item.descriptionVi} onChange={e => setHistory(p => p.map((h, idx) => idx === i ? { ...h, descriptionVi: e.target.value } : h))} className="form-textarea" rows={2} /></div>
                    <div className="form-group"><label className="form-label">Description (EN)</label><textarea value={item.descriptionEn} onChange={e => setHistory(p => p.map((h, idx) => idx === i ? { ...h, descriptionEn: e.target.value } : h))} className="form-textarea" rows={2} /></div>
                  </div>`;
                  
  const newHistGrid2 = `<div className="grid-split-2" style={{ gap: '1rem' }}>
                    <div className="form-group"><label className="form-label">Mô tả (VI)</label><textarea value={item.descriptionVi} onChange={e => setHistory(p => p.map((h, idx) => idx === i ? { ...h, descriptionVi: e.target.value } : h))} className="form-textarea" rows={2} /></div>
                    <div className="form-group"><label className="form-label">Description (EN)</label><textarea value={item.descriptionEn} onChange={e => setHistory(p => p.map((h, idx) => idx === i ? { ...h, descriptionEn: e.target.value } : h))} className="form-textarea" rows={2} /></div>
                  </div>`;
                  
  if (normalized.includes(oldHistGrid2)) {
    normalized = normalized.replace(oldHistGrid2, newHistGrid2);
    console.log('Fixed History Grid 2');
  } else {
    console.log('Pattern oldHistGrid2 not found');
  }
  
  // 2. Fix Team tab (Đội ngũ kỹ sư)
  // Re-enable grid-split-2 for Name and Position rows
  const oldTeamGrid1 = `<div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem' }}>
                        <div className="form-group"><label className="form-label">Họ tên (VI)</label><input value={member.nameVi} onChange={e => setTeam(p => p.map((m, idx) => idx === i ? { ...m, nameVi: e.target.value } : m))} className="form-input" placeholder="Nguyễn Văn A" /></div>
                      <div className="form-group"><label className="form-label">Name (EN)</label><input value={member.nameEn} onChange={e => setTeam(p => p.map((m, idx) => idx === i ? { ...m, nameEn: e.target.value } : m))} className="form-input" /></div>
                    </div>`;
                    
  const newTeamGrid1 = `<div className="grid-split-2" style={{ gap: '0.75rem' }}>
                        <div className="form-group"><label className="form-label">Họ tên (VI)</label><input value={member.nameVi} onChange={e => setTeam(p => p.map((m, idx) => idx === i ? { ...m, nameVi: e.target.value } : m))} className="form-input" placeholder="Nguyễn Văn A" /></div>
                      <div className="form-group"><label className="form-label">Name (EN)</label><input value={member.nameEn} onChange={e => setTeam(p => p.map((m, idx) => idx === i ? { ...m, nameEn: e.target.value } : m))} className="form-input" /></div>
                    </div>`;
                    
  if (normalized.includes(oldTeamGrid1)) {
    normalized = normalized.replace(oldTeamGrid1, newTeamGrid1);
    console.log('Fixed Team Grid 1');
  } else {
    console.log('Pattern oldTeamGrid1 not found');
  }
  
  const oldTeamGrid2 = `<div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem' }}>
                        <div className="form-group"><label className="form-label">Chức vụ (VI)</label><input value={member.positionVi} onChange={e => setTeam(p => p.map((m, idx) => idx === i ? { ...m, positionVi: e.target.value } : m))} className="form-input" placeholder="Trưởng phòng kỹ thuật" /></div>
                      <div className="form-group"><label className="form-label">Position (EN)</label><input value={member.positionEn} onChange={e => setTeam(p => p.map((m, idx) => idx === i ? { ...m, positionEn: e.target.value } : m))} className="form-input" /></div>
                    </div>`;
                    
  const newTeamGrid2 = `<div className="grid-split-2" style={{ gap: '0.75rem' }}>
                        <div className="form-group"><label className="form-label">Chức vụ (VI)</label><input value={member.positionVi} onChange={e => setTeam(p => p.map((m, idx) => idx === i ? { ...m, positionVi: e.target.value } : m))} className="form-input" placeholder="Trưởng phòng kỹ thuật" /></div>
                      <div className="form-group"><label className="form-label">Position (EN)</label><input value={member.positionEn} onChange={e => setTeam(p => p.map((m, idx) => idx === i ? { ...m, positionEn: e.target.value } : m))} className="form-input" /></div>
                    </div>`;
                    
  if (normalized.includes(oldTeamGrid2)) {
    normalized = normalized.replace(oldTeamGrid2, newTeamGrid2);
    console.log('Fixed Team Grid 2');
  } else {
    console.log('Pattern oldTeamGrid2 not found');
  }
  
  // 3. Fix Certs tab (Chứng chỉ)
  // Re-enable grid-split-2 for Name VI-EN row, keep other 2 separate rows
  const oldCertsDiv = `<div key={i} style={{ background: 'var(--color-bg-2)', border: '1px solid var(--color-border-muted)', borderRadius: 'var(--radius-lg)', padding: '0.75rem 1rem', display: 'grid', gridTemplateColumns: '1fr', position: 'relative', gap: '0.75rem', alignItems: 'end' }}>
                  <div className="form-group" style={{ margin: 0 }}><label className="form-label">Tên (VI)</label><input value={cert.nameVi} onChange={e => setCerts(p => p.map((c, idx) => idx === i ? { ...c, nameVi: e.target.value } : c))} className="form-input" placeholder="ISO 9001" /></div>
                  <div className="form-group" style={{ margin: 0 }}><label className="form-label">Name (EN)</label><input value={cert.nameEn} onChange={e => setCerts(p => p.map((c, idx) => idx === i ? { ...c, nameEn: e.target.value } : c))} className="form-input" /></div>
                  <div className="form-group" style={{ margin: 0 }}><label className="form-label">Cấp bởi</label><input value={cert.issuedBy} onChange={e => setCerts(p => p.map((c, idx) => idx === i ? { ...c, issuedBy: e.target.value } : c))} className="form-input" placeholder="TÜV SÜD" /></div>
                  <div className="form-group" style={{ margin: 0 }}><label className="form-label">Năm</label><input value={cert.year} onChange={e => setCerts(p => p.map((c, idx) => idx === i ? { ...c, year: e.target.value } : c))} className="form-input" type="number" /></div>`;
                  
  const newCertsDiv = `<div key={i} style={{ background: 'var(--color-bg-2)', border: '1px solid var(--color-border-muted)', borderRadius: 'var(--radius-lg)', padding: '0.75rem 1rem', position: 'relative', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div className="grid-split-2" style={{ gap: '0.75rem' }}>
                    <div className="form-group" style={{ margin: 0 }}><label className="form-label">Tên (VI)</label><input value={cert.nameVi} onChange={e => setCerts(p => p.map((c, idx) => idx === i ? { ...c, nameVi: e.target.value } : c))} className="form-input" placeholder="ISO 9001" /></div>
                    <div className="form-group" style={{ margin: 0 }}><label className="form-label">Name (EN)</label><input value={cert.nameEn} onChange={e => setCerts(p => p.map((c, idx) => idx === i ? { ...c, nameEn: e.target.value } : c))} className="form-input" /></div>
                  </div>
                  <div className="form-group" style={{ margin: 0 }}><label className="form-label">Cấp bởi</label><input value={cert.issuedBy} onChange={e => setCerts(p => p.map((c, idx) => idx === i ? { ...c, issuedBy: e.target.value } : c))} className="form-input" placeholder="TÜV SÜD" /></div>
                  <div className="form-group" style={{ margin: 0 }}><label className="form-label">Năm</label><input value={cert.year} onChange={e => setCerts(p => p.map((c, idx) => idx === i ? { ...c, year: e.target.value } : c))} className="form-input" type="number" /></div>`;
                  
  if (normalized.includes(oldCertsDiv)) {
    normalized = normalized.replace(oldCertsDiv, newCertsDiv);
    console.log('Fixed Certs Layout');
  } else {
    console.log('Pattern oldCertsDiv not found');
  }

  // Restore CRLF if needed
  if (c.includes('\r\n')) {
    normalized = normalized.replace(/\n/g, '\r\n');
  }
  
  fs.writeFileSync(file, normalized, 'utf8');
}
