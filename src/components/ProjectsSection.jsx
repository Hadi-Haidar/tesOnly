import React, { useRef, useState, useCallback, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useScroll } from 'framer-motion';
import { SectionHeader, Reveal } from './ui';
import { useSound } from '../hooks/useSound';
import { PROJECTS } from '../data/data';

// ─── Interactive Physics Rope ──────────────────────────────────────────────────
function PhysicsRope({ anchors, cardBoxes = [] }) {
  const pathRef = useRef(null);
  const glowPathRef = useRef(null);
  const containerRef = useRef(null);

  // Mouse tracking
  const mouseRef = useRef({ x: -1000, y: -1000, isDown: false });
  const prevMouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };
    const handleMouseDown = () => { mouseRef.current.isDown = true; };
    const handleMouseUp = () => { mouseRef.current.isDown = false; };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  useEffect(() => {
    if (anchors.length < 2) return;

    // Generate particles
    const particles = [];
    const segments = anchors.length - 1;
    const pointsPerSegment = 25; // High resolution for smooth physical curve

    for (let i = 0; i < segments; i++) {
      const p1 = anchors[i];
      const p2 = anchors[i + 1];

      // Calculate cubic bezier resting path (Sagging cable effect)
      const dist = Math.abs(p2.x - p1.x);
      const sag = Math.max(dist * 0.35, 120); // Massive sag so it hangs loosely

      const cp1x = p1.x + (p2.x - p1.x) * 0.5;
      const cp1y = p1.y + sag;
      const cp2x = p1.x + (p2.x - p1.x) * 0.5;
      const cp2y = p2.y + sag;

      const steps = i === segments - 1 ? pointsPerSegment + 1 : pointsPerSegment;
      for (let j = 0; j < steps; j++) {
        const t = j / pointsPerSegment;
        const u = 1 - t;
        const rx = u * u * u * p1.x + 3 * u * u * t * cp1x + 3 * u * t * t * cp2x + t * t * t * p2.x;
        const ry = u * u * u * p1.y + 3 * u * u * t * cp1y + 3 * u * t * t * cp2y + t * t * t * p2.y;

        particles.push({
          x: rx, y: ry,
          rx, ry,
          vx: 0, vy: 0,
          isFixed: (j === 0 || (i === segments - 1 && j === pointsPerSegment))
        });
      }
    }

    let animationFrame;

    const tick = () => {
      const m = mouseRef.current;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (p.isFixed) continue;

        // Spring force towards resting S-curve position (softer, slower)
        const dxRest = p.rx - p.x;
        const dyRest = p.ry - p.y;
        p.vx += dxRest * 0.015;
        p.vy += dyRest * 0.015;

        // Spring force pulling from neighbors to keep the rope tight
        if (i > 0) {
          p.vx += (particles[i - 1].x - p.x) * 0.15;
          p.vy += (particles[i - 1].y - p.y) * 0.15;
        }
        if (i < particles.length - 1) {
          p.vx += (particles[i + 1].x - p.x) * 0.15;
          p.vy += (particles[i + 1].y - p.y) * 0.15;
        }

        // Drag interaction with the mouse (only on click/hold)
        const dxMouse = m.x - p.x; // vector towards mouse
        const dyMouse = m.y - p.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

        if (m.isDown && distMouse < 250) { // Massive drag influence radius
          const force = (250 - distMouse) / 250;
          // Powerfully pull particles towards the mouse
          p.vx += (dxMouse / distMouse) * force * 5.5;
          p.vy += (dyMouse / distMouse) * force * 5.5;
        }

        // Physics Damping (Friction)
        p.vx *= 0.75;
        p.vy *= 0.75;

        p.x += p.vx;
        p.y += p.vy;
      }

      prevMouseRef.current = { x: m.x, y: m.y };

      // Render ultra-smooth SVG Path using Quadratic Bezier smoothing
      if (particles.length > 0) {
        let d = `M ${particles[0].x} ${particles[0].y}`;
        for (let i = 1; i < particles.length - 1; i++) {
          const xc = (particles[i].x + particles[i + 1].x) / 2;
          const yc = (particles[i].y + particles[i + 1].y) / 2;
          d += ` Q ${particles[i].x} ${particles[i].y}, ${xc} ${yc}`;
        }
        const last = particles[particles.length - 1];
        d += ` L ${last.x} ${last.y}`;

        if (pathRef.current) pathRef.current.setAttribute('d', d);
        if (glowPathRef.current) glowPathRef.current.setAttribute('d', d);
      }

      animationFrame = requestAnimationFrame(tick);
    };

    tick();
    return () => cancelAnimationFrame(animationFrame);
  }, [anchors]);

  if (anchors.length < 2) return null;

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="absolute inset-0 pointer-events-none z-0"
    >
      <svg className="w-full h-full overflow-visible">
        {/* Dark Metallic Shadow Cable */}
        <path
          ref={pathRef}
          fill="none"
          stroke="rgba(0,0,0,0.6)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="drop-shadow-lg"
        />
        {/* Glowing Matrix Green Core */}
        <path
          ref={glowPathRef}
          fill="none"
          stroke="rgba(34, 197, 94, 0.7)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ filter: 'drop-shadow(0 0 5px rgba(34,197,94,0.9))' }}
        />
      </svg>
    </motion.div>
  );
}

