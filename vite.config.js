// ─── SHAR7 BEL LEBNENE (Vite Configuration) ─────────────────────────────────
// Hayda l-file huwe l-Vite Configuration teb3 l-project:
// - 'react()': bi khalli Vite yefham React JSX w ya3mel Fast Refresh (HMR).
// - 'tailwindcss()': bi shaghil Tailwind CSS v4 l-jdid direct ma3 Vite.

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})
