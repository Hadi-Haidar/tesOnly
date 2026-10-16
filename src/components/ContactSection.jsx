import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { SectionHeader, Reveal, useSpotlight } from './ui';

const CONTACT_LINKS = [
  {
    label: 'Email',
    value: 'hadihaidar200477@gmail.com',
    href: 'mailto:hadihaidar200477@gmail.com',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
  },
  {
    label: 'GitHub',
    value: 'github.com/Hadi-Haidar',
    href: 'https://github.com/Hadi-Haidar',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    value: 'linkedin.com/in/engineer',
    href: 'https://linkedin.com',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: 'Twitter / X',
    value: '@engineer',
    href: 'https://x.com',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
];

export default function ContactSection() {
  const containerRef = useRef(null);
  useSpotlight(containerRef);

  return (
    <section id="contact" className="relative w-full py-20 sm:py-28 md:py-36 px-4 sm:px-6 md:px-8 flex justify-center">
      <div className="w-full max-w-7xl 2xl:max-w-[1600px]">
        <SectionHeader
          label="Contact"
          title="Let's build something extraordinary."
          description="I'm always open to discussing new projects, architecture challenges, or opportunities to build at scale."
          centered={true}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-8">
          {/* Contact links */}
          <Reveal>
            <div className="space-y-3">
              {CONTACT_LINKS.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith('mailto') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  className="glow-card glass-surface rounded-xl p-5 flex items-center gap-4 group transition-colors"
                  whileHover={{ scale: 1.02, x: 4 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  data-hoverable
                >
                  <div className="w-10 h-10 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#71717a] group-hover:text-white group-hover:border-white/20 transition-all">
                    {link.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-mono text-[#71717a] uppercase tracking-wider mb-0.5">
                      {link.label}
                    </div>
                    <div className="text-sm text-white/80 group-hover:text-white transition-colors truncate">
                      {link.value}
                    </div>
                  </div>
                  <motion.span
                    className="text-white/20 group-hover:text-white/60 transition-colors"
                    whileHover={{ x: 4 }}
                  >
                    →
                  </motion.span>
                </motion.a>
              ))}
            </div>
          </Reveal>

          {/* Status & availability card */}
          <Reveal delay={0.15}>
            <div
              ref={containerRef}
              className="spotlight-container glass-surface-elevated rounded-xl p-6 sm:p-8 h-full flex flex-col justify-between"
            >
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="relative">
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#4ade80]" />
                    <div className="absolute inset-0 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#4ade80] animate-ping opacity-30" />
                  </div>
                  <span className="font-mono text-[10px] sm:text-xs text-[#4ade80] tracking-wider uppercase">
                    Available for work
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
                  Currently seeking
                  <br />
                  <span className="text-white/50">new opportunities</span>
                </h3>

                <p className="text-sm text-[#a1a1aa] leading-relaxed mb-8">
                  Open to full-time software engineering roles, frontend / full-stack positions,
                  and collaborative development teams. Remote-first preferred.
                </p>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-[#71717a]">
                    <span className="text-[#4ade80]">✓</span> System design & architecture
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#71717a]">
                    <span className="text-[#4ade80]">✓</span> Performance-critical applications
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#71717a]">
                    <span className="text-[#4ade80]">✓</span> Team mentoring & tech leadership
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#71717a]">
                    <span className="text-[#4ade80]">✓</span> DevOps & platform engineering
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/[0.06] relative z-10">
                <span className="font-mono text-[11px] text-[#52525b]">
                  Response time: typically within 24 hours
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
