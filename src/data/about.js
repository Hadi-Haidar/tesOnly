/**
 * ==============================================================================
 * ABOUT PAGE DATA (about.js)
 * ==============================================================================
 * Real, authentic data extracted from Hadi Haidar's portfolio & projects.
 * Easily customize any field here.
 * ==============================================================================
 */

export const ABOUT_PROFILE = {
  name: 'Hadi Haidar',
  firstLine: 'Hadi',
  secondLine: 'Haidar',
  role: 'Full-Stack Web Developer',
  degree: 'B.S. in Computer Science',
  location: 'Beirut, Lebanon',
  availability: 'Available for high-impact projects',
  tagline: 'I build modern, scalable web and mobile solutions with real-time performance and clean architecture.',
  email: 'hadihaidar200477@gmail.com',
  whatsapp: '96181386402', // +961 81 386 402 (international format, digits only)
  github: 'https://github.com/Hadi-Haidar',
};

// Word-by-word scroll reveal paragraph
export const ABOUT_MANIFESTO =
  'I build interfaces that feel truly alive. From real-time WebSocket messaging and scalable backend architectures to pixel-perfect mobile apps, I engineer complete systems with deep care for performance, clean architecture, and delightful user experience.';

export const ABOUT_STATS = [
  { value: 1, suffix: '+', label: 'Years Experience' },
  { value: 7, suffix: '+', label: 'Completed Projects' },
  { value: 90, suffix: '%', label: 'Code Craftsmanship' },
  { value: 85, suffix: '%', label: 'Production Ready' },
];

// Comprehensive skill categories (archived for reference)
export const ABOUT_SKILL_CATEGORIES = [
  {
    category: 'Frontend Engineering',
    tag: 'Client-Side',
    description: 'Dynamic, responsive, and accessible interfaces with fluid micro-interactions.',
    skills: ['React', 'JavaScript (ES6+)', 'Tailwind CSS', 'Framer Motion', 'HTML5 & CSS3', 'Vite'],
    color: '#71717a',
  },
  {
    category: 'Backend Architecture',
    tag: 'Server & APIs',
    description: 'Robust server engines, RESTful architectures, and real-time event streaming.',
    skills: ['PHP (Laravel)', 'Node.js', 'Express', 'MySQL', 'RESTful APIs', 'Supabase & Firebase'],
    color: '#06b6d4',
  },
  {
    category: 'Mobile Applications',
    tag: 'Cross-Platform',
    description: 'High-performance native mobile apps delivering smooth 60fps animations.',
    skills: ['React Native', 'Expo', 'Flutter', 'Dart', 'Mobile UI/UX'],
    color: '#8b5cf6',
  },
  {
    category: 'Tools & Ecosystem',
    tag: 'DevOps & Services',
    description: 'Modern development workflows, automated deployments, and payment gateways.',
    skills: ['Git & GitHub', 'Postman', 'Pusher & WebSockets', 'Stripe', 'OAuth & Sanctum', 'Vercel & Render'],
    color: '#f59e0b',
  },
];

