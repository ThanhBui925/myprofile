'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, X, EyeOff, Eye, Upload } from 'lucide-react';
import { adminGetBanners, adminCreateBanner, adminUpdateBanner, adminDeleteBanner, uploadFile } from '../../../../services/api';

function BannerModal({ banner, onClose, onSave, onDelete }) {
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: banner || {} });

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(8px)' }}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        style={{ background: 'var(--color-bg-2)', border: '1px solid var(--color-border-muted)', borderRadius: 'var(--radius-xl)', padding: '2.5rem', width: '100%', maxWidth: 560, position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'var(--color-surface)', border: '1px solid var(--color-border-muted)', borderRadius: '50%', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--color-text-muted)' }}><X size={16} /></button>
        <h3 style={{ fontFamily: 'var(--font-heading)', color: '#fff', marginBottom: '2rem' }}>{banner ? 'Sửa Nội dung' : 'Thêm Nội dung'}</h3>
        <form onSubmit={handleSubmit(d => onSave(d))} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'space-between', marginTop: '0.5rem' }}>
            {banner && <button type="button" onClick={() => { if (confirm('Xoá nội dung này?')) { onDelete(banner._id); onClose(); } }} className="btn btn-sm" style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)' }}><Trash2 size={14} /> Xóa</button>}
            <div style={{ display: 'flex', gap: '0.75rem', marginLeft: banner ? 'auto' : '0' }}>
              <button type="button" onClick={onClose} className="btn btn-ghost">Huỷ</button>
              <button type="submit" className="btn btn-primary">Lưu</button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function AdminBanners() {
  const qc = useQueryClient();
  const [modal, setModal] = useState(null); // null | 'create' | banner object

  const { data: banners = [], isLoading } = useQuery({ queryKey: ['admin-banners'], queryFn: adminGetBanners });

  const invalidate = () => qc.invalidateQueries({ queryKey: ['admin-banners'] });

  const createMut = useMutation({ mutationFn: adminCreateBanner, onSuccess: () => { toast.success('Đã thêm banner!'); invalidate(); setModal(null); } });
  const updateMut = useMutation({ mutationFn: ({ id, data }) => adminUpdateBanner(id, data), onSuccess: () => { toast.success('Đã cập nhật!'); invalidate(); setModal(null); } });
  const deleteMut = useMutation({ mutationFn: adminDeleteBanner, onSuccess: () => { toast.success('Đã xoá!'); invalidate(); } });

  const handleSave = (data) => {
    if (modal?._id) updateMut.mutate({ id: modal._id, data });
    else createMut.mutate(data);
  };

  const handleToggle = (banner) => {
    updateMut.mutate({ id: banner._id, data: { isActive: !banner.isActive } });
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div><h1 style={{ fontFamily: 'var(--font-heading)', color: '#fff', marginBottom: '0.25rem' }}>Quản lý Nội dung</h1><p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Quản lý nội dung tiêu đề & mô tả hiển thị trên Banner 3D trang chủ</p></div>
        <button onClick={() => setModal('create')} className="btn btn-primary"><Plus size={16} /> Thêm Nội dung</button>
      </div>

      {isLoading ? <div style={{ color: 'var(--color-text-muted)', padding: '3rem', textAlign: 'center' }}>Đang tải...</div> : (
        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-muted)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
          <table className="admin-table">
            <thead><tr><th>Tiêu đề</th><th>Link</th><th>Thứ tự</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
            <tbody>
              {banners.map(banner => (
                <tr key={banner._id} onClick={() => setModal(banner)} style={{ cursor: 'pointer' }}>
                  <td>
                    <p style={{ fontWeight: 600, color: '#fff', marginBottom: '0.2rem', fontSize: '0.875rem' }}>{banner.titleVi}</p>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.78rem' }}>{banner.titleEn}</p>
                  </td>
                  <td style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>{banner.link || '—'}</td>
                  <td style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>{banner.order}</td>
                  <td>
                    <button onClick={() => handleToggle(banner)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: banner.isActive ? 'var(--color-success)' : '#EF4444', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 600 }}>
                      {banner.isActive ? <><Eye size={20} /> Hiện</> : <><EyeOff size={20} /> Ẩn</>}
                    </button>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => setModal(banner)} className="btn btn-ghost btn-sm"><Pencil size={14} /></button>
                      <button onClick={() => { if (confirm('Xoá banner này?')) deleteMut.mutate(banner._id); }} className="btn btn-sm" style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)' }}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {banners.length === 0 && <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '3rem' }}>Chưa có banner nào</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {modal && <BannerModal banner={modal === 'create' ? null : modal} onClose={() => setModal(null)} onSave={handleSave} onDelete={(id) => deleteMut.mutate(id)} />}
    </div>
  );
}
