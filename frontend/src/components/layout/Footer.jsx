'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { getCompany, getServices, getBanners } from '../../services/api';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  const { t, i18n } = useTranslation();
  const year = new Date().getFullYear();
  
  const { data: company } = useQuery({ queryKey: ['company'], queryFn: getCompany });
  const { data: services = [] } = useQuery({ queryKey: ['services'], queryFn: getServices });
  const { data: banners = [] } = useQuery({ queryKey: ['banners'], queryFn: getBanners });
  
  const activeBanners = banners.filter(b => b.isActive !== false);
  const [footerIndex, setFooterIndex] = useState(0);

  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const interval = setInterval(() => {
      setFooterIndex((prev) => (prev + 1) % activeBanners.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [activeBanners.length]);

  const activeBanner = activeBanners[footerIndex] || activeBanners[0];
  
  const appName = company ? (i18n.language === 'vi' ? company.nameVi : company.nameEn) || company.nameVi || 'THANHTDH' : 'THANHTDH';
  const address = company ? (i18n.language === 'vi' ? (company.addressVi || company.address || t('contact.address_value')) : (company.addressEn || t('contact.address_value'))) : t('contact.address_value');
  const phone = company?.phone || '+84 28 3812 3456';
  const email = company?.email || 'info@thanhtdh.vn';
  const poweredBy = company ? (i18n.language === 'vi' ? company.poweredByVi : company.poweredByEn) || company.poweredByVi || t('footer.powered_by') : t('footer.powered_by');

  const footerDesc = activeBanner
    ? (i18n.language === 'vi' ? activeBanner.subtitleVi : activeBanner.subtitleEn)
    : (i18n.language === 'vi' ? `Cung cấp kho tài liệu tự động hoá, sơ đồ mạch điện và tài liệu kỹ thuật hoàn toàn miễn phí từ ${appName}.` : `Providing free automation technical documentation, electrical schematics, and resources from ${appName}.`);

  return (
    <footer className="footer" suppressHydrationWarning>
      <div className="footer__top">
        <div className="container footer__grid">
          {/* Brand */}
          <div className="footer__brand">
            <div className="footer__logo">
              <div className="footer__logo-icon"><span>{appName[0]?.toUpperCase()}</span></div>
              <span className="footer__logo-text">{appName}</span>
            </div>
            <p style={{ marginTop: '0.75rem', color: 'var(--color-text-muted)', fontSize: '0.88rem', lineHeight: 1.6 }}>
              {footerDesc}
            </p>
          </div>

          <div className="footer__col">
            <h4>{i18n.language === 'vi' ? 'Cá nhân' : 'Personal'}</h4>
            <ul>
              <li><Link href="/about">{t('nav.about')}</Link></li>
              <li><Link href="/projects">{t('nav.projects')}</Link></li>
              <li><Link href="/documents">{t('nav.courses')}</Link></li>
              <li><Link href="/contact">{t('nav.contact')}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer__col">
            <h4>{t('contact.title')}</h4>
            <ul className="footer__contact-list">
              <li><MapPin size={14} /><span>{address}</span></li>
              <li><Phone size={14} /><span>{phone}</span></li>
              <li><Mail size={14} /><span>{email}</span></li>
              <li><Clock size={14} /><span>{t('contact.hours_value')}</span></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <p>© {year} {appName}. {t('footer.copyright')}</p>
          <p>{poweredBy}</p>
        </div>
      </div>
    </footer>
  );
}
