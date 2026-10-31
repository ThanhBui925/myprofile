'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Users, EyeOff, Eye, Building2, Phone } from 'lucide-react';
import { adminGetUsers, adminToggleUser } from '../../../../services/api';

export default function AdminUsers() {
  const qc = useQueryClient();
  const { data: users = [], isLoading } = useQuery({ queryKey: ['admin-users'], queryFn: adminGetUsers });

  const toggleMut = useMutation({
    mutationFn: adminToggleUser,
    onSuccess: () => { toast.success('Đã cập nhật trạng thái!'); qc.invalidateQueries({ queryKey: ['admin-users'] }); },
  });

  const activeCount = users.filter(u => u.isActive).length;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', color: '#fff', marginBottom: '0.25rem' }}>Quản lý Người dùng</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Danh sách tài khoản đã đăng ký trên hệ thống</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 'var(--radius-lg)', padding: '0.75rem 1.25rem', textAlign: 'center' }}>
            <p style={{ color: '#22C55E', fontWeight: 800, fontSize: '1.4rem', fontFamily: 'var(--font-heading)', lineHeight: 1 }}>{activeCount}</p>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>Hoạt động</p>
          </div>
          <div style={{ background: 'rgba(255,107,0,0.1)', border: '1px solid rgba(255,107,0,0.3)', borderRadius: 'var(--radius-lg)', padding: '0.75rem 1.25rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--color-primary)', fontWeight: 800, fontSize: '1.4rem', fontFamily: 'var(--font-heading)', lineHeight: 1 }}>{users.length}</p>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>Tổng cộng</p>
          </div>
        </div>
      </div>

      <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-muted)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Người dùng</th>
              <th>Email</th>
              <th>Điện thoại</th>
              <th>Công ty</th>
              <th>Yêu cầu</th>
              <th>Ngày đăng ký</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>Đang tải...</td></tr>
            )}
            {users.map((user, i) => (
              <motion.tr key={user._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                    <div style={{ width: 38, height: 38, background: 'linear-gradient(135deg, var(--color-primary), #FF8C42)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.95rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-heading)', flexShrink: 0 }}>
                      {user.fullName?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, color: '#fff', fontSize: '0.875rem', marginBottom: '0.1rem' }}>{user.fullName}</p>
                      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>ID: {user._id.substring(0, 8)}...</p>
                    </div>
                  </div>
                </td>
                <td style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>{user.email}</td>
                <td style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                  {user.phone ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Phone size={12} />{user.phone}</span>
                  ) : '—'}
                </td>
                <td style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                  {user.company ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Building2 size={12} />{user.company}</span>
                  ) : '—'}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {user.consultations?.length > 0 && (
                      <span style={{ background: 'rgba(255,107,0,0.1)', color: 'var(--color-primary)', border: '1px solid rgba(255,107,0,0.3)', fontSize: '0.7rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-full)' }}>{user.consultations.length} BG</span>
                    )}
                    {user.quoteRequests?.length > 0 && (
                      <span style={{ background: 'rgba(168,85,247,0.1)', color: '#A855F7', border: '1px solid rgba(168,85,247,0.3)', fontSize: '0.7rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-full)' }}>{user.quoteRequests.length} BG</span>
                    )}
                    {!user.consultations?.length && !user.quoteRequests?.length && (
                      <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>—</span>
                    )}
                  </div>
                </td>
                <td style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                  {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                </td>
                <td>
                  <button onClick={() => toggleMut.mutate(user._id)} disabled={toggleMut.isPending}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'none', border: 'none', cursor: 'pointer', color: user.isActive ? 'var(--color-success)' : '#EF4444', fontSize: '0.8rem', fontWeight: 600 }}>
                    {user.isActive ? <Eye size={20} /> : <EyeOff size={20} />}
                    {user.isActive ? 'Hoạt động' : 'Đã khoá'}
                  </button>
                </td>
              </motion.tr>
            ))}
            {!isLoading && users.length === 0 && (
              <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '3rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}><Users size={40} style={{ opacity: 0.3 }} /></div>
                Chưa có người dùng nào đăng ký
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
