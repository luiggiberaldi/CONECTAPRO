'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Home3DCanvasProps {
  progress: number;
  mode: 'cliente' | 'profesional';
}

export default function Home3DCanvas({ progress, mode }: Home3DCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Utilizar referencias estables para evitar reiniciar el loop de renderizado al cambiar props
  const stateRef = useRef({
    progress,
    mode,
    mouseX: 0,
    mouseY: 0,
    targetMouseX: 0,
    targetMouseY: 0,
  });

  // Mantener los valores sincronizados con las props de React
  useEffect(() => {
    stateRef.current.progress = progress;
    stateRef.current.mode = mode;
  }, [progress, mode]);

  // Capturar movimiento del ratón para efecto parallax sutil (solo en clientes de escritorio)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalizar coordenadas a rango [-1, 1]
      stateRef.current.targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
      stateRef.current.targetMouseY = (e.clientY / window.innerHeight) * 2 - 1;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // 1. Configuración de Escena y Cámara
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.z = 6;

    // 2. Configuración del Renderizador
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);

    // Grupo contenedor principal de las figuras
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 3. Sistema de Partículas (Morphing)
    const particleCount = 1200;
    const geometry = new THREE.BufferGeometry();
    
    // Arrays para guardar posiciones de ambos estados
    const clientPositions = new Float32Array(particleCount * 3);
    const profPositions = new Float32Array(particleCount * 3);
    const currentPositions = new Float32Array(particleCount * 3);

    // Rellenar posiciones del Cliente (Esfera regular)
    for (let i = 0; i < particleCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 1.8; // Radio de la esfera

      clientPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      clientPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      clientPositions[i * 3 + 2] = r * Math.cos(phi);
    }

    // Rellenar posiciones del Profesional (Constelación / 3 Anillos Interconectados)
    for (let i = 0; i < particleCount; i++) {
      const ringIndex = i % 3;
      const angle = (i / particleCount) * Math.PI * 2 * 3;
      const r = 2.0; // Radio del anillo

      // Desviación aleatoria sutil para dar volumen
      const noise = (Math.random() - 0.5) * 0.15;

      if (ringIndex === 0) {
        // Anillo horizontal (Plano XY)
        profPositions[i * 3] = (r + noise) * Math.cos(angle);
        profPositions[i * 3 + 1] = (r + noise) * Math.sin(angle);
        profPositions[i * 3 + 2] = (Math.random() - 0.5) * 0.1;
      } else if (ringIndex === 1) {
        // Anillo vertical 1 (Plano XZ)
        profPositions[i * 3] = (r + noise) * Math.cos(angle);
        profPositions[i * 3 + 1] = (Math.random() - 0.5) * 0.1;
        profPositions[i * 3 + 2] = (r + noise) * Math.sin(angle);
      } else {
        // Anillo vertical 2 (Plano YZ)
        profPositions[i * 3] = (Math.random() - 0.5) * 0.1;
        profPositions[i * 3 + 1] = (r + noise) * Math.cos(angle);
        profPositions[i * 3 + 2] = (r + noise) * Math.sin(angle);
      }
    }

    // Inicializar posiciones en el estado del Cliente
    currentPositions.set(clientPositions);
    geometry.setAttribute('position', new THREE.BufferAttribute(currentPositions, 3));

    // Material de partículas con transparencia y glow
    const pointsMaterial = new THREE.PointsMaterial({
      color: 0x6366f1, // Indigo inicial
      size: 0.035,
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const particleSystem = new THREE.Points(geometry, pointsMaterial);
    mainGroup.add(particleSystem);

    // 4. Mallas Estructurales Complementarias (Efecto Glassmorphism / Wireframe)
    // Figura del Cliente: Globo Geodésico
    const clientSphereGeo = new THREE.IcosahedronGeometry(1.65, 2);
    const clientSphereMat = new THREE.MeshBasicMaterial({
      color: 0x818cf8,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
      blending: THREE.AdditiveBlending,
    });
    const clientSphere = new THREE.Mesh(clientSphereGeo, clientSphereMat);
    mainGroup.add(clientSphere);

    // Figura del Profesional: Nodos Octaédricos
    const profOctaGeo = new THREE.OctahedronGeometry(1.9, 1);
    const profOctaMat = new THREE.MeshBasicMaterial({
      color: 0xf43f5e,
      wireframe: true,
      transparent: true,
      opacity: 0.0,
      blending: THREE.AdditiveBlending,
    });
    const profOcta = new THREE.Mesh(profOctaGeo, profOctaMat);
    mainGroup.add(profOcta);

    // Iluminaciones
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1.2, 50);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // 5. Animación y Loop de Renderizado (RequestAnimationFrame)
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const state = stateRef.current;
      const elapsedTime = clock.getElapsedTime();

      // Interpolación suave del cursor del ratón (Lag amortiguado)
      state.mouseX += (state.targetMouseX - state.mouseX) * 0.05;
      state.mouseY += (state.targetMouseY - state.mouseY) * 0.05;

      // --- MORPHING DE PARTÍCULAS ---
      const positions = geometry.attributes.position.array as Float32Array;
      const targetSource = state.mode === 'cliente' ? clientPositions : profPositions;
      
      // Desplazamiento progresivo de cada punto hacia su objetivo
      const lerpFactor = 0.06; // Velocidad de transición entre estados

      for (let i = 0; i < particleCount * 3; i++) {
        const diff = targetSource[i] - positions[i];
        if (Math.abs(diff) > 0.001) {
          positions[i] += diff * lerpFactor;
        }
      }

      // Añadir una micro-vibración orgánica (respiración del sistema)
      const amplitude = 0.002;
      for (let i = 0; i < particleCount; i++) {
        const phase = i * 0.05 + elapsedTime * 1.5;
        positions[i * 3] += Math.sin(phase) * amplitude;
        positions[i * 3 + 1] += Math.cos(phase * 0.8) * amplitude;
        positions[i * 3 + 2] += Math.sin(phase * 1.2) * amplitude;
      }
      geometry.attributes.position.needsUpdate = true;

      // --- CAMBIO DINÁMICO DE COLORES ---
      // Cliente: Indigo (0x6366f1) | Profesional: Rose (0xf43f5e)
      const targetColor = state.mode === 'cliente' ? new THREE.Color(0x6366f1) : new THREE.Color(0xf43f5e);
      pointsMaterial.color.lerp(targetColor, 0.05);

      // --- OPACIDADES DE ESTRUCTURAS WIREFRAME ---
      if (state.mode === 'cliente') {
        clientSphereMat.opacity += (0.12 - clientSphereMat.opacity) * 0.05;
        profOctaMat.opacity += (0.0 - profOctaMat.opacity) * 0.05;
      } else {
        clientSphereMat.opacity += (0.0 - clientSphereMat.opacity) * 0.05;
        profOctaMat.opacity += (0.12 - profOctaMat.opacity) * 0.05;
      }

      // --- ROTACIONES Y ZOOM BASADOS EN SCROLL Y MOUSE (TELEMETRÍA) ---
      // Rotación constante sutil
      const baseRotationY = elapsedTime * 0.08;
      
      // Sumar rotación de scroll (una vuelta completa sobre Y en scroll máximo, y 45 grados en X)
      const scrollRotY = state.progress * Math.PI * 2;
      const scrollRotX = state.progress * Math.PI * 0.35;

      // Sumar el paralaje del ratón
      const mouseRotY = state.mouseX * 0.22;
      const mouseRotX = state.mouseY * 0.22;

      // Interpolación de las rotaciones finales en el grupo principal
      mainGroup.rotation.y = THREE.MathUtils.lerp(mainGroup.rotation.y, baseRotationY + scrollRotY + mouseRotY, 0.08);
      mainGroup.rotation.x = THREE.MathUtils.lerp(mainGroup.rotation.x, scrollRotX + mouseRotX, 0.08);

      // Rotación opuesta para las mallas de fondo para dar más dinamismo tridimensional
      clientSphere.rotation.y = -elapsedTime * 0.04;
      profOcta.rotation.x = -elapsedTime * 0.05;

      // Acercar la cámara a medida que se desplaza hacia abajo (Zoom)
      const targetCameraZ = 6.2 - state.progress * 1.6;
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetCameraZ, 0.08);

      renderer.render(scene, camera);
    };

    animate();

    // 6. Manejo de Redimensionamiento Responsivo
    const handleResize = () => {
      if (!container || !canvas) return;
      const width = container.clientWidth;
      const height = container.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('resize', handleResize, { passive: true });

    // 7. Liberación Limpia de Memoria WebGL (Cleanup)
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);

      // Eliminar listeners de la escena
      scene.remove(mainGroup);

      // Liberar geometrías y materiales
      geometry.dispose();
      pointsMaterial.dispose();
      clientSphereGeo.dispose();
      clientSphereMat.dispose();
      profOctaGeo.dispose();
      profOctaMat.dispose();

      // Desechar WebGL Renderer
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-full">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
    </div>
  );
}
