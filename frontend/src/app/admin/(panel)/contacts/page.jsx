'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Trash2, X, Eye, CheckCircle, Mail, Phone, Building2, MessageSquare } from 'lucide-react';
import { adminGetContacts, adminUpdateContact, adminDeleteContact } from '../../../../services/api';

const STATUS_CONFIG = {
  new: { label: 'Mới', color: '#FF6B00', bg: 'rgba(255,107,0,0.12)', border: 'rgba(255,107,0,0.35)' },
  read: { label: 'Đã đọc', color: '#3B82F6', bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.35)' },
  replied: { label: 'Đã phản hồi', color: '#22C55E', bg: 'rgba(34,197,94,0.12)', border: 'rgba(34,197,94,0.35)' },
};

function ContactDetailModal({ contact, onClose, onStatusChange }) {
  const cfg = STATUS_CONFIG[contact.status] || STATUS_CONFIG.new;
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(8px)' }}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        style={{ background: 'var(--color-bg-2)', border: '1px solid var(--color-border-muted)', borderRadius: 'var(--radius-xl)', padding: '2.25rem', width: '100%', maxWidth: 520, position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'var(--color-surface)', border: '1px solid var(--color-border-muted)', borderRadius: '50%', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--color-text-muted)' }}><X size={16} /></button>
        
        <div style={{ marginBottom: '1.75rem' }}>
          <span style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`, fontSize: '0.75rem', fontWeight: 700, padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{cfg.label}</span>
        </div>

        <h3 style={{ fontFamily: 'var(--font-heading)', color: '#fff', marginBottom: '0.375rem', fontSize: '1.2rem' }}>{contact.name}</h3>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', marginBottom: '2rem' }}>
          {new Date(contact.createdAt).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { icon: Mail, label: 'Email', value: contact.email },
            { icon: Phone, label: 'Điện thoại', value: contact.phone },
            { icon: Building2, label: 'Công ty', value: contact.company },
            { icon: MessageSquare, label: 'Dịch vụ quan tâm', value: contact.service },
          ].filter(f => f.value).map((field, i) => (
            <div key={i} style={{ display: 'flex', gap: '0.875rem', alignItems: 'flex-start' }}>
              <div style={{ width: 36, height: 36, background: 'var(--color-surface)', border: '1px solid var(--color-border-muted)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', flexShrink: 0 }}>
                <field.icon size={15} />
              </div>
              <div>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.125rem' }}>{field.label}</p>
                <p style={{ color: '#fff', fontSize: '0.9rem' }}>{field.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tracking Status Banner */}
        <div style={{ background: contact.isDownloaded ? 'rgba(59,130,246,0.1)' : 'rgba(255,255,255,0.03)', border: `1px solid ${contact.isDownloaded ? 'rgba(59,130,246,0.3)' : 'var(--color-border-muted)'}`, borderRadius: 'var(--radius-lg)', padding: '1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ fontSize: '1.25rem' }}>{contact.isDownloaded ? '📥' : '⏳'}</div>
          <div>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '0.15rem' }}>Trạng thái Mở Link Tài liệu</p>
            <p style={{ color: contact.isDownloaded ? '#3B82F6' : 'var(--color-text-muted)', fontWeight: 700, fontSize: '0.875rem' }}>
              {contact.isDownloaded ? `✓ Khách hàng ĐÃ bấm mở link tài liệu lúc ${contact.clickedAt ? new Date(contact.clickedAt).toLocaleString('vi-VN') : ''}` : 'Chưa bấm mở link trong Email (hoặc yêu cầu tạo trước khi bật tính năng)'}
            </p>
          </div>
        </div>

        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-muted)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', marginBottom: '2rem' }}>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Nội dung tin nhắn</p>
          <p style={{ color: '#fff', fontSize: '0.95rem', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{contact.message}</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>Cập nhật trạng thái:</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
          {Object.entries(STATUS_CONFIG).map(([key, val]) => (
            <button key={key} onClick={() => onStatusChange(key)}
              disabled={contact.status === key}
              style={{ background: contact.status === key ? val.bg : 'var(--color-surface)', color: val.color, border: `1px solid ${val.border}`, borderRadius: 'var(--radius-md)', padding: '0.5rem', whiteSpace: 'nowrap', textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '0.8rem', fontWeight: 600, cursor: contact.status === key ? 'default' : 'pointer', opacity: contact.status === key ? 1 : 0.7, transition: 'all 0.2s' }}>
              {val.label}
            </button>
          ))}
        </div>
      </div>
      </motion.div>
    </div>
  );
}

export default function AdminContacts() {
  const qc = useQueryClient();
  const [selected, setSelected] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');

  const { data: contacts = [], isLoading } = useQuery({ queryKey: ['admin-contacts', filterStatus], queryFn: () => adminGetContacts(filterStatus ? { status: filterStatus } : {}) });
  const invalidate = () => qc.invalidateQueries({ queryKey: ['admin-contacts'] });

  const updateMut = useMutation({
    mutationFn: ({ id, data }) => adminUpdateContact(id, data),
    onSuccess: () => { toast.success('Cập nhật thành công!'); invalidate(); setSelected(s => s ? { ...s } : null); }
  });
  const deleteMut = useMutation({ mutationFn: adminDeleteContact, onSuccess: () => { toast.success('Đã xoá!'); invalidate(); setSelected(null); } });

  const handleStatusChange = (status) => {
    updateMut.mutate({ id: selected._id, data: { status } });
    setSelected(prev => ({ ...prev, status }));
  };

  // Mark as read when opening
  const openContact = (contact) => {
    setSelected(contact);
    if (contact.status === 'new') {
      updateMut.mutate({ id: contact._id, data: { status: 'read' } });
    }
  };

  const newCount = contacts.filter(c => c.status === 'new').length;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
            <h1 style={{ fontFamily: 'var(--font-heading)', color: '#fff' }}>Hòm thư Liên hệ</h1>
            {newCount > 0 && <span style={{ background: 'var(--color-primary)', color: '#fff', fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)' }}>{newCount} mới</span>}
          </div>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Quản lý các yêu cầu từ khách hàng</p>
        </div>
        {/* Status filter */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => setFilterStatus('')} className={!filterStatus ? 'btn btn-primary btn-sm' : 'btn btn-ghost btn-sm'}>Tất cả</button>
          {Object.entries(STATUS_CONFIG).map(([key, val]) => (
            <button key={key} onClick={() => setFilterStatus(key)} className={filterStatus === key ? 'btn btn-primary btn-sm' : 'btn btn-ghost btn-sm'}
              style={filterStatus === key ? {} : { color: val.color }}>
              {val.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-muted)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
        <table className="admin-table">
          <thead><tr><th>Tên</th><th>Email</th><th>Điện thoại</th><th>Dịch vụ</th><th>Trạng thái</th><th>Ngày gửi</th><th>Thao tác</th></tr></thead>
          <tbody>
            {isLoading && <tr><td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>Đang tải...</td></tr>}
            {contacts.map(c => {
              const cfg = STATUS_CONFIG[c.status] || STATUS_CONFIG.new;
              return (
                <tr key={c._id} style={{ cursor: 'pointer' }} onClick={() => openContact(c)}>
                  <td>
                    <p style={{ fontWeight: c.status === 'new' ? 700 : 500, color: c.status === 'new' ? '#fff' : 'var(--color-text)', fontSize: '0.875rem' }}>{c.name}</p>
                    {c.company && <p style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>{c.company}</p>}
                  </td>
                  <td style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>{c.email}</td>
                  <td style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>{c.phone || '—'}</td>
                  <td style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', maxWidth: 140 }}><span style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{c.service || '—'}</span></td>
                  <td onClick={e => e.stopPropagation()}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', alignItems: 'flex-start' }}>
                      <span style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`, fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.625rem', borderRadius: 'var(--radius-full)', letterSpacing: '0.04em' }}>{cfg.label}</span>
                      {c.isDownloaded && (
                        <span title={`Đã mở link tài liệu lúc ${c.clickedAt ? new Date(c.clickedAt).toLocaleString('vi-VN') : ''}`} style={{ background: 'rgba(59,130,246,0.15)', color: '#3B82F6', border: '1px solid rgba(59,130,246,0.35)', fontSize: '0.68rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-full)', whiteSpace: 'nowrap' }}>
                          ✓ Đã mở link ({c.clickedAt ? new Date(c.clickedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : ''})
                        </span>
                      )}
                    </div>
                  </td>
                  <td style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                    {new Date(c.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td onClick={e => e.stopPropagation()}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => openContact(c)} className="btn btn-ghost btn-sm"><Eye size={14} /></button>
                      <button onClick={() => { if (confirm('Xoá liên hệ này?')) deleteMut.mutate(c._id); }} className="btn btn-sm" style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)' }}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {!isLoading && contacts.length === 0 && <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '3rem' }}>Không có liên hệ nào</td></tr>}
          </tbody>
        </table>
      </div>

      {selected && (
        <ContactDetailModal contact={selected} onClose={() => setSelected(null)} onStatusChange={handleStatusChange} />
      )}
    </div>
  );
}
