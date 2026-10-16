/**
 * ==============================================================================
 * PORTFOLIO DATA (data.js)
 * ==============================================================================
 * Centralized data source for your portfolio projects.
 * 
 * To add, edit, or remove projects:
 * Simply modify the `PROJECTS` array below!
 * 
 * FIELD REFERENCE:
 * - id: Unique string identifier (e.g. '01', '02')
 * - title: Project name displayed on the card
 * - description: Detailed overview of what was built and its architecture
 * - tech: Array of technology tags (e.g. ['React', 'Laravel'])
 * - liveUrl: Live production deployment link (use '#' if not yet live)
 * - githubUrl: Public repository link
 * - image: Imported WebP/image asset from `../assets/` (recommended ratio: 16:9 widescreen)
 * - featured: Boolean flag for featured showcase status
 * - span: Tailwind Bento Grid layout span:
 *         - 'col-span-1 lg:col-span-7' (wider card)
 *         - 'col-span-1 lg:col-span-5' (compact card)
 *         - 'col-span-1 lg:col-span-6' (equal 50/50 card)
 *         - 'col-span-1 lg:col-span-12' (full width banner)
 * - isEmpty: Set to true for "Upcoming / In Development" placeholders
 * ==============================================================================
 */

import tawasolImg from '../assets/tawasol.webp';
import ourVoiceImg from '../assets/Our-Voice.webp';
import pawsImg from '../assets/paws.webp';
import fluxImg from '../assets/flux.webp';

export const PROJECTS = [
  {
    id: '01',
    title: 'Tawasol',
    description:
      'A comprehensive real-time collaboration platform featuring secure authentication, instant messaging, and interactive dashboards. Built with a scalable Laravel backend and a dynamic React frontend.',
    tech: ['Laravel', 'React', 'Tailwind', 'Pusher', 'MySQL'],
    liveUrl: 'https://tawasol-frontend.vercel.app',
    githubUrl: 'https://github.com/Hadi-Haidar',
    image: tawasolImg,
    featured: true,
    isEmpty: false,
    span: 'col-span-1 lg:col-span-7',
  },
  {
    id: '02',
    title: 'Our Voice',
    description:
      'A civic engagement platform for Lebanon enabling citizens to report local issues (power outages, water, roads, internet), vote on problems, and track progress transparently. Features community chat, polls, and bilingual support.',
    tech: ['React', 'Vite', 'Tailwind CSS', 'Framer Motion', 'REST API'],
    liveUrl: 'https://our-voice-frontend.vercel.app/',
    githubUrl: 'https://github.com/Hadi-Haidar',
    image: ourVoiceImg,
    featured: true,
    isEmpty: false,
    span: 'col-span-1 lg:col-span-5',
  },
  {
    id: '03',
    title: 'PAWS',
    description:
      'Full-stack pet care & veterinary platform featuring mobile Expo apps, real-time Socket.io appointments, pet medical histories, adoption hub, and Stripe-powered pet store backend.',
    tech: ['React Native', 'Expo', 'Express', 'Supabase', 'Stripe', 'Socket.io'],
    liveUrl: '#',
    githubUrl: 'https://github.com/Hadi-Haidar',
    image: pawsImg,
    featured: true,
    isEmpty: false,
    span: 'col-span-1 lg:col-span-5',
  },
  {
    id: '04',
    title: 'Flux',
    description:
      'A high-performance mobile e-commerce application built with Flutter & Dart. Features fluid animated product catalogs, reactive state management, cart/wishlist engines, and dark/light system adaptation.',
    tech: ['Flutter', 'Dart'],
    liveUrl: '#',
    githubUrl: 'https://github.com/Hadi-Haidar/flux.git',
    image: fluxImg,
    featured: true,
    isEmpty: false,
    span: 'col-span-1 lg:col-span-7',
  },
];

// Default export & alias for convenience matching your old data.js
export const projects = PROJECTS;
export default PROJECTS;
