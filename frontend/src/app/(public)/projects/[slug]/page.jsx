'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { getProjectBySlug } from '../../../../services/api';
import { ArrowLeft, AlertTriangle, Lightbulb, TrendingUp } from 'lucide-react';

export default function ProjectDetailPage() {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const { data: project, isLoading, error } = useQuery({ queryKey: ['project', slug], queryFn: () => getProjectBySlug(slug) });

  if (isLoading) return <div style={{ padding: '10rem 0', textAlign: 'center', color: 'var(--color-text-muted)' }}>{t('common.loading')}</div>;
  if (error || !project) return <div style={{ padding: '10rem 0', textAlign: 'center', color: 'var(--color-text-muted)' }}>{t('common.error')}</div>;

  return (
    <div>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #0A0A0A, #1A0800)', padding: 'calc(var(--nav-height) + 2.5rem) 0 4rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: '-5%', top: '20%', width: 400, height: 400, background: 'var(--color-primary)', filter: 'blur(120px)', opacity: 0.08, borderRadius: '50%' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <Link href="/projects" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '0.5rem', marginBottom: '1.5rem', transition: 'color 0.2s' }}>
            <ArrowLeft size={16} /> {t('common.back')}
          </Link>
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            {project.client && <span className="tag tag-primary">{project.client}</span>}
            {(lang === 'vi' ? project.industryVi : project.industryEn) && <span className="tag">{lang === 'vi' ? project.industryVi : project.industryEn}</span>}
          </div>
          <h1 style={{ background: 'linear-gradient(135deg, #fff, #FFB380)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: '1.25rem', maxWidth: 750 }}>
            {lang === 'vi' ? project.titleVi : project.titleEn}
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem', lineHeight: 1.7, maxWidth: 650, whiteSpace: 'pre-line' }}>
            {lang === 'vi' ? project.descriptionVi : project.descriptionEn}
          </p>
        </div>
      </div>

      <div className="section">
        <div className="container">
          {/* Images */}
          {project.images?.length > 0 && (
            <div style={{ marginBottom: '4rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: project.images.length === 1 ? '1fr' : 'repeat(2, 1fr)', gap: '1rem' }}>
                {project.images.map((img, i) => (
                  <div key={i} style={{ aspectRatio: '16/9', borderRadius: 'var(--radius-xl)', overflow: 'hidden', background: 'var(--color-surface)' }}>
                    <img src={`/uploads/images/${img}`} alt={`${project.titleVi} ${i+1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Before / After */}
          {(project.beforeImage || project.afterImage) && (
            <div style={{ marginBottom: '4rem' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: '#fff', marginBottom: '1.5rem' }}>Before / After</h2>
              <div className="grid-2">
                {project.beforeImage && (
                  <div>
                    <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-md)', padding: '0.5rem 1rem', marginBottom: '0.75rem', display: 'inline-block', color: '#EF4444', fontSize: '0.85rem', fontWeight: 600 }}>
                      {t('projects.before')}
                    </div>
                    <div style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', aspectRatio: '16/9' }}>
                      <img src={`/uploads/images/${project.beforeImage}`} alt="Before" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  </div>
                )}
                {project.afterImage && (
                  <div>
                    <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 'var(--radius-md)', padding: '0.5rem 1rem', marginBottom: '0.75rem', display: 'inline-block', color: '#22C55E', fontSize: '0.85rem', fontWeight: 600 }}>
                      {t('projects.after')}
                    </div>
                    <div style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', aspectRatio: '16/9' }}>
                      <img src={`/uploads/images/${project.afterImage}`} alt="After" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Challenge / Solution / Result */}
          <div className="grid-3" style={{ marginBottom: '4rem' }}>
            {[
              { icon: AlertTriangle, title: t('projects.challenge'), content: lang === 'vi' ? project.challengeVi : project.challengeEn, color: '#F59E0B' },
              { icon: Lightbulb, title: t('projects.solution'), content: lang === 'vi' ? project.solutionVi : project.solutionEn, color: 'var(--color-primary)' },
              { icon: TrendingUp, title: t('projects.result'), content: lang === 'vi' ? project.resultVi : project.resultEn, color: '#22C55E' },
            ].filter(s => s.content).map((section, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                style={{ background: 'var(--color-surface)', border: `1px solid ${section.color}30`, borderRadius: 'var(--radius-xl)', padding: '2rem' }}>
                <div style={{ width: 48, height: 48, background: `${section.color}20`, border: `1px solid ${section.color}50`, borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', color: section.color }}>
                  <section.icon size={22} />
                </div>
                <h3 style={{ fontFamily: 'var(--font-heading)', color: '#fff', marginBottom: '0.875rem', fontSize: '1rem' }}>{section.title}</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: 1.7, whiteSpace: 'pre-line' }}>{section.content}</p>
              </motion.div>
            ))}
          </div>

          {/* Technologies */}
          {project.technologies?.length > 0 && (
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: '#fff', marginBottom: '1.25rem' }}>{t('projects.technologies')}</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {project.technologies.map(tech => (<span key={tech} className="tag tag-primary">{tech}</span>))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
