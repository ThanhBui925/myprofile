'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, X, Upload, PlusCircle, MinusCircle, ToggleLeft, ToggleRight } from 'lucide-react';
import { adminGetProducts, adminCreateProduct, adminUpdateProduct, adminDeleteProduct, uploadFile, uploadMultiple } from '../../../../services/api';

function ProductModal({ product, onClose, onSave }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: product ? {
      nameVi: product.nameVi, nameEn: product.nameEn,
      categoryVi: product.categoryVi, categoryEn: product.categoryEn,
      descriptionVi: product.descriptionVi, descriptionEn: product.descriptionEn,
      isActive: product.isActive, order: product.order,
    } : { isActive: true, order: 0 }
  });
  const [specs, setSpecs] = useState(product?.specifications || [{ labelVi: '', labelEn: '', value: '' }]);
  const [images, setImages] = useState(product?.images || []);
  const [catalogName, setCatalogName] = useState(product?.catalogUrl || '');
  const [uploading, setUploading] = useState(false);
  const [uploadingCatalog, setUploadingCatalog] = useState(false);

  const addSpec = () => setSpecs(p => [...p, { labelVi: '', labelEn: '', value: '' }]);
  const removeSpec = (i) => setSpecs(p => p.filter((_, idx) => idx !== i));
  const updateSpec = (i, field, val) => setSpecs(p => p.map((s, idx) => idx === i ? { ...s, [field]: val } : s));

  const handleImgUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    try {
      const fd = new FormData();
      files.forEach(f => fd.append('files', f));
      const res = await uploadMultiple(fd);
      setImages(p => [...p, ...res.files.map(f => f.url.replace('/uploads/images/', ''))]);
      toast.success(`Đã tải ${res.files.length} ảnh`);
    } catch { toast.error('Lỗi tải ảnh'); }
    finally { setUploading(false); }
  };

  const handleCatalogUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingCatalog(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await uploadFile(fd);
      setCatalogName(res.filename);
      toast.success('Catalog đã được tải lên!');
    } catch { toast.error('Lỗi tải catalog'); }
    finally { setUploadingCatalog(false); }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(8px)' }}>
      <div style={{ background: 'var(--color-bg-2)', border: '1px solid var(--color-border-muted)', borderRadius: 'var(--radius-xl)', padding: '2.25rem', width: '100%', maxWidth: 680, position: 'relative', maxHeight: '92vh', overflowY: 'auto' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'var(--color-surface)', border: '1px solid var(--color-border-muted)', borderRadius: '50%', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--color-text-muted)' }}><X size={16} /></button>
        <h3 style={{ fontFamily: 'var(--font-heading)', color: '#fff', marginBottom: '1.75rem' }}>{product ? 'Sửa Sản phẩm' : 'Thêm Sản phẩm'}</h3>
        <form onSubmit={handleSubmit(d => onSave({ ...d, specifications: specs, images, catalogUrl: catalogName, order: Number(d.order) }))} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group"><label className="form-label">Tên SP (VI) *</label><input {...register('nameVi', { required: true })} className="form-input" />{errors.nameVi && <span className="form-error">Bắt buộc</span>}</div>
            <div className="form-group"><label className="form-label">Product Name (EN) *</label><input {...register('nameEn', { required: true })} className="form-input" />{errors.nameEn && <span className="form-error">Required</span>}</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div className="form-group"><label className="form-label">Danh mục (VI)</label><input {...register('categoryVi')} className="form-input" placeholder="Camera công nghiệp" /></div>
            <div className="form-group"><label className="form-label">Category (EN)</label><input {...register('categoryEn')} className="form-input" placeholder="Industrial Camera" /></div>
            <div className="form-group"><label className="form-label">Thứ tự</label><input {...register('order')} type="number" className="form-input" /></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group"><label className="form-label">Mô tả (VI)</label><textarea {...register('descriptionVi')} className="form-textarea" rows={3} /></div>
            <div className="form-group"><label className="form-label">Description (EN)</label><textarea {...register('descriptionEn')} className="form-textarea" rows={3} /></div>
          </div>

          {/* Specifications */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <label className="form-label" style={{ margin: 0 }}>Thông số kỹ thuật</label>
              <button type="button" onClick={addSpec} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                <PlusCircle size={15} /> Thêm thông số
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {specs.map((spec, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '0.5rem', alignItems: 'center' }}>
                  <input value={spec.labelVi} onChange={e => updateSpec(i, 'labelVi', e.target.value)} className="form-input" placeholder="Nhãn (VI)" style={{ fontSize: '0.85rem', padding: '0.5rem 0.75rem' }} />
                  <input value={spec.labelEn} onChange={e => updateSpec(i, 'labelEn', e.target.value)} className="form-input" placeholder="Label (EN)" style={{ fontSize: '0.85rem', padding: '0.5rem 0.75rem' }} />
                  <input value={spec.value} onChange={e => updateSpec(i, 'value', e.target.value)} className="form-input" placeholder="Giá trị" style={{ fontSize: '0.85rem', padding: '0.5rem 0.75rem' }} />
                  <button type="button" onClick={() => removeSpec(i)} style={{ color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer' }}><MinusCircle size={18} /></button>
                </div>
              ))}
            </div>
          </div>

          {/* Images */}
          <div className="form-group">
            <label className="form-label">Hình ảnh sản phẩm</label>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--color-surface)', border: '1px dashed var(--color-border-muted)', borderRadius: 'var(--radius-md)', padding: '0.6rem 1rem', cursor: 'pointer', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
              <Upload size={15} />{uploading ? 'Đang tải...' : 'Tải ảnh'}
              <input type="file" multiple accept="image/*" onChange={handleImgUpload} style={{ display: 'none' }} disabled={uploading} />
            </label>
            {images.length > 0 && <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.625rem' }}>{images.map((img, i) => <div key={i} style={{ position: 'relative' }}><img src={`/uploads/images/${img}`} alt={i} style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} /><button type="button" onClick={() => setImages(p => p.filter((_, idx) => idx !== i))} style={{ position: 'absolute', top: -6, right: -6, width: 18, height: 18, background: '#EF4444', border: 'none', borderRadius: '50%', color: '#fff', cursor: 'pointer', fontSize: '10px' }}>×</button></div>)}</div>}
          </div>

          {/* Catalog */}
          <div className="form-group">
            <label className="form-label">Catalog PDF</label>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--color-surface)', border: '1px dashed var(--color-border-muted)', borderRadius: 'var(--radius-md)', padding: '0.6rem 1rem', cursor: 'pointer', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
              <Upload size={15} />{uploadingCatalog ? 'Đang tải...' : (catalogName ? `✓ ${catalogName.substring(0,20)}...` : 'Tải Catalog PDF')}
              <input type="file" accept="application/pdf" onChange={handleCatalogUpload} style={{ display: 'none' }} disabled={uploadingCatalog} />
            </label>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} className="btn btn-ghost">Huỷ</button>
            <button type="submit" className="btn btn-primary">Lưu Sản phẩm</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminProducts() {
  const qc = useQueryClient();
  const [modal, setModal] = useState(null);
  const { data: products = [], isLoading } = useQuery({ queryKey: ['admin-products'], queryFn: adminGetProducts });
  const invalidate = () => qc.invalidateQueries({ queryKey: ['admin-products'] });
  const createMut = useMutation({ mutationFn: adminCreateProduct, onSuccess: () => { toast.success('Đã thêm!'); invalidate(); setModal(null); } });
  const updateMut = useMutation({ mutationFn: ({ id, data }) => adminUpdateProduct(id, data), onSuccess: () => { toast.success('Đã cập nhật!'); invalidate(); setModal(null); } });
  const deleteMut = useMutation({ mutationFn: adminDeleteProduct, onSuccess: () => { toast.success('Đã xoá!'); invalidate(); } });
  const handleSave = (data) => { if (modal?._id) updateMut.mutate({ id: modal._id, data }); else createMut.mutate(data); };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div><h1 style={{ fontFamily: 'var(--font-heading)', color: '#fff', marginBottom: '0.25rem' }}>Quản lý Sản phẩm</h1><p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Sản phẩm và thông số kỹ thuật</p></div>
        <button onClick={() => setModal('create')} className="btn btn-primary"><Plus size={16} /> Thêm Sản phẩm</button>
      </div>
      <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-muted)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
        <table className="admin-table">
          <thead><tr><th>Hình</th><th>Tên sản phẩm</th><th>Danh mục</th><th>Thông số</th><th>Catalog</th><th>Thứ tự</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
          <tbody>
            {isLoading && <tr><td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>Đang tải...</td></tr>}
            {products.map(p => (
              <tr key={p._id}>
                <td>{p.images?.[0] ? <img src={`/uploads/images/${p.images[0]}`} alt={p.nameVi} style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} /> : <div style={{ width: 56, height: 56, background: 'var(--color-bg-3)', borderRadius: 'var(--radius-sm)' }} />}</td>
                <td><p style={{ fontWeight: 600, color: '#fff', fontSize: '0.875rem', marginBottom: '0.15rem' }}>{p.nameVi}</p><p style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>{p.nameEn}</p></td>
                <td style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>{p.categoryVi || '—'}</td>
                <td style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>{p.specifications?.length || 0} thông số</td>
                <td>{p.catalogUrl ? <span style={{ color: 'var(--color-success)', fontSize: '0.8rem' }}>✓ Có</span> : <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>—</span>}</td>
                <td style={{ color: 'var(--color-text-muted)' }}>{p.order}</td>
                <td>
                  <button onClick={() => updateMut.mutate({ id: p._id, data: { isActive: !p.isActive } })} style={{ background: 'none', border: 'none', cursor: 'pointer', color: p.isActive ? 'var(--color-success)' : 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 600 }}>
                    {p.isActive ? <><ToggleRight size={20} /> Hiện</> : <><ToggleLeft size={20} /> Ẩn</>}
                  </button>
                </td>
                <td><div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => setModal(p)} className="btn btn-ghost btn-sm"><Pencil size={14} /></button>
                  <button onClick={() => { if (confirm('Xoá sản phẩm?')) deleteMut.mutate(p._id); }} className="btn btn-sm" style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)' }}><Trash2 size={14} /></button>
                </div></td>
              </tr>
            ))}
            {!isLoading && products.length === 0 && <tr><td colSpan={8} style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '3rem' }}>Chưa có sản phẩm nào</td></tr>}
          </tbody>
        </table>
      </div>
      {modal && <ProductModal product={modal === 'create' ? null : modal} onClose={() => setModal(null)} onSave={handleSave} />}
    </div>
  );
}
