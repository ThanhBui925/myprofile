'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getDashboard, getCompany } from '../../../../services/api';
import { MessageSquare, Wrench, FolderOpen, Package, Bell, ArrowRight, Users } from 'lucide-react';

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery({ queryKey: ['dashboard'], queryFn: getDashboard });
  const { data: company } = useQuery({ queryKey: ['company'], queryFn: getCompany });
  const appName = company?.nameVi || company?.nameEn || 'THANHTDH';

  const cards = [
    { label: 'Liên hệ mới', value: stats?.newContacts, total: stats?.contacts, icon: Bell, color: '#FF6B00', bg: 'rgba(255,107,0,0.1)', border: 'rgba(255,107,0,0.3)', link: '/admin/contacts' },
    { label: 'Dịch vụ', value: stats?.services, icon: Wrench, color: '#3B82F6', bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.3)', link: '/admin/services' },
    { label: 'Dự án', value: stats?.projects, icon: FolderOpen, color: '#22C55E', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.3)', link: '/admin/projects' },
    { label: 'Sản phẩm', value: stats?.products, icon: Package, color: '#A855F7', bg: 'rgba(168,85,247,0.1)', border: 'rgba(168,85,247,0.3)', link: '/admin/products' },
    { label: 'Người dùng', value: stats?.users, icon: Users, color: '#06B6D4', bg: 'rgba(6,182,212,0.1)', border: 'rgba(6,182,212,0.3)', link: '/admin/users' },
  ];

  const quickLinks = [
    { to: '/admin/banners', label: 'Quản lý Banner', desc: 'Thêm/sửa/xóa banner trang chủ' },
    { to: '/admin/services', label: 'Quản lý Dịch vụ', desc: 'CRUD dịch vụ công ty' },
    { to: '/admin/projects', label: 'Quản lý Dự án', desc: 'Thêm dự án, quản lý NDA' },
    { to: '/admin/products', label: 'Quản lý Sản phẩm', desc: 'Sản phẩm và catalog' },
    { to: '/admin/company', label: 'Thông tin Cá nhân', desc: 'Chỉnh sửa nội dung giới thiệu' },
    { to: '/admin/contacts', label: 'Hòm thư Liên hệ', desc: 'Xem và xử lý form liên hệ' },
    { to: '/admin/users', label: 'Người dùng', desc: 'Quản lý tài khoản đã đăng ký' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', color: '#fff', marginBottom: '0.25rem' }}>Dashboard</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>Tổng quan hệ thống {appName}</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', marginBottom: '3rem' }}>
        {cards.map((card, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Link href={card.link} style={{ display: 'block', textDecoration: 'none' }}>
              <div style={{ background: card.bg, border: `1px solid ${card.border}`, borderRadius: 'var(--radius-xl)', padding: '1.75rem', transition: 'all 0.2s', cursor: 'pointer' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 8px 30px ${card.bg}`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ width: 44, height: 44, background: card.bg, border: `1px solid ${card.border}`, borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.color }}>
                    <card.icon size={20} />
                  </div>
                  {card.label === 'Liên hệ mới' && card.value > 0 && (
                    <span style={{ background: 'var(--color-primary)', color: '#fff', fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-full)' }}>
                      {card.value} mới
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '2.5rem', fontFamily: 'var(--font-heading)', fontWeight: 800, color: card.color, lineHeight: 1, marginBottom: '0.375rem' }}>
                  {isLoading ? '—' : (card.total || card.value || 0)}
                </div>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', margin: 0 }}>{card.label}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Quick Links */}
      <h2 style={{ fontFamily: 'var(--font-heading)', color: '#fff', marginBottom: '1.25rem', fontSize: '1.2rem' }}>Truy cập nhanh</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
        {quickLinks.map((link, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.06 }}>
            <Link href={link.to} style={{ display: 'block', textDecoration: 'none' }}>
              <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-muted)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.background = 'rgba(255,107,0,0.04)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border-muted)'; e.currentTarget.style.background = 'var(--color-surface)'; }}>
                <div>
                  <p style={{ color: '#fff', fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.25rem' }}>{link.label}</p>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', margin: 0 }}>{link.desc}</p>
                </div>
                <ArrowRight size={16} color="var(--color-primary)" style={{ flexShrink: 0 }} />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
