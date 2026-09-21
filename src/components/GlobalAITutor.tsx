import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AITutorPanel } from './quantum-tutor/AITutorPanel';
import { TutorContext } from '../services/aiTutorService';

// Qubit AI 4-Pointed Star Icon
function QubitStar({ size = 20, className = '' }: { size?: number; className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      className={className}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="global-qubit-star-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4285F4" />
          <stop offset="35%" stopColor="#9B72CB" />
          <stop offset="70%" stopColor="#D96570" />
          <stop offset="100%" stopColor="#E2B340" />
        </linearGradient>
      </defs>
      <path
        fill="url(#global-qubit-star-grad)"
        d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z"
      />
    </svg>
  );
}

import { getLessonById, getCourseById, getPathById } from '../data/curriculum';

export function GlobalAITutor() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // On quantum-lab, the toolbar button handles opening the lab-specific tutor
  if (location.pathname.startsWith('/quantum-lab')) {
    return null;
  }

  // Derive dynamic page context
  const getContextForRoute = (): TutorContext => {
    const p = location.pathname;
    if (p.startsWith('/algorithms')) {
      return { pageType: 'algorithms', pageTitle: 'Quantum Algorithms Explorer' };
    }
    if (p.includes('/lesson/')) {
      const lessonId = p.split('/lesson/')[1]?.split('/')[0]?.split('?')[0];
      const lesson = lessonId ? getLessonById(lessonId) : undefined;
      return { 
        pageType: 'lesson', 
        pageTitle: lesson ? lesson.title : 'Quantum Lesson',
        lesson 
      };
    }
    if (p.includes('/course/')) {
      const courseId = p.split('/course/')[1]?.split('/')[0]?.split('?')[0];
      const course = courseId ? getCourseById(courseId) : undefined;
      return { 
        pageType: 'course', 
        pageTitle: course ? course.title : 'Course Overview' 
      };
    }
    if (p.includes('/path/')) {
      const pathId = p.split('/path/')[1]?.split('/')[0]?.split('?')[0];
      const pathObj = pathId ? getPathById(pathId) : undefined;
      return { 
        pageType: 'path', 
        pageTitle: pathObj ? pathObj.title : 'Learning Path' 
      };
    }
    if (p.startsWith('/learn')) {
      return { pageType: 'learn', pageTitle: 'Quantum Foundations & Curriculum' };
    }
    if (p.startsWith('/dashboard')) {
      return { pageType: 'dashboard', pageTitle: 'Student Dashboard & Progress' };
    }
    if (p.startsWith('/experiments')) {
      return { pageType: 'experiments', pageTitle: 'Saved Experiments & Circuits' };
    }
    if (p.startsWith('/profile') || p.startsWith('/settings')) {
      return { pageType: 'profile', pageTitle: 'User Profile & Achievements' };
    }
    if (p.startsWith('/about')) {
      return { pageType: 'about', pageTitle: 'About QubitCraft' };
    }
    return { pageType: 'home', pageTitle: 'QubitCraft Platform' };
  };

  const context = getContextForRoute();

  return (
    <>
      {/* Floating Ask AI Button (White / Light theme) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 px-4 py-3 bg-white dark:bg-[#131314] hover:bg-slate-50 dark:hover:bg-[#1e1f20] text-slate-900 dark:text-white border border-slate-200/90 dark:border-[#2e2f33] rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 z-50 group flex items-center gap-2.5 ring-2 ring-indigo-500/15 dark:ring-indigo-500/25"
          title="Ask Qubit AI"
        >
          <QubitStar size={20} className="group-hover:rotate-12 transition-transform duration-300" />
          <span className="text-xs font-bold tracking-wide text-slate-800 dark:text-[#e3e3e3]">
            Ask Qubit AI
          </span>
        </button>
      )}

      {/* Full-Height Gemini Sidebar */}
      <AITutorPanel 
        context={context}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
