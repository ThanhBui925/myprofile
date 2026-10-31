'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, X, EyeOff, Eye, Upload } from 'lucide-react';
import { adminGetServices, adminCreateService, adminUpdateService, adminDeleteService, uploadFile, uploadMultiple } from '../../../../services/api';

const ICON_OPTIONS = ['Settings', 'Eye', 'Cpu', 'Zap', 'Truck', 'Monitor', 'Wrench', 'Bot'];

function ServiceModal({ service, onClose, onSave, onDelete }) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: service ? {
      nameVi: service.nameVi, nameEn: service.nameEn,
      descriptionVi: service.descriptionVi, descriptionEn: service.descriptionEn,
      icon: service.icon, order: service.order,
      technologies: (service.technologies || []).join(', '),
      featuresVi: (service.featuresVi || []).join('\n'),
      featuresEn: (service.featuresEn || []).join('\n'),
      isActive: service.isActive,
    } : { isActive: true, order: 0 }
  });
  const [images, setImages] = useState(service?.images || []);
  const [uploading, setUploading] = useState(false);

  const handleImgUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    try {
      const fd = new FormData();
      files.forEach(f => fd.append('files', f));
      const res = await uploadMultiple(fd);
      const newUrls = res.files.map(f => f.url.replace('/uploads/images/', ''));
      setImages(prev => [...prev, ...newUrls]);
      toast.success(`Đã tải lên ${res.files.length} ảnh`);
    } catch { toast.error('Lỗi tải ảnh'); }
    finally { setUploading(false); }
  };

  const handleSubmitForm = (data) => {
    onSave({
      ...data,
      technologies: data.technologies ? data.technologies.split(',').map(t => t.trim()).filter(Boolean) : [],
      featuresVi: data.featuresVi ? data.featuresVi.split('\n').filter(Boolean) : [],
      featuresEn: data.featuresEn ? data.featuresEn.split('\n').filter(Boolean) : [],
      images,
      order: Number(data.order),
    });
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(8px)' }}>
      <div style={{ background: 'var(--color-bg-2)', border: '1px solid var(--color-border-muted)', borderRadius: 'var(--radius-xl)', padding: '2.25rem', width: '100%', maxWidth: 640, position: 'relative', maxHeight: '92vh', overflowY: 'auto' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'var(--color-surface)', border: '1px solid var(--color-border-muted)', borderRadius: '50%', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--color-text-muted)' }}><X size={16} /></button>
        <h3 style={{ fontFamily: 'var(--font-heading)', color: '#fff', marginBottom: '1.75rem' }}>{service ? 'Sửa Dịch vụ' : 'Thêm Dịch vụ'}</h3>
        <form onSubmit={handleSubmit(handleSubmitForm)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="grid-split-2" style={{ gap: '1rem' }}>
            <div className="form-group"><label className="form-label">Tên (VI) *</label><input {...register('nameVi', { required: true })} className="form-input" placeholder="Thiết kế máy tự động" />{errors.nameVi && <span className="form-error">Bắt buộc</span>}</div>
            <div className="form-group"><label className="form-label">Tên (EN) *</label><input {...register('nameEn', { required: true })} className="form-input" placeholder="Custom Machine Design" />{errors.nameEn && <span className="form-error">Required</span>}</div>
          </div>
          <div className="grid-split-2" style={{ gap: '1rem' }}>
            <div className="form-group"><label className="form-label">Mô tả (VI)</label><textarea {...register('descriptionVi')} className="form-textarea" rows={3} placeholder="Mô tả tiếng Việt..." /></div>
            <div className="form-group"><label className="form-label">Mô tả (EN)</label><textarea {...register('descriptionEn')} className="form-textarea" rows={3} placeholder="Description in English..." /></div>
          </div>
          <div className="form-group">
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
          </div>
          <div className="form-group">
            <label className="form-label">Công nghệ (cách nhau bằng dấu phẩy)</label>
            <input {...register('technologies')} className="form-input" placeholder="PLC, Robot, Siemens, ..." />
          </div>
          <div className="grid-split-2" style={{ gap: '1rem' }}>
            <div className="form-group"><label className="form-label">Tính năng (VI) - mỗi dòng 1 mục</label><textarea {...register('featuresVi')} className="form-textarea" rows={4} placeholder="Tính năng 1&#10;Tính năng 2" /></div>
            <div className="form-group"><label className="form-label">Features (EN) - one per line</label><textarea {...register('featuresEn')} className="form-textarea" rows={4} placeholder="Feature 1&#10;Feature 2" /></div>
          </div>
          {/* Image Upload */}
          <div className="form-group">
            <label className="form-label">Hình ảnh dịch vụ</label>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--color-surface)', border: '1px dashed var(--color-border-muted)', borderRadius: 'var(--radius-md)', padding: '0.6rem 1rem', cursor: 'pointer', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
              <Upload size={15} />{uploading ? 'Đang tải...' : 'Tải ảnh lên (nhiều ảnh)'}
              <input type="file" multiple accept="image/*" onChange={handleImgUpload} style={{ display: 'none' }} disabled={uploading} />
            </label>
            {images.length > 0 && (
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
                {images.map((img, i) => (
                  <div key={i} style={{ position: 'relative' }}>
                    <img src={`/uploads/images/${img}`} alt={i} style={{ width: 72, height: 56, objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border-muted)' }} />
                    <button type="button" onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))} style={{ position: 'absolute', top: -6, right: -6, width: 18, height: 18, background: '#EF4444', border: 'none', borderRadius: '50%', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>×</button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'space-between' }}>
            {service && <button type="button" onClick={() => { if (confirm('Xoá dịch vụ này?')) { onDelete(service._id); onClose(); } }} className="btn btn-sm" style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)' }}><Trash2 size={14} /> Xóa</button>}
            <div style={{ display: 'flex', gap: '0.75rem', marginLeft: service ? 'auto' : '0' }}>
              <button type="button" onClick={onClose} className="btn btn-ghost">Huỷ</button>
              <button type="submit" className="btn btn-primary">Lưu</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminServices() {
  const qc = useQueryClient();
  const [modal, setModal] = useState(null);
  const { data: services = [], isLoading } = useQuery({ queryKey: ['admin-services'], queryFn: adminGetServices });
  const invalidate = () => qc.invalidateQueries({ queryKey: ['admin-services'] });
  const createMut = useMutation({ mutationFn: adminCreateService, onSuccess: () => { toast.success('Đã thêm!'); invalidate(); setModal(null); }, onError: (err) => { toast.error(err.response?.data?.message || 'Lỗi thêm dịch vụ'); } });
  const updateMut = useMutation({ mutationFn: ({ id, data }) => adminUpdateService(id, data), onSuccess: () => { toast.success('Đã cập nhật!'); invalidate(); setModal(null); }, onError: (err) => { toast.error(err.response?.data?.message || 'Lỗi cập nhật dịch vụ'); } });
  const deleteMut = useMutation({ mutationFn: adminDeleteService, onSuccess: () => { toast.success('Đã xoá!'); invalidate(); }, onError: (err) => { toast.error(err.response?.data?.message || 'Lỗi xoá dịch vụ'); } });
  const handleSave = (data) => { if (modal?._id) updateMut.mutate({ id: modal._id, data }); else createMut.mutate(data); };
  const handleEdit = (svc) => setModal(svc || 'create');

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div><h1 style={{ fontFamily: 'var(--font-heading)', color: '#fff', marginBottom: '0.25rem' }}>Quản lý Dịch vụ</h1><p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Thêm, sửa, xoá các dịch vụ của {process.env.NEXT_PUBLIC_APP_NAME || 'THANHTDH'}</p></div>
        <button className="btn btn-primary" onClick={() => handleEdit()}>
          <Plus size={16} /> Thêm dịch vụ
        </button>
      </div>
      <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-muted)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
        <table className="admin-table">
          <thead><tr><th>Tên dịch vụ</th><th>Slug</th><th>Công nghệ</th><th>Thứ tự</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
          <tbody>
            {isLoading && <tr><td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>Đang tải...</td></tr>}
            {services.map(svc => (
              <tr key={svc._id} onClick={() => setModal(svc)} style={{ cursor: 'pointer' }}>
                <td><p style={{ fontWeight: 600, color: '#fff', marginBottom: '0.15rem', fontSize: '0.875rem' }}>{svc.nameVi}</p><p style={{ color: 'var(--color-text-muted)', fontSize: '0.78rem' }}>{svc.nameEn}</p></td>
                <td><code style={{ background: 'var(--color-bg-3)', padding: '0.2rem 0.5rem', borderRadius: 4, fontSize: '0.78rem', color: 'var(--color-primary)' }}>{svc.slug}</code></td>
                <td><div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', maxWidth: 200 }}>{(svc.technologies || []).slice(0, 3).map(t => <span key={t} className="tag" style={{ fontSize: '0.72rem' }}>{t}</span>)}{svc.technologies?.length > 3 && <span style={{ color: 'var(--color-text-muted)', fontSize: '0.72rem' }}>+{svc.technologies.length - 3}</span>}</div></td>
                <td style={{ color: 'var(--color-text-muted)' }}>{svc.order}</td>
                <td>
                  <button 
                    onClick={() => updateMut.mutate({ id: svc._id, data: { isActive: !svc.isActive } })} 
                    disabled={updateMut.isPending}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'none', border: 'none', cursor: 'pointer', color: svc.isActive ? 'var(--color-success)' : '#EF4444', fontSize: '0.8rem', fontWeight: 600 }}>
                    {svc.isActive ? <Eye size={20} /> : <EyeOff size={20} />}
                    {svc.isActive ? 'Hiện' : 'Ẩn'}
                  </button>
                </td>
                <td><div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => setModal(svc)} className="btn btn-ghost btn-sm"><Pencil size={14} /></button>
                  <button onClick={() => { if (confirm('Xoá dịch vụ này?')) deleteMut.mutate(svc._id); }} className="btn btn-sm" style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)' }}><Trash2 size={14} /></button>
                </div></td>
              </tr>
            ))}
            {!isLoading && services.length === 0 && <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '3rem' }}>Chưa có dịch vụ nào</td></tr>}
          </tbody>
        </table>
      </div>
      {modal && <ServiceModal service={modal === 'create' ? null : modal} onClose={() => setModal(null)} onSave={handleSave} onDelete={(id) => deleteMut.mutate(id)} />}
    </div>
  );
}
