'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function SubPageHero3D({ children }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    let width = container.clientWidth;
    let height = container.clientHeight;

    const rand = (min, max) => min + Math.random() * (max - min);

    // --- RANDOM CAMERA PERSPECTIVE & SCENE TILT ---
    // Keep shapes/colors identical to homepage, but view them from a different random angle.
    const sceneTiltX = rand(-0.4, 0.4); // Random pitch tilt
    const sceneTiltY = rand(-0.6, 0.6); // Random yaw tilt
    const sceneTiltZ = rand(-0.3, 0.3); // Random roll tilt

    // 1. Scene Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0a0a, 0.015);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    
    // Position the camera slightly differently to alter the viewpoint
    const camX = rand(-3, 3);
    const camY = rand(-2, 2);
    const camZ = rand(19, 21);
    camera.position.set(camX, camY, camZ);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 2. Lights (Keep brand orange/cyan lights)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLightOrange = new THREE.PointLight(0xff6b00, 3.5, 45);
    pointLightOrange.position.set(10, 8, 10);
    scene.add(pointLightOrange);

    const pointLightCyan = new THREE.PointLight(0x00f0ff, 2.5, 45);
    pointLightCyan.position.set(-10, -8, 8);
    scene.add(pointLightCyan);

    // 3. Main Objects Group
    const heroGroup = new THREE.Group();
    // Apply the random scene tilt to the group so it rotates at a different angle
    heroGroup.rotation.set(sceneTiltX, sceneTiltY, sceneTiltZ);
    scene.add(heroGroup);

    // Keep shapes identical to homepage (scaled down to fit height)
    // Left shape
    const geoA = new THREE.IcosahedronGeometry(3.5, 1);
    const matA = new THREE.MeshStandardMaterial({
      color: 0xff6b00,
      wireframe: true,
      emissive: 0xff4500,
      emissiveIntensity: 0.25,
      metalness: 0.8,
      roughness: 0.2,
    });
    const meshA = new THREE.Mesh(geoA, matA);
    meshA.position.set(-7, 2, -2);
    heroGroup.add(meshA);

    const innerGeoA = new THREE.IcosahedronGeometry(2.0, 0);
    const innerMatA = new THREE.MeshStandardMaterial({
      color: 0x111111,
      emissive: 0xff6b00,
      emissiveIntensity: 0.6,
      roughness: 0.1,
    });
    const innerMeshA = new THREE.Mesh(innerGeoA, innerMatA);
    meshA.add(innerMeshA);

    // Right shape
    const geoB = new THREE.DodecahedronGeometry(2.6, 1);
    const matB = new THREE.MeshStandardMaterial({
      color: 0xffa500,
      wireframe: true,
      emissive: 0xff6b00,
      emissiveIntensity: 0.2,
      metalness: 0.9,
      roughness: 0.1,
    });
    const meshB = new THREE.Mesh(geoB, matB);
    meshB.position.set(7, -2, 1);
    heroGroup.add(meshB);

    // 4. Constellation Lines & Particles Network (Keep brand orange)
    const pCount = 50;
    const pPositions = new Float32Array(pCount * 3);
    const pVelocities = [];

    for (let i = 0; i < pCount; i++) {
      pPositions[i * 3] = (Math.random() - 0.5) * 28;
      pPositions[i * 3 + 1] = (Math.random() - 0.5) * 18;
      pPositions[i * 3 + 2] = (Math.random() - 0.5) * 15;

      pVelocities.push({
        x: (Math.random() - 0.5) * 0.01,
        y: (Math.random() - 0.5) * 0.01,
        z: (Math.random() - 0.5) * 0.01,
      });
    }

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));

    const pMat = new THREE.PointsMaterial({
      size: 0.2,
      color: 0xff8800,
      transparent: true,
      opacity: 0.8,
    });
    const particleSystem = new THREE.Points(pGeo, pMat);
    heroGroup.add(particleSystem);

    const linesGeo = new THREE.BufferGeometry();
    const linesMat = new THREE.LineBasicMaterial({
      color: 0xff6b00,
      transparent: true,
      opacity: 0.12,
    });
    const linesMesh = new THREE.LineSegments(linesGeo, linesMat);
    heroGroup.add(linesMesh);

    // 5. Starfield Particles Background
    const starsCount = 180;
    const starsGeo = new THREE.BufferGeometry();
    const starsPos = new Float32Array(starsCount * 3);
    for (let i = 0; i < starsCount * 3; i += 3) {
      starsPos[i] = (Math.random() - 0.5) * 60;
      starsPos[i + 1] = (Math.random() - 0.5) * 45;
      starsPos[i + 2] = (Math.random() - 0.5) * 45;
    }
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starsPos, 3));
    const starsMat = new THREE.PointsMaterial({
      size: 0.08,
      color: 0xffffff,
      transparent: true,
      opacity: 0.4,
    });
    const starsPoints = new THREE.Points(starsGeo, starsMat);
    scene.add(starsPoints);

    // 6. Interactive Mouse Offsets
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      mouseX = x / (rect.width / 2);
      mouseY = y / (rect.height / 2);
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 7. Animation Frame Loop
    let animId;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Lerp mouse interaction
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      // Spin the group containing the tilted shapes
      heroGroup.rotation.y = sceneTiltY + targetX * 0.25 + elapsed * 0.03;
      heroGroup.rotation.x = sceneTiltX - targetY * 0.18;

      camera.position.x = camX + targetX * 1.0;
      camera.position.y = camY - targetY * 1.0;
      camera.lookAt(0, 0, 0);

      // Rotate individual shapes on their local axes
      meshA.rotation.x = elapsed * 0.12;
      meshA.rotation.y = elapsed * 0.18;

      meshB.rotation.x = -elapsed * 0.15;
      meshB.rotation.z = elapsed * 0.12;

      // Update network lines
      const positions = pGeo.attributes.position.array;
      const linePositions = [];

      for (let i = 0; i < pCount; i++) {
        positions[i * 3] += pVelocities[i].x;
        positions[i * 3 + 1] += pVelocities[i].y;
        positions[i * 3 + 2] += pVelocities[i].z;

        if (Math.abs(positions[i * 3]) > 14) pVelocities[i].x *= -1;
        if (Math.abs(positions[i * 3 + 1]) > 9) pVelocities[i].y *= -1;
        if (Math.abs(positions[i * 3 + 2]) > 8) pVelocities[i].z *= -1;

        for (let j = i + 1; j < pCount; j++) {
          const dx = positions[i * 3] - positions[j * 3];
          const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
          const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < 5.0) {
            linePositions.push(
              positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
              positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]
            );
          }
        }
      }

      pGeo.attributes.position.needsUpdate = true;
      linesGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));

      starsPoints.rotation.y = elapsed * 0.008;

      renderer.render(scene, camera);
    };

    animate();

    // 8. Resize Handler
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
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      geoA.dispose();
      matA.dispose();
      innerGeoA.dispose();
      innerMatA.dispose();
      geoB.dispose();
      matB.dispose();
      pGeo.dispose();
      pMat.dispose();
      linesGeo.dispose();
      linesMat.dispose();
      starsGeo.dispose();
      starsMat.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        background: 'linear-gradient(180deg, #050505 0%, #0D0600 50%, #050505 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        padding: 'calc(var(--nav-height) + 2.5rem) 0 4rem',
        textAlign: 'center',
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

      {/* Radial Gradient Glow Overlay */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 500,
          height: 300,
          background: 'var(--color-primary)',
          borderRadius: '50%',
          filter: 'blur(120px)',
          opacity: 0.08,
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Children Content Layer */}
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        {children}
      </div>
    </div>
  );
}
