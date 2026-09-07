import React from 'react';
import { Atom, Cpu, Brain, Clock, BookOpen, Star, ChevronRight } from 'lucide-react';
import type { LearningPathData } from '../../types/curriculum';
import { ProgressBar } from './ProgressBar';
import { Button } from '../Button';

interface LearningPathCardProps {
  path: LearningPathData;
  progress: number;
  completedLessons: number;
  isRecommended?: boolean;
}

const iconMap: Record<string, React.ReactNode> = {
  Atom: <Atom className="w-8 h-8" />,
  Cpu: <Cpu className="w-8 h-8" />,
  Brain: <Brain className="w-8 h-8" />,
};

const difficultyColors = {
  beginner: 'bg-green-50 text-green-600 border-green-100',
  intermediate: 'bg-blue-50 text-blue-600 border-blue-100',
  advanced: 'bg-purple-50 text-purple-600 border-purple-100',
};

export const LearningPathCard: React.FC<LearningPathCardProps> = ({
  path,
  progress,
  completedLessons,
  isRecommended = false,
}) => {
  const isCompleted = progress >= 100;
  const isStarted = progress > 0;

  return (
    <div className="bg-white rounded-[20px] shadow-card hover:shadow-card-hover transition-all duration-300 border border-slate-100 flex flex-col h-full relative overflow-hidden group">
      {isRecommended && (
        <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-bl-lg z-10 flex items-center gap-1 shadow-sm">
          <Star className="w-3 h-3 fill-current" /> Recommended
        </div>
      )}
      
      <div className="p-6 flex-grow flex flex-col">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-5 group-hover:scale-110 transition-transform duration-300">
          {iconMap[path.icon] || <Atom className="w-8 h-8" />}
        </div>
        
        <div className="flex items-center gap-3 mb-3">
          <span className={`px-2.5 py-1 text-xs font-semibold rounded-md border ${difficultyColors[path.difficulty]}`}>
            {path.difficulty.charAt(0).toUpperCase() + path.difficulty.slice(1)}
          </span>
          <span className="text-sm font-medium text-amber-500 flex items-center gap-1">
            <Star className="w-4 h-4 fill-current" /> {path.totalXP} XP
          </span>
        </div>

        <h3 className="text-xl font-bold text-navy-900 mb-2">{path.title}</h3>
        <p className="text-slate-600 text-sm mb-6 flex-grow line-clamp-3">{path.description}</p>
        
        <div className="grid grid-cols-2 gap-4 mb-6 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 text-slate-500">
            <BookOpen className="w-4 h-4" />
            <span className="text-sm">{path.lessonCount} Lessons</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{path.estimatedDuration}</span>
          </div>
        </div>

        <div className="mt-auto">
          {isStarted ? (
            <div className="mb-4">
              <div className="flex justify-between text-xs font-medium text-slate-500 mb-1.5">
                <span>{completedLessons} / {path.lessonCount} lessons</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <ProgressBar value={progress} color="indigo" />
            </div>
          ) : null}

          <Button 
            href={`/learn/path/${path.id}`} 
            variant={isCompleted ? 'secondary' : 'primary'} 
            className="w-full justify-between group/btn"
          >
            <span>{isCompleted ? 'Review Path' : isStarted ? 'Continue Learning' : 'Start Path'}</span>
            <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LearningPathCard;
