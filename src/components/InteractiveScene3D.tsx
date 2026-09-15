"use client";

import React, { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

function ReactiveGeometry({ color, wireframe }: { color: string; wireframe: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!meshRef.current) return;
    const { x, y } = state.pointer;
    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, y * 0.8, 0.05);
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, x * 0.8, 0.05);
  });

  return (
    <Float speed={2.5} rotationIntensity={1.2} floatIntensity={1.5}>
      <mesh
        ref={meshRef}
        scale={hovered ? 1.4 : 1.25}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        className="cursor-pointer"
      >
        <icosahedronGeometry args={[1.5, 3]} />
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={hovered ? 0.6 : 0.35}
          speed={hovered ? 3.5 : 1.8}
          roughness={0.15}
          metalness={0.8}
          wireframe={wireframe}
        />
      </mesh>
    </Float>
  );
}

export function InteractiveScene3D() {
  const [color, setColor] = useState("#3b82f6");
  const [wireframe, setWireframe] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  if (reducedMotion) {
    return (
      <div className="w-full h-80 flex flex-col items-center justify-center bg-slate-900/60 border border-slate-800 rounded-2xl p-6 text-center">
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-400 shadow-lg mb-3 animate-pulse" />
        <p className="text-xs text-slate-400 font-mono">Reduced-motion detected: 3D Canvas disabled for performance & comfort.</p>
      </div>
    );
  }

  return (
    <section className="w-full max-w-2xl mx-auto my-10 px-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Interactive 3D Stage</h2>
            <p className="text-xs text-slate-400">Pointer-reactive procedural geometry with dynamic distortion shaders.</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setColor((prev) => (prev === "#3b82f6" ? "#10b981" : prev === "#10b981" ? "#ec4899" : "#3b82f6"))}
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

        <div className="w-full h-72 sm:h-80 bg-slate-950 rounded-xl border border-slate-800/80 relative overflow-hidden">
          <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-xs text-slate-500 font-mono">Loading 3D Canvas...</div>}>
            <Canvas
              dpr={[1, 1.5]}
              camera={{ position: [0, 0, 4.5], fov: 45 }}
              gl={{ antialias: true, powerPreference: "high-performance" }}
            >
              <ambientLight intensity={0.7} />
              <directionalLight position={[10, 10, 5]} intensity={1.2} />
              <pointLight position={[-10, -5, -5]} color="#60a5fa" intensity={1.5} />
              <ReactiveGeometry color={color} wireframe={wireframe} />
            </Canvas>
          </Suspense>
        </div>
      </div>
    </section>
  );
}
