// ─── ABOUT PAGE — Dual Theme (Light & Dark) with Interactive Toggle ───────────
// Features:
//  1. Theme Toggle  → Switch instantly between Light mode and Dark mode (persisted in localStorage)
//  2. Hero          → Parallax background portrait (bright studio in light mode, moody dark in dark mode)
//  3. Manifesto     → Scroll-linked word illumination
//  4. Stats         → Metric counters with spring interpolation
//  5. Skills Matrix → 4 architectural categories from your authentic portfolio
//  6. Journey       → Horizontal pinned timeline (decorative "TIMELINE" watermark removed)
//  7. Principles    → Sticky stacking cards with elegant shadows & accents
//  8. Facts + CTA   → Academic background, direct contact links, and seamless routing

import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  animate,
  AnimatePresence,
} from 'framer-motion';
import portraitLight from '../assets/about-portrait-light.jpg';
import {
  ABOUT_PROFILE,
  ABOUT_MANIFESTO,
  ABOUT_STATS,
  ABOUT_PARTNERSHIP_PILLARS,
  ABOUT_JOURNEY,
  ABOUT_PRINCIPLES,
  ABOUT_FACTS,
} from '../data/about';
import { Reveal } from '../components/ui';

const EASE = [0.16, 1, 0.3, 1];

// ─── Small Shared Components ─────────────────────────────────────────────────
function Eyebrow({ children, center = false, isDark = false }) {
  return (
    <span
      className={`inline-flex items-center gap-2.5 font-mono text-xs tracking-[0.2em] uppercase font-semibold ${isDark ? 'text-zinc-400' : 'text-zinc-600'
        } ${center ? 'justify-center' : ''}`}
    >
      <span className={`w-6 h-px ${isDark ? 'bg-zinc-600' : 'bg-zinc-300'}`} />
      {children}
      {center && <span className={`w-6 h-px ${isDark ? 'bg-zinc-600' : 'bg-zinc-300'}`} />}
    </span>
  );
}

function MaskLine({ children, delay = 0, className = '' }) {
  return (
    <span className="block overflow-hidden py-[0.06em] -my-[0.06em]">
      <motion.span
        className={`block ${className}`}
        initial={{ y: '115%' }}
        animate={{ y: 0 }}
        transition={{ duration: 1.1, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  );
}

// ─── Top Scroll Progress Bar & Dual-Theme Header ─────────────────────────────
function ScrollProgressBar({ isDark }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28, restDelta: 0.001 });
  return (
    <motion.div
      style={{ scaleX }}
      className={`fixed top-0 left-0 right-0 h-[3px] origin-left z-[120] ${isDark
        ? 'bg-gradient-to-r from-zinc-500 via-zinc-200 to-white'
        : 'bg-gradient-to-r from-zinc-400 via-zinc-700 to-zinc-950'
        }`}
    />
  );
}

