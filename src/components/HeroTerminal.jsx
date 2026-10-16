// ─── SHAR7 BEL LEBNENE (Linear-Style Hero Stagger Sequence & Raycast Lighting) ──
// 1. Linear-Style Staggered Reveal Sequence (Entrance Animation):
//    * 1st: Background dot-grid w ambient light b-bayyno bi fade-in n3eem (delay 0.1s).
//    * 2nd: Floating Navbar btenzel mn fo2 (delay 0.3s).
//    * 3rd: Status badge (delay 0.5s), Main Headline (delay 0.65s), w Subheadline (delay 0.8s)
//           byetla3o b-tartib sequential ma3 deceleration curve fakhim cubic-bezier(0.16, 1, 0.3, 1).
//    * 4th: Terminal container byo23od bi ma7allo (delay 0.95s, scale 0.97 -> 1, y: 35 -> 0).
// 2. Raycast Ambient Background Depth & Mouse Tracking:
//    - Khalfeeye matte black (#050505) ma3 dot-grid pattern.
//    - Top-center radial ambient glow fakhim bi yet7arrak b-chikel organic ma3 7araket l-fara (mouse tracking),
//      kermel ya3ti impression 3D workspace atmosphere 7a2i2i metel Raycast!
// 3. L-Terminal l-Asli (100% Mitel ma ken):
//    - macOS control dots + title "neural_link — bash — 80×24".
//    - Boot sequence l-asliye (neural_link, system_integrity, core_modules, design_systems, etc.).
//    - Typewriter: "Hello, World. I engineer scalable digital systems."
//    - Command pills: [projects], [stack], [contact], [help].
//    - Interactive command input prompt.

import React, { useState, useEffect, useRef, useCallback, Suspense, lazy } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion';
import { useSound } from '../hooks/useSound';

// 3D badge is code-split so Three.js never blocks the hero's first paint
const HeroBadgeScene = lazy(() => import('./hero/HeroBadgeScene'));

const BOOT_LINES = [
  { text: '> initializing neural_link...', delay: 0, status: '[OK]', statusColor: '#4ade80' },
  { text: '> scanning system_integrity...', delay: 600, status: '[SECURE]', statusColor: '#22d3ee' },
  { text: '> loading core_modules: React, TypeScript, System Architecture', delay: 1200, status: '[10y exp]', statusColor: '#fbbf24' },
  { text: '> mounting design_systems: Figma, Tailwind, Motion', delay: 1800, status: '[OK]', statusColor: '#4ade80' },
  { text: '> verifying deployment_pipelines: AWS, Docker, CI/CD', delay: 2400, status: '[ACTIVE]', statusColor: '#22d3ee' },
  { text: '> executing: hello_world.sh', delay: 3000, status: '', statusColor: '' },
];

const MAIN_TEXT = "Hello, World. I engineer scalable digital systems.";

const COMMANDS = [
  { label: 'projects', icon: '◈', target: 'projects' },
  { label: 'stack', icon: '⬡', target: 'stack' },
  { label: 'contact', icon: '▷', target: 'contact' },
];

const COMMAND_RESPONSES = {
  help: [
    'Available commands:',
    '  projects  — View featured work',
    '  stack     — Technology expertise',
    '  contact   — Get in touch',
    '  about     — About page (coming soon)',
    '  clear     — Clear terminal',
    '  whoami    — Who am I?',
  ],
  whoami: [
    'Full-Stack Developer',
    'Crafting modern, responsive web & mobile experiences',
    'Specializing in React, Next.js, and Clean Architecture',
    'Currently: Open to new opportunities',
  ],
  about: [
    'Dedicated About page is under development.',
    '10+ years architecting scalable digital systems.',
  ],
  clear: [],
};

