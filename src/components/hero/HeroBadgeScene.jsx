// ─── HeroBadgeScene — R3F canvas, camera, lighting & studio reflections ──────
// Mounted only on wide screens (≥1100px) where the hero has free side space.
// Rendering pauses automatically when the hero scrolls out of view.

import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import BadgeCardMesh from './BadgeCardMesh';

const QUERY = '(min-width: 1100px)';

function useMediaQuery(query) {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches
  );
  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = (e) => setMatches(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);
  return matches;
}

export default function HeroBadgeScene({ className = '', style }) {
  const isWide = useMediaQuery(QUERY);
  const wrapRef = useRef(null);
  const [inView, setInView] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!wrapRef.current) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0,
    });
    io.observe(wrapRef.current);
    return () => io.disconnect();
  }, [isWide]);

  if (!isWide) return null;

  return (
    <div
      ref={wrapRef}
      id="hero-badge"
      role="img"
      aria-label="Interactive 3D ID badge for Hadi, Software Architect — drag to swing it"
      className={className}
      style={{
        ...style,
        opacity: ready ? 1 : 0,
        transition: 'opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.3s',
        pointerEvents: 'none',
      }}
    >
      <Canvas
        flat
        dpr={[1, 2]}
        eventSource={typeof document !== 'undefined' ? document.body : undefined}
        eventPrefix="client"
        frameloop={inView ? 'always' : 'never'}
        camera={{ position: [0, 0, 17], fov: 30, near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        onCreated={() => setReady(true)}
      >
        {/* Soft studio key + fill */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 6, 9]} intensity={1.25} />
        <directionalLight position={[-6, 2, 4]} intensity={0.35} color="#e4e6ff" />

        {/* Offline studio environment → glossy metal & plastic reflections */}
        <Environment resolution={256} frames={1}>
          <Lightformer form="rect" intensity={3} position={[0, 6, 5]} scale={[12, 3, 1]} />
          <Lightformer form="rect" intensity={2} position={[-6, 1, 3]} scale={[3, 10, 1]} />
          <Lightformer form="rect" intensity={1.4} position={[6, -1, 3]} scale={[3, 8, 1]} />
          <Lightformer form="ring" intensity={2.5} position={[2, 3, 7]} scale={2} />
          <Lightformer form="rect" intensity={0.6} position={[0, -6, 2]} scale={[10, 2, 1]} />
        </Environment>

        <Suspense fallback={null}>
          <BadgeCardMesh />
        </Suspense>
      </Canvas>
    </div>
  );
}
