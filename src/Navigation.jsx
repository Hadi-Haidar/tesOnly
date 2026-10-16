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
import './Navigation.css';

const LINKS = [
  { label: 'Projects', href: '#projects' },
  { label: 'Stack', href: '#stack' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

const CLOSED_HEIGHT = 58; // --navbar-height tab3 Raycast

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [navHeight, setNavHeight] = useState(CLOSED_HEIGHT);
  const navbarRef = useRef(null);

  // Ne2is toul l-content l-7a2i2i kermel l-card tekbar la 3ando bel zabt (metel Raycast)
  useLayoutEffect(() => {
    if (!navbarRef.current) return;
    setNavHeight(isOpen ? navbarRef.current.scrollHeight : CLOSED_HEIGHT);
  }, [isOpen]);

  // Ta2fil l-scroll tab3 l-saf7a 100% lamma l-menu maftou7 (Lenis + Body Fixed + Touchmove lock)
  useEffect(() => {
    if (isOpen) {
      // 1. Waqqef Lenis virtual scroller
      window.__lenis?.stop();

      // 2. 2fol l-position tab3 l-body bel zabt ma7al ma l-user we2ef
      const scrollY = window.scrollY || window.pageYOffset || 0;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';

      // 3. Mn3 l-touchmove w l-wheel kermel ma y7arrik l-shishe abadan nzool aw tl;oo3
      const preventTouch = (e) => {
        if (navbarRef.current && navbarRef.current.contains(e.target)) {
          // Eza l-card b-7ad zata fiha scroll (masalan landscape), mnsma7lo yskrol jawweta bas
          if (navbarRef.current.scrollHeight > navbarRef.current.clientHeight) {
            return;
          }
        }
        e.preventDefault();
      };

      window.addEventListener('touchmove', preventTouch, { passive: false });
      window.addEventListener('wheel', preventTouch, { passive: false });

      return () => {
        window.removeEventListener('touchmove', preventTouch);
        window.removeEventListener('wheel', preventTouch);
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        window.scrollTo(0, scrollY);
        window.__lenis?.start();
      };
    } else {
      window.__lenis?.start();
    }
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

  // Kabse 3a link: bisakker l-menu w ba3den byenzel 3al section b-slasa
  const goTo = useCallback((e, href) => {
    e.preventDefault();
    setIsOpen(false);
    setTimeout(() => {
      const target = document.querySelector(href);
      if (target) {
        if (window.__lenis) {
          window.__lenis.scrollTo(target, { duration: 1.2 });
        } else {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }, 60);
  }, []);

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

          <nav className="flex items-center gap-8 lg:gap-10">
            {LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-[13px] font-medium text-zinc-400 hover:text-white transition-colors relative py-1"
                data-hoverable
              >
                {link.label}
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
                onClick={() => setIsOpen((o) => !o)}
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
