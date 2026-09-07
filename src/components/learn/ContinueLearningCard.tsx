import React from 'react';
import { ArrowRight, BookOpen, Clock, PlayCircle, Star } from 'lucide-react';
import { ProgressBar } from './ProgressBar';
import { Button } from '../Button';

interface ContinueLearningState {
  pathId: string;
  courseId: string;
  lessonId: string;
  lessonTitle: string;
  pathTitle: string;
  courseTitle: string;
  lessonNumber: number;
  totalLessons: number;
  progress: number;
}

export interface ContinueLearningCardProps {
  continueLearning: ContinueLearningState | null;
  recommendedPathId?: string;
  recommendedPathTitle?: string;
}

export const ContinueLearningCard: React.FC<ContinueLearningCardProps> = ({
  continueLearning,
  recommendedPathId,
  recommendedPathTitle,
}) => {
  const hasProgress = continueLearning !== null;

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-[20px] p-8 border border-indigo-100 shadow-sm relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
        <svg width="200" height="200" viewBox="0 0 100 100" className="animate-spin-slow">
          <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="10 5" />
          <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="5 5" />
        </svg>
      </div>

      <div className="relative z-10">
        {hasProgress ? (
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
            <div className="flex-1 max-w-2xl">
              <div className="flex items-center gap-2 text-indigo-600 font-semibold text-sm mb-3">
                <span>{continueLearning.pathTitle}</span>
                <span className="text-indigo-300">•</span>
                <span>{continueLearning.courseTitle}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-navy-900 mb-4">
                {continueLearning.lessonTitle}
              </h2>
              <div className="flex items-center gap-4 text-slate-600 text-sm font-medium mb-6">
                <span className="flex items-center gap-1.5 bg-white/60 px-2.5 py-1 rounded-md border border-indigo-100/50">
                  <BookOpen className="w-4 h-4 text-indigo-500" />
                  Lesson {continueLearning.lessonNumber} of {continueLearning.totalLessons}
                </span>
                <span className="flex items-center gap-1.5 bg-white/60 px-2.5 py-1 rounded-md border border-indigo-100/50">
                  <Clock className="w-4 h-4 text-indigo-500" />
                  ~15 mins left
                </span>
              </div>
              <div className="max-w-md">
                <ProgressBar value={continueLearning.progress} color="indigo" showLabel={true} />
              </div>
            </div>
            <div className="w-full md:w-auto">
              <Button
                href={`/learn/course/${continueLearning.courseId}/lesson/${continueLearning.lessonId}`}
                size="lg"
                icon={<PlayCircle className="w-5 h-5" />}
                className="w-full md:w-auto shadow-md"
              >
                Continue Learning
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
            <div className="flex-1 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/60 border border-indigo-100 text-indigo-700 text-sm font-semibold rounded-full mb-4">
                <Star className="w-4 h-4 fill-current text-amber-400" /> New to Quantum Computing?
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-navy-900 mb-4 tracking-tight">
                Start Your Quantum Journey
              </h2>
              <p className="text-slate-600 text-lg mb-0 max-w-lg leading-relaxed">
                Begin with our recommended path:{' '}
                <strong className="text-indigo-700">{recommendedPathTitle || 'Quantum Computing Fundamentals'}</strong>. 
                Learn the basics from the ground up.
              </p>
            </div>
            <div className="w-full md:w-auto">
              <Button
                href={recommendedPathId ? `/learn/path/${recommendedPathId}` : '/learn/path/fundamentals'}
                size="lg"
                icon={<ArrowRight className="w-5 h-5" />}
                iconPosition="right"
                className="w-full md:w-auto shadow-md"
              >
                Get Started
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContinueLearningCard;