// ─── CLIENT PARTNERSHIP PLAYBOOK (Interactive Collaboration Pillars) ─────────
export const ABOUT_PARTNERSHIP_PILLARS = [
  {
    id: 'zero-black-box',
    number: '01',
    title: 'No Black Boxes or Guesswork',
    shortTitle: 'Full Visibility',
    tagline: 'Private GitHub access + a live preview link updated every couple of days.',
    description:
      'You will never have to wonder what I’m working on or if progress is actually happening. From day one, you get access to the GitHub repository and a private staging link that updates whenever I push new work, so you can test things out in real time.',
    badge: 'Transparency',
    metrics: [
      { label: 'Live Preview', value: 'Updates Often' },
      { label: 'Repo Access', value: 'From Day 1' },
      { label: 'Surprises', value: 'Zero' },
    ],
    preview: {
      tag: 'LIVE PREVIEW PIPELINE',
      url: 'https://staging.hadihaidar.dev/preview',
      branch: 'feature/realtime-checkout',
      lastDeployed: '42 minutes ago',
      commitsCount: 18,
      status: 'Live & ready to test',
      pipeline: [
        { name: 'Push code & run lint checks', status: 'Passed', time: '12s' },
        { name: 'Run database migrations & test data', status: 'Passed', time: '8s' },
        { name: 'Build production frontend bundle', status: 'Passed', time: '410ms' },
        { name: 'Deploy to live staging preview', status: 'Live', time: 'Instant' },
      ],
    },
  },
  {
    id: 'daily-async-comms',
    number: '02',
    title: 'Quick Video Updates, Not Long Meetings',
    shortTitle: 'Video & Chat',
    tagline: 'Short 2-minute Loom walkthroughs + direct chat on WhatsApp.',
    description:
      'Nobody likes getting stuck in hour-long status meetings that could’ve been a quick message. Instead, I send short 2-minute screen recordings showing you exactly what got built, and keep a direct line open on WhatsApp whenever you have a thought or question.',
    badge: 'Communication',
    metrics: [
      { label: 'Quick Catchups', value: '2-min Loom' },
      { label: 'Direct Chat', value: 'WhatsApp' },
      { label: 'Response Time', value: 'Usually Fast' },
    ],
    preview: {
      tag: 'QUICK LOOM WALKTHROUGH',
      videoTitle: 'Sprint 2: Quick walkthrough of the checkout flow and live cart updates',
      videoDuration: '2:40',
      chatSnippet: [
        {
          sender: 'Client',
          time: '10:14 AM',
          text: 'Hey Hadi! Can we see how the mobile checkout looks with dynamic tax rates?',
        },
        {
          sender: 'Hadi Haidar',
          time: '10:32 AM',
          text: 'Morning! Just recorded a 2-minute Loom showing the calculation on iOS and Android. Staging link is updated too if you want to click around!',
        },
      ],
      commitNotice: 'Recorded on Loom • Tested on actual phones',
    },
  },
  {
    id: 'complete-documentation',
    number: '03',
    title: 'Clean Docs That Anyone Can Follow',
    shortTitle: 'Clear Handover',
    tagline: 'Ready-to-run Postman collections + simple setup guides.',
    description:
      'I build with the mindset that someone else might work on this code after me. Every API endpoint is documented in Postman, environment variables are clearly explained, and getting the project running takes minutes—not hours of head-scratching.',
    badge: 'Documentation',
    metrics: [
      { label: 'API Endpoints', value: 'All Documented' },
      { label: 'Tooling', value: 'Postman & Swagger' },
      { label: 'Project Setup', value: 'Simple & Clear' },
    ],
    preview: {
      tag: 'POSTMAN API SPECIFICATION',
      collection: 'Hadi_Production_API_v1.postman_collection.json',
      endpoints: [
        { method: 'POST', path: '/api/v1/orders/checkout', status: '200 OK', latency: '42ms' },
        { method: 'GET', path: '/api/v1/realtime/messages', status: '200 OK', latency: '28ms' },
        { method: 'POST', path: '/api/v1/auth/sanctum/token', status: '201 Created', latency: '55ms' },
        { method: 'PUT', path: '/api/v1/users/profile', status: '200 OK', latency: '35ms' },
      ],
      sampleResponse: {
        success: true,
        message: 'Order processed & WebSocket notification dispatched',
        latency: '34ms',
        environment: 'production',
      },
    },
  },
  {
    id: 'post-launch-warranty',
    number: '04',
    title: 'I Still Have Your Back After Launch',
    shortTitle: '30-Day Support',
    tagline: '30 days of free bug fixing + recorded video tutorials for your team.',
    description:
      'Launching the app is just the beginning. I stay around for the first 30 days to squash any unexpected bugs for free, and record clear video guides so you and your team know how to manage everything without needing me for every little change.',
    badge: 'Peace of Mind',
    metrics: [
      { label: 'Free Support', value: 'First 30 Days' },
      { label: 'Code & Accounts', value: '100% Yours' },
      { label: 'Team Walkthrough', value: 'Video Guides' },
    ],
    preview: {
      tag: 'CLIENT SUPPORT PROMISE',
      guarantees: [
        {
          title: '30 Days of Free Bug Fixes',
          desc: 'If anything acts up or breaks in the first month after going live, I jump in and fix it right away at no extra cost.',
        },
        {
          title: 'Total Handover & Ownership',
          desc: 'All GitHub repos, server logins, domain settings, and database keys belong to you. Clean and straightforward.',
        },
        {
          title: 'Screen Recordings for Your Team',
          desc: 'Short, friendly videos showing how to use the admin panel, manage content, or invite new team members.',
        },
        {
          title: 'Post-Launch Health Check',
          desc: 'Reviewing real user traffic, database queries, and server response times once people start using the app.',
        },
      ],
    },
  },
];

