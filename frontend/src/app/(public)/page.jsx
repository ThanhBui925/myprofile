'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion, useInView } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import {
  ArrowRight, Play, Pause, Settings, Eye, Cpu, Zap,
  Truck, Monitor, ChevronRight, Send, MapPin, Phone, Mail
} from 'lucide-react';
import {
  getBanners, getServices, getProjects, getProducts, getPartners, submitContact, getCompany
} from '../../services/api';
import { useUserStore } from '../../store/userStore';
import Hero3DScene from '../../components/home/Hero3DScene';

// Icon map for services
const iconMap = { Settings, Eye, Cpu, Zap, Truck, Monitor };

// ─── Animated Counter ───────────────────────────────────────────────────────
function Counter({ target, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1800;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);
  return <span ref={ref}>{count}{suffix}</span>;
}

// ─── Section Wrapper with animation ──────────────────────────────────────────
function Section({ children, className = '', id }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.section
      id={id}
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`section ${className}`}
    >
      {children}
    </motion.section>
  );
}

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const videoRef = useRef(null);
  const [videoMuted, setVideoMuted] = useState(true);
  
  const { data: company } = useQuery({ queryKey: ['company'], queryFn: getCompany });
  const appName = company ? (lang === 'vi' ? company.nameVi : company.nameEn) || company.nameVi || '' : '';

  const parseYearOnly = (str) => {
    if (!str) return NaN;
    const match = String(str).match(/\b(19\d{2}|20\d{2})\b/);
    return match ? parseInt(match[0]) : parseInt(str);
  };

  const historyYears = company?.history?.map(h => parseYearOnly(h.year)).filter(y => !isNaN(y)) || [];
  const minYear = historyYears.length > 0 ? Math.min(...historyYears) : parseYearOnly(company?.founded || 2015);
  const maxYear = historyYears.length > 0 ? Math.max(...historyYears) : new Date().getFullYear();
  const yearsOfExp = Math.max(0, maxYear - minYear);

  const { data: banners = [] } = useQuery({ queryKey: ['banners'], queryFn: getBanners });
  const { data: services = [] } = useQuery({ queryKey: ['services'], queryFn: getServices });
  const { data: featuredProjects = [], isLoading: isLoadingFeatured } = useQuery({
    queryKey: ['projects', 'featured'],
    queryFn: () => getProjects({ featured: 'true', limit: 3 })
  });
  const { data: allProjects = [], isLoading: isLoadingAll } = useQuery({ 
    queryKey: ['projects', 'all'], 
    queryFn: () => getProjects() 
  });
  
  const displayedProjects = featuredProjects.length > 0 ? featuredProjects : allProjects.slice(0, 3);
  const showSkeleton = isLoadingFeatured || (featuredProjects.length === 0 && isLoadingAll);
  const { data: featuredProducts = [] } = useQuery({ queryKey: ['products', 'featured'], queryFn: () => getProducts() });
  const { data: partners = [] } = useQuery({ queryKey: ['partners'], queryFn: getPartners });

  const user = useUserStore(state => state.user);
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.fullName || user?.name || '',
      email: user?.email || '',
      phone: user?.phone || ''
    }
  });

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    if (user) {
      reset({ name: user.fullName || user.name || '', email: user.email || '', phone: user.phone || '' });
    }
  }, [user, reset]);

  const mutation = useMutation({
    mutationFn: submitContact,
    onSuccess: () => { toast.success(t('form.success')); reset(); },
    onError: () => toast.error(t('form.error')),
  });

  const toggleVideoMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoMuted;
      setVideoMuted(!videoMuted);
    }
  };

  return (
    <div>
      {/* ─── HERO 3D SCENE BANNER ───────────────────────────────────────────────── */}
      <Hero3DScene appName={appName} totalProjects={allProjects.length || 3} yearsOfExp={yearsOfExp || 5} />

      {/* ─── STATS ───────────────────────────────────────────────────────── */}
      <Section style={{ background: 'var(--color-bg-2)' }}>
        <div style={{ background: 'var(--color-bg-2)', padding: '4rem 0' }}>
          <div className="container">
            <div className="grid-2" style={{ gap: '2rem' }}>
              {[
                { value: allProjects.length, suffix: '+', label: t('home.stats_projects') },
                { value: yearsOfExp, suffix: '+', label: t('home.stats_years') },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  style={{
                    textAlign: 'center',
                    padding: '2rem',
                    background: 'var(--color-surface)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--color-border-muted)',
                  }}
                >
                  <div style={{
                    fontSize: 'clamp(2.5rem, 4vw, 3.5rem)',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 800,
                    color: 'var(--color-primary)',
                    lineHeight: 1,
                    marginBottom: '0.5rem',
                  }}>
                    <Counter target={stat.value} suffix={stat.suffix} />
                  </div>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', margin: 0 }}>{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Section>






      {/* ─── PROJECTS ─────────────────────────────────────────────────────── */}
      <Section>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t('home.projects_title')}</h2>
          </div>
          <div className="grid-3">
            {showSkeleton && [1,2,3].map(i => (
              <div key={i} className="card" style={{ aspectRatio: '4/3' }}>
                <div className="skeleton" style={{ height: '100%' }} />
              </div>
            ))}
            {!showSkeleton && displayedProjects.map((project, i) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
              >
                <Link href={`/projects/${project.slug}`} style={{ display: 'block' }}>
                  <div className="card img-overlay" style={{ aspectRatio: '4/3', position: 'relative' }}>
                    {project.images?.[0] ? (
                      <img src={`/uploads/images/${project.images[0]}`} alt={project.titleVi} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #1A1A1A, #2A1500)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Settings size={48} color="var(--color-primary)" opacity={0.3} />
                      </div>
                    )}
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 60%)', zIndex: 1 }} />
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.5rem', zIndex: 2 }}>
                      {project.client && (
                        <span className="tag tag-primary" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>{project.client}</span>
                      )}
                      <h4 style={{ color: '#fff', fontFamily: 'var(--font-heading)', marginBottom: '0.5rem' }}>
                        {lang === 'vi' ? project.titleVi : project.titleEn}
                      </h4>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                        {(project.technologies || []).slice(0, 3).map(tech => (
                          <span key={tech} className="tag" style={{ fontSize: '0.72rem' }}>{tech}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
            {!showSkeleton && displayedProjects.length === 0 && (
              <p style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--color-text-muted)', padding: '3rem 0' }}>
                {lang === 'vi' ? 'Chưa có dự án nào' : 'No projects found'}
              </p>
            )}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link href="/projects" className="btn btn-outline">
              {lang === 'vi' ? 'Xem tất cả dự án' : 'View all projects'} <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </Section>



      {/* ─── PARTNERS ─────────────────────────────────────────────────────── */}
      {partners.length > 0 && (
        <div style={{ background: 'var(--color-bg-2)', padding: '2.5rem 0', position: 'relative', overflow: 'hidden' }}>
          
          <div style={{ position: 'relative', width: '100%', overflow: 'hidden', padding: '0.5rem 0' }}>
            {/* Scrolling track */}
            <div style={{
              display: 'flex',
              width: 'max-content',
              gap: '3rem',
              alignItems: 'center',
              animation: 'marquee 25s linear infinite',
            }}>
              {[...partners, ...partners, ...partners].map((p, i) => (
                <div key={i} style={{
                  padding: '0.85rem 2.5rem',
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border-muted)',
                  borderRadius: 'var(--radius-md)',
                  whiteSpace: 'nowrap',
                  color: 'var(--color-text-muted)',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  letterSpacing: '0.05em',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border-muted)'; e.currentTarget.style.color = 'var(--color-text-muted)'; }}>
                  {p.logoUrl ? <img src={p.logoUrl} alt={p.name} style={{ height: 32, filter: 'grayscale(1) brightness(0.8)' }} /> : p.name}
                </div>
              ))}
            </div>
          </div>
          <style>{`@keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-33.33%); } }`}</style>
        </div>
      )}

      {/* ─── CONTACT SECTION ──────────────────────────────────────────────── */}
      <Section>
        <div className="container">
          <div className="grid-split-2" style={{ gap: '4rem', alignItems: 'center' }}>
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>

              <h2 className="section-title" style={{ marginBottom: '2rem' }}>{t('home.contact_title')}</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[t('home.contact_form_reason1'), t('home.contact_form_reason2'), t('home.contact_form_reason3')].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
                    <div style={{ width: 22, height: 22, background: 'var(--color-primary-glow)', border: '1px solid var(--color-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ color: 'var(--color-primary)', fontSize: '0.7rem', fontWeight: 700 }}>✓</span>
                    </div>
                    {item}
                  </div>
                ))}
              </div>

              {/* Company Contact Info */}
              <div style={{ marginTop: '3rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: 48, height: 48, background: 'var(--color-surface)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', border: '1px solid var(--color-border-muted)' }}>
                    <MapPin size={22} />
                  </div>
                  <div>
                    <div style={{ color: '#fff', fontWeight: 600, marginBottom: '0.2rem' }}>{t('contact.address') || 'Address'}</div>
                    <div style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>{company?.address || 'Hanoi, Vietnam'}</div>
                  </div>
                </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: 48, height: 48, background: 'var(--color-surface)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', border: '1px solid var(--color-border-muted)' }}>
                    <Phone size={22} />
                  </div>
                  <div>
                    <div style={{ color: '#fff', fontWeight: 600, marginBottom: '0.2rem' }}>{t('contact.phone') || 'Phone'}</div>
                    <div style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>{company?.phone || '+84 123 456 789'}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: 48, height: 48, background: 'var(--color-surface)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', border: '1px solid var(--color-border-muted)' }}>
                    <Mail size={22} />
                  </div>
                  <div>
                    <div style={{ color: '#fff', fontWeight: 600, marginBottom: '0.2rem' }}>{t('contact.email') || 'Email'}</div>
                    <div style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>{company?.email || 'contact@example.com'}</div>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              {(!mounted) ? (
                <div style={{ height: 400, background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)' }} />
              ) : user ? (
                <form
                  onSubmit={handleSubmit(data => mutation.mutate(data))}
                  style={{
                    background: 'var(--color-surface)', border: '1px solid var(--color-border-muted)',
                    borderRadius: 'var(--radius-xl)', padding: '2.5rem',
                  }}
                >
                  <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '1.75rem', color: '#fff' }}>{t('home.contact_form_title')}</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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
                      <textarea {...register('message', { required: true })} className="form-textarea" rows={4} placeholder={t('form.placeholder_message_service')} />
                      {errors.message && <span className="form-error">{t('form.required')}</span>}
                    </div>
                    <input type="hidden" {...register('lang')} value={lang} />
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={mutation.isPending}>
                      {mutation.isPending ? t('form.submitting') : <>{t('form.submit')} <Send size={16} /></>}
                    </button>
                  </div>
                </form>
              ) : (
                <div
                  style={{
                    background: 'var(--color-surface)', border: '1px solid var(--color-border-muted)',
                    borderRadius: 'var(--radius-xl)', padding: '2.5rem',
                    textAlign: 'center',
                    paddingTop: '4rem',
                    paddingBottom: '4rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1.5rem'
                  }}
                >
                  <div style={{ fontSize: '3rem' }}>🔒</div>
                  <h3 style={{ fontFamily: 'var(--font-heading)', color: '#fff', margin: 0 }}>{t('home.contact_form_title')}</h3>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', margin: 0 }}>
                    {lang === 'vi' ? 'Vui lòng đăng nhập để gửi liên hệ với chúng tôi.' : 'Please log in to contact us.'}
                  </p>
                  <Link href="/login" className="btn btn-primary">
                    {lang === 'vi' ? 'Đăng nhập ngay' : 'Log In Now'} <Send size={14} />
                  </Link>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </Section>
    </div>
  );
}
