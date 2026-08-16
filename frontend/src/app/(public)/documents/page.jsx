'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { getCourses } from '../../../services/api';
import { BookOpen, Download, FileText } from 'lucide-react';

export default function DocumentsPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const router = useRouter();
  const [filterCat, setFilterCat] = useState('');
  const { data: courses = [], isLoading } = useQuery({ queryKey: ['courses', filterCat], queryFn: () => getCourses(filterCat ? { category: filterCat } : {}) });

  const categories = [...new Set(courses.map(p => lang === 'vi' ? p.categoryVi : p.categoryEn).filter(Boolean))];

  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg, #0A0A0A, #1A0800)', padding: 'calc(var(--nav-height) + 2.5rem) 0 4rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 400, height: 300, background: 'var(--color-primary)', filter: 'blur(100px)', opacity: 0.08, borderRadius: '50%' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ background: 'linear-gradient(135deg, #fff, #FFB380)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: '1rem' }}>{t('courses.title')}</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>{t('courses.sub')}</p>
        </div>
      </div>

      <div className="section">
        <div className="container">
          {/* Category Filter */}
          {categories.length > 0 && (
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
              <button onClick={() => setFilterCat('')} className={!filterCat ? 'btn btn-primary btn-sm' : 'btn btn-ghost btn-sm'}>
                {t('projects.all')}
              </button>
              {categories.map(cat => (
                <button key={cat} onClick={() => setFilterCat(cat)} className={filterCat === cat ? 'btn btn-primary btn-sm' : 'btn btn-ghost btn-sm'}>{cat}</button>
              ))}
            </div>
          )}

          {isLoading ? (
            <div className="grid-4">{[...Array(8)].map((_, i) => <div key={i} className="skeleton" style={{ height: 280, borderRadius: 'var(--radius-xl)' }} />)}</div>
          ) : (
            <div className="grid-4">
              {courses.map((course, i) => (
                <motion.div key={course._id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.5 }}>
                  <div 
                    onClick={() => router.push(`/documents/${course.slug}`)}
                    style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-muted)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%', transition: 'all 0.3s', cursor: 'pointer' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-glow-sm)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border-muted)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                    <div style={{ position: 'relative', aspectRatio: '1', background: 'linear-gradient(135deg, #1A1A1A, #2A1500)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                      {course.images?.[0] ? (
                        <img src={`/uploads/images/${course.images[0]}`} alt={course.nameVi} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <BookOpen size={56} color="rgba(255,107,0,0.3)" />
                      )}
                      <span style={{ position: 'absolute', top: '0.625rem', right: '0.625rem', background: 'rgba(0,0,0,0.8)', color: '#FFB380', border: '1px solid rgba(255,107,0,0.35)', backdropFilter: 'blur(6px)', fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', gap: '0.3rem', boxShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
                        📥 {course.requestCount || 0} {lang === 'vi' ? 'yêu cầu' : 'requests'}
                      </span>
                    </div>
                    <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      {(lang === 'vi' ? course.categoryVi : course.categoryEn) && (
                        <span className="tag" style={{ marginBottom: '0.625rem', display: 'inline-block', fontSize: '0.72rem' }}>{lang === 'vi' ? course.categoryVi : course.categoryEn}</span>
                      )}
                      <h3 style={{ fontFamily: 'var(--font-heading)', color: '#fff', fontSize: '0.95rem', marginBottom: '0.625rem', lineHeight: 1.3 }}>
                        {lang === 'vi' ? course.nameVi : course.nameEn}
                      </h3>
                      {course.specifications?.length > 0 && (
                        <div style={{ marginBottom: '1rem', flex: 1 }}>
                          {course.specifications.slice(0, 2).map((spec, j) => (
                            <div key={j} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', padding: '0.25rem 0', borderBottom: '1px solid var(--color-border-muted)', color: 'var(--color-text-muted)' }}>
                              <span>{lang === 'vi' ? spec.labelVi : spec.labelEn}</span>
                              <span style={{ color: '#fff', fontWeight: 500 }}>{spec.value}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                        <Link href={`/documents/${course.slug}`} className="btn btn-outline btn-sm" style={{ flex: 1, justifyContent: 'center', fontSize: '0.78rem' }}>
                          <FileText size={13} /> {t('services.detail')}
                        </Link>
                        {course.catalogUrl && (
                          <a href={course.catalogUrl} download onClick={(e) => e.stopPropagation()} className="btn btn-ghost btn-sm" style={{ justifyContent: 'center' }} title="Download Materials">
                            <Download size={14} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
