'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  Package, Search, Filter, Send, Download, CheckCircle2,
  FileText, ArrowRight, X, Cpu, Settings, ShieldCheck, Zap
} from 'lucide-react';
import { getProducts, submitQuote } from '../../../services/api';
import { useUserStore } from '../../../store/userStore';

export default function ProductsPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [quoteProduct, setQuoteProduct] = useState(null);
  const [detailProduct, setDetailProduct] = useState(null);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => getProducts(),
  });

  const user = useUserStore(state => state.user);
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.fullName || user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      company: user?.company || '',
      quantity: 1,
      message: ''
    }
  });

  const quoteMutation = useMutation({
    mutationFn: (data) => submitQuote(quoteProduct.slug, { ...data, lang }),
    onSuccess: () => {
      toast.success(lang === 'vi' ? 'Đã gửi yêu cầu báo giá thành công!' : 'Quote request submitted successfully!');
      setQuoteProduct(null);
      reset();
    },
    onError: () => toast.error(lang === 'vi' ? 'Gửi yêu cầu thất bại. Vui lòng thử lại!' : 'Submission failed. Please try again!'),
  });

  // Categories
  const categories = Array.from(new Set(products.map(p => lang === 'vi' ? p.categoryVi : p.categoryEn).filter(Boolean)));

  // Filtered Products
  const filteredProducts = products.filter(p => {
    const cat = lang === 'vi' ? p.categoryVi : p.categoryEn;
    const matchesCategory = selectedCategory === 'all' || cat === selectedCategory;
    const name = lang === 'vi' ? p.nameVi : p.nameEn;
    const desc = lang === 'vi' ? p.descriptionVi : p.descriptionEn;
    const matchesSearch = !searchTerm || 
      name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      desc?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenQuote = (product) => {
    setQuoteProduct(product);
    reset({
      name: user?.fullName || user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      company: user?.company || '',
      quantity: 1,
      message: lang === 'vi' ? `Tôi muốn xin báo giá cho sản phẩm ${product.nameVi}` : `I would like a quote for ${product.nameEn}`
    });
  };

  return (
    <div style={{ paddingTop: 'calc(var(--nav-height) + 1rem)' }}>
      {/* Hero Header */}
      <div style={{ background: 'linear-gradient(135deg, #0A0A0A, #1A0800)', padding: '5rem 0 3.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 350, background: 'var(--color-primary)', filter: 'blur(140px)', opacity: 0.08, borderRadius: '50%' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="tag tag-primary" style={{ marginBottom: '1rem', display: 'inline-block' }}>
              {lang === 'vi' ? 'THIẾT BỊ & PHẦN CỨNG TỰ ĐỘNG HÓA' : 'AUTOMATION HARDWARE & PRODUCTS'}
            </span>
            <h1 className="page-title" style={{ color: '#fff', fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.5rem, 5vw, 3.75rem)', fontWeight: 800 }}>
              {lang === 'vi' ? 'Sản Phẩm Công Nghệ' : 'Industrial Products'}
            </h1>
            <p className="page-sub" style={{ maxWidth: 700, margin: '1rem auto 0', color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>
              {lang === 'vi'
                ? 'Cung cấp linh kiện, thiết bị điều khiển, cánh tay robot và giải pháp phần cứng chính hãng chất lượng cao.'
                : 'Providing genuine components, control devices, robotic arms, and high quality hardware solutions.'}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div style={{ background: 'var(--color-bg-2)', borderBottom: '1px solid var(--color-border-muted)', padding: '1.5rem 0', sticky: 'top', top: 'var(--nav-height)', zIndex: 10 }}>
        <div className="container">
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* Category tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
              <button
                onClick={() => setSelectedCategory('all')}
                className={`btn ${selectedCategory === 'all' ? 'btn-primary' : 'btn-ghost'}`}
                style={{ padding: '0.5rem 1.25rem', fontSize: '0.88rem', borderRadius: 'var(--radius-full)' }}
              >
                {lang === 'vi' ? 'Tất cả' : 'All'}
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`btn ${selectedCategory === cat ? 'btn-primary' : 'btn-ghost'}`}
                  style={{ padding: '0.5rem 1.25rem', fontSize: '0.88rem', borderRadius: 'var(--radius-full)', whiteSpace: 'nowrap' }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div style={{ position: 'relative', width: '100%', maxWidth: 320 }}>
              <Search size={16} color="var(--color-text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder={lang === 'vi' ? 'Tìm kiếm sản phẩm...' : 'Search products...'}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.5rem', height: 42, fontSize: '0.88rem', borderRadius: 'var(--radius-full)', background: 'var(--color-surface)' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Product Grid */}
      <div className="section" style={{ background: 'var(--color-bg)' }}>
        <div className="container">
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-text-muted)' }}>
              <div className="loading-spinner" />
              <p style={{ marginTop: '1rem' }}>{lang === 'vi' ? 'Đang tải danh mục sản phẩm...' : 'Loading products catalog...'}</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '5rem 0', background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border-muted)' }}>
              <Package size={48} color="var(--color-primary)" opacity={0.5} style={{ marginBottom: '1rem' }} />
              <h3 style={{ color: '#fff', marginBottom: '0.5rem' }}>{lang === 'vi' ? 'Không tìm thấy sản phẩm' : 'No products found'}</h3>
              <p style={{ color: 'var(--color-text-muted)' }}>{lang === 'vi' ? 'Thử thay đổi từ khóa hoặc danh mục lọc.' : 'Try changing your search terms or filter categories.'}</p>
            </div>
          ) : (
            <div className="grid-3" style={{ gap: '2rem' }}>
              {filteredProducts.map((product, i) => {
                const name = lang === 'vi' ? product.nameVi : product.nameEn;
                const cat = lang === 'vi' ? product.categoryVi : product.categoryEn;
                const desc = lang === 'vi' ? product.descriptionVi : product.descriptionEn;

                return (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.5 }}
                    style={{
                      background: 'var(--color-surface)',
                      border: '1px solid var(--color-border-muted)',
                      borderRadius: 'var(--radius-xl)',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = 'var(--color-primary)';
                      e.currentTarget.style.transform = 'translateY(-6px)';
                      e.currentTarget.style.boxShadow = '0 20px 40px rgba(255, 107, 0, 0.15)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'var(--color-border-muted)';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
                    }}
                  >
                    {/* Product Image */}
                    <div style={{ aspectRatio: '16/10', position: 'relative', background: '#141414', overflow: 'hidden' }}>
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0].startsWith('/') ? product.images[0] : `/uploads/images/${product.images[0]}`}
                          alt={name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #1A1A1A, #2A1500)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Cpu size={56} color="var(--color-primary)" opacity={0.4} />
                        </div>
                      )}
                      {cat && (
                        <span
                          className="tag tag-primary"
                          style={{ position: 'absolute', top: '1rem', left: '1rem', fontSize: '0.75rem', zIndex: 2 }}
                        >
                          {cat}
                        </span>
                      )}
                    </div>

                    {/* Product Details */}
                    <div style={{ padding: '1.75rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <h3 style={{ color: '#fff', fontSize: '1.25rem', fontFamily: 'var(--font-heading)', fontWeight: 700, marginBottom: '0.75rem', lineHeight: 1.3 }}>
                        {name}
                      </h3>
                      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem', flex: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {desc}
                      </p>

                      {/* Specs snippet */}
                      {product.specifications?.length > 0 && (
                        <div style={{ background: 'var(--color-bg-2)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', border: '1px solid var(--color-border-muted)' }}>
                          {product.specifications.slice(0, 2).map((spec, idx) => (
                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', padding: '0.2rem 0' }}>
                              <span style={{ color: 'var(--color-text-muted)' }}>{lang === 'vi' ? spec.labelVi : spec.labelEn}:</span>
                              <span style={{ color: '#fff', fontWeight: 600 }}>{spec.value}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Actions */}
                      <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto' }}>
                        <button
                          onClick={() => handleOpenQuote(product)}
                          className="btn btn-primary"
                          style={{ flex: 1, padding: '0.75rem 1rem', fontSize: '0.88rem', fontWeight: 700, borderRadius: 'var(--radius-md)' }}
                        >
                          <Send size={15} /> {lang === 'vi' ? 'Báo Giá' : 'Get Quote'}
                        </button>
                        <button
                          onClick={() => setDetailProduct(product)}
                          className="btn"
                          style={{ padding: '0.75rem 1rem', fontSize: '0.88rem', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.06)', border: '1px solid var(--color-border-muted)', color: '#fff' }}
                        >
                          {lang === 'vi' ? 'Chi Tiết' : 'Details'}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Quote Request Modal */}
      <AnimatePresence>
        {quoteProduct && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(10px)' }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              style={{ background: 'var(--color-bg-2)', border: '1px solid var(--color-border-muted)', borderRadius: 'var(--radius-xl)', padding: '2.5rem', width: '100%', maxWidth: 520, position: 'relative', boxShadow: '0 25px 60px rgba(0,0,0,0.8)' }}
            >
              <button
                onClick={() => setQuoteProduct(null)}
                style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'var(--color-surface)', border: '1px solid var(--color-border-muted)', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--color-text-muted)' }}
              >
                <X size={18} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ width: 44, height: 44, background: 'var(--color-primary-glow)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--color-primary)' }}>
                  <Package size={22} color="var(--color-primary)" />
                </div>
                <div>
                  <h3 style={{ color: '#fff', fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 800 }}>
                    {lang === 'vi' ? 'Yêu Cầu Báo Giá' : 'Request a Quote'}
                  </h3>
                  <p style={{ color: 'var(--color-primary)', fontSize: '0.9rem', fontWeight: 600 }}>
                    {lang === 'vi' ? quoteProduct.nameVi : quoteProduct.nameEn}
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit(d => quoteMutation.mutate(d))} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">{lang === 'vi' ? 'Họ và tên *' : 'Full Name *'}</label>
                    <input {...register('name', { required: true })} className="form-input" placeholder={lang === 'vi' ? 'Nguyễn Văn A' : 'John Doe'} />
                    {errors.name && <span className="form-error">{lang === 'vi' ? 'Bắt buộc' : 'Required'}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">{lang === 'vi' ? 'Số điện thoại *' : 'Phone *'}</label>
                    <input {...register('phone', { required: true })} className="form-input" placeholder="0912 345 678" />
                    {errors.phone && <span className="form-error">{lang === 'vi' ? 'Bắt buộc' : 'Required'}</span>}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Email *</label>
                    <input {...register('email', { required: true, pattern: /^\S+@\S+$/i })} className="form-input" placeholder="name@company.com" />
                    {errors.email && <span className="form-error">{lang === 'vi' ? 'Email không hợp lệ' : 'Invalid email'}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">{lang === 'vi' ? 'Số lượng' : 'Quantity'}</label>
                    <input {...register('quantity', { valueAsNumber: true })} type="number" min={1} defaultValue={1} className="form-input" />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">{lang === 'vi' ? 'Tên công ty / Đơn vị' : 'Company Name'}</label>
                  <input {...register('company')} className="form-input" placeholder={lang === 'vi' ? 'Tên công ty' : 'Company Name'} />
                </div>

                <div className="form-group">
                  <label className="form-label">{lang === 'vi' ? 'Ghi chú / Yêu cầu thêm' : 'Additional Message'}</label>
                  <textarea {...register('message')} rows={3} className="form-input" style={{ resize: 'none' }} placeholder={lang === 'vi' ? 'Mô tả thêm về nhu cầu của bạn...' : 'Describe your detailed requirements...'} />
                </div>

                <button
                  type="submit"
                  disabled={quoteMutation.isPending}
                  className="btn btn-primary"
                  style={{ marginTop: '0.5rem', width: '100%', padding: '0.9rem', fontSize: '1rem', fontWeight: 700 }}
                >
                  {quoteMutation.isPending ? (lang === 'vi' ? 'Đang gửi...' : 'Sending...') : (lang === 'vi' ? 'Gửi Yêu Cầu Báo Giá' : 'Submit Quote Request')}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Product Detail View Modal */}
      <AnimatePresence>
        {detailProduct && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(10px)' }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ background: 'var(--color-bg-2)', border: '1px solid var(--color-border-muted)', borderRadius: 'var(--radius-xl)', padding: '2.5rem', width: '100%', maxWidth: 700, position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}
            >
              <button
                onClick={() => setDetailProduct(null)}
                style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'var(--color-surface)', border: '1px solid var(--color-border-muted)', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--color-text-muted)' }}
              >
                <X size={18} />
              </button>

              <div style={{ aspectRatio: '16/9', borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: '#141414', marginBottom: '1.5rem' }}>
                {detailProduct.images?.[0] ? (
                  <img src={detailProduct.images[0].startsWith('/') ? detailProduct.images[0] : `/uploads/images/${detailProduct.images[0]}`} alt={detailProduct.nameVi} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #1A1A1A, #2A1500)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Cpu size={64} color="var(--color-primary)" opacity={0.4} />
                  </div>
                )}
              </div>

              <h2 style={{ color: '#fff', fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.75rem' }}>
                {lang === 'vi' ? detailProduct.nameVi : detailProduct.nameEn}
              </h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '2rem' }}>
                {lang === 'vi' ? detailProduct.descriptionVi : detailProduct.descriptionEn}
              </p>

              {detailProduct.specifications?.length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                  <h4 style={{ color: '#fff', marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>
                    {lang === 'vi' ? 'Thông Số Kỹ Thuật' : 'Technical Specifications'}
                  </h4>
                  <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-muted)', overflow: 'hidden' }}>
                    {detailProduct.specifications.map((spec, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.85rem 1.25rem', borderBottom: i < detailProduct.specifications.length - 1 ? '1px solid var(--color-border-muted)' : 'none' }}>
                        <span style={{ color: 'var(--color-text-muted)' }}>{lang === 'vi' ? spec.labelVi : spec.labelEn}</span>
                        <span style={{ color: '#fff', fontWeight: 600 }}>{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={() => { setDetailProduct(null); handleOpenQuote(detailProduct); }}
                  className="btn btn-primary btn-lg"
                  style={{ flex: 1, padding: '0.9rem', fontSize: '1rem', fontWeight: 700 }}
                >
                  <Send size={18} /> {lang === 'vi' ? 'Nhận Báo Giá Ngay' : 'Request Quote Now'}
                </button>
                {detailProduct.catalogUrl && (
                  <a
                    href={detailProduct.catalogUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn"
                    style={{ padding: '0.9rem 1.5rem', background: 'rgba(255,255,255,0.06)', border: '1px solid var(--color-border-muted)', color: '#fff' }}
                  >
                    <Download size={18} /> Catalog (PDF)
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
