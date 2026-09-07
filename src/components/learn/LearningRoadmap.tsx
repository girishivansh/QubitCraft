import React from 'react';
import { Check, Lock, Play, Star, Clock } from 'lucide-react';
import type { LessonState } from '../../types/curriculum';
import { Button } from '../Button';

interface RoadmapLesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  xp: number;
  order: number;
  state: LessonState;
}

export interface LearningRoadmapProps {
  lessons: RoadmapLesson[];
  courseId: string;
}

export const LearningRoadmap: React.FC<LearningRoadmapProps> = ({ lessons, courseId }) => {
  return (
    <div className="relative">
      <div className="absolute left-6 top-8 bottom-8 w-px bg-gray-200" />

      <div className="space-y-12">
        {lessons.map((lesson, index) => {
          const isCompleted = lesson.state === 'completed';
          const isCurrent = lesson.state === 'current';
          const isAvailable = lesson.state === 'available';
          const isLocked = lesson.state === 'locked';
          const isLast = index === lessons.length - 1;

          return (
            <div key={lesson.id} className="relative flex gap-8 group">
              {/* Vertical line fill for completed segments */}
              {!isLast && isCompleted && (
                <div className="absolute left-6 top-10 bottom-[-3rem] w-px bg-indigo-600" />
              )}
              {/* Partial line fill for current segment */}
              {!isLast && isCurrent && (
                <div className="absolute left-6 top-10 bottom-[-3rem] w-px bg-gradient-to-b from-indigo-600 to-gray-200" />
              )}

              <div className="relative z-10 flex-shrink-0 mt-1">
                {isCompleted && (
                  <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-md">
                    <Check className="w-5 h-5" />
                  </div>
                )}
                {isCurrent && (
                  <div className="w-12 h-12 rounded-full bg-white border-2 border-indigo-600 text-indigo-600 flex items-center justify-center relative shadow-sm">
                    <div className="absolute inset-0 rounded-full animate-ping bg-indigo-100 opacity-75" />
                    <Play className="w-4 h-4 ml-0.5 relative z-10 fill-current" />
                  </div>
                )}
                {isAvailable && (
                  <div className="w-12 h-12 rounded-full bg-white border-2 border-slate-200 text-slate-400 flex items-center justify-center hover:border-indigo-300 hover:text-indigo-500 transition-colors shadow-sm">
                    <span className="font-semibold">{lesson.order}</span>
                  </div>
                )}
                {isLocked && (
                  <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-200 text-slate-400 flex items-center justify-center">
                    <Lock className="w-4 h-4" />
                  </div>
                )}
              </div>

              <div className={`flex-grow bg-white rounded-2xl border ${isCurrent ? 'border-indigo-200 shadow-card-hover' : 'border-slate-100 shadow-sm'} p-6 transition-all hover:shadow-md ${isLocked ? 'opacity-70 grayscale-[0.5]' : ''}`}>
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                        Lesson {lesson.order}
                      </span>
                      {isCompleted && (
                        <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Completed
                        </span>
                      )}
                    </div>
                    <h3 className={`text-xl font-bold ${isLocked ? 'text-slate-600' : 'text-navy-900'} mb-2`}>
                      {lesson.title}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed max-w-2xl">
                      {lesson.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 md:flex-col md:items-end">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 text-slate-600 rounded-md text-xs font-semibold border border-slate-100">
                      <Clock className="w-3.5 h-3.5" /> {lesson.duration}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 rounded-md text-xs font-semibold border border-amber-100">
                      <Star className="w-3.5 h-3.5 fill-current" /> {lesson.xp} XP
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  {isLocked ? (
                    <Button variant="ghost" size="sm" className="opacity-50 cursor-not-allowed">
                      <Lock className="w-4 h-4 mr-2" /> Locked
                    </Button>
                  ) : (
                    <Button
                      href={`/learn/course/${courseId}/lesson/${lesson.id}`}
                      variant={isCurrent ? 'primary' : 'secondary'}
                      size="sm"
                    >
                      {isCompleted ? 'Review Lesson' : isCurrent ? 'Continue Lesson' : 'Start Lesson'}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LearningRoadmap;
