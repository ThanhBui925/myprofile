'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { getCompany, getProjects } from '../../../services/api';
import { Award, Users, Target, Eye, CheckCircle } from 'lucide-react';

export default function AboutPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const { data: company, isLoading } = useQuery({ queryKey: ['company'], queryFn: getCompany });
  const { data: allProjects = [] } = useQuery({ queryKey: ['projects', 'all'], queryFn: () => getProjects() });
  const appName = company ? (i18n.language === 'vi' ? company.nameVi : company.nameEn) || company.nameVi || '' : '';

  if (isLoading) return (
    <div style={{ padding: '10rem 0', textAlign: 'center' }}>
      <div style={{ color: 'var(--color-text-muted)' }}>{t('common.loading')}</div>
    </div>
  );

  const parseYearOnly = (str) => {
    if (!str) return NaN;
    const match = String(str).match(/\b(19\d{2}|20\d{2})\b/);
    return match ? parseInt(match[0]) : parseInt(str);
  };

  const historyYears = company?.history?.map(h => parseYearOnly(h.year)).filter(y => !isNaN(y)) || [];
  const minYear = historyYears.length > 0 ? Math.min(...historyYears) : parseYearOnly(company?.founded || 2015);
  const maxYear = historyYears.length > 0 ? Math.max(...historyYears) : new Date().getFullYear();
  const yearsOfExp = Math.max(0, maxYear - minYear);

  return (
    <div>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #0A0A0A 0%, #1A0800 100%)', padding: 'calc(var(--nav-height) + 2.5rem) 0 4rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 300, background: 'var(--color-primary)', filter: 'blur(120px)', opacity: 0.08, borderRadius: '50%' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ background: 'linear-gradient(135deg, #fff, #FFB380)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: '1rem' }}>
            {lang === 'vi' ? `Về ${appName}` : `About ${appName}`}
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem', maxWidth: 600, margin: '0 auto', whiteSpace: 'pre-line' }}>
            {lang === 'vi' ? company?.aboutVi : company?.aboutEn}
          </p>
        </div>
      </div>

      {/* Stats */}
      {company && (
        <div style={{ background: 'var(--color-bg-2)', padding: '3rem 0' }}>
          <div className="container">
            <div className="grid-2" style={{ gap: '1.5rem' }}>
              {[
                { value: allProjects.length, suffix: '+', label: t('home.stats_projects') },
                { value: yearsOfExp, suffix: '+', label: t('home.stats_years') },
              ].map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  style={{ textAlign: 'center', padding: '2rem', background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-muted)' }}>
                  <div style={{ fontSize: '3rem', fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--color-primary)', lineHeight: 1, marginBottom: '0.5rem' }}>{s.value}{s.suffix}</div>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', margin: 0 }}>{s.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* History Timeline */}
      {company?.history?.length > 0 && (
        <div className="section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">{t('about.history')}</h2>
            </div>
            <div className="timeline-container">
              <div className="timeline-line" />
              {(() => {
                const parseSortValue = (str) => {
                  if (!str) return 0;
                  const match = String(str).match(/\b(\d{1,2})[\/\-](19\d{2}|20\d{2})\b/);
                  if (match) return parseInt(match[2]) * 12 + parseInt(match[1]);
                  const yearMatch = String(str).match(/\b(19\d{2}|20\d{2})\b/);
                  return yearMatch ? parseInt(yearMatch[0]) * 12 + 1 : (parseInt(str) * 12 || 0) + 1;
                };
                return [...company.history]
                  .sort((a, b) => parseSortValue(b.year) - parseSortValue(a.year))
                  .map((item, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}
                      className={`timeline-item ${i % 2 === 0 ? 'timeline-item-left' : 'timeline-item-right'}`}>
                      <div style={{ position: 'relative', background: 'var(--color-surface)', border: '1px solid var(--color-border-muted)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
                        <div className={`timeline-dot ${i % 2 === 0 ? 'timeline-dot-left' : 'timeline-dot-right'}`} />
                        <span style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '1.1rem', display: 'block', marginBottom: '0.5rem' }}>{item.year}</span>
                        <h4 style={{ color: '#fff', marginBottom: '0.5rem', fontSize: '1rem' }}>{lang === 'vi' ? item.titleVi : item.titleEn}</h4>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', margin: 0, whiteSpace: 'pre-line' }}>{lang === 'vi' ? item.descriptionVi : item.descriptionEn}</p>
                      </div>
                    </motion.div>
                  ));
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Vision & Mission */}
      {company && (
        <div style={{ background: 'var(--color-bg-2)', padding: '5rem 0' }}>
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">{lang === 'vi' ? 'Tầm nhìn & Sứ mệnh' : 'Vision & Mission'}</h2>
            </div>
            <div className="grid-2">
              {[
                { icon: Eye, title: t('about.vision'), content: lang === 'vi' ? company.visionVi : company.visionEn, color: '#3B82F6' },
                { icon: Target, title: t('about.mission'), content: lang === 'vi' ? company.missionVi : company.missionEn, color: 'var(--color-primary)' },
              ].map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                  style={{ background: 'var(--color-surface)', border: `1px solid ${item.color}30`, borderRadius: 'var(--radius-xl)', padding: '2.5rem' }}>
                  <div style={{ width: 56, height: 56, background: `${item.color}20`, border: `1px solid ${item.color}`, borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', color: item.color }}>
                    <item.icon size={26} />
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-heading)', color: '#fff', marginBottom: '1rem' }}>{item.title}</h3>
                  <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7, fontSize: '1rem' }}>{item.content}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Team */}
      {company?.team?.length > 0 && (
        <div className="section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">{t('about.team')}</h2>
            </div>
            <div className="grid-4">
              {company.team.map((member, i) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  style={{ textAlign: 'center', background: 'var(--color-surface)', border: '1px solid var(--color-border-muted)', borderRadius: 'var(--radius-xl)', padding: '2rem', transition: 'all 0.3s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border-muted)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                  <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '2rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-heading)', overflow: 'hidden' }}>
                    {member.image ? <img src={member.image} alt={member.nameVi} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (lang === 'vi' ? member.nameVi : member.nameEn)?.charAt(0)}
                  </div>
                  <h4 style={{ color: '#fff', marginBottom: '0.25rem', fontSize: '1rem' }}>{lang === 'vi' ? member.nameVi : member.nameEn}</h4>
                  <p style={{ color: 'var(--color-primary)', fontSize: '0.82rem', fontWeight: 600 }}>{lang === 'vi' ? member.positionVi : member.positionEn}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Certificates */}
      {company?.certificates?.length > 0 && (
        <div style={{ background: 'var(--color-bg-2)', padding: '5rem 0' }}>
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">{t('about.certificates')}</h2>
            </div>
            <div className="grid-4">
              {company.certificates.map((cert, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-muted)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', textAlign: 'center' }}>
                  <Award size={40} color="var(--color-primary)" style={{ margin: '0 auto 1rem' }} />
                  <h4 style={{ color: '#fff', fontSize: '0.95rem', marginBottom: '0.5rem' }}>{lang === 'vi' ? cert.nameVi : cert.nameEn}</h4>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>{cert.issuedBy} {cert.year && `· ${cert.year}`}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