// ─── 3D Tilt Card ──────────────────────────────────────────────────────────────
function TiltCard({ project, index }) {
  const cardRef = useRef(null);
  const { playClick, playHoverTick } = useSound();

  // 3D tilt motion values (subtle tilt)
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  // Smooth spring interpolation
  const springRotateX = useSpring(rotateX, { stiffness: 150, damping: 30 });
  const springRotateY = useSpring(rotateY, { stiffness: 150, damping: 30 });

  // Inner layer parallax depths (very subtle)
  const imageTranslateX = useTransform(springRotateY, [-3, 3], [1.5, -1.5]);
  const imageTranslateY = useTransform(springRotateX, [-3, 3], [1.5, -1.5]);
  const titleTranslateX = useTransform(springRotateY, [-3, 3], [1, -1]);
  const titleTranslateY = useTransform(springRotateX, [-3, 3], [1, -1]);

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    rotateY.set(dx * 2.5);
    rotateX.set(-dy * 2.5);
  }, [rotateX, rotateY]);

  const handleMouseLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
  }, [rotateX, rotateY]);

  return (
    <Reveal delay={index * 0.1} className={project.span}>
      <div
        ref={cardRef}
        className="relative h-full"
        style={{ perspective: '1000px' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={playHoverTick}
      >
        <motion.div
          className="relative h-full w-full"
          style={{
            rotateX: springRotateX,
            rotateY: springRotateY,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Light Theme Card wrapper */}
          <div
            id={`project-card-${project.id}`}
            className="group relative rounded-xl overflow-hidden h-full bg-white border border-zinc-200 shadow-xl shadow-black/[0.04] transition-shadow duration-500 hover:shadow-2xl hover:shadow-black/[0.08]"
          >
            <div className="rounded-xl h-full p-4 sm:p-5 md:p-5.5 flex flex-col relative z-10 bg-white">

              {/* Browser mockup header */}
              <div className="flex items-center gap-2 mb-3.5">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-300 group-hover:bg-[#ff5f57] transition-colors duration-300" />
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-300 group-hover:bg-[#febc2e] transition-colors duration-300" />
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-300 group-hover:bg-[#28c840] transition-colors duration-300" />
                </div>
                <div className="flex-1 mx-3 h-5 rounded bg-zinc-100 border border-zinc-200/60 flex items-center px-3">
                  <span className="text-[10px] font-mono text-zinc-500 truncate">
                    {project.title.toLowerCase().replace(/\s+/g, '-')}.dev
                  </span>
                </div>
                {/* Project number badge */}
                <span className="font-mono text-xs text-zinc-300 font-bold shrink-0">
                  {project.id}
                </span>
              </div>

              {/* Project image — floats at Z+ depth (16:9 widescreen ratio) */}
              <motion.div
                className="relative w-full aspect-[16/9] rounded-lg overflow-hidden mb-3.5 border border-zinc-100 bg-zinc-50"
                style={{
                  translateX: imageTranslateX,
                  translateY: imageTranslateY,
                  translateZ: 20,
                  transformStyle: 'preserve-3d',
                }}
              >
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover object-top transition-transform duration-700 ease-out will-change-transform group-hover:scale-[1.03]"
                    style={{ backfaceVisibility: 'hidden', transform: 'translateZ(0)' }}
                  />
                ) : (
                  <>
                    <div className="absolute inset-0 grid-bg opacity-15" />
                    {/* Animated placeholder lines for upcoming projects */}
                    <div className="absolute inset-0 flex items-center justify-center flex-col gap-1.5 p-4 text-center">
                      <span className="font-mono text-[9px] sm:text-[10px] text-zinc-400 tracking-widest uppercase">
                        [ Pending Architecture ]
                      </span>
                      <span className="text-xs text-zinc-400 font-medium">
                        Slot Reserved • Coming Soon
                      </span>
                    </div>
                  </>
                )}

                {/* Subtle dark vignette edge on hover for depth, never clouding the image */}
                <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-lg pointer-events-none group-hover:ring-black/10 transition-all duration-300" />
              </motion.div>

              {/* Content — slightly elevated Z */}
              <motion.div
                className="flex-1 flex flex-col"
                style={{
                  translateX: titleTranslateX,
                  translateY: titleTranslateY,
                  translateZ: 10,
                  transformStyle: 'preserve-3d',
                }}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold text-zinc-900 tracking-tight leading-snug">
                    {project.title}
                  </h3>
                </div>

                <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed mb-3 flex-1">
                  {project.description}
                </p>

                {/* Tech badges */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className={`px-2 py-0.5 text-[10px] sm:text-xs font-medium rounded-md border transition-colors ${project.isEmpty
                        ? 'border-dashed border-zinc-200 bg-zinc-50 text-zinc-400'
                        : 'border-zinc-200 bg-zinc-50 text-zinc-600 group-hover:border-zinc-300'
                        }`}
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-3 pt-3 border-t border-zinc-100">
                  {project.isEmpty ? (
                    <span className="text-xs font-mono text-zinc-400 italic">
                      deployment: scheduled
                    </span>
                  ) : (
                    <>
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
                        onClick={playClick}
                        data-hoverable
                      >
                        <span className="font-medium">Live Preview</span>
                        <motion.span
                          className="inline-block"
                          whileHover={{ x: 4 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        >
                          →
                        </motion.span>
                      </a>
                      <span className="text-zinc-200">|</span>
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-900 transition-colors"
                        onClick={playClick}
                        data-hoverable
                      >
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                        <span className="font-medium">Source</span>
                      </a>
                    </>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </Reveal>
  );
}

// ─── Main Export ───────────────────────────────────────────────────────────────
export default function ProjectsSection() {
  const containerRef = useRef(null);
  const [anchors, setAnchors] = useState([]);

  // Calculate coordinates of all projects to connect them
  const updateAnchors = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const points = PROJECTS.map((p) => {
      const el = document.getElementById(`project-${p.id}`);
      if (!el) return null;
      const elRect = el.getBoundingClientRect();
      return {
        x: elRect.left + elRect.width / 2 - rect.left,
        y: elRect.top + elRect.height / 2 - rect.top,
      };
    }).filter(Boolean);

    setAnchors(points);
  }, []);

  useEffect(() => {
    updateAnchors();
    const t1 = setTimeout(updateAnchors, 50);
    const t2 = setTimeout(updateAnchors, 200);
    const t3 = setTimeout(updateAnchors, 600);

    const observer = new ResizeObserver(() => {
      updateAnchors();
    });
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    window.addEventListener('resize', updateAnchors);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      observer.disconnect();
      window.removeEventListener('resize', updateAnchors);
    };
  }, [updateAnchors]);

  return (
    <>
      <motion.section
        id="projects"
        initial={{ backgroundColor: '#050505' }}
        whileInView={{ backgroundColor: '#fafafa' }}
        viewport={{ once: true, margin: "-20%" }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="relative w-full py-14 sm:py-20 md:py-24 mb-20 sm:mb-32 md:mb-48 px-4 sm:px-6 md:px-8 flex justify-center"
      >
        <div ref={containerRef} className="w-full max-w-5xl 2xl:max-w-[1280px] relative">
          <SectionHeader
            label="Featured Work"
            title="Engineering that ships."
            description="A curated selection of production systems I've architected and built. Each project represents real-world scale, performance, and craftsmanship."
            centered={true}
            theme="light"
          />

          {/* Interactive Physical Rope */}
          <PhysicsRope anchors={anchors} />

          {/* Bento Grid with neon inter-card dividers */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 xl:gap-12 relative z-10">
            {PROJECTS.map((project, i) => (
              <React.Fragment key={project.title}>
                <div
                  id={`project-${project.id}`}
                  className={project.span}
                >
                  <TiltCard
                    project={project}
                    index={i}
                  />
                </div>
                {/* Divider between rows (only between pairs) */}
                {i === 1 && (
                  <div className="col-span-1 lg:col-span-12 py-1">
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-200 to-transparent" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </motion.section>
    </>
  );
}
