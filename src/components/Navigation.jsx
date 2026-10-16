// ─── SHAR7 BEL LEBNENE (Navigation — Desktop Linear + Mobile Raycast Clone) ───
// 1. Desktop (>= 880px):
//    - Nafs l-bar tab3 Linear yalli 3melneh abel: logo 3al shmel w l-links bel nos.
// 2. Mobile (< 880px) — clone 100% la raycast.com:
//    - Card wa7de mdawra (16px) ma3 gradient ghame2 w blur, 58px toul lamma msakkara.
//    - Lamma tekbos l-hamburger, NAFS l-card btekbar la ta7et (height .3s) w btwarje
//      l-links — ma fi overlay menfasel w ma fi zerr close b-ma7al tene.
//    - L-hamburger byeb2a b-ma7allo w byet7awwal la X (rotate 180deg, .5s).
//    - Ta7t l-links: khat fasel w zerr 'light' abyad tab3 Raycast.
//    - L-CSS kello b-Navigation.css (ar2am Raycast l-7a2i2iye).
// 3. Tafasil zghire:
//    - Escape bisakker l-menu, w kamen eza kabast barra l-card.
//    - L-scroll tab3 l-saf7a byet2affal lamma l-menu maftou7.
//    - Eza kabbart l-shashe la fo2 l-880px w l-menu maftou7, bisakker la7alo.

import React, { useState, useEffect, useRef, useLayoutEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSound } from '../hooks/useSound';
import './Navigation.css';

const LINKS = [
  { label: 'Projects', href: '#projects' },
  { label: 'Stack', href: '#stack' },
  { label: 'About', href: '/about' }, // separate page (route), not a scroll anchor
  { label: 'Contact', href: '#contact' },
];

