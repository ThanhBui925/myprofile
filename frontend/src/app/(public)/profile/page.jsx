'use client';

import { useState, useEffect, Suspense } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { User, Phone, Building2, Mail, Lock, History, LogOut, Save, Eye, EyeOff, MessageSquare, Package, X } from 'lucide-react';
import { getUserMe, updateUserMe, changePassword, getUserHistory } from '../../../services/api';
import { useUserStore } from '../../../store/userStore';
import { useTranslation } from 'react-i18next';
import { useRouter, useSearchParams } from 'next/navigation';

const TABS = [
  { key: 'profile', labelKey: 'profile.tab_profile', icon: User },
  { key: 'history', labelKey: 'profile.tab_history', icon: History },
  { key: 'security', labelKey: 'profile.tab_security', icon: Lock },
];

function ProfileTab({ user, onUpdate }) {
  const { t } = useTranslation();
  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm({
    defaultValues: { fullName: user?.fullName, phone: user?.phone, company: user?.company },
  });

  useEffect(() => {
    if (user) {
      reset({ fullName: user.fullName, phone: user.phone, company: user.company });
    }
  }, [user, reset]);
  const mutation = useMutation({
    mutationFn: updateUserMe,
    onSuccess: (data) => { toast.success(t('profile.save_success')); onUpdate(data.user); },
    onError: () => toast.error(t('profile.save_error')),
  });
  return (
    <form onSubmit={handleSubmit(d => mutation.mutate(d))} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
      <div className="profile-user-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem', background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-muted)', marginBottom: '0.5rem' }}>
        <div style={{ width: 72, height: 72, background: 'linear-gradient(135deg, var(--color-primary), #FF8C42)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-heading)' }}>
          {user?.fullName?.[0]?.toUpperCase() || 'U'}
        </div>
        <div>
          <h3 style={{ fontFamily: 'var(--font-heading)', color: '#fff', fontWeight: 700, marginBottom: '0.25rem' }}>{user?.fullName}</h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>{user?.email}</p>
        </div>
      </div>
      <div className="grid-split-2" style={{ gap: '1rem' }}>
        <div className="form-group">
          <label className="form-label">{t('profile.full_name')} *</label>
          <div style={{ position: 'relative' }}>
            <User size={15} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            <input {...register('fullName', { required: true })} className="form-input" style={{ paddingLeft: '2.5rem' }} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">{t('profile.email')}</label>
          <div style={{ position: 'relative' }}>
            <Mail size={15} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            <input value={user?.email || ''} disabled className="form-input" style={{ paddingLeft: '2.5rem', opacity: 0.5 }} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">{t('profile.phone')}</label>
          <div style={{ position: 'relative' }}>
            <Phone size={15} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            <input {...register('phone')} className="form-input" style={{ paddingLeft: '2.5rem' }} placeholder={t('profile.placeholder_phone')} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">{t('profile.company')}</label>
          <div style={{ position: 'relative' }}>
            <Building2 size={15} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            <input {...register('company')} className="form-input" style={{ paddingLeft: '2.5rem' }} placeholder={t('profile.placeholder_company')} />
          </div>
        </div>
      </div>
      <div>
        <button type="submit" className="btn btn-primary" disabled={mutation.isPending || !isDirty}>
          <Save size={15} /> {mutation.isPending ? t('profile.saving') : t('profile.save_changes')}
        </button>
      </div>
    </form>
  );
}

