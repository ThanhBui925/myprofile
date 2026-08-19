const fs = require('fs');

// --- 1. Fix Courses Modal ---
const coursesFile = 'frontend/src/app/admin/(panel)/courses/page.jsx';
if (fs.existsSync(coursesFile)) {
  let c = fs.readFileSync(coursesFile, 'utf8');
  
  const oldBlock = `<div className="grid-split-3" style={{ gap: '1rem' }}>
            <div className="form-group"><label className="form-label">Danh mục (VI)</label><input {...register('categoryVi')} className="form-input" placeholder="Lập trình PLC" /></div>
            <div className="form-group"><label className="form-label">Category (EN)</label><input {...register('categoryEn')} className="form-input" placeholder="PLC Programming" /></div>
            <div className="form-group"><label className="form-label">Thứ tự</label><input {...register('order')} type="number" className="form-input" /></div>
          </div>`;
          
  const newBlock = `<div className="grid-split-2" style={{ gap: '1rem' }}>
            <div className="form-group"><label className="form-label">Danh mục (VI)</label><input {...register('categoryVi')} className="form-input" placeholder="Lập trình PLC" /></div>
            <div className="form-group"><label className="form-label">Category (EN)</label><input {...register('categoryEn')} className="form-input" placeholder="PLC Programming" /></div>
          </div>
          <div className="form-group"><label className="form-label">Thứ tự</label><input {...register('order')} type="number" className="form-input" /></div>`;
          
  if (c.includes(oldBlock)) {
    c = c.replace(oldBlock, newBlock);
    fs.writeFileSync(coursesFile, c, 'utf8');
    console.log('Fixed Courses Modal Grid Layout');
  } else {
    // try with LF
    const oldBlockLF = oldBlock.replace(/\r\n/g, '\n');
    const newBlockLF = newBlock.replace(/\r\n/g, '\n');
    if (c.includes(oldBlockLF)) {
      c = c.replace(oldBlockLF, newBlockLF);
      fs.writeFileSync(coursesFile, c, 'utf8');
      console.log('Fixed Courses Modal Grid Layout (LF)');
    } else {
      console.log('Courses Modal Grid Layout pattern not found');
    }
  }
}

// --- 2. Fix Products Modal ---
const productsFile = 'frontend/src/app/admin/(panel)/products/page.jsx';
if (fs.existsSync(productsFile)) {
  let c = fs.readFileSync(productsFile, 'utf8');
  
  const oldBlock = `<div className="grid-split-3" style={{ gap: '1rem' }}>
            <div className="form-group"><label className="form-label">Danh mục (VI)</label><input {...register('categoryVi')} className="form-input" placeholder="Camera công nghiệp" /></div>
            <div className="form-group"><label className="form-label">Category (EN)</label><input {...register('categoryEn')} className="form-input" placeholder="Industrial Camera" /></div>
            <div className="form-group"><label className="form-label">Thứ tự</label><input {...register('order')} type="number" className="form-input" /></div>
          </div>`;
          
  const newBlock = `<div className="grid-split-2" style={{ gap: '1rem' }}>
            <div className="form-group"><label className="form-label">Danh mục (VI)</label><input {...register('categoryVi')} className="form-input" placeholder="Camera công nghiệp" /></div>
            <div className="form-group"><label className="form-label">Category (EN)</label><input {...register('categoryEn')} className="form-input" placeholder="Industrial Camera" /></div>
          </div>
          <div className="form-group"><label className="form-label">Thứ tự</label><input {...register('order')} type="number" className="form-input" /></div>`;
          
  if (c.includes(oldBlock)) {
    c = c.replace(oldBlock, newBlock);
    fs.writeFileSync(productsFile, c, 'utf8');
    console.log('Fixed Products Modal Grid Layout');
  } else {
    // try with LF
    const oldBlockLF = oldBlock.replace(/\r\n/g, '\n');
    const newBlockLF = newBlock.replace(/\r\n/g, '\n');
    if (c.includes(oldBlockLF)) {
      c = c.replace(oldBlockLF, newBlockLF);
      fs.writeFileSync(productsFile, c, 'utf8');
      console.log('Fixed Products Modal Grid Layout (LF)');
    } else {
      console.log('Products Modal Grid Layout pattern not found');
    }
  }
}