const CLOSED_HEIGHT = 58; // --navbar-height tab3 Raycast

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [navHeight, setNavHeight] = useState(CLOSED_HEIGHT);
  const [hoveredLink, setHoveredLink] = useState(null);
  const navbarRef = useRef(null);
  const { playClick } = useSound();
  const navigate = useNavigate();

  // Ne2is toul l-content l-7a2i2i kermel l-card tekbar la 3ando bel zabt (metel Raycast)
  useLayoutEffect(() => {
    if (!navbarRef.current) return;
    setNavHeight(isOpen ? navbarRef.current.scrollHeight : CLOSED_HEIGHT);
  }, [isOpen]);

  // Ta2fil l-scroll tab3 l-saf7a lamma l-menu maftou7 (w kaman minwa2ef lenis iza mawjoud)
  useEffect(() => {
    const html = document.documentElement;
    if (isOpen) {
      html.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      if (window.lenis) window.lenis.stop();
    } else {
      html.style.overflow = '';
      document.body.style.overflow = '';
      if (window.lenis) window.lenis.start();
    }
    return () => {
      html.style.overflow = '';
      document.body.style.overflow = '';
      if (window.lenis) window.lenis.start();
    };
  }, [isOpen]);

  // Escape bisakker, w l-resize la desktop bisakker
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === 'Escape' && setIsOpen(false);
    const mq = window.matchMedia('(min-width: 880px)');
    const onMq = (e) => e.matches && setIsOpen(false);
    window.addEventListener('keydown', onKey);
    mq.addEventListener('change', onMq);
    return () => {
      window.removeEventListener('keydown', onKey);
      mq.removeEventListener('change', onMq);
    };
  }, [isOpen]);

  // Kabse 3a link: bisakker l-menu w ba3den byenzel 3al section (ba3d ma yerja3 l-scroll)
  const goTo = useCallback((e, href) => {
    e.preventDefault();
    playClick();
    setIsOpen(false);
    // Routes (e.g. /about) open a separate page; '#hash' links scroll inside the home page
    if (!href.startsWith('#')) {
      setTimeout(() => navigate(href), 60);
      return;
    }
    setTimeout(() => {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }, 60);
  }, [playClick, navigate]);

  return (
    <>
      {/* ═══ 1. Desktop Bar (Linear style) — bas fo2 l-880px ═══ */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="hidden min-[880px]:block fixed top-0 left-0 right-0 z-[100] h-16 border-b border-white/[0.08] bg-[#050505]/80 backdrop-blur-xl"
        style={{ WebkitBackdropFilter: 'blur(20px)' }}
      >
        <div className="max-w-7xl mx-auto px-8 lg:px-10 h-full flex items-center justify-between">
          <a
            href="#hero"
            className="flex items-center gap-3 group select-none py-1"
            data-hoverable
            title="engineer.dev"
          >
            <div className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/10 flex items-center justify-center group-hover:border-white/25 group-hover:bg-white/[0.1] transition-all">
              <span className="font-mono text-xs font-bold text-white/80 group-hover:text-white transition-colors">
                {'>'}_
              </span>
            </div>
            <span className="font-mono text-sm font-semibold text-white/90 group-hover:text-white transition-colors tracking-tight">
              engineer<span className="text-zinc-500">.dev</span>
            </span>
          </a>

          <nav 
            className="flex items-center gap-2 lg:gap-4"
            onMouseLeave={() => setHoveredLink(null)}
          >
            {LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="relative px-3 py-1.5 text-[13px] font-medium text-zinc-400 hover:text-white transition-colors z-10"
                onClick={(e) => {
                  goTo(e, link.href);
                }}
                onMouseEnter={() => {
                  if (hoveredLink !== link.label) {
                    setHoveredLink(link.label);
                  }
                }}
                data-hoverable
              >
                {link.label}
                {hoveredLink === link.label && (
                  <motion.div
                    layoutId="nav-slidebar"
                    className="absolute inset-0 bg-white/[0.08] rounded-md -z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </a>
            ))}
          </nav>
        </div>
      </motion.header>

      {/* ═══ 2. Mobile Navbar — Raycast clone (ta7t l-880px) ═══ */}
      <div
        className={`rc-container${isOpen ? ' rc-open' : ''}`}
        // Kabse barra l-card (bel masa7a l-fadye) btsakker l-menu
        onClick={(e) => isOpen && e.target === e.currentTarget && setIsOpen(false)}
      >
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{ width: '100%', maxWidth: 1204 }}
        >
          <div ref={navbarRef} className="rc-navbar" style={{ height: navHeight }}>
            {/* Saff l-logo + l-hamburger */}
            <div className="rc-logoContainer">
              <a
                href="#hero"
                className="rc-logo"
                onClick={(e) => goTo(e, '#hero')}
                data-hoverable
                aria-label="engineer.dev home"
              >
                <span className="rc-logoMark">{'>'}_</span>
                <span className="rc-logoText">
                  engineer<span>.dev</span>
                </span>
              </a>

              <button
                type="button"
                className="rc-navToggle"
                onClick={() => { playClick(); setIsOpen((o) => !o); }}
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isOpen}
                aria-controls="rc-mobile-menu"
                data-hoverable
              >
                <span className="rc-navToggleLine" />
                <span className="rc-navToggleLine" />
                <span className="rc-navToggleLine" />
              </button>
            </div>

            {/* L-links */}
            <nav id="rc-mobile-menu" className="rc-navigation" aria-hidden={!isOpen}>
              {LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="rc-navLink"
                  onClick={(e) => goTo(e, link.href)}
                  tabIndex={isOpen ? 0 : -1}
                  data-hoverable
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Khat fasel + zerr Raycast 'light' */}
            <div className="rc-secondary" aria-hidden={!isOpen}>
              <a
                href="#contact"
                className="rc-button rc-button--light"
                onClick={(e) => goTo(e, '#contact')}
                tabIndex={isOpen ? 0 : -1}
                data-hoverable
              >
                Let's talk
                <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M9.75 4.75 13.25 8m0 0-3.5 3.25M13.25 8H2.75"
                  />
                </svg>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