// Chronological Journey
export const ABOUT_JOURNEY = [
  {
    year: '2021',
    title: 'Curiosity, late nights & early experiments',
    text: 'Before university, I spent hours breaking and fixing HTML, playing with JavaScript, and trying to understand how websites actually worked behind the scenes. That curiosity is what got me hooked.',
    tag: 'Early Spark',
  },
  {
    year: '2022',
    title: 'Starting university & getting serious',
    text: 'Enrolled in Computer Science at IUL. While classes taught me data structures, logic, and database theory, I spent my evenings turning those concepts into real, responsive web interfaces with React.',
    tag: 'Academic Roots',
  },
  {
    year: '2023',
    title: 'Stepping into backend & database architecture',
    text: 'Realized great interfaces are only half the battle. Dived deep into PHP, Laravel, Node.js, and relational databases—building secure auth flows, REST APIs, and learning how to keep data clean and safe.',
    tag: 'Full-Stack Horizon',
  },
  {
    year: '2024',
    title: 'Building mobile apps & live real-time features',
    text: 'Wanted to build software people carry in their pockets. Picked up React Native and Flutter, and engineered Tawasol with live WebSockets, instant messaging, and cloud backends that feel fast.',
    tag: 'Mobile & Cloud',
  },
  {
    year: '2025',
    title: 'Graduating with my degree & shipping real products',
    text: 'Completed my B.S. in Computer Science with my graduation report in hand. Wrapped up the year by shipping production platforms like Our Voice, PAWS, and Flux—focusing on code that actually solves real problems.',
    tag: 'B.S. Graduate',
  },
  {
    year: 'Now',
    title: 'Building reliable software for clients & teams',
    text: 'Today, I partner with founders and businesses to turn ideas into clean, fast web and mobile apps. No shortcuts, clear communication, and code that is built to last.',
    tag: 'Production Grade',
  },
];

// Guiding engineering principles
export const ABOUT_PRINCIPLES = [
  {
    index: '01',
    title: 'Real-Time & Performance First',
    text: 'Software should feel instant. I build with WebSockets, optimistic UI updates, and performance tuning so users never have to wait.',
    accent: '#71717a',
  },
  {
    index: '02',
    title: 'Clean & Scalable Architecture',
    text: 'Code is read much more often than it is written. Clean separation of concerns, reusable components, and documented APIs make growth painless.',
    accent: '#06b6d4',
  },
  {
    index: '03',
    title: 'Security by Design',
    text: 'From bulletproof token authentication (Sanctum/OAuth) to sanitized database transactions and encrypted environments, security is never an afterthought.',
    accent: '#f59e0b',
  },
  {
    index: '04',
    title: 'Obsession with User Experience',
    text: 'A feature is only as good as how it feels to use. Typography, spacing, micro-interactions, and accessibility are engineered into every screen.',
    accent: '#8b5cf6',
  },
];

// Quick facts from MyPortfolio
export const ABOUT_FACTS = [
  { label: 'Degree', value: 'B.S. in Computer Science' },
  { label: 'Specialization', value: 'Full-Stack Web & Mobile Development' },
  { label: 'Core Backend', value: 'Laravel, Node.js, Express, MySQL' },
  { label: 'Core Frontend', value: 'React, Tailwind CSS, Framer Motion' },
  { label: 'Mobile Stack', value: 'React Native (Expo), Flutter (Dart)' },
  { label: 'Status', value: 'Open for Freelance & Full-time Roles' },
];