function AboutHeader({ isDark, toggleTheme }) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
      className={`fixed top-0 left-0 right-0 z-[100] h-16 border-b transition-colors duration-500 backdrop-blur-xl ${isDark
        ? 'border-white/[0.08] bg-[#050505]/75 text-white'
        : 'border-zinc-200/80 bg-white/80 text-zinc-900 shadow-xs'
        }`}
      style={{ WebkitBackdropFilter: 'blur(20px)' }}
    >
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-8 flex items-center justify-between">
        <Link
          to="/"
          data-hoverable
          className={`group inline-flex items-center gap-2 text-sm font-medium transition-colors ${isDark ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-zinc-950'
            }`}
        >
          <span className="inline-block transition-transform duration-300 group-hover:-translate-x-1">←</span>
          Back to portfolio
        </Link>

        <div className="flex items-center">
          {/* Modern Professional Dual-Segment Theme Switcher */}
          <div
            role="radiogroup"
            aria-label="Color theme selector"
            className={`inline-flex items-center p-1 rounded-full border transition-all duration-300 backdrop-blur-md shadow-xs ${isDark
              ? 'bg-white/[0.06] border-white/12 shadow-black/40'
              : 'bg-zinc-100/90 border-zinc-200/90 shadow-black/[0.03]'
              }`}
          >
            {/* Light Option */}
            <button
              type="button"
              role="radio"
              aria-checked={!isDark}
              data-hoverable
              onClick={() => isDark && toggleTheme()}
              title="Light theme"
              className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 cursor-pointer select-none ${!isDark
                ? 'text-zinc-950 font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
                }`}
            >
              {!isDark && (
                <motion.span
                  layoutId="about-theme-pill"
                  className="absolute inset-0 rounded-full bg-white shadow-xs border border-zinc-200/70"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <svg
                  className="w-3.5 h-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2" />
                  <path d="M12 20v2" />
                  <path d="m4.93 4.93 1.41 1.41" />
                  <path d="m17.66 17.66 1.41 1.41" />
                  <path d="M2 12h2" />
                  <path d="M20 12h2" />
                  <path d="m6.34 17.66-1.41 1.41" />
                  <path d="m19.07 4.93-1.41 1.41" />
                </svg>
                <span className="hidden xs:inline tracking-tight">Light</span>
              </span>
            </button>

            {/* Dark Option */}
            <button
              type="button"
              role="radio"
              aria-checked={isDark}
              data-hoverable
              onClick={() => !isDark && toggleTheme()}
              title="Dark theme"
              className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 cursor-pointer select-none ${isDark
                ? 'text-white font-semibold'
                : 'text-zinc-500 hover:text-zinc-800'
                }`}
            >
              {isDark && (
                <motion.span
                  layoutId="about-theme-pill"
                  className="absolute inset-0 rounded-full bg-white/15 shadow-xs border border-white/20"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <svg
                  className="w-3.5 h-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
                <span className="hidden xs:inline tracking-tight">Dark</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

// ─── 1. HERO — Permanent Sleek Dark Mode (Always Clean & Unaltered) ───────────
function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });

  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '8%']);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative h-screen min-h-[680px] w-full overflow-hidden bg-[#050505]"
    >
      {/* Background portrait — framed with breathing room so full head, face, and details show */}
      <motion.div style={{ y: imgY }} className="absolute inset-0 will-change-transform">
        <img
          src={portraitLight}
          alt="Portrait of Hadi Haidar"
          className="w-full h-full object-cover object-[78%_14%] sm:object-[80%_16%] md:object-[82%_18%] transition-opacity duration-700"
          draggable={false}
        />
      </motion.div>

      {/* Dynamic gradient overlays — dark mode for high-contrast crisp typography */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/85 md:via-[#050505]/45 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/40" />

      {/* Main Hero Copy — Always crisp white and silver */}
      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className="relative z-10 h-full max-w-7xl mx-auto px-5 sm:px-8 flex flex-col justify-center pt-20"
      >
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: EASE }}
          className="mb-4"
        >
          <Eyebrow isDark={true}>About Me</Eyebrow>
        </motion.div>

        <h1 className="font-bold tracking-tighter leading-[0.92] text-[clamp(3.8rem,11vw,9.5rem)] text-white">
          <MaskLine delay={0.5}>{ABOUT_PROFILE.firstLine}</MaskLine>
          <MaskLine
            delay={0.65}
            className="bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent"
          >
            {ABOUT_PROFILE.secondLine}
          </MaskLine>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.85, ease: EASE }}
          className="mt-6 max-w-lg sm:max-w-xl text-lg sm:text-2xl leading-relaxed font-normal text-zinc-300"
        >
          {ABOUT_PROFILE.tagline}
        </motion.p>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        style={{ opacity: textOpacity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2.5"
      >
        <span className="font-mono text-[10px] tracking-[0.25em] uppercase font-semibold text-zinc-500">
          Scroll
        </span>
        <span className="relative block h-10 w-px overflow-hidden bg-white/15">
          <motion.span
            className="absolute left-0 top-0 h-4 w-px bg-zinc-300"
            animate={{ y: ['-100%', '240%'] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </span>
      </motion.div>
    </section>
  );
}


// ─── 2. MANIFESTO — Dual Scroll-Linked Word Reveal ───────────────────────────
const HIGHLIGHT_WORDS = new Set([
  'alive.',
  'WebSocket',
  'messaging',
  'scalable',
  'backend',
  'architectures',
  'pixel-perfect',
  'performance,',
  'clean',
  'architecture,',
  'delightful',
  'experience.',
]);

function ManifestoWord({ children, progress, range, isHighlight, isDark }) {
  const opacity = useTransform(progress, range, [0.18, 1]);
  const y = useTransform(progress, range, [6, 0]);

  return (
    <span className="inline-block mr-[0.26em]">
      <motion.span
        style={{ opacity, y }}
        className={`inline-block transition-colors ${isHighlight
          ? isDark
            ? 'text-white font-bold'
            : 'text-zinc-950 font-bold'
          : isDark
            ? 'text-zinc-400 font-semibold'
            : 'text-zinc-600 font-semibold'
          }`}
      >
        {children}
      </motion.span>
    </span>
  );
}

function Manifesto({ isDark }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const words = ABOUT_MANIFESTO.split(' ');

  return (
    <section
      ref={ref}
      className={`relative h-[240vh] transition-colors duration-500 border-y ${isDark ? 'bg-[#050505] border-white/10' : 'bg-white border-zinc-200/80'
        }`}
    >
      <div className="sticky top-0 h-screen flex items-center justify-center px-5 sm:px-8 overflow-hidden">
        {/* Soft background glow */}
        <div
          className="absolute w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{
            background: isDark
              ? 'radial-gradient(circle, rgba(255,255,255,0.04), transparent 70%)'
              : 'radial-gradient(circle, rgba(0,0,0,0.03), transparent 70%)',
          }}
        />

        <div className="relative max-w-4xl mx-auto text-left">
          <div className="mb-6">
            <Eyebrow isDark={isDark}>Engineering Philosophy</Eyebrow>
          </div>
          <p
            className={`text-[clamp(1.75rem,4vw,3.25rem)] font-semibold leading-[1.3] tracking-tight ${isDark ? 'text-white' : 'text-zinc-900'
              }`}
          >
            {words.map((w, i) => {
              const start = (i / words.length) * 0.85;
              return (
                <ManifestoWord
                  key={i}
                  progress={scrollYProgress}
                  range={[start, start + 0.08]}
                  isHighlight={HIGHLIGHT_WORDS.has(w)}
                  isDark={isDark}
                >
                  {w}
                </ManifestoWord>
              );
            })}
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── 3. STATS — Metric Counters ──────────────────────────────────────────────
function Counter({ value, suffix }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 2.0,
      ease: EASE,
      onUpdate: (v) => setN(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value]);

  return (
    <span ref={ref}>
      {n}
      {suffix}
    </span>
  );
}

function Stats({ isDark }) {
  return (
    <section
      className={`relative px-4 sm:px-8 py-20 sm:py-28 transition-colors duration-500 ${isDark ? 'bg-[#0a0a0a]' : 'bg-[#fafafa]'
        }`}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {ABOUT_STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                className={`group relative overflow-hidden rounded-2xl border p-6 sm:p-8 transition-all duration-300 ${isDark
                  ? 'border-white/10 bg-white/[0.03] text-white hover:border-white/20'
                  : 'border-zinc-200 bg-white text-zinc-950 shadow-sm hover:shadow-lg hover:border-zinc-300'
                  }`}
              >
                <div
                  className={`text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-zinc-900'
                    }`}
                >
                  <Counter value={s.value} suffix={s.suffix} />
                </div>
                <div
                  className={`mt-2.5 font-mono text-xs uppercase tracking-wider font-medium ${isDark ? 'text-zinc-400' : 'text-zinc-500'
                    }`}
                >
                  {s.label}
                </div>
                <div
                  className={`mt-4 h-0.5 w-8 rounded-full transition-all duration-500 group-hover:w-16 ${isDark ? 'bg-zinc-400' : 'bg-zinc-800'
                    }`}
                />
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
// ─── Contact Dropdown — circular spring pop-out (WhatsApp / Email) ───────────
function WhatsAppIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

function MailIcon({ className = 'w-5 h-5' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="4" width="20" height="16" rx="3" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function ContactDropdown({ isDark }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('touchstart', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('touchstart', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const waText = encodeURIComponent(
    "Hi Hadi, I found your portfolio and I'd like to discuss a project."
  );
  const options = [
    {
      key: 'whatsapp',
      label: 'WhatsApp',
      hint: 'Chat instantly',
      href: `https://wa.me/${ABOUT_PROFILE.whatsapp}?text=${waText}`,
      external: true,
      badge: 'bg-[#25D366] text-white shadow-[0_8px_20px_-6px_rgba(37,211,102,0.65)]',
      icon: <WhatsAppIcon className="w-6 h-6" />,
    },
    {
      key: 'email',
      label: 'Email',
      hint: ABOUT_PROFILE.email,
      href: `mailto:${ABOUT_PROFILE.email}?subject=${encodeURIComponent('Project inquiry')}`,
      external: false,
      badge: isDark
        ? 'bg-white text-zinc-950 shadow-[0_8px_20px_-6px_rgba(255,255,255,0.35)]'
        : 'bg-zinc-950 text-white shadow-[0_8px_20px_-6px_rgba(0,0,0,0.5)]',
      icon: <MailIcon className="w-5 h-5" />,
    },
  ];

  return (
    <div ref={wrapRef} className="relative inline-block z-30">
      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: 14, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 420, damping: 28 }}
            style={{ transformOrigin: 'bottom center' }}
            className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-[min(80vw,270px)] rounded-[1.75rem] border p-2 backdrop-blur-xl ${isDark
              ? 'border-white/15 bg-[#121214]/90 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.9)]'
              : 'border-zinc-200 bg-white/95 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.3)]'
              }`}
          >
            {options.map((opt, i) => (
              <motion.a
                key={opt.key}
                role="menuitem"
                href={opt.href}
                target={opt.external ? '_blank' : undefined}
                rel={opt.external ? 'noopener noreferrer' : undefined}
                data-hoverable
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, x: -10, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 460, damping: 26, delay: 0.05 + i * 0.07 }}
                whileHover={{ x: 3 }}
                className={`group flex items-center gap-3.5 rounded-[1.4rem] p-2 pr-4 text-left transition-colors ${isDark ? 'hover:bg-white/[0.07]' : 'hover:bg-zinc-100'
                  }`}
              >
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-6deg] ${opt.badge}`}
                >
                  {opt.icon}
                </span>
                <span className="min-w-0 flex flex-col">
                  <span
                    className={`text-sm font-semibold leading-tight ${isDark ? 'text-white' : 'text-zinc-950'}`}
                  >
                    {opt.label}
                  </span>
                  <span
                    className={`truncate text-[11px] leading-snug ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}
                  >
                    {opt.hint}
                  </span>
                </span>
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        data-hoverable
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={`group inline-flex items-center gap-3 rounded-full py-2 pl-7 pr-2 text-xs sm:text-sm font-semibold transition-all duration-300 shadow-md cursor-pointer select-none ${isDark
          ? 'bg-white text-zinc-950 hover:bg-zinc-200'
          : 'bg-zinc-950 text-white hover:bg-zinc-800'
          }`}
      >
        Start a conversation
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-300 ${isDark ? 'bg-zinc-950 text-white' : 'bg-white text-zinc-950'
            }`}
        >
          <svg
            className={`w-4 h-4 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${open ? 'rotate-[135deg]' : 'rotate-0'
              }`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
        </span>
      </button>
    </div>
  );
}

// ─── 4. CLIENT PARTNERSHIP PLAYBOOK (Interactive Collaboration Experience) ───
function PartnershipPlaybook({ isDark }) {
  const [activeId, setActiveId] = useState('zero-black-box');
  const active =
    ABOUT_PARTNERSHIP_PILLARS.find((p) => p.id === activeId) || ABOUT_PARTNERSHIP_PILLARS[0];

  return (
    <section
      className={`relative px-4 sm:px-8 py-24 sm:py-32 border-y transition-colors duration-500 ${isDark ? 'bg-[#050505] border-white/10' : 'bg-white border-zinc-200/80'
        }`}
    >
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <div className="mb-12 sm:mb-16 max-w-2xl">
            <Eyebrow isDark={isDark}>How We Work Together</Eyebrow>
            <h2
              className={`mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight ${isDark ? 'text-white' : 'text-zinc-950'
                }`}
            >
              What it’s actually like working with me.
            </h2>
            <p
              className={`mt-3 text-base sm:text-lg leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'
                }`}
            >
              No technical jargon meant to confuse you, no disappearing acts, and no endless status meetings. Just honest communication, steady updates you can see, and code that is built right.
            </p>
          </div>
        </Reveal>

        {/* 2-Column Interactive Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column: 4 Selectable Pillars */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            {ABOUT_PARTNERSHIP_PILLARS.map((pillar) => {
              const isActive = pillar.id === active.id;
              return (
                <button
                  key={pillar.id}
                  type="button"
                  data-hoverable
                  onClick={() => setActiveId(pillar.id)}
                  className={`text-left w-full rounded-2xl border p-5 sm:p-6 transition-all duration-300 relative cursor-pointer select-none ${isActive
                    ? isDark
                      ? 'border-white/30 bg-white/[0.07] text-white shadow-xl shadow-black/40 ring-1 ring-white/20'
                      : 'border-zinc-900 bg-zinc-900 text-white shadow-lg'
                    : isDark
                      ? 'border-white/10 bg-[#0c0c0e] text-zinc-300 hover:border-white/20 hover:bg-white/[0.03]'
                      : 'border-zinc-200 bg-[#fafafa] text-zinc-800 hover:border-zinc-300 hover:bg-zinc-100/70'
                    }`}
                >
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <span
                      className={`font-mono text-xs font-bold tracking-wider ${isActive
                        ? 'text-zinc-300'
                        : isDark
                          ? 'text-zinc-500'
                          : 'text-zinc-400'
                        }`}
                    >
                      PILLAR {pillar.number}
                    </span>
                    <span
                      className={`font-mono text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${isActive
                        ? 'border-white/30 bg-white/15 text-white'
                        : isDark
                          ? 'border-white/10 bg-white/5 text-zinc-400'
                          : 'border-zinc-300 bg-white text-zinc-600'
                        }`}
                    >
                      {pillar.badge}
                    </span>
                  </div>

                  <h3
                    className={`text-lg sm:text-xl font-bold tracking-tight mb-1.5 ${isActive ? 'text-white' : isDark ? 'text-white' : 'text-zinc-950'
                      }`}
                  >
                    {pillar.title}
                  </h3>
                  <p
                    className={`text-xs sm:text-sm leading-relaxed ${isActive
                      ? 'text-zinc-300'
                      : isDark
                        ? 'text-zinc-400'
                        : 'text-zinc-600'
                      }`}
                  >
                    {pillar.tagline}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Right Column: Live Interactive Preview Terminal & Inspector */}
          <div className="lg:col-span-7">
            <div
              className={`rounded-3xl border overflow-hidden transition-all duration-500 shadow-2xl ${isDark
                ? 'border-white/15 bg-[#0d0d10] shadow-black/80'
                : 'border-zinc-200 bg-white shadow-xl shadow-black/[0.04]'
                }`}
            >
              {/* Window Header */}
              <div
                className={`flex items-center justify-between px-5 py-3.5 border-b font-mono text-xs ${isDark
                  ? 'border-white/10 bg-white/[0.03] text-zinc-400'
                  : 'border-zinc-200 bg-zinc-50 text-zinc-600'
                  }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                  <span className="ml-2 font-semibold tracking-wider text-[11px] hidden sm:inline">
                    {active.preview.tag}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 font-semibold text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>HOW IT WORKS</span>
                </div>
              </div>

              {/* Dynamic Pillar Preview Body */}
              <div className="p-6 sm:p-8 min-h-[420px] flex flex-col justify-between">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.35, ease: EASE }}
                    className="space-y-6"
                  >
                    <div>
                      <div className="flex items-center gap-2 text-xs font-mono font-semibold tracking-wider uppercase mb-2 text-zinc-400">
                        <span>Pillar {active.number} • In Practice</span>
                      </div>
                      <h4
                        className={`text-2xl sm:text-3xl font-bold tracking-tight mb-3 ${isDark ? 'text-white' : 'text-zinc-950'
                          }`}
                      >
                        {active.title}
                      </h4>
                      <p
                        className={`text-sm sm:text-base leading-relaxed ${isDark ? 'text-zinc-300' : 'text-zinc-600'
                          }`}
                      >
                        {active.description}
                      </p>
                    </div>

                    {/* Specific Interactive Sub-Component according to active pillar */}
                    {active.id === 'zero-black-box' && (
                      <div
                        className={`rounded-2xl border p-4 sm:p-5 font-mono text-xs space-y-3 ${isDark
                          ? 'border-white/10 bg-black/50 text-zinc-300'
                          : 'border-zinc-200 bg-zinc-50 text-zinc-800'
                          }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-white/10">
                          <span className="text-zinc-400">URL:</span>
                          <span className="font-semibold text-emerald-400 underline underline-offset-4">
                            {active.preview.url}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-zinc-400">
                          <span>Branch: <strong className="text-white">{active.preview.branch}</strong></span>
                          <span>Last sync: {active.preview.lastDeployed}</span>
                        </div>
                        <div className="pt-2 space-y-2">
                          {active.preview.pipeline.map((step, idx) => (
                            <div key={idx} className="flex items-center justify-between py-1 border-b border-white/5 last:border-none">
                              <span className="flex items-center gap-2">
                                <span className="text-emerald-400">✓</span>
                                {step.name}
                              </span>
                              <span className="text-[11px] text-zinc-400">{step.time}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {active.id === 'daily-async-comms' && (
                      <div className="space-y-4">
                        {/* Loom Simulation */}
                        <div
                          className={`rounded-2xl border p-4 sm:p-5 flex items-center gap-4 ${isDark
                            ? 'border-white/10 bg-black/50'
                            : 'border-zinc-200 bg-zinc-50'
                            }`}
                        >
                          <div className="w-12 h-12 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0 text-xl font-mono">
                            ▶
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-mono font-bold uppercase tracking-wider text-red-400 mb-0.5">
                              LOOM VIDEO DEMO • {active.preview.videoDuration}
                            </div>
                            <div className={`text-sm font-semibold truncate ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                              {active.preview.videoTitle}
                            </div>
                            <div className="text-xs text-zinc-400 mt-0.5">
                              {active.preview.commitNotice}
                            </div>
                          </div>
                        </div>

                        {/* Chat Simulation */}
                        <div
                          className={`rounded-2xl border p-4 space-y-3 text-xs ${isDark
                            ? 'border-white/10 bg-black/40'
                            : 'border-zinc-200 bg-zinc-50'
                            }`}
                        >
                          {active.preview.chatSnippet.map((msg, idx) => (
                            <div key={idx} className="flex flex-col gap-1">
                              <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-400">
                                <strong>{msg.sender}</strong>
                                <span>{msg.time}</span>
                              </div>
                              <div
                                className={`rounded-xl p-3 leading-relaxed ${msg.sender === 'Hadi Haidar'
                                  ? isDark
                                    ? 'bg-white/10 text-white'
                                    : 'bg-zinc-200 text-zinc-900'
                                  : isDark
                                    ? 'bg-white/5 text-zinc-300'
                                    : 'bg-white border border-zinc-200 text-zinc-700'
                                  }`}
                              >
                                {msg.text}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {active.id === 'complete-documentation' && (
                      <div className="space-y-3 font-mono text-xs">
                        <div
                          className={`rounded-2xl border p-4 space-y-2 ${isDark
                            ? 'border-white/10 bg-black/50 text-zinc-300'
                            : 'border-zinc-200 bg-zinc-50 text-zinc-800'
                            }`}
                        >
                          <div className="text-[11px] text-zinc-400 pb-2 border-b border-white/10 flex justify-between">
                            <span>Collection:</span>
                            <span className="text-white font-semibold">{active.preview.collection}</span>
                          </div>
                          {active.preview.endpoints.map((ep, idx) => (
                            <div key={idx} className="flex items-center justify-between py-1">
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${ep.method === 'POST' ? 'bg-amber-500/20 text-amber-400' :
                                  ep.method === 'GET' ? 'bg-blue-500/20 text-blue-400' :
                                    'bg-emerald-500/20 text-emerald-400'
                                  }`}>
                                  {ep.method}
                                </span>
                                <span className="text-zinc-300 text-[11px]">{ep.path}</span>
                              </div>
                              <span className="text-[10px] text-zinc-400">{ep.latency}</span>
                            </div>
                          ))}
                        </div>

                        {/* Sample JSON payload */}
                        <div
                          className={`rounded-2xl border p-4 text-[11px] leading-relaxed overflow-x-auto ${isDark ? 'bg-black/80 border-white/10 text-emerald-400' : 'bg-zinc-900 border-zinc-800 text-emerald-300'
                            }`}
                        >
                          <span className="text-zinc-500">// Response 200 OK</span>
                          <pre className="mt-1 font-mono">{JSON.stringify(active.preview.sampleResponse, null, 2)}</pre>
                        </div>
                      </div>
                    )}

                    {active.id === 'post-launch-warranty' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {active.preview.guarantees.map((g, idx) => (
                          <div
                            key={idx}
                            className={`rounded-2xl border p-4 flex flex-col justify-between ${isDark
                              ? 'border-white/10 bg-black/40 text-zinc-300'
                              : 'border-zinc-200 bg-zinc-50 text-zinc-800'
                              }`}
                          >
                            <div className="flex items-center gap-2 mb-2 font-bold text-sm text-white">
                              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs flex items-center justify-center font-mono">
                                ✓
                              </span>
                              <span className={isDark ? 'text-white' : 'text-zinc-900'}>{g.title}</span>
                            </div>
                            <p className="text-xs text-zinc-400 leading-relaxed">{g.desc}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* 3 Live Metric Badges for the active pillar */}
                <div
                  className={`mt-6 pt-5 border-t grid grid-cols-3 gap-2 sm:gap-4 font-mono text-center ${isDark ? 'border-white/10' : 'border-zinc-200'
                    }`}
                >
                  {active.metrics.map((m, idx) => (
                    <div key={idx} className="p-2 sm:p-3 rounded-xl bg-white/[0.03] border border-white/5">
                      <div className="text-[10px] sm:text-xs text-zinc-400 uppercase tracking-wider mb-1 truncate">
                        {m.label}
                      </div>
                      <div className={`text-sm sm:text-base font-bold truncate ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                        {m.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Playbook Bottom CTA: Direct bridge from Partnership guarantees to booking a project */}
        <Reveal>
          <div
            className={`mt-14 sm:mt-20 rounded-3xl border p-8 sm:p-12 text-center relative transition-all duration-500 shadow-xl ${isDark
              ? 'border-white/15 bg-gradient-to-b from-white/[0.06] to-white/[0.02] text-white shadow-black/60'
              : 'border-zinc-200 bg-gradient-to-b from-zinc-50 to-white text-zinc-950 shadow-sm'
              }`}
          >
            <div
              className="absolute inset-0 pointer-events-none rounded-3xl"
              style={{
                background: isDark
                  ? 'radial-gradient(60% 60% at 50% 100%, rgba(255,255,255,0.06), transparent 75%)'
                  : 'radial-gradient(60% 60% at 50% 100%, rgba(0,0,0,0.03), transparent 75%)',
              }}
            />
            <div className="relative z-10 max-w-2xl mx-auto">
              <Eyebrow center isDark={isDark}>Let's Connect</Eyebrow>
              <h3
                className={`mt-4 text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight ${isDark ? 'text-white' : 'text-zinc-950'
                  }`}
              >
                Ready to build something{' '}
                <span
                  className={
                    isDark
                      ? 'bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent'
                      : 'bg-gradient-to-r from-zinc-950 via-zinc-700 to-zinc-500 bg-clip-text text-transparent'
                  }
                >
                  exceptional?
                </span>
              </h3>
              <p
                className={`mt-4 text-sm sm:text-base sm:leading-relaxed max-w-xl mx-auto ${isDark ? 'text-zinc-400' : 'text-zinc-600'
                  }`}
              >
                Whether you have an upcoming project, need full-stack architecture, or want to discuss a new product, I’m ready to help.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5 sm:gap-4">
                <ContactDropdown isDark={isDark} />
                <Link
                  to="/#projects"
                  data-hoverable
                  className={`inline-flex items-center gap-2 rounded-full border px-7 py-3 text-xs sm:text-sm font-semibold transition-colors duration-300 shadow-xs ${isDark
                    ? 'border-white/20 bg-transparent text-white hover:bg-white/10'
                    : 'border-zinc-300 bg-white text-zinc-800 hover:border-zinc-900'
                    }`}
                >
                  Move to projects
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── 5. JOURNEY — Horizontal Timeline (NO TIMELINE WATERMARK) ────────────────
function Journey({ isDark }) {
  const ref = useRef(null);
  const trackRef = useRef(null);
  const [maxX, setMaxX] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  useEffect(() => {
    const calc = () => {
      if (!trackRef.current) return;
      const track = trackRef.current;
      const lastCard = track.lastElementChild;
      if (!lastCard) return;

      // Exact pixel where the last card ends relative to the track
      const lastCardEnd = lastCard.offsetLeft + lastCard.offsetWidth;
      // Guarantee generous breathing room on the right (at least 100px or 10vw) so it is NEVER cut off
      const rightPadding = Math.max(100, window.innerWidth * 0.1);
      const neededShift = lastCardEnd - window.innerWidth + rightPadding;

      setMaxX(Math.max(0, neededShift));
    };

    calc();
    const t1 = setTimeout(calc, 100);
    const t2 = setTimeout(calc, 400);

    const observer = new ResizeObserver(() => calc());
    if (trackRef.current) observer.observe(trackRef.current);
    window.addEventListener('resize', calc);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      observer.disconnect();
      window.removeEventListener('resize', calc);
    };
  }, []);

  // Buffers: 0.04 to 0.90 ensures Card 1 and Card 6 rest fully in view without being skipped or cut off
  const x = useTransform(scrollYProgress, [0.04, 0.90], [0, -maxX]);
  const bar = useTransform(scrollYProgress, [0.04, 0.90], [0, 1]);

  // Shared container so header, first card and progress rail share the exact same left edge on every screen
  const container = 'max-w-7xl min-[1600px]:max-w-[100rem]';

  return (
    <section
      ref={ref}
      className={`relative transition-colors duration-500 ${isDark ? 'bg-[#0a0a0a]' : 'bg-[#fafafa]'
        }`}
      style={{ height: `${ABOUT_JOURNEY.length * 75 + 100}vh` }}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden flex flex-col justify-center pt-16">
        <div
          className={`relative px-5 sm:px-8 ${container} mx-auto w-full mb-6 sm:mb-8 xl:mb-10 [@media(max-height:760px)]:mb-4`}
        >
          <Eyebrow isDark={isDark}>Chronological Journey</Eyebrow>
          <h2
            className={`mt-3 text-[1.65rem] leading-tight sm:text-4xl lg:text-5xl min-[1600px]:text-6xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-zinc-950'
              }`}
          >
            From Computer Science to Production.
          </h2>
        </div>

        {/* Horizontal Track of Cards */}
        <motion.div
          ref={trackRef}
          style={{ x }}
          className="relative flex gap-4 sm:gap-6 xl:gap-7 min-[1600px]:gap-9 w-max pl-5 pr-5 sm:pl-8 min-[1280px]:pl-[calc((100vw-80rem)/2+2rem)] min-[1600px]:pl-[calc((100vw-100rem)/2+2rem)] will-change-transform"
        >
          {ABOUT_JOURNEY.map((j, i) => (
            <article
              key={j.year}
                className={`group relative shrink-0 overflow-hidden rounded-[1.6rem] border flex flex-col
                  w-[82vw] max-w-[390px] h-[min(400px,58svh)]
                  sm:w-[400px] sm:max-w-none sm:h-[min(400px,56svh)]
                  lg:w-[430px]
                  xl:w-[470px] xl:h-[min(420px,56svh)]
                  min-[1600px]:w-[540px] min-[1600px]:h-[min(470px,56svh)]
                  min-[2200px]:w-[620px] min-[2200px]:h-[min(520px,56svh)]
                  p-5 sm:p-7 xl:p-8 min-[1600px]:p-10
                  transition-all duration-500 hover:-translate-y-1.5 ${isDark
                    ? 'border-white/10 bg-gradient-to-b from-[#16161a] to-[#0f0f12] text-white shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)] hover:border-white/25'
                    : 'border-zinc-200 bg-gradient-to-b from-white to-zinc-50/70 text-zinc-950 shadow-[0_18px_44px_-24px_rgba(0,0,0,0.18)] hover:border-zinc-300 hover:shadow-[0_26px_54px_-24px_rgba(0,0,0,0.26)]'
                  }`}
              >
                {/* Top accent line that grows on hover */}
                <span
                  className={`absolute left-0 top-0 h-[3px] w-12 rounded-br-full transition-all duration-500 group-hover:w-full ${isDark ? 'bg-white/70' : 'bg-zinc-900'
                    }`}
                  aria-hidden
                />

                {/* Top row: tag + step counter */}
                <div className="flex items-center justify-between gap-3">
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-1 font-mono text-[10px] sm:text-xs font-semibold tracking-wider truncate ${isDark
                      ? 'border-white/15 bg-white/[0.06] text-zinc-300'
                      : 'border-zinc-200 bg-zinc-100 text-zinc-700'
                      }`}
                  >
                    {j.tag}
                  </span>
                  <span
                    className={`shrink-0 font-mono text-[10px] sm:text-xs font-semibold tracking-widest ${isDark ? 'text-zinc-500' : 'text-zinc-400'
                      }`}
                  >
                    {String(i + 1).padStart(2, '0')} / {String(ABOUT_JOURNEY.length).padStart(2, '0')}
                  </span>
                </div>

                {/* Year */}
                <div
                  className={`mt-5 sm:mt-6 font-bold tracking-tighter leading-none text-[2.6rem] sm:text-5xl xl:text-[3.4rem] min-[1600px]:text-7xl bg-clip-text text-transparent bg-gradient-to-br ${isDark ? 'from-white to-zinc-600' : 'from-zinc-950 to-zinc-400'
                    }`}
                >
                  {j.year}
                </div>

                {/* Title (2-line reserved so every description starts on the same line) */}
                <h3
                  className={`mt-4 sm:mt-5 text-lg sm:text-xl xl:text-2xl min-[1600px]:text-3xl font-bold tracking-tight leading-snug min-h-[2.7em] ${isDark ? 'text-white' : 'text-zinc-950'
                    }`}
                >
                  {j.title}
                </h3>

                <p
                  className={`mt-2 text-[13px] sm:text-sm xl:text-[0.95rem] min-[1600px]:text-base leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'
                    }`}
                >
                  {j.text}
                </p>
              </article>
          ))}
        </motion.div>

        {/* Progress Rail */}
        <div
          className={`relative px-5 sm:px-8 ${container} mx-auto w-full mt-6 sm:mt-8 xl:mt-10 [@media(max-height:760px)]:mt-4`}
        >
          <div className={`h-1 w-full rounded-full relative overflow-hidden ${isDark ? 'bg-white/10' : 'bg-zinc-200'}`}>
            <motion.div
              style={{ scaleX: bar }}
              className={`absolute inset-0 origin-left rounded-full ${isDark ? 'bg-white' : 'bg-zinc-900'
                }`}
            />
          </div>
          <div
            className={`mt-2.5 flex justify-between font-mono text-[11px] font-semibold tracking-widest ${isDark ? 'text-zinc-400' : 'text-zinc-500'
              }`}
          >
            <span>{ABOUT_JOURNEY[0].year}</span>
            <span>{ABOUT_JOURNEY[ABOUT_JOURNEY.length - 1].year}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── 6. PRINCIPLES — Sticky Stacking Cards ───────────────────────────────────
function PrincipleCard({ item, i, total, progress, isDark }) {
  const scale = useTransform(progress, [((i + 1) / total) * 0.85, 1], [1, 1 - (total - 1 - i) * 0.035]);

  return (
    <div className="sticky mb-[12vh]" style={{ top: `calc(13vh + ${i * 24}px)` }}>
      <motion.div
        style={{ scale, transformOrigin: 'top center' }}
        className={`relative overflow-hidden rounded-3xl border p-7 sm:p-10 min-h-[260px] sm:min-h-[290px] transition-all duration-300 ${isDark
          ? 'border-white/10 bg-[#0d0d0f] text-white shadow-2xl shadow-black/80'
          : 'border-zinc-200/90 bg-white text-zinc-950 shadow-xl shadow-black/[0.05]'
          }`}
      >
        <div className="relative flex items-start justify-between gap-6">
          <div className="max-w-xl">
            <span
              className="inline-block px-3 py-1 rounded-md text-xs font-mono font-bold tracking-wider mb-4 border"
              style={{
                color: item.accent,
                borderColor: `${item.accent}40`,
                backgroundColor: `${item.accent}14`,
              }}
            >
              PRINCIPLE {item.index}
            </span>
            <h3 className={`text-2xl sm:text-4xl font-bold tracking-tight leading-tight ${isDark ? 'text-white' : 'text-zinc-950'}`}>
              {item.title}
            </h3>
            <p className={`mt-4 text-base sm:text-lg leading-relaxed font-normal ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              {item.text}
            </p>
          </div>
          <span
            className={`hidden sm:block text-[110px] font-bold leading-none tracking-tighter select-none pointer-events-none ${isDark ? 'text-white/[0.05]' : 'text-zinc-100'
              }`}
            aria-hidden
          >
            {item.index}
          </span>
        </div>
        <div className="absolute bottom-0 left-0 h-1 w-full" style={{ background: item.accent }} />
      </motion.div>
    </div>
  );
}

function Principles({ isDark }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 40%', 'end end'] });

  return (
    <section
      className={`relative px-4 sm:px-8 py-24 sm:py-32 border-t transition-colors duration-500 ${isDark ? 'bg-[#050505] border-white/10' : 'bg-white border-zinc-200/80'
        }`}
    >
      <div className="max-w-4xl mx-auto">
        <div className="mb-14 sm:mb-20 text-center">
          <Eyebrow center isDark={isDark}>Core Convictions</Eyebrow>
          <h2
            className={`mt-3 text-3xl sm:text-5xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-zinc-950'
              }`}
          >
            Four engineering rules I build by.
          </h2>
        </div>
        <div ref={ref} className="relative">
          {ABOUT_PRINCIPLES.map((p, i) => (
            <PrincipleCard
              key={p.index}
              item={p}
              i={i}
              total={ABOUT_PRINCIPLES.length}
              progress={scrollYProgress}
              isDark={isDark}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── 7. FACTS & CLEAN CALL TO ACTION ─────────────────────────────────────────
function Facts({ isDark }) {
  return (
    <section
      className={`relative px-4 sm:px-8 py-20 sm:py-28 border-t transition-colors duration-500 ${isDark ? 'bg-[#0a0a0a] border-white/10' : 'bg-[#fafafa] border-zinc-200/80'
        }`}
    >
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <div className="mb-10 text-center">
            <Eyebrow center isDark={isDark}>Quick Facts & Qualifications</Eyebrow>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {ABOUT_FACTS.map((f, i) => (
            <Reveal key={f.label} delay={i * 0.06}>
              <motion.div
                whileHover={{ y: -3 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                className={`rounded-2xl border p-5 sm:p-6 transition-all duration-300 ${isDark
                  ? 'border-white/10 bg-white/[0.03] text-white hover:border-white/20'
                  : 'border-zinc-200 bg-white text-zinc-900 shadow-xs hover:shadow-md'
                  }`}
              >
                <div
                  className={`font-mono text-xs uppercase tracking-wider font-semibold mb-1.5 ${isDark ? 'text-zinc-400' : 'text-zinc-500'
                    }`}
                >
                  // {f.label}
                </div>
                <div
                  className={`text-base sm:text-lg font-semibold leading-snug ${isDark ? 'text-white' : 'text-zinc-900'
                    }`}
                >
                  {f.value}
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutFooter({ isDark }) {
  return (
    <footer
      className={`border-t py-8 px-5 sm:px-8 transition-colors duration-500 ${isDark ? 'border-white/10 bg-[#050505]' : 'border-zinc-200 bg-[#fafafa]'
        }`}
    >
      <div
        className={`max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs ${isDark ? 'text-zinc-500' : 'text-zinc-500'
          }`}
      >
        <span>© {new Date().getFullYear()} {ABOUT_PROFILE.name}. Built with care & precision.</span>
        <button
          type="button"
          data-hoverable
          onClick={() => (window.lenis ? window.lenis.scrollTo(0) : window.scrollTo({ top: 0, behavior: 'smooth' }))}
          className={`transition-colors font-medium cursor-pointer ${isDark ? 'hover:text-white' : 'hover:text-zinc-950'
            }`}
        >
          Back to top ↑
        </button>
      </div>
    </footer>
  );
}

// ─── MAIN EXPORT ─────────────────────────────────────────────────────────────
export default function AboutPage() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('portfolio_about_theme');
    // Default to light (white) as user requested, unless user previously picked dark
    return saved ? saved === 'dark' : false;
  });

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      localStorage.setItem('portfolio_about_theme', next ? 'dark' : 'light');
      return next;
    });
  };

  useEffect(() => {
    document.title = `About — ${ABOUT_PROFILE.name}`;
  }, []);

  return (
    <div
      className={`relative min-h-screen transition-colors duration-500 ${isDark ? 'bg-[#050505] text-white' : 'bg-[#fafafa] text-zinc-900'
        }`}
    >
      <ScrollProgressBar isDark={isDark} />
      <AboutHeader isDark={isDark} toggleTheme={toggleTheme} />
      <main>
        <Hero />
        <Manifesto isDark={isDark} />
        <Stats isDark={isDark} />
        <Journey isDark={isDark} />
        <Principles isDark={isDark} />
        <Facts isDark={isDark} />
        <PartnershipPlaybook isDark={isDark} />
      </main>
      <AboutFooter isDark={isDark} />
    </div>
  );
}

