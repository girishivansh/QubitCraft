import { Braces } from 'lucide-react';
import PageShell from '../components/PageShell';

export default function Algorithms() {
  return (
    <PageShell
      title="Quantum Algorithms"
      description="Explore and understand famous quantum algorithms through interactive step-by-step visualizations and explanations."
      icon={<Braces size={32} />}
      comingSoon={true}
    />
  );
}
