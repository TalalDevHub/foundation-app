"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export function InteractiveScene3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [wireframe, setWireframe] = useState(false);
  const [colorMode, setColorMode] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  const colors = [0x3b82f6, 0x10b981, 0xec4899];
  const materialRef = useRef<THREE.MeshStandardMaterial | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);
  }, []);

  useEffect(() => {
    if (reducedMotion || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || 300;
    const height = container.clientHeight || 300;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 4.2;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0x60a5fa, 2, 50);
    pointLight.position.set(-5, -5, 2);
    scene.add(pointLight);

    const geometry = new THREE.IcosahedronGeometry(1.4, 2);
    const material = new THREE.MeshStandardMaterial({
      color: colors[colorMode],
      wireframe: wireframe,
      roughness: 0.2,
      metalness: 0.8,
    });
    materialRef.current = material;

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetX = x * 0.8;
      targetY = y * 0.8;
    };

    container.addEventListener("pointermove", handlePointerMove);

    let animationId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const delta = clock.getElapsedTime();

      mesh.rotation.y += 0.005;
      mesh.position.y = Math.sin(delta * 1.5) * 0.1;

      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;
      mesh.rotation.x = mouseY;
      mesh.rotation.y += mouseX * 0.02;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("pointermove", handlePointerMove);
      cancelAnimationFrame(animationId);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [reducedMotion]);

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.color.setHex(colors[colorMode]);
      materialRef.current.wireframe = wireframe;
    }
  }, [colorMode, wireframe]);

  if (reducedMotion) {
    return (
      <div className="w-full h-72 flex flex-col items-center justify-center bg-slate-900/60 border border-slate-800 rounded-2xl p-6 text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-400 mb-3 shadow-lg" />
        <p className="text-xs text-slate-400 font-mono">Reduced-motion active: Static view enabled.</p>
      </div>
    );
  }

  return (
    <section className="w-full max-w-2xl mx-auto my-8 px-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Interactive 3D Stage</h2>
            <p className="text-xs text-slate-400">Pointer-reactive procedural geometry powered by Three.js.</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setColorMode((prev) => (prev + 1) % colors.length)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-lg border border-slate-700 transition cursor-pointer"
            >
              Cycle Color
            </button>
            <button
              onClick={() => setWireframe((prev) => !prev)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-lg border border-slate-700 transition cursor-pointer"
            >
              {wireframe ? "Solid Mesh" : "Wireframe"}
            </button>
          </div>
        </div>

        <div
          ref={containerRef}
          className="w-full h-72 sm:h-80 bg-slate-950 rounded-xl border border-slate-800/80 cursor-grab active:cursor-grabbing overflow-hidden"
        />
      </div>
    </section>
  );
}
