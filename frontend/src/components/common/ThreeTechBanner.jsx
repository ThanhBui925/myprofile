'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function ThreeTechBanner({
  height = '480px',
  titleVi = 'DÂY CHUYỀN TỰ ĐỘNG HÓA THÔNG MINH 4.0',
  titleEn = 'SMART INDUSTRIAL AUTOMATION 4.0',
  subVi = 'Mô hình 3D tương tác tương lai — Xoay theo góc nhìn con trỏ chuột',
  subEn = 'Interactive 3D Future Model — Rotates dynamically with mouse angle',
}) {
  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const heightPx = container.clientHeight;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0a0a, 0.015);

    const camera = new THREE.PerspectiveCamera(45, width / heightPx, 0.1, 1000);
    camera.position.set(0, 5, 22);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xff6b00, 2.5);
    mainLight.position.set(10, 20, 15);
    scene.add(mainLight);

    const cyanLight = new THREE.PointLight(0x00f0ff, 3, 30);
    cyanLight.position.set(-10, 8, -5);
    scene.add(cyanLight);

    const orangeLight = new THREE.PointLight(0xff5500, 4, 35);
    orangeLight.position.set(10, -5, 10);
    scene.add(orangeLight);

    // 3. 3D Main Group (Will tilt & rotate with mouse)
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // Core Tech Sphere / Node
    const coreGeo = new THREE.IcosahedronGeometry(3.2, 2);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x111111,
      metalness: 0.9,
      roughness: 0.2,
      wireframe: true,
      emissive: 0xff6b00,
      emissiveIntensity: 0.15,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    mainGroup.add(coreMesh);

    // Inner Glowing Core
    const innerGeo = new THREE.SphereGeometry(2.1, 32, 32);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0xff4500,
      emissive: 0xff6b00,
      emissiveIntensity: 0.8,
      roughness: 0.3,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    mainGroup.add(innerMesh);

    // Orbiting Rings
    const ringGroup = new THREE.Group();
    mainGroup.add(ringGroup);

    const ringMat1 = new THREE.MeshStandardMaterial({ color: 0xff6b00, metalness: 0.8, roughness: 0.2, emissive: 0xff5500, emissiveIntensity: 0.4 });
    const ringGeo1 = new THREE.TorusGeometry(5.2, 0.08, 16, 100);
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 3;
    ringGroup.add(ring1);

    const ringMat2 = new THREE.MeshStandardMaterial({ color: 0x00d2ff, metalness: 0.9, roughness: 0.1, emissive: 0x00a2ff, emissiveIntensity: 0.5 });
    const ringGeo2 = new THREE.TorusGeometry(6.5, 0.06, 16, 100);
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.y = Math.PI / 4;
    ringGroup.add(ring2);

    const ringGeo3 = new THREE.TorusGeometry(7.8, 0.04, 16, 100);
    const ring3 = new THREE.Mesh(ringGeo3, ringMat1);
    ring3.rotation.x = -Math.PI / 4;
    ringGroup.add(ring3);

    // 4. Ground Grid & Floating Nodes
    const gridHelper = new THREE.GridHelper(40, 40, 0xff6b00, 0x222222);
    gridHelper.position.y = -6;
    mainGroup.add(gridHelper);

    // Orbiting Floating Tech Cubes / Satellite Nodes
    const nodeGroup = new THREE.Group();
    mainGroup.add(nodeGroup);

    const cubeGeo = new THREE.BoxGeometry(0.7, 0.7, 0.7);
    const cubeMat = new THREE.MeshStandardMaterial({ color: 0xffaa00, metalness: 0.9, roughness: 0.1, emissive: 0xff4500, emissiveIntensity: 0.3 });

    const numNodes = 12;
    const nodeMeshes = [];
    for (let i = 0; i < numNodes; i++) {
      const mesh = new THREE.Mesh(cubeGeo, cubeMat);
      const angle = (i / numNodes) * Math.PI * 2;
      const radius = 8.5 + (i % 3) * 1.2;
      mesh.position.x = Math.cos(angle) * radius;
      mesh.position.z = Math.sin(angle) * radius;
      mesh.position.y = (Math.sin(i * 1.5) * 2.5);
      nodeGroup.add(mesh);
      nodeMeshes.push({ mesh, angle, radius, speed: 0.008 + (i % 4) * 0.003, yBase: mesh.position.y });
    }

    // 5. Starfield Particles
    const particleCount = 400;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 60;
      particlePos[i + 1] = (Math.random() - 0.5) * 40;
      particlePos[i + 2] = (Math.random() - 0.5) * 60;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({ size: 0.15, color: 0xff8800, transparent: true, opacity: 0.6 });
    const particlePoints = new THREE.Points(particleGeo, particleMat);
    scene.add(particlePoints);

    // 6. Mouse Control & Smooth Interpolation (Lerp)
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      mouseX = (x / (rect.width / 2));
      mouseY = (y / (rect.height / 2));
    };

    const handleMouseLeave = () => {
      mouseX = 0;
      mouseY = 0;
      setIsHovered(false);
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('mouseenter', handleMouseEnter);

    // 7. Animation Loop
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse rotation lerp
      targetRotationY = mouseX * 0.45; // Turn Y
      targetRotationX = mouseY * 0.3;  // Pitch X

      mainGroup.rotation.y += (targetRotationY - mainGroup.rotation.y) * 0.05;
      mainGroup.rotation.x += (targetRotationX - mainGroup.rotation.x) * 0.05;

      // Self rotation of 3D elements
      coreMesh.rotation.y = elapsedTime * 0.2;
      coreMesh.rotation.x = elapsedTime * 0.15;
      innerMesh.rotation.y = -elapsedTime * 0.3;

      ring1.rotation.z = elapsedTime * 0.4;
      ring2.rotation.z = -elapsedTime * 0.5;
      ring3.rotation.z = elapsedTime * 0.3;

      // Orbit satellite nodes
      nodeMeshes.forEach((item, idx) => {
        item.angle += item.speed;
        item.mesh.position.x = Math.cos(item.angle) * item.radius;
        item.mesh.position.z = Math.sin(item.angle) * item.radius;
        item.mesh.position.y = item.yBase + Math.sin(elapsedTime * 2 + idx) * 0.4;
        item.mesh.rotation.x += 0.02;
        item.mesh.rotation.y += 0.02;
      });

      particlePoints.rotation.y = elapsedTime * 0.03;

      renderer.render(scene, camera);
    };

    animate();

    // 8. Resize Handler
    const handleResize = () => {
      if (!containerRef.current) return;
      const newW = containerRef.current.clientWidth;
      const newH = containerRef.current.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('mouseenter', handleMouseEnter);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height,
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        background: 'radial-gradient(circle at 50% 50%, #1a0a00 0%, #0a0a0a 80%)',
        border: '1px solid var(--color-border-muted)',
        boxShadow: isHovered ? '0 30px 80px rgba(255, 107, 0, 0.25)' : '0 20px 60px rgba(0, 0, 0, 0.6)',
        transition: 'box-shadow 0.4s ease, border-color 0.4s ease',
        borderColor: isHovered ? 'var(--color-primary)' : 'var(--color-border-muted)',
      }}
    >
      {/* Three.js Canvas Container */}
      <div ref={containerRef} style={{ width: '100%', height: '100%', cursor: 'grab' }} />

      {/* Floating 3D Badge & Title Overlay */}
      <div
        style={{
          position: 'absolute',
          top: '2rem',
          left: '2rem',
          pointerEvents: 'none',
          zIndex: 5,
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1rem',
            background: 'rgba(255, 107, 0, 0.15)',
            border: '1px solid var(--color-primary)',
            borderRadius: '100px',
            color: 'var(--color-primary)',
            fontSize: '0.8rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            backdropFilter: 'blur(8px)',
            marginBottom: '0.75rem',
          }}
        >
          <span style={{ width: 8, height: 8, background: 'var(--color-primary)', borderRadius: '50%', boxShadow: '0 0 10px var(--color-primary)' }} />
          3D WebGL Realtime Engine
        </span>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '3rem 2.5rem 2rem',
          background: 'linear-gradient(to top, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.4) 60%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 5,
        }}
      >
        <h3
          style={{
            color: '#fff',
            fontFamily: 'var(--font-heading)',
            fontSize: '1.75rem',
            fontWeight: 800,
            marginBottom: '0.5rem',
            letterSpacing: '0.03em',
            textShadow: '0 2px 10px rgba(0,0,0,0.8)',
          }}
        >
          {titleVi}
        </h3>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', margin: 0, lineHeight: 1.5 }}>
          {subVi}
        </p>
      </div>
    </div>
  );
}
