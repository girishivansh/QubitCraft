// QubitCraft — Centralized constants and configuration
// All demo/prototype values are collected here for easy replacement with real backend data.

export const BRAND = {
  name: 'QubitCraft',
  tagline: 'Craft. Compute. Conquer.',
  description: 'AI-Powered Interactive Quantum Algorithm Learning Platform',
  heroHeadline: ['AI-Powered.', 'Interactive.', 'Quantum Learning.'],
  heroSubtext:
    'QubitCraft makes quantum computing easy, visual and exciting. Learn quantum concepts, build circuits, simulate algorithms and get AI guidance — all in one place.',
  sihCode: 'SIH 26140',
  sihLabel: 'Smart Education Initiative',
} as const;

export const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Learn', path: '/learn' },
  { label: 'Quantum Lab', path: '/quantum-lab' },
  { label: 'Algorithms', path: '/algorithms' },
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'About Us', path: '/about' },
] as const;

export const FOOTER_LINKS = {
  platform: [
    { label: 'Learn', path: '/learn' },
    { label: 'Quantum Lab', path: '/quantum-lab' },
    { label: 'Algorithms', path: '/algorithms' },
    { label: 'Dashboard', path: '/dashboard' },
  ],
  resources: [
    { label: 'Documentation', path: '#' },
    { label: 'Tutorials', path: '#' },
    { label: 'Challenges', path: '#' },
    { label: 'FAQ', path: '#' },
  ],
  company: [
    { label: 'About Us', path: '/about' },
    { label: 'Contact', path: '#' },
    { label: 'Privacy', path: '#' },
    { label: 'Terms', path: '#' },
  ],
} as const;

export const NAV_LINKS_BY_ROLE = {
  student: [
    { label: 'Home', path: '/' },
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Learn', path: '/learn' },
    { label: 'Quantum Lab', path: '/quantum-lab' },
    { label: 'Algorithms', path: '/algorithms' },
    { label: 'About Us', path: '/about' },
  ],
  instructor: [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Learn', path: '/learn' },
    { label: 'Quantum Lab', path: '/quantum-lab' },
    { label: 'Algorithms', path: '/algorithms' },
    { label: 'Instructor', path: '/instructor' },
  ],
  admin: [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Instructor', path: '/instructor' },
    { label: 'Settings', path: '/settings' },
  ],
} as const;

export const ECOSYSTEM_LABELS = [
  'Quantum Education',
  'Open Quantum Software',
  'Simulation',
  'Research',
  'Algorithm Practice',
] as const;

