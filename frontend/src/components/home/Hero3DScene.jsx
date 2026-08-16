'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { getBanners } from '../../services/api';
import { ArrowRight, Award, CheckCircle2 } from 'lucide-react';
import * as THREE from 'three';

export default function Hero3DScene({ appName = 'THANHTDH', totalProjects = 3, yearsOfExp = 5 }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  const { data: banners = [] } = useQuery({ queryKey: ['banners'], queryFn: getBanners });
  const activeBanners = banners.filter(b => b.isActive !== false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [activeBanners.length]);

  const activeBanner = activeBanners[currentIndex] || activeBanners[0];

  const bannerTitle = activeBanner
    ? (lang === 'vi' ? activeBanner.titleVi : activeBanner.titleEn)
    : (lang === 'vi' ? 'Tài Liệu Tự Động Hóa\nMiễn Phí' : 'Free Automation\nDocumentation');

  const bannerSub = activeBanner
    ? (lang === 'vi' ? activeBanner.subtitleVi : activeBanner.subtitleEn)
    : (lang === 'vi' ? `Cung cấp kho tài liệu tự động hoá, sơ đồ mạch điện và tài liệu kỹ thuật hoàn toàn miễn phí từ ${appName}.` : `Providing free automation technical documentation, electrical schematics, and resources from ${appName}.`);

  const titleLines = bannerTitle ? bannerTitle.split(/\r?\n|<br\s*\/?>/i).map(s => s.trim()).filter(Boolean) : [];
  const mainTitlePart = titleLines.length > 1 ? titleLines[0] : bannerTitle;
  const highlightTitlePart = titleLines.length > 1 ? titleLines.slice(1).join(' ') : '';

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    let width = container.clientWidth;
    let height = container.clientHeight;

    // 1. Three.js Scene Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0a0a, 0.012);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 0, 24);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLightOrange = new THREE.PointLight(0xff6b00, 3, 50);
    pointLightOrange.position.set(12, 12, 12);
    scene.add(pointLightOrange);

    const pointLightCyan = new THREE.PointLight(0x00f0ff, 2.5, 50);
    pointLightCyan.position.set(-15, -10, 10);
    scene.add(pointLightCyan);

    // 3. 3D Main Object Group
    const heroGroup = new THREE.Group();
    scene.add(heroGroup);

    // Object A: Large Left/Top Wireframe Polyhedron
    const geoA = new THREE.IcosahedronGeometry(5.5, 1);
    const matA = new THREE.MeshStandardMaterial({
      color: 0xff6b00,
      wireframe: true,
      emissive: 0xff4500,
      emissiveIntensity: 0.25,
      metalness: 0.8,
      roughness: 0.2,
    });
    const meshA = new THREE.Mesh(geoA, matA);
    meshA.position.set(-10, 5, -2);
    heroGroup.add(meshA);

    // Inner Core A
    const innerGeoA = new THREE.IcosahedronGeometry(3.2, 0);
    const innerMatA = new THREE.MeshStandardMaterial({
      color: 0x111111,
      emissive: 0xff6b00,
      emissiveIntensity: 0.6,
      roughness: 0.1,
    });
    const innerMeshA = new THREE.Mesh(innerGeoA, innerMatA);
    meshA.add(innerMeshA);

    // Object B: Right Floating Wireframe Polyhedron
    const geoB = new THREE.DodecahedronGeometry(4.2, 1);
    const matB = new THREE.MeshStandardMaterial({
      color: 0xffa500,
      wireframe: true,
      emissive: 0xff6b00,
      emissiveIntensity: 0.2,
      metalness: 0.9,
      roughness: 0.1,
    });
    const meshB = new THREE.Mesh(geoB, matB);
    meshB.position.set(11, -3, 1);
    heroGroup.add(meshB);

    // 4. Constellation Lines & Particles Network
    const pCount = 80;
    const pPositions = new Float32Array(pCount * 3);
    const pVelocities = [];

    for (let i = 0; i < pCount; i++) {
      pPositions[i * 3] = (Math.random() - 0.5) * 35;
      pPositions[i * 3 + 1] = (Math.random() - 0.5) * 25;
      pPositions[i * 3 + 2] = (Math.random() - 0.5) * 20;

      pVelocities.push({
        x: (Math.random() - 0.5) * 0.015,
        y: (Math.random() - 0.5) * 0.015,
        z: (Math.random() - 0.5) * 0.015,
      });
    }

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));

    const pMat = new THREE.PointsMaterial({
      size: 0.25,
      color: 0xff8800,
      transparent: true,
      opacity: 0.8,
    });
    const particleSystem = new THREE.Points(pGeo, pMat);
    heroGroup.add(particleSystem);

    // Dynamic Constellation Lines
    const linesGeo = new THREE.BufferGeometry();
    const linesMat = new THREE.LineBasicMaterial({
      color: 0xff6b00,
      transparent: true,
      opacity: 0.15,
    });
    const linesMesh = new THREE.LineSegments(linesGeo, linesMat);
    heroGroup.add(linesMesh);

    // 5. Starfield Particles Background
    const starsCount = 350;
    const starsGeo = new THREE.BufferGeometry();
    const starsPos = new Float32Array(starsCount * 3);
    for (let i = 0; i < starsCount * 3; i += 3) {
      starsPos[i] = (Math.random() - 0.5) * 80;
      starsPos[i + 1] = (Math.random() - 0.5) * 60;
      starsPos[i + 2] = (Math.random() - 0.5) * 60;
    }
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starsPos, 3));
    const starsMat = new THREE.PointsMaterial({
      size: 0.1,
      color: 0xffffff,
      transparent: true,
      opacity: 0.5,
    });
    const starsPoints = new THREE.Points(starsGeo, starsMat);
    scene.add(starsPoints);

    // 6. Mouse Control & Dynamic Camera Movement
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      mouseX = (x / (rect.width / 2));
      mouseY = (y / (rect.height / 2));
    };

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = container.getBoundingClientRect();
        const x = touch.clientX - rect.left - rect.width / 2;
        const y = touch.clientY - rect.top - rect.height / 2;
        mouseX = (x / (rect.width / 2));
        mouseY = (y / (rect.height / 2));
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    // 7. Animation Loop
    let animId;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth mouse lerp
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      heroGroup.rotation.y = targetX * 0.35 + elapsed * 0.03;
      heroGroup.rotation.x = -targetY * 0.25;

      camera.position.x = targetX * 1.5;
      camera.position.y = -targetY * 1.5;
      camera.lookAt(0, 0, 0);

      // Rotate objects
      meshA.rotation.x = elapsed * 0.15;
      meshA.rotation.y = elapsed * 0.2;

      meshB.rotation.x = -elapsed * 0.2;
      meshB.rotation.z = elapsed * 0.15;

      // Update Constellation Positions & Connecting Lines
      const positions = pGeo.attributes.position.array;
      const linePositions = [];

      for (let i = 0; i < pCount; i++) {
        positions[i * 3] += pVelocities[i].x;
        positions[i * 3 + 1] += pVelocities[i].y;
        positions[i * 3 + 2] += pVelocities[i].z;

        // Bounce inside bounds
        if (Math.abs(positions[i * 3]) > 18) pVelocities[i].x *= -1;
        if (Math.abs(positions[i * 3 + 1]) > 14) pVelocities[i].y *= -1;
        if (Math.abs(positions[i * 3 + 2]) > 12) pVelocities[i].z *= -1;

        // Connect nearby points
        for (let j = i + 1; j < pCount; j++) {
          const dx = positions[i * 3] - positions[j * 3];
          const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
          const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < 6.5) {
            linePositions.push(
              positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
              positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]
            );
          }
        }
      }

      pGeo.attributes.position.needsUpdate = true;
      linesGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));

      starsPoints.rotation.y = elapsed * 0.01;

      renderer.render(scene, camera);
    };

    animate();

    // 8. Resize listener
    const handleResize = () => {
      if (!containerRef.current) return;
      width = containerRef.current.clientWidth;
      height = containerRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #050505 0%, #0D0600 50%, #050505 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        paddingTop: 'calc(var(--nav-height) + 2rem)',
      }}
    >
      {/* 3D WebGL Canvas Layer */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Radial Gradient Glow Overlays */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 700,
          height: 700,
          background: 'var(--color-primary)',
          borderRadius: '50%',
          filter: 'blur(200px)',
          opacity: 0.1,
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Hero Text & Actions Overlay */}
      <div
        className="container"
        style={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          padding: '4rem 1rem 6rem',
          maxWidth: '900px',
        }}
      >


        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            {/* Main Headline */}
            <h1
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2.5rem, 5.5vw, 4.25rem)',
                fontWeight: 900,
                lineHeight: 1.15,
                letterSpacing: '-0.02em',
                color: '#ffffff',
                marginBottom: '1.5rem',
                textShadow: '0 10px 40px rgba(0,0,0,0.8)',
              }}
            >
              {mainTitlePart}
              {highlightTitlePart && (
                <>
                  <br />
                  <span
                    style={{
                      background: 'linear-gradient(135deg, var(--color-primary) 0%, #FFB380 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    {highlightTitlePart}
                  </span>
                </>
              )}
            </h1>

            {/* Subtitle */}
            <p
              style={{
                fontSize: 'clamp(1rem, 1.8vw, 1.2rem)',
                color: 'rgba(255, 255, 255, 0.75)',
                lineHeight: 1.7,
                maxWidth: '760px',
                margin: '0 auto 2.5rem',
              }}
            >
              {bannerSub}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Pagination Dots if multiple banners exist */}
        {activeBanners.length > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '2.5rem' }}>
            {activeBanners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                style={{
                  width: i === currentIndex ? 24 : 8,
                  height: 8,
                  borderRadius: 4,
                  background: i === currentIndex ? 'var(--color-primary)' : 'rgba(255,255,255,0.25)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                title={`Content ${i + 1}`}
              />
            ))}
          </div>
        )}

        {/* CTA Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.25rem',
            flexWrap: 'wrap',
            marginBottom: '4rem',
          }}
        >
          <Link
            href={activeBanner?.link || '/about'}
            className="btn btn-primary"
            style={{
              padding: '0.95rem 2.25rem',
              fontSize: '1rem',
              fontWeight: 700,
              borderRadius: 'var(--radius-full)',
              boxShadow: '0 10px 30px rgba(255, 107, 0, 0.4)',
            }}
          >
            {lang === 'vi' ? 'Giới thiệu' : 'About Us'} <ArrowRight size={18} />
          </Link>
          <Link
            href="/courses"
            className="btn"
            style={{
              padding: '0.95rem 2.25rem',
              fontSize: '1rem',
              fontWeight: 600,
              borderRadius: 'var(--radius-full)',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--color-border-muted)',
              color: '#ffffff',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-primary)';
              e.currentTarget.style.background = 'rgba(255, 107, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border-muted)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
            }}
          >
            {lang === 'vi' ? 'Tài Liệu' : 'Documents'}
          </Link>
        </motion.div>

        {/* Floating Stats / Highlights Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2rem',
            flexWrap: 'wrap',
            padding: '1rem 2.25rem',
            background: 'rgba(20, 20, 20, 0.65)',
            border: '1px solid var(--color-border-muted)',
            borderRadius: 'var(--radius-full)',
            backdropFilter: 'blur(20px)',
            maxWidth: '500px',
            margin: '0 auto',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <Award size={20} color="var(--color-primary)" />
            <div style={{ textAlign: 'left' }}>
              <span style={{ color: '#fff', fontWeight: 800, fontSize: '1.1rem', display: 'block', lineHeight: 1.1 }}>{yearsOfExp}+</span>
              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.78rem' }}>{lang === 'vi' ? 'Năm kinh nghiệm' : 'Years Experience'}</span>
            </div>
          </div>

          <div style={{ width: 1, height: 28, background: 'var(--color-border-muted)' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <CheckCircle2 size={20} color="var(--color-primary)" />
            <div style={{ textAlign: 'left' }}>
              <span style={{ color: '#fff', fontWeight: 800, fontSize: '1.1rem', display: 'block', lineHeight: 1.1 }}>{totalProjects}+</span>
              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.78rem' }}>{lang === 'vi' ? 'Dự án đã tham gia' : 'Projects Completed'}</span>
            </div>
          </div>


        </motion.div>
      </div>
    </div>
  );
}
