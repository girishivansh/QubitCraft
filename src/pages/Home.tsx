import { Hero } from '../components/Hero';
import { Features } from '../components/Features';
import { LearningPaths } from '../components/LearningPaths';
import { Stats } from '../components/Stats';
import { CTABanner } from '../components/CTABanner';
import { Testimonials } from '../components/Testimonials';
import { Ecosystem } from '../components/Ecosystem';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export default function Home() {
  const ref = useScrollAnimation();
  return (
    <div ref={ref}>
      <Hero />
      <Features />
      <LearningPaths />
      <Stats />
      <CTABanner />
      <Testimonials />
      <Ecosystem />
    </div>
  );
}
