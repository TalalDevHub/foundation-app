"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;
  varying vec2 vUv;

  // Pseudo-random generator for procedural noise
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  // Smooth 2D Value Noise
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  // Fractional Brownian Motion (fBm) to generate layered organic wave octaves
  float fbm(vec2 p) {
    float val = 0.0;
    float amp = 0.5;
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
    for (int i = 0; i < 4; i++) {
      val += amp * noise(p);
      p = rot * p * 2.1;
      amp *= 0.48;
    }
    return val;
  }

  void main() {
    // 1. Aspect-ratio-corrected coordinate space
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);

    // 2. Mouse displacement field
    vec2 mouseOffset = (u_mouse - 0.5) * 0.4;
    vec2 flowUv = uv + mouseOffset;

    // 3. Dynamic multi-octave plasma flow with time uniforms
    float t = u_time * 0.18;
    vec2 q = vec2(fbm(flowUv + t * 0.3), fbm(flowUv + vec2(5.2, 1.3)));
    vec2 r = vec2(fbm(flowUv + 4.0 * q + vec2(1.7, 9.2) + t * 0.2), fbm(flowUv + 4.0 * q + vec2(8.3, 2.8) + t * 0.25));
    float flow = fbm(flowUv + 4.0 * r);

    // 4. Color Palette (Deep Slate base -> Electric Indigo -> Cyber Cyan)
    vec3 colDeepSpace = vec3(0.02, 0.04, 0.08);
    vec3 colIndigo    = vec3(0.18, 0.22, 0.65);
    vec3 colCyan      = vec3(0.08, 0.62, 0.72);

    vec3 color = mix(colDeepSpace, colIndigo, clamp(flow * 1.6, 0.0, 1.0));
    color = mix(color, colCyan, clamp(length(q) * 0.75, 0.0, 1.0));

    // 5. Film Grain Overlay (Prevents color banding & adds analog texture)
    float grain = (hash(gl_FragCoord.xy + fract(u_time)) - 0.5) * 0.045;
    color += grain;

    // Vignette falloff towards edges for visual focus on center text
    float dist = length(uv);
    color *= (1.0 - smoothstep(0.45, 1.3, dist));

    gl_FragColor = vec4(color, 1.0);
  }
`;

export function ShaderHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (reducedMotion || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 520;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);

    const uniforms = {
      u_time: { value: 0.0 },
      u_resolution: { value: new THREE.Vector2(width * Math.min(window.devicePixelRatio, 1.5), height * Math.min(window.devicePixelRatio, 1.5)) },
      u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      depthWrite: false,
      depthTest: false,
    });

    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(quad);

    let animationId: number;
    const clock = new THREE.Clock();
    let isVisible = true;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = THREE.MathUtils.clamp((e.clientX - rect.left) / rect.width, 0, 1);
      const y = THREE.MathUtils.clamp(1.0 - (e.clientY - rect.top) / rect.height, 0, 1);
      uniforms.u_mouse.value.set(x, y);
    };

    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
      if (isVisible) clock.start();
      else clock.stop();
    };

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      uniforms.u_resolution.value.set(w * Math.min(window.devicePixelRatio, 1.5), h * Math.min(window.devicePixelRatio, 1.5));
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      if (isVisible) {
        uniforms.u_time.value = clock.getElapsedTime();
        renderer.render(scene, camera);
      }
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      cancelAnimationFrame(animationId);
      material.dispose();
      quad.geometry.dispose();
      renderer.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [reducedMotion]);

  return (
    <section className="relative w-full h-[540px] sm:h-[600px] flex items-center justify-center overflow-hidden rounded-3xl border border-slate-800 my-6">
      {reducedMotion ? (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900" />
      ) : (
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />
      )}

      {/* Hero Content Overlay with WCAG AA High Contrast */}
      <div className="relative z-10 max-w-2xl px-6 text-center space-y-4 pointer-events-none">
        <span className="inline-block px-3.5 py-1 bg-slate-900/80 backdrop-blur-md border border-blue-500/30 text-blue-300 text-xs font-semibold rounded-full uppercase tracking-wider shadow-lg">
          Software Developer & CS Student
        </span>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white drop-shadow-md">
          Talal Shah
        </h1>
        <p className="text-slate-200 text-base sm:text-lg leading-relaxed max-w-xl mx-auto drop-shadow">
          Crafting responsive full-stack applications, interactive real-time WebGL graphics, and automated CI/CD pipelines.
        </p>
      </div>
    </section>
  );
}
