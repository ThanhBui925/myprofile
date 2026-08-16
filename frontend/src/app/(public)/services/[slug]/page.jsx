'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { ArrowLeft, CheckCircle, Send, X } from 'lucide-react';
import { getServiceBySlug, submitConsultation } from '../../../../services/api';
import { useUserStore } from '../../../../store/userStore';

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [showForm, setShowForm] = useState(false);
  const { data: service, isLoading, error } = useQuery({ queryKey: ['service', slug], queryFn: () => getServiceBySlug(slug) });
  const { user } = useUserStore();
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.fullName || '',
      email: user?.email || '',
      phone: user?.phone || ''
    }
  });
  const mutation = useMutation({
    mutationFn: (data) => submitConsultation(slug, { ...data, lang }),
    onSuccess: () => { toast.success(t('form.consult_success')); reset(); setShowForm(false); },
    onError: () => toast.error(t('form.error')),
  });

  if (isLoading) return <div style={{ padding: '10rem 0', textAlign: 'center', color: 'var(--color-text-muted)' }}>{t('common.loading')}</div>;
  if (error || !service) return <div style={{ padding: '10rem 0', textAlign: 'center', color: 'var(--color-text-muted)' }}>{t('common.error')}</div>;

  return (
    <div>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #0A0A0A, #1A0800)', padding: '6rem 0 4rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: 0, top: 0, width: 500, height: 500, background: 'var(--color-primary)', filter: 'blur(150px)', opacity: 0.07, borderRadius: '50%' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <Link href="/services" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem', transition: 'color 0.2s' }}
            onMouseEnter={e => e.target.style.color = 'var(--color-primary)'} onMouseLeave={e => e.target.style.color = 'var(--color-text-muted)'}>
            <ArrowLeft size={16} /> {t('common.back')}
          </Link>

          <h1 style={{ background: 'linear-gradient(135deg, #fff, #FFB380)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: '1.5rem', maxWidth: 700 }}>
            {lang === 'vi' ? service.nameVi : service.nameEn}
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem', maxWidth: 650, lineHeight: 1.7, marginBottom: '2rem', whiteSpace: 'pre-line' }}>
            {lang === 'vi' ? service.descriptionVi : service.descriptionEn}
          </p>
          <button onClick={() => setShowForm(true)} className="btn btn-primary btn-lg">
            {t('services.consult')} <Send size={16} />
          </button>
        </div>
      </div>

      <div className="section">
        <div className="container">
          <div className="grid-split-2-1" style={{ gap: '3rem' }}>
            <div>
              {/* Features */}
              {((lang === 'vi' ? service.featuresVi : service.featuresEn) || []).length > 0 && (
                <div style={{ marginBottom: '3rem' }}>
                  <h2 style={{ fontFamily: 'var(--font-heading)', color: '#fff', marginBottom: '1.5rem' }}>{t('services.features')}</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                    {(lang === 'vi' ? service.featuresVi : service.featuresEn).map((f, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', color: 'var(--color-text-muted)', fontSize: '1rem' }}>
                        <CheckCircle size={18} color="var(--color-primary)" style={{ flexShrink: 0 }} />
                        {f}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Image Gallery */}
              {service.images?.length > 0 && (
                <div>
                  <h2 style={{ fontFamily: 'var(--font-heading)', color: '#fff', marginBottom: '1.5rem' }}>{t('services.images')}</h2>
                  <div className="grid-split-2" style={{ gap: '1rem' }}>
                    {service.images.map((img, i) => (
                      <div key={i} style={{ aspectRatio: '16/9', background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                        <img src={`/uploads/images/${img}`} alt={`${service.nameVi} ${i+1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div style={{ position: 'sticky', top: 'calc(var(--nav-height) + 2rem)', alignSelf: 'start' }}>
              <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-muted)', borderRadius: 'var(--radius-xl)', padding: '2rem', marginBottom: '1.5rem' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', color: '#fff', marginBottom: '1.25rem', fontSize: '1.05rem' }}>{t('services.technologies')}</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {(service.technologies || []).map(tech => (<span key={tech} className="tag tag-primary">{tech}</span>))}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button onClick={() => setShowForm(true)} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  {t('services.consult')} <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Consultation Modal */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(8px)' }}>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ background: 'var(--color-bg-2)', border: '1px solid var(--color-border-muted)', borderRadius: 'var(--radius-xl)', padding: '2.5rem', width: '100%', maxWidth: 480, position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
            <button onClick={() => setShowForm(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'var(--color-surface)', border: '1px solid var(--color-border-muted)', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--color-text-muted)' }}><X size={18} /></button>
            <h3 style={{ fontFamily: 'var(--font-heading)', color: '#fff', marginBottom: '1.75rem' }}>{t('services.consult')}</h3>
            <form onSubmit={handleSubmit(d => mutation.mutate(d))} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { name: 'name', label: t('form.name'), required: true, placeholder: 'Nguyễn Văn A' },
                { name: 'email', label: t('form.email'), required: true, placeholder: 'email@company.com', type: 'email' },
                { name: 'phone', label: t('form.phone'), placeholder: t('profile.placeholder_phone') },
              ].map(f => (
                <div key={f.name} className="form-group">
                  <label className="form-label">{f.label}{f.required && ' *'}</label>
                  <input {...register(f.name, f.required ? { required: true } : {})} type={f.type || 'text'} className="form-input" placeholder={f.placeholder} />
                  {errors[f.name] && <span className="form-error">{t('form.required')}</span>}
                </div>
              ))}
              <div className="form-group">
                <label className="form-label">{t('form.service')}</label>
                <input className="form-input" value={lang === 'vi' ? service.nameVi : service.nameEn} disabled style={{ opacity: 0.7, cursor: 'not-allowed', background: 'rgba(255,255,255,0.02)' }} />
              </div>
              <div className="form-group">
                <label className="form-label">{t('form.message')}</label>
                <textarea {...register('message')} className="form-textarea" rows={3} placeholder={t('form.placeholder_message_service')} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center' }} disabled={mutation.isPending}>
                {mutation.isPending ? t('form.submitting') : <>{t('form.submit')} <Send size={16} /></>}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
