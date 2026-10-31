'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, X, Shield, Star, Upload } from 'lucide-react';
import { adminGetProjects, adminCreateProject, adminUpdateProject, adminDeleteProject, uploadMultiple } from '../../../../services/api';

function ProjectModal({ project, onClose, onSave, onDelete }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: project ? {
      titleVi: project.titleVi, titleEn: project.titleEn,
      client: project.client,
      industryVi: project.industryVi, industryEn: project.industryEn,
      descriptionVi: project.descriptionVi, descriptionEn: project.descriptionEn,
      challengeVi: project.challengeVi, challengeEn: project.challengeEn,
      solutionVi: project.solutionVi, solutionEn: project.solutionEn,
      resultVi: project.resultVi, resultEn: project.resultEn,
      technologies: (project.technologies || []).join(', '),
      isFeatured: project.isFeatured, isNDA: project.isNDA, isActive: project.isActive, order: project.order || 0
    } : { isActive: true, isFeatured: false, isNDA: false, order: 0 }
  });
  const [images, setImages] = useState(project?.images || []);
  const [uploading, setUploading] = useState(false);

  const handleImgUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    try {
      const fd = new FormData();
      files.forEach(f => fd.append('files', f));
      const res = await uploadMultiple(fd);
      setImages(prev => [...prev, ...res.files.map(f => f.url.replace('/uploads/images/', ''))]);
      toast.success(`Đã tải ${res.files.length} ảnh`);
    } catch { toast.error('Lỗi tải ảnh'); }
    finally { setUploading(false); }
  };

  const handleSubmitForm = (data) => {
    onSave({ ...data, order: Number(data.order), technologies: data.technologies ? data.technologies.split(',').map(t => t.trim()).filter(Boolean) : [], images });
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(8px)' }}>
      <div style={{ background: 'var(--color-bg-2)', border: '1px solid var(--color-border-muted)', borderRadius: 'var(--radius-xl)', padding: '2.25rem', width: '100%', maxWidth: 680, position: 'relative', maxHeight: '92vh', overflowY: 'auto' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'var(--color-surface)', border: '1px solid var(--color-border-muted)', borderRadius: '50%', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--color-text-muted)' }}><X size={16} /></button>
        <h3 style={{ fontFamily: 'var(--font-heading)', color: '#fff', marginBottom: '1.75rem' }}>{project ? 'Sửa Dự án' : 'Thêm Dự án'}</h3>
        <form onSubmit={handleSubmit(handleSubmitForm)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="grid-split-2" style={{ gap: '1rem' }}>
            <div className="form-group"><label className="form-label">Tên dự án (VI) *</label><input {...register('titleVi', { required: true })} className="form-input" />{errors.titleVi && <span className="form-error">Bắt buộc</span>}</div>
            <div className="form-group"><label className="form-label">Project Title (EN) *</label><input {...register('titleEn', { required: true })} className="form-input" />{errors.titleEn && <span className="form-error">Required</span>}</div>
          </div>
          <div className="form-group"><label className="form-label">Khách hàng</label><input {...register('client')} className="form-input" placeholder="Samsung, Vincom..." /></div>
          <div className="grid-split-2" style={{ gap: '1rem' }}>
            <div className="form-group"><label className="form-label">Ngành (VI)</label><input {...register('industryVi')} className="form-input" placeholder="Điện tử" /></div>
            <div className="form-group"><label className="form-label">Industry (EN)</label><input {...register('industryEn')} className="form-input" placeholder="Electronics" /></div>
          </div>
          <div className="form-group"><label className="form-label">Thứ tự</label><input {...register('order')} type="number" className="form-input" /></div>
          <div className="form-group"><label className="form-label">Công nghệ (phân cách bằng dấu phẩy)</label><input {...register('technologies')} className="form-input" placeholder="PLC, Robot Integration, Machine Vision" /></div>
          <div className="grid-split-2" style={{ gap: '1rem' }}>
            <div className="form-group"><label className="form-label">Mô tả (VI)</label><textarea {...register('descriptionVi')} className="form-textarea" rows={3} /></div>
            <div className="form-group"><label className="form-label">Description (EN)</label><textarea {...register('descriptionEn')} className="form-textarea" rows={3} /></div>
          </div>
          <div className="grid-split-2" style={{ gap: '1rem' }}>
            <div className="form-group"><label className="form-label">Thách thức (VI)</label><textarea {...register('challengeVi')} className="form-textarea" rows={2} /></div>
            <div className="form-group"><label className="form-label">Challenge (EN)</label><textarea {...register('challengeEn')} className="form-textarea" rows={2} /></div>
          </div>
          <div className="grid-split-2" style={{ gap: '1rem' }}>
            <div className="form-group"><label className="form-label">Giải pháp (VI)</label><textarea {...register('solutionVi')} className="form-textarea" rows={2} /></div>
            <div className="form-group"><label className="form-label">Solution (EN)</label><textarea {...register('solutionEn')} className="form-textarea" rows={2} /></div>
          </div>
          <div className="grid-split-2" style={{ gap: '1rem' }}>
            <div className="form-group"><label className="form-label">Kết quả (VI)</label><textarea {...register('resultVi')} className="form-textarea" rows={2} /></div>
            <div className="form-group"><label className="form-label">Result (EN)</label><textarea {...register('resultEn')} className="form-textarea" rows={2} /></div>
          </div>
          {/* Toggles */}
          <div style={{ display: 'flex', gap: '2rem', padding: '1rem', background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-muted)' }}>
            {[
              { name: 'isActive', label: 'Kích hoạt', color: 'var(--color-success)' },
              { name: 'isFeatured', label: '⭐ Nổi bật', color: '#F59E0B' },
              { name: 'isNDA', label: '🔒 NDA (Ẩn)', color: '#EF4444' },
            ].map(f => (
              <label key={f.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                <input {...register(f.name)} type="checkbox" style={{ accentColor: f.color, width: 16, height: 16 }} />
                {f.label}
              </label>
            ))}
          </div>
          {/* Image Upload */}
          <div className="form-group">
            <label className="form-label">Hình ảnh dự án</label>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--color-surface)', border: '1px dashed var(--color-border-muted)', borderRadius: 'var(--radius-md)', padding: '0.6rem 1rem', cursor: 'pointer', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
              <Upload size={15} />{uploading ? 'Đang tải...' : 'Tải nhiều ảnh'}
              <input type="file" multiple accept="image/*" onChange={handleImgUpload} style={{ display: 'none' }} disabled={uploading} />
            </label>
            {images.length > 0 && (
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
                {images.map((img, i) => (
                  <div key={i} style={{ position: 'relative' }}>
                    <img src={`/uploads/images/${img}`} alt={i} style={{ width: 80, height: 56, objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border-muted)' }} />
                    <button type="button" onClick={() => setImages(p => p.filter((_, idx) => idx !== i))} style={{ position: 'absolute', top: -6, right: -6, width: 18, height: 18, background: '#EF4444', border: 'none', borderRadius: '50%', color: '#fff', cursor: 'pointer', fontSize: '10px' }}>×</button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'space-between' }}>
            {project && <button type="button" onClick={() => { if (confirm('Xoá dự án này?')) { onDelete(project._id); onClose(); } }} className="btn btn-sm" style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)' }}><Trash2 size={14} /> Xóa</button>}
            <div style={{ display: 'flex', gap: '0.75rem', marginLeft: project ? 'auto' : '0' }}>
              <button type="button" onClick={onClose} className="btn btn-ghost">Huỷ</button>
              <button type="submit" className="btn btn-primary">Lưu</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminProjects() {
  const qc = useQueryClient();
  const [modal, setModal] = useState(null);
  const { data: projects = [], isLoading } = useQuery({ queryKey: ['admin-projects'], queryFn: adminGetProjects });
  const invalidate = () => qc.invalidateQueries({ queryKey: ['admin-projects'] });
  const createMut = useMutation({ mutationFn: adminCreateProject, onSuccess: () => { toast.success('Đã thêm!'); invalidate(); setModal(null); }, onError: (err) => { toast.error(err.response?.data?.message || 'Lỗi thêm dự án'); } });
  const updateMut = useMutation({ mutationFn: ({ id, data }) => adminUpdateProject(id, data), onSuccess: () => { toast.success('Đã cập nhật!'); invalidate(); setModal(null); }, onError: (err) => { toast.error(err.response?.data?.message || 'Lỗi cập nhật dự án'); } });
  const deleteMut = useMutation({ mutationFn: adminDeleteProject, onSuccess: () => { toast.success('Đã xoá!'); invalidate(); }, onError: (err) => { toast.error(err.response?.data?.message || 'Lỗi xoá dự án'); } });
  const handleSave = (data) => { if (modal?._id) updateMut.mutate({ id: modal._id, data }); else createMut.mutate(data); };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div><h1 style={{ fontFamily: 'var(--font-heading)', color: '#fff', marginBottom: '0.25rem' }}>Quản lý Dự án</h1><p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Dự án NDA sẽ bị ẩn khỏi trang công khai</p></div>
        <button onClick={() => setModal('create')} className="btn btn-primary"><Plus size={16} /> Thêm Dự án</button>
      </div>
      <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-muted)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
        <table className="admin-table">
          <thead><tr><th>Tên dự án</th><th>Khách hàng</th><th>Ngành</th><th>Thứ tự</th><th>Tags</th><th>Thao tác</th></tr></thead>
          <tbody>
            {isLoading && <tr><td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>Đang tải...</td></tr>}
            {projects.map(p => (
              <tr key={p._id} onClick={() => setModal(p)} style={{ cursor: 'pointer' }}>
                <td>
                  <p style={{ fontWeight: 600, color: '#fff', marginBottom: '0.15rem', fontSize: '0.875rem' }}>{p.titleVi}</p>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.78rem' }}>{p.titleEn}</p>
                </td>
                <td style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>{p.client || '—'}</td>
                <td style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>{p.industryVi || '—'}</td>
                <td style={{ color: 'var(--color-text-muted)' }}>{p.order}</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                    {p.isFeatured && <span style={{ background: 'rgba(245,158,11,0.15)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.3)', fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-full)', fontWeight: 600 }}><Star size={10} style={{ display: 'inline', marginRight: 2 }} />Featured</span>}
                    {p.isNDA && <span style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)', fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-full)', fontWeight: 600 }}><Shield size={10} style={{ display: 'inline', marginRight: 2 }} />NDA</span>}
                    {!p.isActive && <span style={{ background: 'rgba(100,100,100,0.15)', color: 'var(--color-text-muted)', border: '1px solid var(--color-border-muted)', fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-full)' }}>Ẩn</span>}
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => setModal(p)} className="btn btn-ghost btn-sm"><Pencil size={14} /></button>
                    <button onClick={() => { if (confirm('Xoá dự án này?')) deleteMut.mutate(p._id); }} className="btn btn-sm" style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)' }}><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {!isLoading && projects.length === 0 && <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '3rem' }}>Chưa có dự án nào</td></tr>}
          </tbody>
        </table>
      </div>
      {modal && <ProjectModal project={modal === 'create' ? null : modal} onClose={() => setModal(null)} onSave={handleSave} onDelete={(id) => deleteMut.mutate(id)} />}
    </div>
  );
}