function HistoryDetailModal({ item, onClose, lang, t, STATUS_COLOR, formatTitle, formatMessage, defaultUserEmail }) {
  if (!item) return null;
  const cfg = STATUS_COLOR[item.status] || STATUS_COLOR.pending;
  const title = formatTitle(item.product || item.service);
  const message = formatMessage(item.message);
  const targetEmail = item.email || defaultUserEmail;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 2500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(8px)' }}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ background: 'var(--color-bg-2)', border: '1px solid var(--color-border-muted)', borderRadius: 'var(--radius-xl)', padding: '2.25rem', width: '100%', maxWidth: 500, position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'var(--color-surface)', border: '1px solid var(--color-border-muted)', borderRadius: '50%', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--color-text-muted)' }}><X size={16} /></button>
        
        <h3 style={{ fontFamily: 'var(--font-heading)', color: '#fff', marginBottom: '0.25rem', fontSize: '1.15rem' }}>{t('profile.detail_title')}</h3>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', marginBottom: '1.5rem' }}>
          📅 {new Date(item.createdAt).toLocaleString(lang === 'vi' ? 'vi-VN' : 'en-US')}
        </p>

        {/* Status badges */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          <span style={{ background: `${cfg.color}15`, color: cfg.color, border: `1px solid ${cfg.color}40`, fontSize: '0.78rem', fontWeight: 700, padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)' }}>
            {cfg.label}
          </span>
          {item.isDownloaded && (
            <span style={{ background: 'rgba(59,130,246,0.15)', color: '#3B82F6', border: '1px solid rgba(59,130,246,0.35)', fontSize: '0.78rem', fontWeight: 700, padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)' }}>
              {t('profile.opened_link')} ({item.clickedAt ? new Date(item.clickedAt).toLocaleTimeString(lang === 'vi' ? 'vi-VN' : 'en-US', { hour: '2-digit', minute: '2-digit' }) : ''})
            </span>
          )}
        </div>

        {/* Detail list */}
        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-muted)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem' }}>{t('profile.item_name')}</p>
            <p style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 700 }}>{title}</p>
          </div>
          {targetEmail && (
            <div>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem' }}>{t('profile.receiving_email')}</p>
              <p style={{ color: '#FFB380', fontSize: '0.875rem', fontWeight: 600 }}>{targetEmail}</p>
            </div>
          )}
          <div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem' }}>{t('form.message')}</p>
            <p style={{ color: 'var(--color-text)', fontSize: '0.875rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{message || '—'}</p>
          </div>
          {item.clickedAt && (
            <div>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem' }}>{t('profile.downloaded_time')}</p>
              <p style={{ color: '#3B82F6', fontSize: '0.875rem', fontWeight: 600 }}>{new Date(item.clickedAt).toLocaleString(lang === 'vi' ? 'vi-VN' : 'en-US')}</p>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onClose} className="btn btn-outline btn-sm">{t('common.back')}</button>
        </div>
      </motion.div>
    </div>
  );
}

function HistoryTab() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const storeUser = useUserStore(s => s.user);
  const [selectedItem, setSelectedItem] = useState(null);
  const { data, isLoading } = useQuery({ queryKey: ['user-history'], queryFn: getUserHistory });
  const STATUS_COLOR = { pending: { color: '#F59E0B', label: t('profile.status_pending') }, replied: { color: '#22C55E', label: t('profile.status_replied') } };

  if (isLoading) return <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>{t('profile.loading')}</div>;

  const consultations = (data?.consultations || []).map(item => ({ ...item, type: 'consultation' }));
  const quoteRequests = (data?.quoteRequests || []).map(item => ({ ...item, type: 'quote' }));
  const allItems = [...consultations, ...quoteRequests].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (allItems.length === 0) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>{t('profile.no_requests')}</p>
        <p style={{ color: 'var(--color-text-subtle)', fontSize: '0.85rem', marginTop: '0.5rem' }}>{t('profile.no_requests_sub')}</p>
      </div>
    );
  }

  const formatTitle = (rawTitle) => {
    if (!rawTitle) return t('profile.product_general');
    if (lang === 'en') {
      return rawTitle.replace(/^Tài liệu:\s*/i, 'Document: ');
    }
    return rawTitle;
  };

  const formatMessage = (msg) => {
    if (msg === 'Yêu cầu nhận tài liệu qua Email' && lang === 'en') {
      return t('profile.doc_delivery_msg');
    }
    return msg;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h4 style={{ fontFamily: 'var(--font-heading)', color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <History size={18} color="var(--color-primary)" /> {t('profile.all_requests')} ({allItems.length})
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {allItems.map((item, i) => {
            const cfg = STATUS_COLOR[item.status] || STATUS_COLOR.pending;
            const itemTitle = formatTitle(item.type === 'consultation' ? item.service : item.product);
            return (
              <div key={i} onClick={() => setSelectedItem(item)} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-muted)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', display: 'flex', alignItems: 'flex-start', gap: '1rem', justifyContent: 'space-between', cursor: 'pointer', transition: 'transform 0.2s, border-color 0.2s' }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, color: '#fff', fontSize: '0.9rem', marginBottom: '0.3rem' }}>{itemTitle}</p>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.825rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{formatMessage(item.message)}</p>
                  <p style={{ color: 'var(--color-text-subtle)', fontSize: '0.75rem', marginTop: '0.5rem' }}>{new Date(item.createdAt).toLocaleDateString(lang === 'vi' ? 'vi-VN' : 'en-US')}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.35rem', flexShrink: 0 }}>
                  <span style={{ background: `${cfg.color}15`, color: cfg.color, border: `1px solid ${cfg.color}40`, fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.625rem', borderRadius: 'var(--radius-full)', whiteSpace: 'nowrap' }}>{cfg.label}</span>
                  {item.isDownloaded && (
                    <span style={{ background: 'rgba(59,130,246,0.15)', color: '#3B82F6', border: '1px solid rgba(59,130,246,0.35)', fontSize: '0.68rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-full)', whiteSpace: 'nowrap' }}>
                      {t('profile.opened_link')}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedItem && (
        <HistoryDetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          lang={lang}
          t={t}
          STATUS_COLOR={STATUS_COLOR}
          formatTitle={formatTitle}
          formatMessage={formatMessage}
          defaultUserEmail={storeUser?.email}
        />
      )}
    </div>
  );
}

function SecurityTab() {
  const { t } = useTranslation();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();
  const newPassword = watch('newPassword');
  const mutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => { toast.success(t('profile.pwd_success')); reset(); },
    onError: (err) => toast.error(err.response?.data?.message || t('profile.pwd_error')),
  });
  const PwField = ({ label, name, rules, show, onToggle, placeholder, autoComplete }) => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <div style={{ position: 'relative' }}>
        <Lock size={15} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', pointerEvents: 'none' }} />
        <input {...register(name, rules)} type={show ? 'text' : 'password'} className="form-input" placeholder={placeholder || '••••••••'} autoComplete={autoComplete} style={{ paddingLeft: '2.5rem', paddingRight: '2.75rem' }} />
        <button type="button" onClick={onToggle} style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', padding: 0 }}>
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
      {errors[name] && <span className="form-error">{errors[name].message}</span>}
    </div>
  );
  return (
    <div style={{ maxWidth: 480 }}>
      <div style={{ padding: '1.25rem', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 'var(--radius-lg)', marginBottom: '2rem' }}>
        <p style={{ color: '#93C5FD', fontSize: '0.85rem' }}>{t('profile.pwd_info')}</p>
      </div>
      <form onSubmit={handleSubmit(d => mutation.mutate({ currentPassword: d.currentPassword, newPassword: d.newPassword }))} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <PwField label={`${t('profile.current_pwd')} *`} name="currentPassword" rules={{ required: t('profile.pwd_required') }} show={showCurrent} onToggle={() => setShowCurrent(!showCurrent)} autoComplete="current-password" />
        <PwField label={`${t('profile.new_pwd')} *`} name="newPassword" rules={{ required: t('profile.new_pwd_required'), minLength: { value: 6, message: t('profile.pwd_min_length') } }} show={showNew} onToggle={() => setShowNew(!showNew)} placeholder={t('profile.placeholder_pwd')} autoComplete="new-password" />
        <PwField label={`${t('profile.confirm_new_pwd')} *`} name="confirmPassword" rules={{ required: t('profile.confirm_pwd_required'), validate: v => v === newPassword || t('profile.pwd_mismatch') }} show={showConfirm} onToggle={() => setShowConfirm(!showConfirm)} autoComplete="new-password" />
        <button type="submit" className="btn btn-primary" disabled={mutation.isPending} style={{ alignSelf: 'flex-start' }}>
          <Lock size={15} /> {mutation.isPending ? t('profile.saving') : t('profile.change_pwd')}
        </button>
      </form>
    </div>
  );
}

function UserProfileContent() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('profile');
  const { user: storeUser, updateUser, logout, isAuthenticated } = useUserStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push('/login');
    }
  }, [mounted, isAuthenticated, router]);

  useEffect(() => {
    if (tabParam && TABS.some(t => t.key === tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const { data: user, isLoading } = useQuery({
    queryKey: ['user-me'],
    queryFn: getUserMe,
    enabled: mounted && isAuthenticated,
  });

  const displayUser = user || storeUser;

  const handleLogout = () => {
    logout();
    toast.success(t('auth.logout') + ' ' + 'thành công');
    router.push('/');
  };

  // 1. Render a loader on SSR and initial client pass to prevent text hydration mismatch
  if (!mounted) {
    return (
      <div style={{ minHeight: 'calc(100vh - var(--nav-height))', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)' }}>
        <div style={{ width: 40, height: 40, border: '3px solid rgba(255,107,0,0.2)', borderTopColor: 'var(--color-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // 2. Client-only checks after mounting
  if (!isAuthenticated) return <div style={{ paddingTop: 'calc(var(--nav-height) + 5rem)', textAlign: 'center', color: 'var(--color-text-muted)' }}>{t('profile.redirecting')}</div>;
  if (isLoading) return <div style={{ paddingTop: 'calc(var(--nav-height) + 5rem)', textAlign: 'center', color: 'var(--color-text-muted)' }}>{t('profile.loading')}</div>;

  return (
    <div style={{ minHeight: 'calc(100vh - var(--nav-height))', paddingTop: 'calc(var(--nav-height) + 2.5rem)', paddingBottom: '3rem' }}>
      <div className="container">
        <div className="grid-split-sidebar" style={{ gap: '2rem', alignItems: 'start' }}>
          {/* Sidebar */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} className="profile-sidebar">
            {/* User info */}
            <div className="profile-user-info">
              <div style={{ width: 64, height: 64, background: 'linear-gradient(135deg, var(--color-primary), #FF8C42)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-heading)', margin: '0 auto 1rem' }}>
                {displayUser?.fullName?.[0]?.toUpperCase() || 'U'}
              </div>
              <p style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem', marginBottom: '0.25rem' }}>{displayUser?.fullName}</p>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.78rem', wordBreak: 'break-all' }}>{displayUser?.email}</p>
            </div>
            {/* Tabs */}
            <div className="profile-tabs">
              {TABS.map(tab => (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                  className="profile-tab-btn"
                  style={{
                    background: activeTab === tab.key ? 'var(--color-primary-glow)' : 'transparent',
                    color: activeTab === tab.key ? 'var(--color-primary)' : 'var(--color-text-muted)',
                    fontWeight: activeTab === tab.key ? 700 : 500, fontSize: '0.875rem',
                  }}>
                  <tab.icon size={16} />{t(tab.labelKey)}
                </button>
              ))}
              <div className="profile-logout-container">
                <button onClick={handleLogout} className="profile-logout-btn">
                  <LogOut size={16} /> {t('profile.logout')}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="profile-content">
            <h2 style={{ fontFamily: 'var(--font-heading)', color: '#fff', marginBottom: '2rem', fontSize: '1.2rem' }}>
              {t(TABS.find(t => t.key === activeTab)?.labelKey)}
            </h2>
            {activeTab === 'profile' && <ProfileTab user={displayUser} onUpdate={updateUser} />}
            {activeTab === 'history' && <HistoryTab />}
            {activeTab === 'security' && <SecurityTab />}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function UserProfilePage() {
  const { t } = useTranslation();
  return (
    <Suspense fallback={<div style={{ padding: '5rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>{t('profile.loading')}</div>}>
      <UserProfileContent />
    </Suspense>
  );
}
