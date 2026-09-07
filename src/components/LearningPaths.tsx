import React from 'react';
import { SectionHeading } from './SectionHeading';
import { LearningPathCard } from './LearningPathCard';
import { learningPaths } from '../data/learningPaths';

export const LearningPaths: React.FC = () => {
  return (
    <section className="scroll-trigger max-w-container mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-20">
      <div className="stagger-child">
        <SectionHeading
          label="LEARNING PATHS"
          title="From Basics to Brilliance"
          subtitle="Choose your path and start your quantum journey today."
          action={{ label: 'View All Paths', href: '/learn' }}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
        {learningPaths.map((path, index) => (
          <div key={index} className="h-full stagger-child">
            <LearningPathCard {...path} />
          </div>
        ))}
      </div>
    </section>
  );
};
