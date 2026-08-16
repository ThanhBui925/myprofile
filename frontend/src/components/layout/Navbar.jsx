'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Menu, X, Globe, User, LogIn, LogOut, UserCircle, History, ChevronDown } from 'lucide-react';
import { useUserStore } from '../../store/userStore';
import { useQuery } from '@tanstack/react-query';
import { getCompany } from '../../services/api';
import toast from 'react-hot-toast';
import './Navbar.css';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useUserStore();
  
  const { data: company } = useQuery({ queryKey: ['company'], queryFn: getCompany });
  const appName = company ? (i18n.language === 'vi' ? company.nameVi : company.nameEn) : '';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 120);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setUserDropdown(false);
  }, [pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggleLang = () => {
    const newLang = i18n.language === 'vi' ? 'en' : 'vi';
    i18n.changeLanguage(newLang);
    localStorage.setItem('lang', newLang);
  };

  const handleLogout = () => {
    logout();
    setUserDropdown(false);
    toast.success(t('auth.logout') + ' ' + 'thành công');
    router.push('/');
  };

  const navLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/about', label: t('nav.about') },
    { href: '/projects', label: t('nav.projects') },
    { href: '/documents', label: t('nav.courses') },
    { href: '/contact', label: t('nav.contact') },
  ];

  const isActive = (href) => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`} suppressHydrationWarning>
      <div className="container navbar__inner" suppressHydrationWarning>
        <Link href="/" className="navbar__logo">
          <div className="navbar__logo-icon"><span>{appName[0]?.toUpperCase()}</span></div>
          <span className="navbar__logo-text">{appName}</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="navbar__nav" suppressHydrationWarning>
          {navLinks.map(link => (
            <Link
              key={link.href} href={link.href}
              className={`navbar__link ${isActive(link.href) ? 'navbar__link--active' : ''}`}
              suppressHydrationWarning
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="navbar__actions">
          <button onClick={toggleLang} className="navbar__lang-btn" title="Toggle Language">
            <Globe size={16} />
            <span>{i18n.language === 'vi' ? 'EN' : 'VI'}</span>
          </button>

          {/* User Auth Button */}
          {isAuthenticated && user ? (
            <div ref={dropdownRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setUserDropdown(!userDropdown)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,107,0,0.1)',
                  border: '1px solid rgba(255,107,0,0.3)', borderRadius: 'var(--radius-md)',
                  padding: '0.4rem 0.875rem', cursor: 'pointer', color: '#fff', fontSize: '0.875rem', fontWeight: 600, transition: 'all 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,107,0,0.18)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,107,0,0.1)'}
              >
                <div style={{ width: 26, height: 26, background: 'linear-gradient(135deg, var(--color-primary), #FF8C42)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-heading)' }}>
                  {user.fullName?.[0]?.toUpperCase() || 'U'}
                </div>
                <span className="navbar__username" style={{ maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.fullName?.split(' ').pop()}</span>
                <ChevronDown size={14} style={{ transition: 'transform 0.2s', transform: userDropdown ? 'rotate(180deg)' : 'rotate(0)' }} />
              </button>

              {/* Dropdown */}
              {userDropdown && (
                <div style={{
                  position: 'absolute', right: 0, top: 'calc(100% + 0.75rem)', width: 220,
                  background: 'var(--color-bg-2)', border: '1px solid var(--color-border-muted)', borderRadius: 'var(--radius-lg)',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.5)', zIndex: 1000, overflow: 'hidden',
                  animation: 'fadeInDown 0.15s ease',
                }}>
                  {/* Header */}
                  <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--color-border-muted)', background: 'rgba(255,107,0,0.06)' }}>
                    <p style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem', marginBottom: '0.2rem' }}>{user.fullName}</p>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</p>
                  </div>
                  {/* Links */}
                  <div style={{ padding: '0.5rem' }}>
                    {[
                      { href: '/profile', icon: UserCircle, label: t('auth.my_account') },
                      { href: '/profile?tab=history', icon: History, label: t('auth.order_history') },
                    ].map((item) => (
                      <Link key={item.href} href={item.href}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 0.875rem', borderRadius: 'var(--radius-sm)', color: 'var(--color-text-muted)', fontSize: '0.875rem', textDecoration: 'none', transition: 'all 0.15s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-surface)'; e.currentTarget.style.color = '#fff'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-text-muted)'; }}>
                        <item.icon size={15} color="var(--color-primary)" />
                        {item.label}
                      </Link>
                    ))}
                    <div style={{ borderTop: '1px solid var(--color-border-muted)', margin: '0.375rem 0', paddingTop: '0.375rem' }}>
                      <button onClick={handleLogout}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 0.875rem', borderRadius: 'var(--radius-sm)', color: '#EF4444', fontSize: '0.875rem', background: 'none', border: 'none', cursor: 'pointer', width: '100%', transition: 'background 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <LogOut size={15} /> {t('auth.logout')}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link href="/login" className="btn btn-ghost btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <LogIn size={14} /> {t('auth.login')}
              </Link>
              <Link href="/register" className="btn btn-primary btn-sm">{t('auth.register')}</Link>
            </div>
          )}

          <button className="navbar__menu-btn" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`navbar__mobile ${isOpen ? 'navbar__mobile--open' : ''}`}>
        {navLinks.map(link => (
          <Link
            key={link.href} href={link.href}
            className={`navbar__mobile-link ${isActive(link.href) ? 'navbar__mobile-link--active' : ''}`}
          >
            {link.label}
          </Link>
        ))}

        {/* Mobile Auth */}
        <div style={{ padding: '0.75rem 1.5rem', borderTop: '1px solid var(--color-border-muted)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {isAuthenticated ? (
            <>
              <Link href="/profile" className="navbar__mobile-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <User size={15} /> {user?.fullName}
              </Link>
              <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 0', background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444', fontWeight: 500, fontSize: '0.95rem', textAlign: 'left' }}>
                <LogOut size={15} /> {t('auth.logout')}
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="navbar__mobile-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <LogIn size={18} /> {t('auth.login')}
              </Link>
              <Link href="/register" className="navbar__mobile-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)' }}>
                <User size={15} /> {t('auth.register_account')}
              </Link>
            </>
          )}
        </div>

        <div className="navbar__mobile-lang">
          <button onClick={toggleLang} className="btn btn-ghost btn-sm">
            <Globe size={14} />
            {i18n.language === 'vi' ? 'Switch to English' : 'Chuyển tiếng Việt'}
          </button>
        </div>
      </div>

      <style>{`@keyframes fadeInDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </header>
  );
}
