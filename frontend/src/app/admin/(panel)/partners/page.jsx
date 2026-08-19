'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, X, Upload, Globe, EyeOff, Eye } from 'lucide-react';
import { adminGetPartners, adminCreatePartner, adminUpdatePartner, adminDeletePartner, uploadFile } from '../../../../services/api';

function PartnerModal({ partner, onClose, onSave, onDelete }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: partner || { isActive: true, order: 0 }
  });
  const [logoUrl, setLogoUrl] = useState(partner?.logoUrl || '');
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await uploadFile(fd);
      setLogoUrl(res.url);
      toast.success('Logo đã tải lên!');
    } catch { toast.error('Lỗi tải logo'); }
    finally { setUploading(false); }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(8px)' }}>
      <div style={{ background: 'var(--color-bg-2)', border: '1px solid var(--color-border-muted)', borderRadius: 'var(--radius-xl)', padding: '2.25rem', width: '100%', maxWidth: 480, position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'var(--color-surface)', border: '1px solid var(--color-border-muted)', borderRadius: '50%', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--color-text-muted)' }}><X size={16} /></button>
        <h3 style={{ fontFamily: 'var(--font-heading)', color: '#fff', marginBottom: '1.75rem' }}>{partner ? 'Sửa Đối tác' : 'Thêm Đối tác'}</h3>
        <form onSubmit={handleSubmit(d => onSave({ ...d, logoUrl, order: Number(d.order) }))} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group"><label className="form-label">Tên công ty *</label><input {...register('name', { required: true })} className="form-input" placeholder="Samsung, Vinfast..." />{errors.name && <span className="form-error">Bắt buộc</span>}</div>
          <div className="form-group">
            <label className="form-label">Logo</label>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--color-surface)', border: '1px dashed var(--color-border-muted)', borderRadius: 'var(--radius-md)', padding: '0.6rem 1rem', cursor: 'pointer', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                <Upload size={15} />{uploading ? 'Đang tải...' : 'Tải logo'}
                <input type="file" accept="image/*" onChange={handleUpload} style={{ display: 'none' }} disabled={uploading} />
              </label>
              {logoUrl && <img src={logoUrl} alt="logo" style={{ height: 36, objectFit: 'contain', borderRadius: 'var(--radius-sm)' }} />}
            </div>
          </div>
          <div className="form-group"><label className="form-label">Website</label><input {...register('website')} className="form-input" placeholder="https://partner.com" type="url" /></div>
          <div className="form-group"><label className="form-label">Thứ tự</label><input {...register('order')} type="number" className="form-input" /></div>
          <div className="form-group">
            <label className="form-label">Trạng thái</label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginTop: '0.5rem' }}>
              <input {...register('isActive')} type="checkbox" defaultChecked style={{ accentColor: 'var(--color-primary)', width: 16, height: 16 }} />
              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Kích hoạt</span>
            </label>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'space-between', marginTop: '0.5rem' }}>
            {partner && <button type="button" onClick={() => { if (confirm('Xoá đối tác này?')) { onDelete(partner._id); onClose(); } }} className="btn btn-sm" style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)' }}><Trash2 size={14} /> Xóa</button>}
            <div style={{ display: 'flex', gap: '0.75rem', marginLeft: partner ? 'auto' : '0' }}>
              <button type="button" onClick={onClose} className="btn btn-ghost">Huỷ</button>
              <button type="submit" className="btn btn-primary">Lưu</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminPartners() {
  const qc = useQueryClient();
  const [modal, setModal] = useState(null);
  const { data: partners = [], isLoading } = useQuery({ queryKey: ['admin-partners'], queryFn: adminGetPartners });
  const invalidate = () => qc.invalidateQueries({ queryKey: ['admin-partners'] });
  const createMut = useMutation({ mutationFn: adminCreatePartner, onSuccess: () => { toast.success('Đã thêm!'); invalidate(); setModal(null); } });
  const updateMut = useMutation({ mutationFn: ({ id, data }) => adminUpdatePartner(id, data), onSuccess: () => { toast.success('Đã cập nhật!'); invalidate(); setModal(null); } });
  const deleteMut = useMutation({ mutationFn: adminDeletePartner, onSuccess: () => { toast.success('Đã xoá!'); invalidate(); } });
  const handleSave = (data) => { if (modal?._id) updateMut.mutate({ id: modal._id, data }); else createMut.mutate(data); };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div><h1 style={{ fontFamily: 'var(--font-heading)', color: '#fff', marginBottom: '0.25rem' }}>Quản lý Đối tác</h1><p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Đối tác hiển thị trên trang chủ</p></div>
        <button onClick={() => setModal('create')} className="btn btn-primary"><Plus size={16} /> Thêm Đối tác</button>
      </div>
      <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-muted)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
        <table className="admin-table">
          <thead><tr><th>Logo</th><th>Tên</th><th>Website</th><th>Thứ tự</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
          <tbody>
            {isLoading && <tr><td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>Đang tải...</td></tr>}
            {partners.map(p => (
              <tr key={p._id} onClick={() => setModal(p)} style={{ cursor: 'pointer' }}>
                <td>{p.logoUrl ? <img src={p.logoUrl} alt={p.name} style={{ height: 36, maxWidth: 100, objectFit: 'contain', filter: 'brightness(0.9)' }} /> : <div style={{ width: 60, height: 36, background: 'var(--color-bg-3)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>No logo</div>}</td>
                <td style={{ fontWeight: 600, color: '#fff', fontSize: '0.875rem' }}>{p.name}</td>
                <td>{p.website ? <a href={p.website} target="_blank" rel="noreferrer" style={{ color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem' }}><Globe size={13} />{p.website.replace('https://', '').substring(0, 25)}</a> : <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>—</span>}</td>
                <td style={{ color: 'var(--color-text-muted)' }}>{p.order}</td>
                <td>
                  <button onClick={() => updateMut.mutate({ id: p._id, data: { isActive: !p.isActive } })} style={{ background: 'none', border: 'none', cursor: 'pointer', color: p.isActive ? 'var(--color-success)' : '#EF4444', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 600 }}>
                    {p.isActive ? <><Eye size={20} /> Hiện</> : <><EyeOff size={20} /> Ẩn</>}
                  </button>
                </td>
                <td><div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => setModal(p)} className="btn btn-ghost btn-sm"><Pencil size={14} /></button>
                  <button onClick={() => { if (confirm('Xoá đối tác?')) deleteMut.mutate(p._id); }} className="btn btn-sm" style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)' }}><Trash2 size={14} /></button>
                </div></td>
              </tr>
            ))}
            {!isLoading && partners.length === 0 && <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '3rem' }}>Chưa có đối tác nào</td></tr>}
          </tbody>
        </table>
      </div>
      {modal && <PartnerModal partner={modal === 'create' ? null : modal} onClose={() => setModal(null)} onSave={handleSave} onDelete={(id) => deleteMut.mutate(id)} />}
    </div>
  );
}
