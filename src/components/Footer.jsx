// ─── SHAR7 BEL LEBNENE (Footer) ─────────────────────────────────────────────
// - Terminal prompt icon '>_'.
// - Dynamic year: new Date().getFullYear().
// - All systems operational indicator.

import React from 'react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative py-12 px-4 md:px-8 border-t border-white/[0.04]">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left */}
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-md bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
              <span className="font-mono text-[10px] font-bold text-white/60">{'>'}_</span>
            </div>
            <span className="font-mono text-xs text-[#52525b]">
              Designed & engineered with precision
            </span>
          </div>

          {/* Center */}
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/Hadi-Haidar"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#52525b] hover:text-white/60 transition-colors font-mono"
              data-hoverable
            >
              GitHub
            </a>
            <a
              href="mailto:hadihaidar200477@gmail.com"
              className="text-xs text-[#52525b] hover:text-white/60 transition-colors font-mono"
              data-hoverable
            >
              Email
            </a>
          </div>

          {/* Right */}
          <span className="font-mono text-xs text-[#3f3f46]">
            © {year} · All systems operational
          </span>
        </div>
      </div>
    </footer>
  );
}
