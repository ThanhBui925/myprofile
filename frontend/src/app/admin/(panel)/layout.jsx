'use client';

import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuthStore } from '../../../store/authStore';
import { useQuery } from '@tanstack/react-query';
import { getCompany } from '../../../services/api';
import { 
  LayoutDashboard, Image, Building2, Wrench, FolderOpen, 
  Package, Users, MessageSquare, LogOut, ChevronRight, Handshake, BookOpen,
  User
} from 'lucide-react';
import '../../../components/layout/AdminLayout.css';

const sidebarLinks = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/banners', icon: Image, label: 'Nội dung' },
  { href: '/admin/company', icon: User, label: 'Cá nhân' },
  // { href: '/admin/services', icon: Wrench, label: 'Dịch vụ' },
  { href: '/admin/projects', icon: FolderOpen, label: 'Dự án' },
  // { href: '/admin/products', icon: Package, label: 'Sản phẩm' },
  { href: '/admin/courses', icon: BookOpen, label: 'Tài liệu' },
  { href: '/admin/partners', icon: Handshake, label: 'Đối tác' },
  { href: '/admin/contacts', icon: MessageSquare, label: 'Liên hệ' },
  { href: '/admin/users', icon: Users, label: 'Người dùng' },
];

export default function AdminPanelLayout({ children }) {
  const { admin, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  const { data: company } = useQuery({ queryKey: ['company'], queryFn: getCompany });
  const appName = company?.nameVi || company?.nameEn || 'THANHTDH';

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated) {
      router.replace('/admin/login');
    }
  }, [isAuthenticated, router]);

  // Protect admin routes and fix hydration mismatch
  if (!mounted) return null;
  if (!isAuthenticated) return null;

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        {/* Logo */}
        <div className="admin-sidebar__logo">
          <div className="footer__logo-icon" style={{ width: 32, height: 32, fontSize: '1rem' }}><span>{appName[0]?.toUpperCase()}</span></div>
          <span className="admin-sidebar__logo-text">{appName}</span>
          <span className="admin-sidebar__badge">Admin</span>
        </div>

        {/* Nav */}
        <nav className="admin-sidebar__nav">
          {sidebarLinks.map(link => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`admin-sidebar__link ${isActive ? 'admin-sidebar__link--active' : ''}`}
              >
                <link.icon size={18} />
                <span>{link.label}</span>
                <ChevronRight size={14} className="admin-sidebar__arrow" />
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="admin-sidebar__footer">
          <div className="admin-sidebar__user">
            <div className="admin-sidebar__avatar">
              {admin?.username?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <p className="admin-sidebar__username">{admin?.username}</p>
              <p className="admin-sidebar__role">{admin?.role}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="admin-sidebar__logout" title="Logout">
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {children}
      </main>
    </div>
  );
}
