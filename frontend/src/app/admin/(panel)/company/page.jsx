'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Upload, Save, PlusCircle, MinusCircle } from 'lucide-react';
import { adminGetCompany, adminUpdateCompany, uploadFile, uploadMultiple } from '../../../../services/api';

const TABS = [
  { key: 'general', label: '📋 Tổng quan' },
  { key: 'history', label: '📅 Kinh nghiệm' },
  { key: 'team', label: '👥 Team' },
  { key: 'certs', label: '🏆 Chứng chỉ' },
];

export default function AdminCompany() {
  const qc = useQueryClient();
  const [activeTab, setActiveTab] = useState('general');
  const { data: company, isLoading } = useQuery({ queryKey: ['admin-company'], queryFn: adminGetCompany });
  const { register, handleSubmit, reset, setValue } = useForm();
  const [isUploading, setIsUploading] = useState(false);

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setIsUploading(true);
      const fd = new FormData();
      fd.append('file', file);
      const res = await uploadFile(fd);
      setValue('videoUrl', res.url);
      toast.success('Tải video thành công');
    } catch (err) {
      toast.error('Lỗi tải video');
    } finally {
      setIsUploading(false);
    }
  };

  // History state
  const [history, setHistory] = useState([]);
  const [team, setTeam] = useState([]);
  const [certs, setCerts] = useState([]);
  const [initialized, setInitialized] = useState(false);

  if (company && !initialized) {
    reset({
      nameVi: company.nameVi, nameEn: company.nameEn,
      poweredByVi: company.poweredByVi, poweredByEn: company.poweredByEn,
      aboutVi: company.aboutVi, aboutEn: company.aboutEn,
      visionVi: company.visionVi, visionEn: company.visionEn,
      missionVi: company.missionVi, missionEn: company.missionEn,
      address: company.address, phone: company.phone, email: company.email, founded: company.founded,
      videoUrl: company.videoUrl, mapUrl: company.mapUrl,
    });
    setHistory(company.history || []);
    setTeam(company.team || []);
    setCerts(company.certificates || []);
    setInitialized(true);
  }

  const updateMut = useMutation({
    mutationFn: (data) => adminUpdateCompany(data),
    onSuccess: () => { toast.success('Đã lưu thông tin cá nhân!'); qc.invalidateQueries({ queryKey: ['admin-company'] }); },
    onError: () => toast.error('Lỗi lưu dữ liệu'),
  });

  const onSubmit = (formData) => {
    updateMut.mutate({ ...formData, history, team, certificates: certs });
  };

  if (isLoading) return <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>Đang tải...</div>;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', color: '#fff', marginBottom: '0.25rem' }}>Thông tin Cá nhân</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Quản lý nội dung trang Giới thiệu</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '2rem', background: 'var(--color-surface)', padding: '0.375rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-muted)', width: 'fit-content' }}>
        {TABS.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: activeTab === tab.key ? 'var(--color-primary)' : 'transparent',
              color: activeTab === tab.key ? '#fff' : 'var(--color-text-muted)',
              fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', transition: 'all 0.2s',
            }}>
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* ── TỔNG QUAN ─────────────────────────────────────── */}
        {activeTab === 'general' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-muted)', borderRadius: 'var(--radius-xl)', padding: '2rem' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', color: '#fff', marginBottom: '1.5rem', fontSize: '1rem' }}>Thông tin cơ bản</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group"><label className="form-label">Tên website (VI)</label><input {...register('nameVi')} className="form-input" /></div>
                <div className="form-group"><label className="form-label">Web Name (EN)</label><input {...register('nameEn')} className="form-input" /></div>
                <div className="form-group"><label className="form-label">Chữ chân trang (VI)</label><input {...register('poweredByVi')} className="form-input" placeholder="Powered by THANHTDH Engineering Team" /></div>
                <div className="form-group"><label className="form-label">Footer text (EN)</label><input {...register('poweredByEn')} className="form-input" placeholder="Powered by THANHTDH Engineering Team" /></div>
                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label className="form-label">Video Trang chủ (Tải lên file .mp4, nhập YouTube Link, hoặc Google Drive Link)</label>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <input {...register('videoUrl')} className="form-input" style={{ flex: 1 }} placeholder="Ví dụ: /uploads/videos/demo.mp4 hoặc https://www.youtube.com/watch?v=..." />
                    <label className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                      <input type="file" accept="video/mp4" style={{ display: 'none' }} onChange={handleVideoUpload} disabled={isUploading} />
                      <Upload size={18} />
                      {isUploading ? 'Đang tải...' : 'Tải video lên'}
                    </label>
                  </div>
                </div>
                <div className="form-group"><label className="form-label">Địa chỉ</label><input {...register('address')} className="form-input" /></div>
                <div className="form-group"><label className="form-label">Điện thoại</label><input {...register('phone')} className="form-input" /></div>
                <div className="form-group"><label className="form-label">Email</label><input {...register('email')} type="email" className="form-input" /></div>
                <div className="form-group"><label className="form-label">Năm thành lập</label><input {...register('founded')} type="number" className="form-input" /></div>
                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label className="form-label">Bản đồ (Tùy chọn nhập đường dẫn nhúng Google Maps Embed URL - nếu để trống sẽ tự động tìm theo Địa chỉ)</label>
                  <input {...register('mapUrl')} className="form-input" placeholder="Ví dụ: https://www.google.com/maps/embed?pb=..." />
                </div>
              </div>
            </div>

            <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-muted)', borderRadius: 'var(--radius-xl)', padding: '2rem' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', color: '#fff', marginBottom: '1.5rem', fontSize: '1rem' }}>Giới thiệu</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group"><label className="form-label">Giới thiệu (VI)</label><textarea {...register('aboutVi')} className="form-textarea" rows={5} /></div>
                <div className="form-group"><label className="form-label">About (EN)</label><textarea {...register('aboutEn')} className="form-textarea" rows={5} /></div>
                <div className="form-group"><label className="form-label">Tầm nhìn (VI)</label><textarea {...register('visionVi')} className="form-textarea" rows={4} /></div>
                <div className="form-group"><label className="form-label">Vision (EN)</label><textarea {...register('visionEn')} className="form-textarea" rows={4} /></div>
                <div className="form-group"><label className="form-label">Sứ mệnh (VI)</label><textarea {...register('missionVi')} className="form-textarea" rows={4} /></div>
                <div className="form-group"><label className="form-label">Mission (EN)</label><textarea {...register('missionEn')} className="form-textarea" rows={4} /></div>
              </div>
            </div>
          </div>
        )}

        {/* ── LỊCH SỬ ─────────────────────────────────────── */}
        {activeTab === 'history' && (
          <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-muted)', borderRadius: 'var(--radius-xl)', padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', color: '#fff', fontSize: '1rem' }}>Kinh nghiệm làm việc</h3>
              <button type="button" onClick={() => setHistory(p => [...p, { year: new Date().getFullYear(), titleVi: '', titleEn: '', descriptionVi: '', descriptionEn: '' }])}
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' }}>
                <PlusCircle size={16} /> Thêm mốc
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {history.map((item, i) => (
                <div key={i} style={{ background: 'var(--color-bg-2)', border: '1px solid var(--color-border-muted)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', position: 'relative' }}>
                  <button type="button" onClick={() => setHistory(p => p.filter((_, idx) => idx !== i))} style={{ position: 'absolute', top: '1rem', right: '1rem', color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer' }}><MinusCircle size={18} /></button>
                  <div style={{ display: 'grid', gridTemplateColumns: '0.5fr 1fr 1fr', gap: '1rem', marginBottom: '0.75rem' }}>
                    <div className="form-group"><label className="form-label">Thời gian</label><input value={item.year} onChange={e => setHistory(p => p.map((h, idx) => idx === i ? { ...h, year: e.target.value } : h))} className="form-input" type="text" placeholder="Ví dụ: 05/2023 hoặc 2023" /></div>
                    <div className="form-group"><label className="form-label">Tiêu đề (VI)</label><input value={item.titleVi} onChange={e => setHistory(p => p.map((h, idx) => idx === i ? { ...h, titleVi: e.target.value } : h))} className="form-input" /></div>
                    <div className="form-group"><label className="form-label">Title (EN)</label><input value={item.titleEn} onChange={e => setHistory(p => p.map((h, idx) => idx === i ? { ...h, titleEn: e.target.value } : h))} className="form-input" /></div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group"><label className="form-label">Mô tả (VI)</label><textarea value={item.descriptionVi} onChange={e => setHistory(p => p.map((h, idx) => idx === i ? { ...h, descriptionVi: e.target.value } : h))} className="form-textarea" rows={2} /></div>
                    <div className="form-group"><label className="form-label">Description (EN)</label><textarea value={item.descriptionEn} onChange={e => setHistory(p => p.map((h, idx) => idx === i ? { ...h, descriptionEn: e.target.value } : h))} className="form-textarea" rows={2} /></div>
                  </div>
                </div>
              ))}
              {history.length === 0 && <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '2rem 0' }}>Chưa có mốc lịch sử nào</p>}
            </div>
          </div>
        )}

        {/* ── TEAM ─────────────────────────────────────── */}
        {activeTab === 'team' && (
          <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-muted)', borderRadius: 'var(--radius-xl)', padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', color: '#fff', fontSize: '1rem' }}>Đội ngũ kỹ sư</h3>
              <button type="button" onClick={() => setTeam(p => [...p, { nameVi: '', nameEn: '', positionVi: '', positionEn: '', image: '' }])}
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' }}>
                <PlusCircle size={16} /> Thêm thành viên
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }}>
              {team.map((member, i) => (
                <div key={i} style={{ background: 'var(--color-bg-2)', border: '1px solid var(--color-border-muted)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', position: 'relative' }}>
                  <button type="button" onClick={() => setTeam(p => p.filter((_, idx) => idx !== i))} style={{ position: 'absolute', top: '1rem', right: '1rem', color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer' }}><MinusCircle size={18} /></button>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div className="form-group"><label className="form-label">Họ tên (VI)</label><input value={member.nameVi} onChange={e => setTeam(p => p.map((m, idx) => idx === i ? { ...m, nameVi: e.target.value } : m))} className="form-input" placeholder="Nguyễn Văn A" /></div>
                      <div className="form-group"><label className="form-label">Name (EN)</label><input value={member.nameEn} onChange={e => setTeam(p => p.map((m, idx) => idx === i ? { ...m, nameEn: e.target.value } : m))} className="form-input" /></div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div className="form-group"><label className="form-label">Chức vụ (VI)</label><input value={member.positionVi} onChange={e => setTeam(p => p.map((m, idx) => idx === i ? { ...m, positionVi: e.target.value } : m))} className="form-input" placeholder="Trưởng phòng kỹ thuật" /></div>
                      <div className="form-group"><label className="form-label">Position (EN)</label><input value={member.positionEn} onChange={e => setTeam(p => p.map((m, idx) => idx === i ? { ...m, positionEn: e.target.value } : m))} className="form-input" /></div>
                    </div>
                  </div>
                </div>
              ))}
              {team.length === 0 && <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '2rem 0', gridColumn: '1/-1' }}>Chưa có thành viên nào</p>}
            </div>
          </div>
        )}

        {/* ── CHỨNG CHỈ ─────────────────────────────────────── */}
        {activeTab === 'certs' && (
          <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-muted)', borderRadius: 'var(--radius-xl)', padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', color: '#fff', fontSize: '1rem' }}>Chứng chỉ & Giải thưởng</h3>
              <button type="button" onClick={() => setCerts(p => [...p, { nameVi: '', nameEn: '', issuedBy: '', year: '' }])}
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' }}>
                <PlusCircle size={16} /> Thêm chứng chỉ
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {certs.map((cert, i) => (
                <div key={i} style={{ background: 'var(--color-bg-2)', border: '1px solid var(--color-border-muted)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: '0.75rem', alignItems: 'end' }}>
                  <div className="form-group" style={{ margin: 0 }}><label className="form-label">Tên (VI)</label><input value={cert.nameVi} onChange={e => setCerts(p => p.map((c, idx) => idx === i ? { ...c, nameVi: e.target.value } : c))} className="form-input" placeholder="ISO 9001" /></div>
                  <div className="form-group" style={{ margin: 0 }}><label className="form-label">Name (EN)</label><input value={cert.nameEn} onChange={e => setCerts(p => p.map((c, idx) => idx === i ? { ...c, nameEn: e.target.value } : c))} className="form-input" /></div>
                  <div className="form-group" style={{ margin: 0 }}><label className="form-label">Cấp bởi</label><input value={cert.issuedBy} onChange={e => setCerts(p => p.map((c, idx) => idx === i ? { ...c, issuedBy: e.target.value } : c))} className="form-input" placeholder="TÜV SÜD" /></div>
                  <div className="form-group" style={{ margin: 0 }}><label className="form-label">Năm</label><input value={cert.year} onChange={e => setCerts(p => p.map((c, idx) => idx === i ? { ...c, year: e.target.value } : c))} className="form-input" type="number" /></div>
                  <button type="button" onClick={() => setCerts(p => p.filter((_, idx) => idx !== i))} style={{ color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer', paddingBottom: '0.25rem' }}><MinusCircle size={20} /></button>
                </div>
              ))}
              {certs.length === 0 && <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '2rem 0' }}>Chưa có chứng chỉ nào</p>}
            </div>
          </div>
        )}

        {/* Save Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
          <button type="submit" className="btn btn-primary" disabled={updateMut.isPending} style={{ padding: '0.75rem 2rem' }}>
            {updateMut.isPending ? 'Đang lưu...' : <><Save size={16} /> Lưu thay đổi</>}
          </button>
        </div>
      </form>
    </div>
  );
}