// --- 3. Fix Projects Modal ---
const projectsFile = 'frontend/src/app/admin/(panel)/projects/page.jsx';
if (fs.existsSync(projectsFile)) {
  let c = fs.readFileSync(projectsFile, 'utf8');
  
  const oldBlock = `<div className="grid-split-3" style={{ gap: '1rem' }}>
            <div className="form-group"><label className="form-label">Khách hàng</label><input {...register('client')} className="form-input" placeholder="Samsung, Vincom..." /></div>
            <div className="form-group"><label className="form-label">Ngành (VI)</label><input {...register('industryVi')} className="form-input" placeholder="Điện tử" /></div>
            <div className="form-group"><label className="form-label">Industry (EN)</label><input {...register('industryEn')} className="form-input" placeholder="Electronics" /></div>
            <div className="form-group"><label className="form-label">Thứ tự</label><input {...register('order')} type="number" className="form-input" style={{ width: 80 }} /></div>
          </div>`;
          
  const newBlock = `<div className="form-group"><label className="form-label">Khách hàng</label><input {...register('client')} className="form-input" placeholder="Samsung, Vincom..." /></div>
          <div className="grid-split-2" style={{ gap: '1rem' }}>
            <div className="form-group"><label className="form-label">Ngành (VI)</label><input {...register('industryVi')} className="form-input" placeholder="Điện tử" /></div>
            <div className="form-group"><label className="form-label">Industry (EN)</label><input {...register('industryEn')} className="form-input" placeholder="Electronics" /></div>
          </div>
          <div className="form-group"><label className="form-label">Thứ tự</label><input {...register('order')} type="number" className="form-input" /></div>`;
          
  if (c.includes(oldBlock)) {
    c = c.replace(oldBlock, newBlock);
    fs.writeFileSync(projectsFile, c, 'utf8');
    console.log('Fixed Projects Modal Grid Layout');
  } else {
    // try with LF
    const oldBlockLF = oldBlock.replace(/\r\n/g, '\n');
    const newBlockLF = newBlock.replace(/\r\n/g, '\n');
    if (c.includes(oldBlockLF)) {
      c = c.replace(oldBlockLF, newBlockLF);
      fs.writeFileSync(projectsFile, c, 'utf8');
      console.log('Fixed Projects Modal Grid Layout (LF)');
    } else {
      console.log('Projects Modal Grid Layout pattern not found');
    }
  }
}

// --- 4. Fix Partners Modal ---
const partnersFile = 'frontend/src/app/admin/(panel)/partners/page.jsx';
if (fs.existsSync(partnersFile)) {
  let c = fs.readFileSync(partnersFile, 'utf8');
  
  const oldBlock = `<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group"><label className="form-label">Thứ tự</label><input {...register('order')} type="number" className="form-input" /></div>
            <div className="form-group" style={{ justifyContent: 'flex-end' }}>
              <label className="form-label">Trạng thái</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginTop: '0.5rem' }}>
                <input {...register('isActive')} type="checkbox" defaultChecked style={{ accentColor: 'var(--color-primary)', width: 16, height: 16 }} />
                <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Kích hoạt</span>
              </label>
            </div>
          </div>`;
          
  const newBlock = `<div className="form-group"><label className="form-label">Thứ tự</label><input {...register('order')} type="number" className="form-input" /></div>
          <div className="form-group">
            <label className="form-label">Trạng thái</label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginTop: '0.5rem' }}>
              <input {...register('isActive')} type="checkbox" defaultChecked style={{ accentColor: 'var(--color-primary)', width: 16, height: 16 }} />
              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Kích hoạt</span>
            </label>
          </div>`;
          
  if (c.includes(oldBlock)) {
    c = c.replace(oldBlock, newBlock);
    fs.writeFileSync(partnersFile, c, 'utf8');
    console.log('Fixed Partners Modal Grid Layout');
  } else {
    // try with LF
    const oldBlockLF = oldBlock.replace(/\r\n/g, '\n');
    const newBlockLF = newBlock.replace(/\r\n/g, '\n');
    if (c.includes(oldBlockLF)) {
      c = c.replace(oldBlockLF, newBlockLF);
      fs.writeFileSync(partnersFile, c, 'utf8');
      console.log('Fixed Partners Modal Grid Layout (LF)');
    } else {
      console.log('Partners Modal Grid Layout pattern not found');
    }
  }
}
