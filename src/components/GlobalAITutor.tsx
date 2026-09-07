import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Bot } from 'lucide-react';
import { AITutorPanel } from './quantum-tutor/AITutorPanel';

export function GlobalAITutor() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Hide on quantum-lab because it has its own built-in tutor panel
  if (location.pathname.startsWith('/quantum-lab')) {
    return null;
  }

  // General context since we are outside the lab
  const context = {};

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 p-4 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 hover:scale-105 hover:shadow-xl transition-all duration-300 z-50 group flex items-center justify-center"
          title="Ask AI Tutor"
        >
          <Bot size={24} className="group-hover:animate-pulse" />
        </button>
      )}

      {/* Floating Panel Container */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 h-[600px] max-h-[85vh] flex flex-col shadow-2xl rounded-2xl overflow-hidden ring-1 ring-slate-200 overscroll-contain" data-lenis-prevent="true">
          <AITutorPanel 
            context={context}
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
          />
        </div>
      )}
    </>
  );
}
