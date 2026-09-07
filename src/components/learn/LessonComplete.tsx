import React, { useEffect, useState } from 'react';
import { CheckCircle, Star, Trophy, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '../Button';

export interface LessonCompleteProps {
  lessonTitle: string;
  xpEarned: number;
  courseCompleted: boolean;
  courseXP: number;
  achievementsEarned: string[];
  nextLessonId: string | null;
  courseId: string;
  pathId: string;
  onDismiss: () => void;
}

export const LessonComplete: React.FC<LessonCompleteProps> = ({
  lessonTitle,
  xpEarned,
  courseCompleted,
  courseXP,
  nextLessonId,
  courseId,
  pathId,
  onDismiss,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-navy-900/80 backdrop-blur-md transition-opacity duration-500 ${
          mounted ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onDismiss}
      />

      {/* Modal */}
      <div 
        className={`relative w-full max-w-lg bg-white rounded-[24px] shadow-2xl overflow-hidden transform transition-all duration-500 delay-100 ${
          mounted ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-8'
        }`}
      >
        <div className="bg-gradient-to-br from-indigo-500 to-blue-600 p-8 text-center text-white relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          
          <div className="relative z-10 flex justify-center mb-6">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center animate-bounce-slow shadow-lg">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
          </div>
          
          <h2 className="text-3xl font-extrabold mb-2 text-shadow-sm">
            {courseCompleted ? 'Course Complete!' : 'Lesson Complete!'}
          </h2>
          <p className="text-indigo-100 font-medium">
            {lessonTitle}
          </p>
        </div>

        <div className="p-8">
          <div className="flex flex-col gap-4 mb-8">
            <div className="flex items-center justify-between p-4 bg-amber-50 border border-amber-100 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
                  <Star className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <div className="text-sm font-bold text-amber-800">Lesson XP</div>
                  <div className="text-xs text-amber-600 font-medium">For completion & quizzes</div>
                </div>
              </div>
              <div className="text-2xl font-black text-amber-600">+{xpEarned}</div>
            </div>

            {courseCompleted && (
              <div className="flex items-center justify-between p-4 bg-indigo-50 border border-indigo-100 rounded-2xl animate-fade-in delay-300">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-indigo-800">Course Bonus</div>
                    <div className="text-xs text-indigo-600 font-medium">For finishing the course</div>
                  </div>
                </div>
                <div className="text-2xl font-black text-indigo-600">+{courseXP}</div>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={onDismiss}
              icon={<ArrowLeft className="w-4 h-4" />}
            >
              Back to Course
            </Button>
            
            {nextLessonId ? (
              <Button
                variant="primary"
                href={`/learn/course/${courseId}/lesson/${nextLessonId}`}
                className="flex-1"
                icon={<ArrowRight className="w-4 h-4" />}
                iconPosition="right"
              >
                Next Lesson
              </Button>
            ) : (
              <Button
                variant="primary"
                href={`/learn/path/${pathId}`}
                className="flex-1"
                icon={<Trophy className="w-4 h-4" />}
              >
                Finish Course
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonComplete;
