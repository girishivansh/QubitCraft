export interface Stat {
  value: string;
  label: string;
  icon: string;
  color: 'indigo' | 'green' | 'orange' | 'blue' | 'pink';
}

// These are prototype/demo values. Replace with real backend data in production.
export const stats: Stat[] = [
  {
    value: '1,200+',
    label: 'Active Learners',
    icon: 'Users',
    color: 'indigo',
  },
  {
    value: '50+',
    label: 'Interactive Lessons',
    icon: 'Monitor',
    color: 'green',
  },
  {
    value: '100+',
    label: 'Practice Circuits',
    icon: 'Zap',
    color: 'orange',
  },
  {
    value: '15+',
    label: 'Quantum Algorithms',
    icon: 'Star',
    color: 'blue',
  },
  {
    value: '24/7',
    label: 'AI Tutor Support',
    icon: 'MessageCircle',
    color: 'pink',
  },
];
