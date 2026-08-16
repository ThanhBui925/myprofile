'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Phone, Building2, ArrowRight, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { useGoogleLogin } from '@react-oauth/google';
import { useTranslation } from 'react-i18next';
import { userRegister, userGoogleLogin, getCompany } from '../../../services/api';
import { useUserStore } from '../../../store/userStore';

export default function UserRegisterPage() {
  const router = useRouter();
  const { login } = useUserStore();
  const { t, i18n } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { data: company } = useQuery({ queryKey: ['company'], queryFn: getCompany });
  const appName = company ? (i18n.language === 'vi' ? company.nameVi : company.nameEn) || company.nameVi || 'THANHTDH' : 'THANHTDH';

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch('password');

  const mutation = useMutation({
    mutationFn: userRegister,
    onSuccess: (data) => {
      login(data.token, data.user);
      toast.success(`Đăng ký thành công! Chào mừng bạn đến với ${appName} 🎉`);
      router.push('/');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
    },
  });

  const googleMutation = useMutation({
    mutationFn: userGoogleLogin,
    onSuccess: (data) => {
      login(data.token, data.user);
      toast.success(`Đăng nhập thành công! Chào mừng bạn đến với ${appName} 🎉`);
      router.push('/');
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



  const onSubmit = ({ confirmPassword, ...data }) => {
    mutation.mutate(data);
  };

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
      <div style={{ position: 'absolute', top: '5%', right: '10%', width: 500, height: 500, background: 'var(--color-primary)', borderRadius: '50%', filter: 'blur(160px)', opacity: 0.05, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '5%', left: '5%', width: 300, height: 300, background: '#22C55E', borderRadius: '50%', filter: 'blur(120px)', opacity: 0.04, pointerEvents: 'none' }} />

      <div className="grid-split-2" style={{ width: '100%', maxWidth: 980, gap: '0', borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1px solid var(--color-border-muted)', boxShadow: '0 40px 100px rgba(0,0,0,0.5)' }}>
        {/* Left: Branding */}
        <div className="login-branding" style={{
          background: 'linear-gradient(160deg, #0A0A0A 0%, #1A0800 60%, #0F0500 100%)',
          padding: '3.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: '-10%', right: '-20%', width: 300, height: 300, background: 'var(--color-primary)', borderRadius: '50%', filter: 'blur(90px)', opacity: 0.12 }} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem' }}>
              <div style={{ width: 44, height: 44, background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.2rem', color: '#fff', flexShrink: 0 }}>{appName[0]?.toUpperCase()}</div>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.3rem', letterSpacing: '0.08em', color: '#fff' }}>{appName}</span>
            </div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.9rem', fontWeight: 800, color: '#fff', lineHeight: 1.25 }}>
              {t('auth.create_account_title')}
            </h2>
          </div>
        </div>

        {/* Right: Form */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          style={{ background: 'var(--color-bg-2)', padding: '3rem 3.5rem', overflowY: 'auto', maxHeight: '90vh' }}
        >
          <h1 style={{ fontFamily: 'var(--font-heading)', color: '#fff', fontSize: '1.65rem', fontWeight: 800, marginBottom: '0.5rem' }}>{t('auth.register_account')}</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '2rem' }}>
            {t('auth.already_have_account')}{' '}
            <Link href="/login" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{t('auth.login')}</Link>
          </p>

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            {/* Full Name */}
            <div className="form-group">
              <label className="form-label">{t('auth.full_name')} *</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', pointerEvents: 'none' }} />
                <input {...register('fullName', { required: t('form.required'), minLength: { value: 2, message: 'Tên phải ít nhất 2 ký tự' } })} className="form-input" placeholder={t('auth.placeholder_name')} style={{ paddingLeft: '2.5rem' }} />
              </div>
              {errors.fullName && <span className="form-error">{errors.fullName.message}</span>}
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label">{t('auth.email')} *</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', pointerEvents: 'none' }} />
                <input {...register('email', { required: t('form.required'), pattern: { value: /^\S+@\S+$/i, message: t('form.invalid_email') } })} type="email" className="form-input" placeholder="email@company.com" style={{ paddingLeft: '2.5rem' }} autoComplete="email" />
              </div>
              {errors.email && <span className="form-error">{errors.email.message}</span>}
            </div>

            {/* Phone + Company */}
            <div className="grid-split-2" style={{ gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">{t('auth.phone')}</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', pointerEvents: 'none' }} />
                  <input {...register('phone')} className="form-input" placeholder="0901 234 567" style={{ paddingLeft: '2.5rem' }} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">{t('auth.company')}</label>
                <div style={{ position: 'relative' }}>
                  <Building2 size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', pointerEvents: 'none' }} />
                  <input {...register('company')} className="form-input" placeholder={t('auth.placeholder_company')} style={{ paddingLeft: '2.5rem' }} />
                </div>
              </div>
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label">{t('auth.password')} *</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', pointerEvents: 'none' }} />
                <input
                  {...register('password', {
                    required: t('form.required'),
                    minLength: { value: 6, message: 'Mật khẩu phải ít nhất 6 ký tự' },
                  })}
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder={t('auth.placeholder_password')}
                  style={{ paddingLeft: '2.5rem', paddingRight: '2.75rem' }}
                  autoComplete="new-password"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', padding: 0 }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <span className="form-error">{errors.password.message}</span>}
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label className="form-label">{t('auth.confirm_password')} *</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', pointerEvents: 'none' }} />
                <input
                  {...register('confirmPassword', {
                    required: t('form.required'),
                    validate: val => val === password || 'Mật khẩu không khớp',
                  })}
                  type={showConfirm ? 'text' : 'password'}
                  className="form-input"
                  placeholder={t('auth.placeholder_confirm_password')}
                  style={{ paddingLeft: '2.5rem', paddingRight: '2.75rem' }}
                  autoComplete="new-password"
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', padding: 0 }}>
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && <span className="form-error">{errors.confirmPassword.message}</span>}
            </div>

            {/* Terms */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.875rem 1rem', background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-muted)' }}>
              <input
                {...register('terms', { required: t('form.required') })}
                type="checkbox"
                id="terms"
                style={{ accentColor: 'var(--color-primary)', marginTop: '0.125rem', width: 16, height: 16, flexShrink: 0, cursor: 'pointer' }}
              />
              <label htmlFor="terms" style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', lineHeight: 1.5, cursor: 'pointer' }}>
                {t('auth.terms_agree')}{' '}
                <span style={{ color: 'var(--color-primary)' }}>{t('auth.terms_link')}</span>{' '}
                {t('auth.and')}{' '}
                <span style={{ color: 'var(--color-primary)' }}>{t('auth.privacy_link')}</span> {t('auth.of')} {appName}
              </label>
            </div>
            {errors.terms && <span className="form-error" style={{ marginTop: '-0.5rem' }}>{errors.terms.message}</span>}

            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.875rem', marginTop: '0.25rem' }} disabled={mutation.isPending}>
              {mutation.isPending ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  {t('auth.creating_account')}
                </span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <UserPlus size={16} /> {t('auth.create_free_account')}
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
              <span>{t('auth.signup_with_google')}</span>
            </button>
          </div>

          <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid var(--color-border-muted)', textAlign: 'center' }}>
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
              {t('auth.back_to_home')} <ArrowRight size={14} />
            </Link>
          </div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </motion.div>
      </div>
    </div>
  );
}
