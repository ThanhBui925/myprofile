'use client';

import { useState, useRef } from 'react';

export default function TiltBanner({
  src = '/images/tech-banner.jpg',
  alt = 'Technology Banner',
  maxTilt = 15,
  scale = 1.03,
  perspective = 1000,
  className = '',
  style = {},
  overlayTitle = '',
  overlaySub = '',
}) {
  const [transform, setTransform] = useState(`perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = -((y - centerY) / centerY) * maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;
    
    setTransform(`perspective(${perspective}px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`);
    
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;
    setGlarePos({ x: glareX, y: glareY, opacity: 0.3 });
  };

  const handleMouseLeave = () => {
    setTransform(`perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`);
    setGlarePos((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: `${perspective}px`,
        transformStyle: 'preserve-3d',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        cursor: 'pointer',
        boxShadow: '0 25px 70px rgba(0, 0, 0, 0.5)',
        position: 'relative',
        transition: 'box-shadow 0.3s ease',
        ...style,
      }}
      className={className}
    >
      <div
        style={{
          transform,
          transformStyle: 'preserve-3d',
          transition: transform.includes('rotateX(0deg)') ? 'transform 0.5s ease' : 'transform 0.1s ease-out',
          width: '100%',
          height: '100%',
          position: 'relative',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
        }}
      >
        <img
          src={src}
          alt={alt}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />

        {/* Dynamic 3D Glare effect overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.35) 0%, rgba(255,107,0,0.2) 35%, transparent 70%)`,
            opacity: glarePos.opacity,
            transition: 'opacity 0.3s ease',
            mixBlendMode: 'overlay',
          }}
        />

        {/* Optional Title/Sub Overlay floating in 3D space */}
        {(overlayTitle || overlaySub) && (
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '2.5rem 2rem 2rem',
              background: 'linear-gradient(to top, rgba(10,10,10,0.95) 0%, transparent 100%)',
              transform: 'translateZ(30px)',
              pointerEvents: 'none',
            }}
          >
            {overlayTitle && (
              <h3 style={{ color: '#fff', fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.4rem', fontFamily: 'var(--font-heading)', letterSpacing: '0.02em' }}>
                {overlayTitle}
              </h3>
            )}
            {overlaySub && (
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', lineHeight: 1.5, margin: 0 }}>
                {overlaySub}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