export default function HeroTerminal() {
  const [bootLines, setBootLines] = useState([]);
  const [bootComplete, setBootComplete] = useState(false);
  const [mainText, setMainText] = useState('');
  const [showCommands, setShowCommands] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [history, setHistory] = useState([]);
  const inputRef = useRef(null);
  const terminalBodyRef = useRef(null);
  const { playClick } = useSound();

  // ═══ Raycast Ambient Light Mouse Tracking ═══
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring physics kermel l-glow yel7a2 l-mouse be slasa fakhme
  const glowX = useSpring(mouseX, { stiffness: 60, damping: 25 });
  const glowY = useSpring(mouseY, { stiffness: 60, damping: 25 });

  useEffect(() => {
    const handleWindowMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      // Bo3od l-mouse 3an l-center mn -50px la +50px
      const offsetX = ((e.clientX - innerWidth / 2) / (innerWidth / 2)) * 60;
      const offsetY = ((e.clientY - innerHeight / 2) / (innerHeight / 2)) * 40;
      mouseX.set(offsetX);
      mouseY.set(offsetY);
    };

    window.addEventListener('mousemove', handleWindowMouseMove);
    return () => window.removeEventListener('mousemove', handleWindowMouseMove);
  }, [mouseX, mouseY]);

  // 1. Boot sequence timing
  useEffect(() => {
    const timers = BOOT_LINES.map((line, i) =>
      setTimeout(() => {
        setBootLines((prev) => [...prev, line]);
        if (i === BOOT_LINES.length - 1) {
          setTimeout(() => setBootComplete(true), 600);
        }
      }, line.delay)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  // 2. Typewriter effect
  useEffect(() => {
    if (!bootComplete) return;
    let i = 0;
    const interval = setInterval(() => {
      setMainText(MAIN_TEXT.slice(0, i + 1));
      i++;
      if (i >= MAIN_TEXT.length) {
        clearInterval(interval);
        setTimeout(() => setShowCommands(true), 400);
      }
    }, 35);
    return () => clearInterval(interval);
  }, [bootComplete]);

  // 3. Auto-scroll terminal body
  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [history, bootLines, mainText]);

  const scrollToSection = useCallback((target) => {
    const el = document.getElementById(target);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleCommand = useCallback((cmd) => {
    const cleaned = cmd.trim().toLowerCase();
    if (!cleaned) return;

    setHistory((prev) => [...prev, { type: 'input', text: cleaned }]);

    if (cleaned === 'clear') {
      setHistory([]);
      return;
    }

    const navCmd = COMMANDS.find((c) => c.label === cleaned);
    if (navCmd && navCmd.target) {
      setHistory((prev) => [
        ...prev,
        { type: 'response', lines: [`Navigating to ${navCmd.target}...`] },
      ]);
      setTimeout(() => scrollToSection(navCmd.target), 500);
      return;
    }

    if (COMMAND_RESPONSES[cleaned]) {
      setHistory((prev) => [
        ...prev,
        { type: 'response', lines: COMMAND_RESPONSES[cleaned] },
      ]);
      return;
    }

    setHistory((prev) => [
      ...prev,
      {
        type: 'response',
        lines: [`command not found: ${cleaned}`, 'Type "help" for available commands.'],
      },
    ]);
  }, [scrollToSection]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      playClick();
      handleCommand(inputValue);
      setInputValue('');
    }
  };

  const focusInput = () => inputRef.current?.focus();

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 pt-32 pb-20 overflow-hidden"
    >
      {/* ═══ 1st in Sequence: Background Grid & Ambient Glow ═══ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.14 }}
        transition={{ duration: 1.2, delay: 0.1 }}
        className="absolute inset-0 dot-grid pointer-events-none"
      />

      {/* Raycast Interactive Top-Center Ambient Glow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, delay: 0.1 }}
        style={{ x: glowX, y: glowY }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
      >
        <div
          className="w-full h-full opacity-25"
          style={{
            background: 'radial-gradient(ellipse at top, rgba(255,255,255,0.4), transparent 70%)',
          }}
        />
      </motion.div>

      {/* ═══ 3D Hanging ID Badge — left gutter (≥1536px only) ═══ */}
      <Suspense fallback={null}>
        <HeroBadgeScene
          className="absolute inset-0 z-[50]"
        />
      </Suspense>

      <div className="relative z-10 w-full max-w-5xl flex flex-col items-center text-center">
        
        {/* ═══ Linear Typography: Original Main Headline (delay: 0.5s) ═══ */}
        {/* SHAR7 BEL LEBNENE:
            - Rja3na l-jomle l-asliye: "Architecting digital systems that scale."
            - Ma3 l-Linear typography style: Crisp Pure White (#ffffff), font-bold, tracking-tight, leading-none/tight
            - Bedoun l-badge tab3 l-Available for Senior Roles, w bedoun gradients
        */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-5xl md:text-5xl xl:text-6xl 2xl:text-7xl font-bold tracking-tight text-white leading-[1.08] sm:leading-none max-w-2xl xl:max-w-3xl 2xl:max-w-4xl mb-4 sm:mb-6 text-center"
        >
          Architecting digital systems that scale.
        </motion.h1>

        {/* ═══ Linear Typography: Original Subheadline (delay: 0.65s) ═══ */}
        {/* SHAR7 BEL LEBNENE:
            - Rja3na l-jomle l-asliye: "5+ years of senior engineering expertise..."
            - Ma3 l-Linear style: Regular weight (font-normal), text-zinc-400 (#a1a1aa), leading-relaxed, max-w-xl
        */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="text-base sm:text-lg 2xl:text-xl text-zinc-400 font-normal leading-relaxed max-w-lg 2xl:max-w-xl text-center mb-8 sm:mb-12"
        >
          I build interfaces that feel alive. Specializing in real-time interaction, performance, and clean web architecture.
        </motion.p>

        {/* ═══ 4th in Sequence: Terminal Container Snaps into Place (delay: 0.95s) ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 35, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.95, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-2xl xl:max-w-3xl 2xl:max-w-4xl text-left"
        >
          <div className="terminal-chrome shadow-2xl shadow-black/80 w-full" onClick={focusInput}>
            {/* Title bar l-asli */}
            <div className="terminal-titlebar">
              <div className="flex gap-1.5 md:gap-2">
                <div className="terminal-dot terminal-dot--red w-2.5 h-2.5 md:w-3 md:h-3" />
                <div className="terminal-dot terminal-dot--yellow w-2.5 h-2.5 md:w-3 md:h-3" />
                <div className="terminal-dot terminal-dot--green w-2.5 h-2.5 md:w-3 md:h-3" />
              </div>
              <span className="flex-1 text-center text-[10px] sm:text-xs font-mono text-[#52525b] tracking-wider truncate px-2">
                neural_link — bash — 80×24
              </span>
              <div className="w-[40px] md:w-[52px]" />
            </div>

            <div
              ref={terminalBodyRef}
              className="p-4 sm:p-5 2xl:p-7 font-mono text-[11px] sm:text-xs 2xl:text-sm leading-relaxed min-h-[40vh] sm:min-h-[250px] 2xl:min-h-[290px] max-h-[60vh] sm:max-h-[350px] 2xl:max-h-[410px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
              {/* Boot sequence lines */}
              <AnimatePresence>
                {bootLines.map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="flex items-center gap-3 mb-1"
                  >
                    <span className="text-[#71717a]">{line.text}</span>
                    {line.status && (
                      <span style={{ color: line.statusColor }} className="text-xs font-semibold">
                        {line.status}
                      </span>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Divider ba3ed l-boot */}
              {bootComplete && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="my-4 border-t border-white/5"
                />
              )}

              {/* Typed text l-asli */}
              {bootComplete && (
                <div className="text-base md:text-lg text-white font-medium mb-6">
                  <span className="text-[#4ade80] mr-2">❯</span>
                  {mainText}
                  {!showCommands && (
                    <span className="cursor-blink inline-block w-[2px] h-5 bg-white ml-1 align-middle" />
                  )}
                </div>
              )}

              {/* Command pills l-asliye */}
              <AnimatePresence>
                {showCommands && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="flex flex-wrap gap-2 mb-6">
                      {COMMANDS.map((cmd) => (
                        <button
                          key={cmd.label}
                          className="command-pill"
                          onClick={(e) => {
                            e.stopPropagation();
                            playClick();
                            handleCommand(cmd.label);
                          }}
                          data-hoverable
                        >
                          <span className="opacity-50">{cmd.icon}</span>
                          {cmd.label}
                        </button>
                      ))}
                      <button
                        className="command-pill"
                        onClick={(e) => {
                          e.stopPropagation();
                          playClick();
                          handleCommand('help');
                        }}
                        data-hoverable
                      >
                        <span className="opacity-50">?</span>
                        help
                      </button>
                    </div>

                    {/* History */}
                    {history.map((entry, i) => (
                      <div key={i} className="mb-2">
                        {entry.type === 'input' && (
                          <div className="text-[#71717a]">
                            <span className="text-[#4ade80]">❯</span> {entry.text}
                          </div>
                        )}
                        {entry.type === 'response' &&
                          entry.lines.map((line, j) => (
                            <div key={j} className="text-[#a1a1aa] ml-4">
                              {line}
                            </div>
                          ))}
                      </div>
                    ))}

                    {/* Interactive input field */}
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[#4ade80]">❯</span>
                      <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 bg-transparent border-none outline-none text-white font-mono text-base sm:text-sm caret-white"
                        placeholder="type a command or press ⌘K..."
                        autoComplete="off"
                        spellCheck={false}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Guide text ta7et l-terminal */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 4.5, duration: 1 }}
            className="text-center text-xs text-[#52525b] mt-6 font-mono tracking-wider"
          >
            ↓ scroll to explore · or type a command above
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
