// ─── SHAR7 BEL LEBNENE (About & Career Timeline) ────────────────────────────
// - Stats Grid: 10+ snin khebra, 50+ mashari3, 200k+ users, 15+ teams.
// - Philosophy Card: Quote 3an mabadi2 l-software engineering l-nadife.
// - Career Timeline: Khat zamani vertical mn 2016 la lyom ma3 glow dots.

import React from 'react';
import { motion } from 'framer-motion';
import { SectionHeader, Reveal } from './ui';

const TIMELINE = [
  {
    year: '2016 – 2018',
    role: 'Frontend Developer',
    company: 'Early career — Agency & Freelance',
    description:
      'Cut my teeth building responsive web apps for startups. Mastered vanilla JS, jQuery, and early React. Delivered 30+ production sites.',
  },
  {
    year: '2018 – 2020',
    role: 'Full Stack Engineer',
    company: 'Scale-up — Product Teams',
    description:
      'Transitioned to full-stack with Node.js and PostgreSQL. Led migration from monolith to microservices, reducing deploy time by 70%.',
  },
  {
    year: '2020 – 2023',
    role: 'Senior Software Engineer',
    company: 'Enterprise — Platform Engineering',
    description:
      'Architected critical platform services handling millions of daily requests. Mentored junior engineers and drove adoption of TypeScript across the org.',
  },
  {
    year: '2023 – Present',
    role: 'Staff / Lead Engineer',
    company: 'Principal — Architecture & Strategy',
    description:
      'Leading system design for distributed platforms. Focus on performance, developer experience, and building engineering culture from the ground up.',
  },
];

const STATS = [
  { value: '10+', label: 'Years Experience' },
  { value: '50+', label: 'Projects Delivered' },
  { value: '200k+', label: 'Users Served' },
  { value: '15+', label: 'Teams Mentored' },
];

export default function AboutSection() {
  return (
    <section id="about" className="relative w-full py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-8 flex justify-center">
      <div className="w-full max-w-7xl 2xl:max-w-[1600px]">
        <SectionHeader
          label="About"
          title="A decade of building what matters."
          description="I'm a senior software engineer with 10 years of experience turning complex requirements into elegant, scalable systems. I don't just write code — I architect solutions."
          centered={true}
        />

        {/* Stats row */}
        <Reveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-16 md:mb-20">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="glass-surface rounded-xl p-4 sm:p-6 text-center"
                whileHover={{ scale: 1.03 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              >
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-1 tracking-tight">
                  {stat.value}
                </div>
                <div className="text-[10px] sm:text-xs font-mono text-[#71717a] uppercase tracking-widest">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </Reveal>

        {/* Philosophy block */}
        <Reveal>
          <div className="glass-surface-elevated rounded-xl p-6 sm:p-8 md:p-10 mb-16 md:mb-20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-full md:w-1/2 h-full grid-bg opacity-10 md:opacity-20 pointer-events-none" />
            <div className="relative z-10">
              <span className="inline-block font-mono text-[10px] sm:text-xs text-[#4ade80] mb-3 sm:mb-4 tracking-wider">
                // engineering_philosophy.md
              </span>
              <blockquote className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-light text-white/90 leading-relaxed mb-4 sm:mb-6 max-w-3xl">
                "Great software is invisible. The best systems I build are the ones users never
                think about — they just <span className="text-white font-medium">work</span>,
                at scale, every single time."
              </blockquote>
              <p className="text-xs sm:text-sm md:text-base text-[#a1a1aa] leading-relaxed max-w-2xl">
                I believe in shipping fast without compromising quality. Every architectural
                decision I make is driven by three principles: performance, maintainability,
                and developer ergonomics. Code is read far more than it is written.
              </p>
            </div>
          </div>
        </Reveal>

        {/* Career Timeline */}
        <div className="relative max-w-4xl mx-auto">
          <Reveal>
            <h3 className="font-mono text-xs text-[#71717a] uppercase tracking-widest mb-10 text-center">
              Career Timeline
            </h3>
          </Reveal>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[7px] md:left-[9px] top-0 bottom-0 w-px bg-gradient-to-b from-white/10 via-white/5 to-transparent" />

            {TIMELINE.map((item, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="relative flex gap-6 md:gap-8 mb-12 last:mb-0 pl-8 md:pl-10">
                  {/* Dot on timeline */}
                  <div className="absolute left-0 top-1.5 w-[15px] h-[15px] md:w-[19px] md:h-[19px] rounded-full border-2 border-white/20 bg-[#050505] flex items-center justify-center">
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-white/40" />
                  </div>

                  <div className="flex-1">
                    <span className="font-mono text-xs text-[#4ade80] tracking-wider mb-1 block">
                      {item.year}
                    </span>
                    <h4 className="text-lg font-semibold text-white mb-1">{item.role}</h4>
                    <p className="text-sm text-[#71717a] mb-2 font-mono">{item.company}</p>
                    <p className="text-sm text-[#a1a1aa] leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
