'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, LogIn, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useGoogleLogin } from '@react-oauth/google';
import { userLogin, userGoogleLogin, getCompany } from '../../../services/api';
import { useUserStore } from '../../../store/userStore';

function UserLoginForm() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useUserStore();
  const [showPassword, setShowPassword] = useState(false);

  const { data: company } = useQuery({ queryKey: ['company'], queryFn: getCompany });
  const appName = company ? (i18n.language === 'vi' ? company.nameVi : company.nameEn) || company.nameVi || 'THANHTDH' : 'THANHTDH';

  // Redirect after login
  const from = searchParams.get('redirect') || '/';

  const { register, handleSubmit, formState: { errors } } = useForm();

  const mutation = useMutation({
    mutationFn: userLogin,
    onSuccess: (data) => {
      login(data.token, data.user);
      toast.success(`Chào mừng trở lại, ${data.user.fullName}! 👋`);
      router.push(from);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Đăng nhập thất bại');
    },
  });

  const googleMutation = useMutation({
    mutationFn: userGoogleLogin,
    onSuccess: (data) => {
      login(data.token, data.user);
      toast.success(`Chào mừng, ${data.user.fullName}! 👋`);
      router.push(from);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Đăng nhập Google thất bại');
    },
  });

  const handleGoogleSuccess = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      googleMutation.mutate({ access_token: tokenResponse.access_token });
    },
    onError: () => {
      toast.error(t('auth.google_login_failed') || 'Google login failed');
    },
  });

  return (
    <div style={{
      minHeight: 'calc(100vh - var(--nav-height))',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
      background: 'var(--color-bg)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background glows */}
      <div style={{ position: 'absolute', top: '10%', left: '15%', width: 400, height: 400, background: 'var(--color-primary)', borderRadius: '50%', filter: 'blur(150px)', opacity: 0.05, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: 300, height: 300, background: '#3B82F6', borderRadius: '50%', filter: 'blur(120px)', opacity: 0.05, pointerEvents: 'none' }} />

      <div className="grid-split-2" style={{ width: '100%', maxWidth: 900, gap: '0', borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1px solid var(--color-border-muted)', boxShadow: '0 40px 100px rgba(0,0,0,0.5)' }}>
        {/* Left: Branding */}
        <div className="login-branding" style={{
          background: 'linear-gradient(135deg, #0F0500 0%, #1F0A00 50%, #0A0A0A 100%)',
          padding: '3.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', bottom: '-20%', right: '-20%', width: 350, height: 350, background: 'var(--color-primary)', borderRadius: '50%', filter: 'blur(100px)', opacity: 0.15 }} />
          
          <div>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem' }}>
              <div style={{ width: 44, height: 44, background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.2rem', color: '#fff', flexShrink: 0 }}>{appName[0]?.toUpperCase()}</div>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.3rem', letterSpacing: '0.08em', color: '#fff' }}>{appName}</span>
            </div>

            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800, color: '#fff', marginBottom: '1rem', lineHeight: 1.2 }}>
              {t('auth.welcome_back')}
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, fontSize: '0.95rem' }}>
              {t('auth.login_sub', { appName })}
            </p>
          </div>
        </div>

        {/* Right: Form */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          style={{ background: 'var(--color-bg-2)', padding: '3.5rem' }}
        >
          <div style={{ marginBottom: '2.5rem' }}>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.25rem', marginBottom: '0.5rem', color: '#fff' }}>{t('auth.login')}</h1>
            <p style={{ color: 'var(--color-text-muted)' }}>{t('auth.login_sub', { appName })}</p>
          </div>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '2.5rem' }}>
            {t('auth.no_account')}{' '}
            <Link href="/register" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{t('auth.register_now')}</Link>
          </p>

          <form onSubmit={handleSubmit(d => mutation.mutate(d))} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">{t('auth.email')}</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', pointerEvents: 'none' }} />
                <input
                  {...register('email', { required: t('form.required'), pattern: { value: /^\S+@\S+$/i, message: t('form.invalid_email') } })}
                  type="email"
                  className="form-input"
                  placeholder="email@company.com"
                  style={{ paddingLeft: '2.5rem' }}
                  autoComplete="email"
                />
              </div>
              {errors.email && <span className="form-error">{errors.email.message}</span>}
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label className="form-label" style={{ margin: 0 }}>{t('auth.password')}</label>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-primary)', cursor: 'pointer' }}>{t('auth.forgot_password')}</span>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', pointerEvents: 'none' }} />
                <input
                  {...register('password', { required: t('form.required') })}
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="••••••••"
                  style={{ paddingLeft: '2.5rem', paddingRight: '2.75rem' }}
                  autoComplete="current-password"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', padding: 0 }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <span className="form-error">{errors.password.message}</span>}
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.875rem', marginTop: '0.5rem' }} disabled={mutation.isPending}>
              {mutation.isPending ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  {t('auth.logging_in')}
                </span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <LogIn size={16} /> {t('auth.login')}
                </span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', margin: '2rem 0' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--color-border-muted)' }} />
            <span style={{ padding: '0 1rem', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>{t('auth.or')}</span>
            <div style={{ flex: 1, height: 1, background: 'var(--color-border-muted)' }} />
          </div>

          {/* Social Login Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: 360, margin: '0 auto', width: '100%' }}>
            <button
              type="button"
              onClick={() => handleGoogleSuccess()}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                width: '100%',
                padding: '0.75rem 1rem',
                background: '#1A1A1A',
                border: '1px solid var(--color-border-muted)',
                borderRadius: 'var(--radius-md)',
                color: '#fff',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#252525';
                e.currentTarget.style.borderColor = 'var(--color-primary)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = '#1A1A1A';
                e.currentTarget.style.borderColor = 'var(--color-border-muted)';
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>{t('auth.login_with_google')}</span>
            </button>
          </div>

          <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border-muted)', textAlign: 'center' }}>
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-text-muted)', fontSize: '0.875rem', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--color-text)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-muted)'}>
              {t('auth.back_to_home')} <ArrowRight size={14} />
            </Link>
          </div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </motion.div>
      </div>
    </div>
  );
}

export default function UserLoginPage() {
  return (
    <Suspense fallback={<div style={{ padding: '10rem 0', textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading...</div>}>
      <UserLoginForm />
    </Suspense>
  );
}
