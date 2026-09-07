import React from 'react';
import { FeatureCard } from './FeatureCard';
import { features } from '../data/features';

export const Features: React.FC = () => {
  return (
    <section className="scroll-trigger max-w-container mx-auto px-4 md:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-5">
        {features.map((feature, index) => (
          <div key={index} className="stagger-child">
            <FeatureCard {...feature} />
          </div>
        ))}
      </div>
    </section>
  );
};
