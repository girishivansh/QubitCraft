export interface Feature {
  icon: string;
  title: string;
  description: string;
  color: 'indigo' | 'blue' | 'green' | 'orange' | 'pink';
}

export const features: Feature[] = [
  {
    icon: 'BookOpen',
    title: 'Interactive Learning',
    description:
      'Learn quantum concepts with engaging visuals and step-by-step tutorials.',
    color: 'indigo',
  },
  {
    icon: 'Cpu',
    title: 'Circuit Builder',
    description:
      'Build and simulate quantum circuits in a simple drag-and-drop interface.',
    color: 'blue',
  },
  {
    icon: 'Bot',
    title: 'AI Quantum Tutor',
    description:
      'Get instant explanations, hints and guidance from our AI tutor.',
    color: 'green',
  },
  {
    icon: 'TrendingUp',
    title: 'Track Progress',
    description:
      'Complete assessments, earn badges and track your quantum journey.',
    color: 'orange',
  },
  {
    icon: 'Activity',
    title: 'Real-time Simulation',
    description:
      'Visualize quantum states, Bloch spheres and probability distributions.',
    color: 'pink',
  },
];
