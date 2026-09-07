export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  rating: number;
  initials: string;
  color: string;
}

export const testimonials: Testimonial[] = [
  {
    quote:
      'QubitCraft made quantum computing easy to understand. The interactive circuits and Bloch sphere visualizations are game-changers!',
    name: 'Arjun Patel',
    role: 'Computer Science Student',
    rating: 5,
    initials: 'AP',
    color: 'bg-indigo-100 text-indigo-700',
  },
  {
    quote:
      "The AI tutor is incredibly helpful. I get instant explanations whenever I'm stuck. Best platform to learn quantum algorithms!",
    name: 'Ananya Sharma',
    role: 'Quantum Enthusiast',
    rating: 5,
    initials: 'AS',
    color: 'bg-blue-100 text-blue-700',
  },
  {
    quote:
      'As a teacher, QubitCraft helps me demonstrate complex quantum concepts in a simple and visual way. Highly recommended!',
    name: 'Dr. Rohan Mehta',
    role: 'Physics Professor',
    rating: 5,
    initials: 'RM',
    color: 'bg-emerald-100 text-emerald-700',
  },
];
