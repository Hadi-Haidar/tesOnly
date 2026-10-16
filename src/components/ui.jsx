import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';

// ─── Custom Cursor ─────────────────────────────────────────────────────
export function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHover, setIsHover] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Pointer spring (almost instant, super smooth)
  const dotX = useSpring(mouseX, { stiffness: 1200, damping: 50, mass: 0.08 });
  const dotY = useSpring(mouseY, { stiffness: 1200, damping: 50, mass: 0.08 });

  useEffect(() => {
    if (window.innerWidth < 768) return;

    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const attachHoverListeners = () => {
      const hoverables = document.querySelectorAll('a, button, .command-pill, [data-hoverable]');

      hoverables.forEach((el) => {
        el.addEventListener('mouseenter', () => setIsHover(true));
        el.addEventListener('mouseleave', () => setIsHover(false));
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    const observer = new MutationObserver(attachHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });
    attachHoverListeners();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      observer.disconnect();
    };
  }, [isVisible, mouseX, mouseY]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[10000]"
      style={{
        x: dotX,
        y: dotY,
        translateX: 0,
        translateY: 0,
      }}
      animate={{
        scale: isHover ? 1.2 : 1,
      }}
      transition={{ duration: 0.15 }}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
      >
        <path
          d="M3 2L10.5 20.5L13.8 13.8L20.5 10.5L3 2Z"
          fill="#ffffff"
          stroke="#18181b"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </svg>
    </motion.div>
  );
}

// ─── Spotlight Mouse Tracker (attaches CSS vars) ────────────────────────
export function useSpotlight(ref) {
  const handleMouseMove = useCallback((e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    ref.current.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    ref.current.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  }, [ref]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.addEventListener('mousemove', handleMouseMove);
    return () => el.removeEventListener('mousemove', handleMouseMove);
  }, [ref, handleMouseMove]);
}

// ─── Scroll-triggered reveal wrapper ────────────────────────────────────
export function Reveal({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Section header reusable ───────────────────────────────────────────
export function SectionHeader({ label, title, description, centered = false, theme = 'dark' }) {
  const isLight = theme === 'light';
  
  return (
    <Reveal>
      <div className={`mb-16 max-w-3xl ${centered ? 'mx-auto text-center' : ''}`}>
        <span className={`inline-flex items-center gap-2 font-mono text-xs tracking-widest uppercase mb-4 ${centered ? 'justify-center' : ''} ${isLight ? 'text-zinc-500' : 'text-[#a1a1aa]'}`}>
          <span className={`w-6 h-px ${isLight ? 'bg-zinc-300' : 'bg-[rgba(255,255,255,0.3)]'}`} />
          {label}
          {centered && <span className={`w-6 h-px ${isLight ? 'bg-zinc-300' : 'bg-[rgba(255,255,255,0.3)]'}`} />}
        </span>
        <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1] mb-4 ${isLight ? 'text-zinc-900' : 'text-white'}`}>
          {title}
        </h2>
        {description && (
          <p className={`text-base md:text-lg leading-relaxed ${isLight ? 'text-zinc-500' : 'text-[#a1a1aa]'}`}>
            {description}
          </p>
        )}
      </div>
    </Reveal>
  );
}

// ─── Noise Overlay ──────────────────────────────────────────────────────
export function NoiseOverlay() {
  return <div className="noise-overlay" />;
}

// ─── Neon Divider ───────────────────────────────────────────────────────
export function NeonDivider({ className = '' }) {
  return (
    <div className={`max-w-5xl mx-auto w-full px-4 ${className}`}>
      <div className="neon-divider" />
    </div>
  );
}
