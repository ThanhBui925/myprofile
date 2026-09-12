'use client';
import SubPageHero3D from '../../../components/common/SubPageHero3D';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { getProjects, getCompany } from '../../../services/api';
import { Settings, Filter } from 'lucide-react';

export default function ProjectsPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [filterIndustry, setFilterIndustry] = useState('');
  const [filterTech, setFilterTech] = useState('');

  const { data: company } = useQuery({ queryKey: ['company'], queryFn: getCompany });
  const appName = company ? (lang === 'vi' ? company.nameVi : company.nameEn) || company.nameVi || '' : '';

  const { data: allProjects = [] } = useQuery({ queryKey: ['projects', 'all'], queryFn: () => getProjects() });

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects', filterIndustry, filterTech],
    queryFn: () => getProjects({
      ...(filterIndustry && filterIndustry !== 'Tất cả' && filterIndustry !== 'All' ? { industry: filterIndustry } : {}),
      ...(filterTech && filterTech !== 'Tất cả' && filterTech !== 'All' ? { technology: filterTech } : {}),
    }),
  });

  const industriesVi = ['Tất cả', ...new Set(allProjects.map(p => p.industryVi).filter(Boolean))];
  const industriesEn = ['All', ...new Set(allProjects.map(p => p.industryEn).filter(Boolean))];
  const dynamicIndustries = lang === 'vi' ? industriesVi : industriesEn;
  const dynamicTechs = ['Tất cả', ...new Set(allProjects.flatMap(p => p.technologies || []).filter(Boolean))];

  return (
    <div>
      <SubPageHero3D>
        <h1 style={{ fontFamily: 'var(--font-heading)', marginBottom: '0.5rem', color: '#fff' }}>{t('projects.title')}</h1>
        <p style={{ color: 'rgba(255,255,255,0.92)', fontSize: '1.1rem', textShadow: '0 1px 8px rgba(0,0,0,0.7)' }}>{lang === 'vi' ? `Các dự án tự động hóa tiêu biểu ${appName} đã triển khai` : `Featured automation projects implemented by ${appName}`}</p>
      </SubPageHero3D>

      <div className="section">
        <div className="container">
          {/* Filters */}
          <div style={{ marginBottom: '3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.875rem', fontWeight: 600 }}>
                <Filter size={14} /> {t('projects.filter_industry')}:
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {dynamicIndustries.map(ind => (
                  <button key={ind} onClick={() => setFilterIndustry(ind === dynamicIndustries[0] ? '' : ind)}
                    className={filterIndustry === ind || (filterIndustry === '' && ind === dynamicIndustries[0]) ? 'btn btn-primary btn-sm' : 'btn btn-ghost btn-sm'}>
                    {ind}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.875rem', fontWeight: 600 }}>
                <Filter size={14} /> {t('projects.filter_tech')}:
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {dynamicTechs.map(tech => (
                  <button key={tech} onClick={() => setFilterTech(tech === 'Tất cả' ? '' : tech)}
                    className={filterTech === tech || (filterTech === '' && tech === 'Tất cả') ? 'btn btn-primary btn-sm' : 'btn btn-ghost btn-sm'}>
                    {tech}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="grid-3">{[...Array(6)].map((_, i) => <div key={i} className="skeleton" style={{ height: 280, borderRadius: 'var(--radius-xl)' }} />)}</div>
          ) : projects.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-muted)' }}>{t('common.no_data')}</div>
          ) : (
            <div className="grid-3">
              {projects.map((project, i) => (
                <motion.div key={project._id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.5 }}>
                  <Link href={`/projects/${project.slug}`} style={{ display: 'block' }}>
                    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-muted)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', transition: 'all 0.3s' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.transform = 'translateY(-6px)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border-muted)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                      <div style={{ position: 'relative', aspectRatio: '16/9', background: 'linear-gradient(135deg, #1A1A1A, #2A1500)', overflow: 'hidden' }}>
                        {project.images?.[0] ? (
                          <img src={`/uploads/images/${project.images[0]}`} alt={project.titleVi} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}><Settings size={40} color="rgba(255,107,0,0.3)" /></div>
                        )}
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)' }} />
                        {project.isFeatured && (
                          <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'var(--color-primary)', color: '#fff', fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', letterSpacing: '0.05em' }}>FEATURED</div>
                        )}
                      </div>
                      <div style={{ padding: '1.5rem' }}>
                        {project.client && <span className="tag tag-primary" style={{ marginBottom: '0.75rem', display: 'inline-block' }}>{project.client}</span>}
                        <h3 style={{ fontFamily: 'var(--font-heading)', color: '#fff', fontSize: '1rem', marginBottom: '0.5rem', lineHeight: 1.3 }}>
                          {lang === 'vi' ? project.titleVi : project.titleEn}
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.875rem' }}>
                          <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                            {lang === 'vi' ? project.industryVi : project.industryEn}
                          </span>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                          {(project.technologies || []).slice(0, 3).map(tech => (<span key={tech} className="tag" style={{ fontSize: '0.72rem' }}>{tech}</span>))}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
