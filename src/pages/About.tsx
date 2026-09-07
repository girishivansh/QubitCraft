import { Info } from 'lucide-react';
import PageShell from '../components/PageShell';

export default function About() {
  return (
    <PageShell
      title="About QubitCraft"
      description="QubitCraft is an AI-Powered Interactive Quantum Algorithm Learning Platform built for SIH 2026 (Problem Statement SIH26140). Our mission is to make quantum computing visual, interactive, and accessible to everyone."
      icon={<Info size={32} />}
      comingSoon={false}
    />
  );
}
