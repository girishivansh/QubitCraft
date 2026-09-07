import React from 'react';
import { X, Check, Lock, ChevronLeft, ChevronRight } from 'lucide-react';
import type { LessonState } from '../../types/curriculum';

interface SidebarLesson {
  id: string;
  title: string;
  order: number;
  state: LessonState;
}

export interface LessonSidebarProps {
  lessons: SidebarLesson[];
  currentLessonId: string;
  courseId: string;
  courseTitle: string;
  onNavigate: (lessonId: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const LessonSidebar: React.FC<LessonSidebarProps> = ({
  lessons,
  currentLessonId,
  courseTitle,
  onNavigate,
  isOpen,
  onClose,
}) => {
  const currentIndex = lessons.findIndex((l) => l.id === currentLessonId);
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

  const handleNav = (lesson: SidebarLesson | null) => {
    if (lesson && lesson.state !== 'locked') {
      onNavigate(lesson.id);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-navy-900/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Content */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-80 bg-white border-r border-slate-200 shadow-xl lg:shadow-none lg:static lg:block transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="pr-4">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Course
            </span>
            <h3 className="text-sm font-bold text-navy-900 line-clamp-2 leading-tight">
              {courseTitle}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2 -mr-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full lg:hidden transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
          {lessons.map((lesson) => {
            const isCurrent = lesson.id === currentLessonId;
            const isCompleted = lesson.state === 'completed';
            const isLocked = lesson.state === 'locked';

            return (
              <button
                key={lesson.id}
                onClick={() => handleNav(lesson)}
                disabled={isLocked}
                className={`w-full text-left flex items-start gap-3 p-3 rounded-xl transition-all ${
                  isCurrent 
                    ? 'bg-indigo-50 border border-indigo-100 shadow-sm' 
                    : isLocked 
                      ? 'opacity-60 cursor-not-allowed hover:bg-slate-50/50' 
                      : 'hover:bg-slate-50 cursor-pointer active:bg-slate-100'
                }`}
              >
                <div className={`mt-0.5 flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full ${
                  isCompleted ? 'bg-indigo-600 text-white' :
                  isCurrent ? 'border-2 border-indigo-600 bg-white text-indigo-600' :
                  isLocked ? 'bg-slate-100 text-slate-400' :
                  'border-2 border-slate-300 text-transparent'
                }`}>
                  {isCompleted && <Check className="w-3 h-3" />}
                  {isCurrent && <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />}
                  {isLocked && <Lock className="w-3 h-3" />}
                </div>
                <div>
                  <span className={`text-xs font-medium block mb-0.5 ${
                    isCurrent ? 'text-indigo-600' : 'text-slate-500'
                  }`}>
                    Lesson {lesson.order}
                  </span>
                  <span className={`text-sm font-semibold leading-snug ${
                    isCurrent ? 'text-indigo-950' : 'text-slate-700'
                  }`}>
                    {lesson.title}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="p-4 border-t border-slate-200 bg-white flex gap-2">
          <button
            onClick={() => handleNav(prevLesson)}
            disabled={!prevLesson}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-sm font-medium rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:pointer-events-none transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Prev
          </button>
          <button
            onClick={() => handleNav(nextLesson)}
            disabled={!nextLesson || nextLesson.state === 'locked'}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-sm font-medium rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:pointer-events-none transition-colors"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );
};

export default LessonSidebar;
