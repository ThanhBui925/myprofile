import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { 
  LayoutDashboard, Image, Building2, Wrench, FolderOpen, 
  Package, Users, MessageSquare, LogOut, ChevronRight, Handshake
} from 'lucide-react';
import './AdminLayout.css';

const sidebarLinks = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/banners', icon: Image, label: 'Banners' },
  { to: '/admin/company', icon: Building2, label: 'Cá nhân' },
  { to: '/admin/services', icon: Wrench, label: 'Dịch vụ' },
  { to: '/admin/projects', icon: FolderOpen, label: 'Dự án' },
  { to: '/admin/products', icon: Package, label: 'Sản phẩm' },
  { to: '/admin/partners', icon: Handshake, label: 'Đối tác' },
  { to: '/admin/contacts', icon: MessageSquare, label: 'Liên hệ' },
  { to: '/admin/users', icon: Users, label: 'Người dùng' },
];

export default function AdminLayout() {
  const { admin, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        {/* Logo */}
        <div className="admin-sidebar__logo">
          <div className="footer__logo-icon" style={{ width: 32, height: 32, fontSize: '1rem' }}><span>E</span></div>
          <span className="admin-sidebar__logo-text">ERA<span>TECH</span></span>
          <span className="admin-sidebar__badge">Admin</span>
        </div>

        {/* Nav */}
        <nav className="admin-sidebar__nav">
          {sidebarLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `admin-sidebar__link ${isActive ? 'admin-sidebar__link--active' : ''}`}
            >
              <link.icon size={18} />
              <span>{link.label}</span>
              <ChevronRight size={14} className="admin-sidebar__arrow" />
            </NavLink>
          ))}
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
        <Outlet />
      </main>
    </div>
  );
}
