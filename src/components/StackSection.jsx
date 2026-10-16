import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { SectionHeader, Reveal, useSpotlight } from './ui';

const STACK_CATEGORIES = [
  {
    title: 'Frontend & Mobile',
    icon: '◈',
    items: [
      { name: 'React', level: 92, years: 'Advanced' },
      { name: 'React Native / Expo', level: 88, years: 'Proficient' },
      { name: 'Flutter & Dart', level: 85, years: 'Proficient' },
      { name: 'JavaScript (ES6+)', level: 94, years: 'Advanced' },
      { name: 'Tailwind CSS', level: 95, years: 'Advanced' },
      { name: 'HTML5 & Modern CSS', level: 96, years: 'Advanced' },
    ],
  },
  {
    title: 'Backend & APIs',
    icon: '⬡',
    items: [
      { name: 'PHP (Laravel)', level: 90, years: 'Advanced' },
      { name: 'Node.js & Express', level: 88, years: 'Proficient' },
      { name: 'RESTful API Architecture', level: 92, years: 'Advanced' },
      { name: 'Socket.io & Real-time', level: 85, years: 'Proficient' },
      { name: 'MySQL Database', level: 88, years: 'Proficient' },
      { name: 'Supabase & Firebase', level: 84, years: 'Proficient' },
    ],
  },
  {
    title: 'Tools & Platforms',
    icon: '◉',
    items: [
      { name: 'Git & GitHub', level: 92, years: 'Advanced' },
      { name: 'Postman (API Testing)', level: 90, years: 'Proficient' },
      { name: 'Vercel & Render Cloud', level: 88, years: 'Proficient' },
      { name: 'OAuth & Laravel Sanctum', level: 86, years: 'Proficient' },
      { name: 'Stripe Payments', level: 82, years: 'Proficient' },
      { name: 'Vite & Modern Tooling', level: 94, years: 'Advanced' },
    ],
  },
];

// ─── Logo marquee data ─────────────────────────────────────────────────────────
// `slug` = Simple Icons slug. Logos are served in their official brand colours.
const logo = (name, slug) => ({ name, src: `https://cdn.simpleicons.org/${slug}` });

const LOGO_ROW_ONE = [
  logo('React', 'react'),
  logo('React Native', 'react'),
  logo('Expo', 'expo'),
  logo('Flutter', 'flutter'),
  logo('Dart', 'dart'),
  logo('JavaScript', 'javascript'),
  logo('HTML5', 'html5'),
  logo('Tailwind CSS', 'tailwindcss'),
  logo('Vite', 'vite'),
  logo('Framer Motion', 'framer'),
  logo('Figma', 'figma'),
];

const LOGO_ROW_TWO = [
  logo('Laravel', 'laravel'),
  logo('PHP', 'php'),
  logo('Node.js', 'nodedotjs'),
  logo('Express', 'express'),
  logo('MySQL', 'mysql'),
  logo('Supabase', 'supabase'),
  logo('Firebase', 'firebase'),
  logo('Socket.io', 'socketdotio'),
  logo('Pusher', 'pusher'),
  logo('Stripe', 'stripe'),
  logo('Postman', 'postman'),
  logo('Git', 'git'),
  logo('GitHub', 'github'),
  logo('Vercel', 'vercel'),
  logo('Render', 'render'),
];

// The list is rendered twice so translating by -50% loops seamlessly.
function MarqueeRow({ items, direction }) {
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden">
      <div className={`marquee-track ${direction === 'left' ? 'marquee-left' : 'marquee-right'}`}>
        {doubled.map((item, i) => (
          <span key={`${item.name}-${i}`} className="tech-logo-pill" aria-hidden={i >= items.length}>
            <img src={item.src} alt={item.name} loading="lazy" draggable="false" />
            {item.name}
          </span>
        ))}
      </div>
    </div>
  );
}


function StackCard({ category, index }) {
  const cardRef = useRef(null);
  useSpotlight(cardRef);

  return (
    <Reveal delay={index * 0.12}>
      <motion.div
        ref={cardRef}
        className="glow-card spotlight-container glass-surface rounded-xl p-6 md:p-8 h-full"
        whileHover={{ scale: 1.01 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      >
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-lg text-white/60">{category.icon}</span>
            <h3 className="text-lg font-semibold text-white">{category.title}</h3>
          </div>

          {/* Skills */}
          <div className="space-y-4">
            {category.items.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 + i * 0.05 }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-white/90 font-medium">{item.name}</span>
                  <span className="font-mono text-[11px] text-[#71717a]">{item.years}</span>
                </div>
                <div className="w-full h-1 rounded-full bg-white/[0.06] overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background: `linear-gradient(90deg, rgba(255,255,255,0.15), rgba(255,255,255,0.35))`,
                    }}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${item.level}%` }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 1.2,
                      delay: index * 0.1 + i * 0.08,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </Reveal>
  );
}

export default function StackSection() {
  return (
    <section id="stack" className="relative w-full py-16 sm:py-24 md:py-32 mb-20 sm:mb-32 md:mb-48 px-4 sm:px-6 md:px-8 flex justify-center">
      <div className="w-full max-w-7xl 2xl:max-w-[1600px]">
        <SectionHeader
          label="Tech Stack"
          title="Tools of the trade."
          description="A proven engineering stack refined through building full-stack platforms, mobile apps, and real-time systems."
          centered={true}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 xl:gap-6">
          {STACK_CATEGORIES.map((cat, i) => (
            <StackCard key={cat.title} category={cat} index={i} />
          ))}
        </div>

        {/* Logo marquee — balanced mid-tone surface (frosted slate-zinc), two rows moving in opposite directions, pauses on hover */}
        <Reveal delay={0.3}>
          <div className="mt-10 rounded-2xl bg-zinc-900/40 border border-zinc-700/50 backdrop-blur-md py-6 md:py-8 overflow-hidden shadow-xl shadow-black/20">
            <h4 className="font-mono text-xs text-zinc-400 uppercase tracking-widest mb-5 px-6 md:px-8">
              Also proficient in
            </h4>
            <div className="marquee-wrap marquee-mask space-y-3">
              <MarqueeRow items={LOGO_ROW_ONE} direction="left" />
              <MarqueeRow items={LOGO_ROW_TWO} direction="right" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
