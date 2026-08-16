'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { ArrowLeft, Download, Send, X, BookOpen, Lock } from 'lucide-react';
import { getCourseBySlug, submitCourseQuote } from '../../../../services/api';
import { useUserStore } from '../../../../store/userStore';

export default function DocumentDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [showQuote, setShowQuote] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const { data: course, isLoading, error } = useQuery({ queryKey: ['course', slug], queryFn: () => getCourseBySlug(slug) });
  const { user, isAuthenticated } = useUserStore();
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.fullName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      company: user?.company || '',
    }
  });

  // Auto pre-fill form when user is loaded or modal opens
  useEffect(() => {
    if (user) {
      reset({
        name: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        company: user.company || '',
      });
    }
  }, [user, reset]);

  const checkUserAuth = () => {
    if (typeof window === 'undefined') return false;
    try {
      const raw = localStorage.getItem('thanhtdh_user');
      if (!raw) return false;
      const parsed = JSON.parse(raw);
      return Boolean(parsed?.state?.token || parsed?.state?.isAuthenticated);
    } catch {
      return false;
    }
  };

  // Auto-open modal when redirected from Expired Link Notice Page (?openQuote=true)
  useEffect(() => {
    if (searchParams && (searchParams.get('openQuote') === 'true' || searchParams.get('action') === 'request')) {
      const isLogged = isAuthenticated || checkUserAuth();
      if (isLogged) {
        setShowQuote(true);
      } else {
        toast.error(lang === 'vi' ? 'Vui lòng đăng nhập để nhận tài liệu' : 'Please log in to receive documents');
        router.push(`/login?redirect=/documents/${slug}?openQuote=true`);
      }
    }
  }, [searchParams, isAuthenticated, slug, lang, router]);

  const mutation = useMutation({
    mutationFn: (data) => submitCourseQuote(slug, { ...data, lang }),
    onSuccess: () => {
      toast.success(lang === 'vi' ? 'Yêu cầu thành công! Link tải tài liệu đã được gửi tới email của bạn.' : 'Success! Document link has been sent to your email.');
      reset();
      setShowQuote(false);
    },
    onError: () => toast.error(t('form.error')),
  });

  const handleRequestClick = () => {
    const isLogged = isAuthenticated || checkUserAuth();
    if (!isLogged) {
      toast.error(lang === 'vi' ? 'Vui lòng đăng nhập để nhận tài liệu này!' : 'Please log in to receive this document!');
      router.push(`/login?redirect=/documents/${slug}`);
      return;
    }
    setShowQuote(true);
  };

  if (isLoading) return <div style={{ padding: '10rem 0', textAlign: 'center', color: 'var(--color-text-muted)' }}>{t('common.loading')}</div>;
  if (error || !course) return <div style={{ padding: '10rem 0', textAlign: 'center', color: 'var(--color-text-muted)' }}>{t('common.error')}</div>;

  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg, #0A0A0A, #1A0800)', padding: 'calc(var(--nav-height) + 2.5rem) 0 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: 0, top: 0, width: 400, height: 400, background: 'var(--color-primary)', filter: 'blur(120px)', opacity: 0.07, borderRadius: '50%' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <Link href="/documents" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '0.5rem', marginBottom: '2rem', transition: 'color 0.2s' }}>
            <ArrowLeft size={16} /> {t('common.back')}
          </Link>
          <div className="grid-split-2" style={{ gap: '4rem', paddingBottom: '5rem' }}>
            {/* Images */}
            <div>
              <div style={{ aspectRatio: '1', background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', marginBottom: '1rem', border: '1px solid var(--color-border-muted)' }}>
                {course.images?.[activeImg] ? (
                  <img src={`/uploads/images/${course.images[activeImg]}`} alt={course.nameVi} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '1rem' }} />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}><BookOpen size={80} color="rgba(255,107,0,0.2)" /></div>
                )}
              </div>
              {course.images?.length > 1 && (
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  {course.images.map((img, i) => (
                    <button key={i} onClick={() => setActiveImg(i)} style={{ width: 72, height: 72, background: 'var(--color-surface)', border: `2px solid ${activeImg === i ? 'var(--color-primary)' : 'var(--color-border-muted)'}`, borderRadius: 'var(--radius-md)', overflow: 'hidden', padding: 0, cursor: 'pointer', transition: 'border-color 0.2s' }}>
                      <img src={`/uploads/images/${img}`} alt={`${i+1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                {(lang === 'vi' ? course.categoryVi : course.categoryEn) && <span className="tag">{lang === 'vi' ? course.categoryVi : course.categoryEn}</span>}
                <span style={{ background: 'rgba(255,107,0,0.12)', color: '#FFB380', border: '1px solid rgba(255,107,0,0.3)', fontSize: '0.78rem', fontWeight: 600, padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  📥 {course.requestCount || 0} {lang === 'vi' ? 'yêu cầu' : 'requests'}
                </span>
              </div>
              <h1 style={{ fontFamily: 'var(--font-heading)', color: '#fff', marginBottom: '1rem', fontSize: 'clamp(1.5rem, 3vw, 2.2rem)' }}>
                {lang === 'vi' ? course.nameVi : course.nameEn}
              </h1>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7, marginBottom: '2rem', whiteSpace: 'pre-line' }}>
                {lang === 'vi' ? course.descriptionVi : course.descriptionEn}
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button onClick={handleRequestClick} className="btn btn-primary btn-lg" style={{ flex: 1, justifyContent: 'center' }}>
                  {!isAuthenticated && <Lock size={16} />} <Send size={16} /> {t('courses.quote')}
                </button>
                {course.catalogUrl && (
                  <a href={`/uploads/catalogs/${course.catalogUrl}`} download className="btn btn-outline btn-lg">
                    <Download size={16} /> {t('courses.download')}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications */}
      {course.specifications?.length > 0 && (
        <div className="section">
          <div className="container">
            <h2 style={{ fontFamily: 'var(--font-heading)', color: '#fff', marginBottom: '2rem' }}>{t('courses.specs')}</h2>
            <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-muted)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
              <table className="admin-table" style={{ margin: 0 }}>
                <tbody>
                  {course.specifications.map((spec, i) => (
                    <motion.tr key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                      <td style={{ width: '40%', fontWeight: 600, color: 'var(--color-text-muted)', background: 'var(--color-bg-2)', borderBottom: '1px solid var(--color-border-muted)', padding: '1rem 1.5rem' }}>
                        {lang === 'vi' ? spec.labelVi : spec.labelEn}
                      </td>
                      <td style={{ color: '#fff', borderBottom: '1px solid var(--color-border-muted)', padding: '1rem 1.5rem' }}>{spec.value}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Quote Modal */}
      {showQuote && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(8px)' }}>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ background: 'var(--color-bg-2)', border: '1px solid var(--color-border-muted)', borderRadius: 'var(--radius-xl)', padding: '2.5rem', width: '100%', maxWidth: 480, position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
            <button onClick={() => setShowQuote(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'var(--color-surface)', border: '1px solid var(--color-border-muted)', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--color-text-muted)' }}><X size={18} /></button>
            <h3 style={{ fontFamily: 'var(--font-heading)', color: '#fff', marginBottom: '1.75rem' }}>{t('courses.quote')}</h3>
            <form onSubmit={handleSubmit(d => mutation.mutate(d))} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { name: 'name', label: t('form.name'), required: true, placeholder: 'Nguyễn Văn A' },
                { name: 'email', label: t('form.email'), required: true, placeholder: 'email@company.com', type: 'email', note: t('courses.email_note') },
                { name: 'phone', label: t('form.phone'), placeholder: t('profile.placeholder_phone') },
              ].map(f => (
                <div key={f.name} className="form-group">
                  <label className="form-label">{f.label}{f.required && ' *'}</label>
                  <input {...register(f.name, f.required ? { required: true } : {})} type={f.type || 'text'} className="form-input" placeholder={f.placeholder} />
                  {errors[f.name] && <span className="form-error">{t('form.required')}</span>}
                  {f.note && <span style={{ fontSize: '0.78rem', color: 'var(--color-primary)', marginTop: '0.35rem', display: 'block', fontWeight: 600 }}>{f.note}</span>}
                </div>
              ))}
              <div className="form-group">
                <label className="form-label">{t('courses.interested')}</label>
                <input className="form-input" value={lang === 'vi' ? course.nameVi : course.nameEn} disabled style={{ opacity: 0.7, cursor: 'not-allowed', background: 'rgba(255,255,255,0.02)' }} />
              </div>
              <div className="form-group">
                <label className="form-label">{t('form.message')}</label>
                <textarea {...register('message')} className="form-textarea" rows={3} placeholder={t('form.placeholder_message_product')} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center' }} disabled={mutation.isPending}>
                {mutation.isPending ? t('form.submitting') : <><Send size={16} /> {t('courses.quote')}</>}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
