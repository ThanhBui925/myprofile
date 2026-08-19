'use client';
import SubPageHero3D from '../../../components/common/SubPageHero3D';
import Link from 'next/link';

import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { submitContact, getCompany } from '../../../services/api';
import { useUserStore } from '../../../store/userStore';

export default function ContactPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const { user } = useUserStore();
  const { data: company } = useQuery({ queryKey: ['company'], queryFn: getCompany });
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.fullName || '',
      email: user?.email || '',
      phone: user?.phone || ''
    }
  });
  const mutation = useMutation({
    mutationFn: (data) => submitContact({ ...data, lang }),
    onSuccess: () => { toast.success(t('form.success')); reset(); },
    onError: () => toast.error(t('form.error')),
  });

  const appName = company ? (i18n.language === 'vi' ? company.nameVi : company.nameEn) || company.nameVi || 'THANHTDH' : 'THANHTDH';
  const address = company ? (i18n.language === 'vi' ? (company.addressVi || company.address || t('contact.address_value')) : (company.addressEn || t('contact.address_value'))) : t('contact.address_value');
  
  const contactInfo = [
    { icon: MapPin, label: t('contact.address'), value: address, color: 'var(--color-primary)' },
    { icon: Phone, label: t('contact.phone'), value: company?.phone || '0326160757', color: '#3B82F6' },
    { icon: Mail, label: t('contact.email'), value: company?.email || 'thanh.buitrung21@gmail.com', color: '#22C55E' },
    { icon: Clock, label: t('contact.hours'), value: t('contact.hours_value'), color: '#F59E0B' },
  ];

  return (
    <div>
      {/* Hero */}
      <SubPageHero3D>
        <h1 style={{ background: 'linear-gradient(135deg, #fff, #FFB380)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: '1rem' }}>
          {t('contact.title')}
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>{t('contact.sub')}</p>
      </SubPageHero3D>

      <div className="section">
        <div className="container">
          <div className="grid-split-1-15" style={{ gap: 'clamp(2rem, 5vw, 4rem)' }}>
            {/* Left: Contact Info */}
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: '#fff', marginBottom: '2.5rem' }}>{t('contact.info_title')}</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                {contactInfo.map((info, i) => (
                  <div key={i} style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                    <div style={{ width: 48, height: 48, background: `${info.color}15`, border: `1px solid ${info.color}40`, borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: info.color, flexShrink: 0 }}>
                      <info.icon size={20} />
                    </div>
                    <div>
                      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>{info.label}</p>
                      <p style={{ color: '#fff', fontSize: '0.95rem', lineHeight: 1.5 }}>{info.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '2.5rem', background: 'var(--color-surface)', border: '1px solid var(--color-border-muted)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', aspectRatio: '16/9' }}>
                <iframe
                  src={company?.mapUrl || (company?.address ? `https://www.google.com/maps?q=${encodeURIComponent(company.address)}&output=embed` : "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.1823!2d106.6297!3d10.8072!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDQ4JzI2LjAiTiAxMDbCsDM3JzQ2LjkiRQ!5e0!3m2!1svi!2svn!4v1")}
                  width="100%" height="100%" style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }} allowFullScreen loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade" title={`${appName} Location`}
                />
              </div>
            </motion.div>

            {/* Right: Form */}
            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-muted)', borderRadius: 'var(--radius-xl)', padding: 'clamp(1.5rem, 4vw, 2.5rem)' }}>
                <h2 style={{ fontFamily: 'var(--font-heading)', color: '#fff', marginBottom: '2rem' }}>{t('contact.form_heading')}</h2>
                {user ? (
                  <form onSubmit={handleSubmit(d => mutation.mutate(d))} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div className="grid-split-2" style={{ gap: '1rem' }}>
                      <div className="form-group">
                        <label className="form-label">{t('form.name')} *</label>
                        <input {...register('name', { required: true })} className="form-input" placeholder="Nguyễn Văn A" />
                        {errors.name && <span className="form-error">{t('form.required')}</span>}
                      </div>
                      <div className="form-group">
                        <label className="form-label">{t('form.phone')}</label>
                        <input {...register('phone')} className="form-input" placeholder={t('profile.placeholder_phone')} />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">{t('form.email')} *</label>
                      <input {...register('email', { required: true, pattern: /^\S+@\S+$/i })} type="email" className="form-input" placeholder="email@company.com" />
                      {errors.email && <span className="form-error">{t('form.invalid_email')}</span>}
                    </div>
                    <div className="form-group">
                      <label className="form-label">{t('form.message')} *</label>
                      <textarea {...register('message', { required: true })} className="form-textarea" rows={5} placeholder={t('form.placeholder_message_service')} />
                      {errors.message && <span className="form-error">{t('form.required')}</span>}
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center', padding: '0.875rem' }} disabled={mutation.isPending}>
                      {mutation.isPending ? t('form.submitting') : <>{t('form.submit')} <Send size={16} /></>}
                    </button>
                  </form>
                ) : (
                  <div style={{
                    textAlign: 'center',
                    padding: '3rem 1.5rem',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px dashed var(--color-border-muted)',
                    borderRadius: 'var(--radius-lg)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1.5rem'
                  }}>
                    <div style={{ fontSize: '3rem' }}>🔒</div>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', margin: 0 }}>
                      {lang === 'vi' ? 'Vui lòng đăng nhập để gửi liên hệ với chúng tôi.' : 'Please log in to contact us.'}
                    </p>
                    <Link href="/login" className="btn btn-primary">
                      {lang === 'vi' ? 'Đăng nhập ngay' : 'Log In Now'} <Send size={14} />
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
