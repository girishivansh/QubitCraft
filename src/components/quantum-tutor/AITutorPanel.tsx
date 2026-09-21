import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Send, X, MoreVertical, Plus, 
  Copy, Check, Sparkles, Atom, ChevronDown, 
  RotateCcw, FileText, Zap, HelpCircle, ThumbsUp, ThumbsDown,
  Compass, Code
} from 'lucide-react';
import { aiTutorService, TutorContext, TutorMessage } from '../../services/aiTutorService';
import { useAuth } from '../../auth/AuthProvider';
import { getLessonById, getCourseById, getPathById } from '../../data/curriculum';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

interface AITutorPanelProps {
  context: TutorContext;
  isOpen: boolean;
  onClose: () => void;
}

interface PageContextDetails {
  contextTitle: string;
  chips: { label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[];
}

function getPageContextAndSuggestions(pathname: string, context: TutorContext): PageContextDetails {
  // 1. Quantum Lab route or active circuit
  if (pathname.startsWith('/quantum-lab') || pathname.startsWith('/playground') || context.circuit) {
    const numQ = context.circuit?.numQubits ?? 2;
    const gateCount = context.circuit?.operations?.length ?? 0;
    const hasGates = gateCount > 0;
    return {
      contextTitle: context.circuit 
        ? `Sharing "Quantum Circuit Studio (${numQ} Qubits, ${gateCount} Gate${gateCount === 1 ? '' : 's'})"`
        : 'Sharing "Quantum Circuit Studio"',
      chips: [
        { 
          label: hasGates ? 'Explain my current circuit' : 'How do I build a Bell State (|Φ+⟩)?', 
          icon: hasGates ? FileText : Sparkles 
        },
        { label: 'What is the difference between H and X gates?', icon: Zap },
        { label: 'How does the Bloch sphere represent qubit state?', icon: Atom },
        { label: 'Why does measurement collapse superposition?', icon: HelpCircle },
      ]
    };
  }

  // 2. Specific Lesson Player
  if (pathname.includes('/lesson/') || context.pageType === 'lesson') {
    const lessonId = pathname.split('/lesson/')[1]?.split('/')[0]?.split('?')[0];
    const lesson = (lessonId ? getLessonById(lessonId) : undefined) || context.lesson;
    const title = lesson ? lesson.title : (context.pageTitle || 'Quantum Lesson');
    return {
      contextTitle: `Sharing "Lesson: ${title}"`,
      chips: [
        { label: `Explain "${title}" concepts`, icon: FileText },
        { label: 'Give me an intuitive analogy for this', icon: Sparkles },
        { label: 'How does this apply in quantum computing?', icon: Zap },
        { label: 'Quiz me on this lesson', icon: HelpCircle },
      ]
    };
  }

  // 3. Course Detail Page
  if ((pathname.includes('/course/') && !pathname.includes('/lesson/')) || context.pageType === 'course') {
    const courseId = pathname.split('/course/')[1]?.split('/')[0]?.split('?')[0];
    const course = courseId ? getCourseById(courseId) : undefined;
    const title = course ? course.title : (context.pageTitle || 'Quantum Course');
    return {
      contextTitle: `Sharing "Course: ${title}"`,
      chips: [
        { label: `Overview of "${title}"`, icon: FileText },
        { label: 'What are the core prerequisites?', icon: HelpCircle },
        { label: 'How does this fit into the curriculum?', icon: Sparkles },
        { label: 'Recommend study tips for this course', icon: Zap },
      ]
    };
  }

  // 4. Learning Path Page
  if (pathname.includes('/path/') || context.pageType === 'path') {
    const pathId = pathname.split('/path/')[1]?.split('/')[0]?.split('?')[0];
    const pathObj = pathId ? getPathById(pathId) : undefined;
    const title = pathObj ? pathObj.title : (context.pageTitle || 'Learning Path');
    return {
      contextTitle: `Sharing "Path: ${title}"`,
      chips: [
        { label: `What will I master in ${title}?`, icon: FileText },
        { label: 'Recommended order of lessons to take', icon: Compass },
        { label: 'What mathematical background is required?', icon: HelpCircle },
        { label: 'How does this prepare me for quantum lab?', icon: Zap },
      ]
    };
  }

  // 5. Algorithms Page
  if (pathname.startsWith('/algorithms') || context.activeAlgorithmName) {
    const isGeneric = !context.activeAlgorithmName || context.activeAlgorithmName === 'QubitCraft Platform' || context.activeAlgorithmName === 'Quantum Algorithms Explorer';
    const algoName = isGeneric ? "Grover's Search Algorithm" : context.activeAlgorithmName;
    return {
      contextTitle: isGeneric ? 'Sharing "Quantum Algorithms Explorer"' : `Sharing "Algorithm: ${algoName}"`,
      chips: [
        { label: `Explain ${algoName} step-by-step`, icon: FileText },
        { label: 'How does phase kickback work?', icon: Zap },
        { label: 'What is the quantum speedup for this?', icon: Sparkles },
        { label: 'How do I implement this in Qiskit?', icon: Code },
      ]
    };
  }

  // 6. Learn Catalog / Hub
  if (pathname.startsWith('/learn') || context.pageType === 'learn') {
    return {
      contextTitle: 'Sharing "Quantum Curriculum & Foundations"',
      chips: [
        { label: 'Which learning path should I start with?', icon: Compass },
        { label: 'What is quantum superposition & entanglement?', icon: Atom },
        { label: 'What mathematical background is required?', icon: HelpCircle },
        { label: 'How do qubits differ from classical bits?', icon: Sparkles },
      ]
    };
  }

  // 7. Dashboard
  if (pathname.startsWith('/dashboard') || context.pageType === 'dashboard') {
    return {
      contextTitle: 'Sharing "Dashboard & Learning Progress"',
      chips: [
        { label: 'What should I learn next based on my progress?', icon: Compass },
        { label: 'How do daily streaks and XP work?', icon: Zap },
        { label: 'Summarize my quantum learning milestones', icon: FileText },
        { label: 'How do I unlock more achievements?', icon: Sparkles },
      ]
    };
  }

  // 8. Saved Experiments
  if (pathname.startsWith('/experiments') || context.pageType === 'experiments') {
    return {
      contextTitle: 'Sharing "Saved Experiments & Circuits"',
      chips: [
        { label: 'How do I optimize circuit depth and gate count?', icon: Zap },
        { label: 'What is the difference between statevector and shots?', icon: HelpCircle },
        { label: 'How do I export experiments to IBM Quantum?', icon: Code },
        { label: 'Suggest an interesting experiment to simulate', icon: Sparkles },
      ]
    };
  }

  // 9. Profile & Settings
  if (pathname.startsWith('/profile') || pathname.startsWith('/settings') || context.pageType === 'profile') {
    return {
      contextTitle: 'Sharing "User Profile & Achievements"',
      chips: [
        { label: 'How can I level up my quantum rank?', icon: Sparkles },
        { label: 'What achievements can I earn next?', icon: Zap },
        { label: 'What quantum algorithms should I master?', icon: Compass },
        { label: 'What can QubitCraft AI do for me?', icon: HelpCircle },
      ]
    };
  }

  // 10. About Page
  if (pathname.startsWith('/about') || context.pageType === 'about') {
    return {
      contextTitle: 'Sharing "About QubitCraft"',
      chips: [
        { label: 'What is QubitCraft and who is it designed for?', icon: FileText },
        { label: 'How does the browser quantum simulator work?', icon: Zap },
        { label: 'Can I run circuits on real quantum hardware?', icon: Sparkles },
        { label: 'What quantum concepts can I learn here?', icon: HelpCircle },
      ]
    };
  }

  // 11. Home / Landing Page (fallback)
  return {
    contextTitle: 'Sharing "QubitCraft Platform"',
    chips: [
      { label: 'What can you do?', icon: Sparkles },
      { label: 'How do I start learning quantum computing?', icon: Compass },
      { label: 'What is quantum superposition & entanglement?', icon: Atom },
      { label: 'How do quantum computers differ from classical?', icon: HelpCircle },
    ]
  };
}

// Qubit AI 4-Pointed Star Icon
function QubitStar({ size = 28, className = '' }: { size?: number; className?: string }) {
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
        <linearGradient id="qubit-star-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4285F4" />
          <stop offset="35%" stopColor="#9B72CB" />
          <stop offset="70%" stopColor="#D96570" />
          <stop offset="100%" stopColor="#E2B340" />
        </linearGradient>
      </defs>
      <path
        fill="url(#qubit-star-grad)"
        d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z"
      />
    </svg>
  );
}

export function AITutorPanel({ context, isOpen, onClose }: AITutorPanelProps) {
  const { user } = useAuth();
  const location = useLocation();
  const userName = user?.name ? user.name.split(' ')[0] : 'Shivansh';

  const [messages, setMessages] = useState<TutorMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isSharingContext, setIsSharingContext] = useState(true);
  const [selectedModel, setSelectedModel] = useState<'Flash' | 'Pro'>('Flash');
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Derive dynamic page-aware context title and suggestion chips
  const { contextTitle, chips: suggestionChips } = getPageContextAndSuggestions(location.pathname, context);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: TutorMessage = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const enrichedContext: TutorContext = {
        ...context,
        pageType: context.pageType || location.pathname,
        pageTitle: contextTitle,
      };

      const response = await aiTutorService.askTutor({
        message: text,
        context: isSharingContext ? enrichedContext : undefined,
        conversation: messages.slice(-8), 
      });

      const aiMsg: TutorMessage = { role: 'assistant', content: response.message };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      setMessages((prev) => [
        ...prev, 
        { role: 'assistant', content: 'Quantum Tutor is temporarily unavailable. Please try again.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  };

  const handleCopyMessage = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleResetChat = () => {
    setMessages([]);
    setMoreMenuOpen(false);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Dim backdrop for mobile screens */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-xs z-[95] lg:hidden"
        onClick={onClose}
      />

      {/* Gemini Sidebar Container - Light & Dark Theme Adaptive */}
      <aside 
        className="fixed top-0 right-0 h-full w-[440px] sm:w-[480px] max-w-[95vw] bg-white dark:bg-[#131314] text-slate-800 dark:text-[#e3e3e3] z-[100] flex flex-col border-l border-slate-200 dark:border-[#2e2f33] shadow-2xl animate-in slide-in-from-right duration-300 select-none overflow-hidden font-sans"
        data-lenis-prevent="true"
      >
        {/* 1. Header Bar */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-slate-100 dark:border-[#222427] flex-shrink-0 bg-white dark:bg-[#131314]">
          <div className="flex items-center gap-2">
            <QubitStar size={22} />
            <span className="text-sm font-bold text-slate-900 dark:text-white tracking-wide">
              Qubit AI
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-[#1e1f20] border border-indigo-100 dark:border-[#333538] text-indigo-700 dark:text-indigo-400 font-mono">
              Quantum
            </span>
          </div>

          <div className="flex items-center gap-1">
            {/* More Options */}
            <div className="relative">
              <button 
                onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                className="p-2 rounded-full text-slate-500 dark:text-[#c4c7c5] hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1e1f20] transition-colors"
                title="Options"
              >
                <MoreVertical size={18} />
              </button>

              {moreMenuOpen && (
                <div className="absolute right-0 mt-1 w-44 bg-white dark:bg-[#1e1f20] border border-slate-200 dark:border-[#333538] rounded-xl shadow-xl py-1 z-50 text-xs">
                  <button
                    onClick={handleResetChat}
                    className="w-full text-left px-3 py-2 text-slate-700 dark:text-[#c4c7c5] hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-[#282a2c] flex items-center gap-2"
                  >
                    <RotateCcw size={14} />
                    <span>Clear conversation</span>
                  </button>
                </div>
              )}
            </div>

            {/* Close Button */}
            <button 
              onClick={onClose} 
              className="p-2 rounded-full text-slate-500 dark:text-[#c4c7c5] hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1e1f20] transition-colors"
              title="Close side panel"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* 2. Main Body: Messages Stream or Empty State */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col justify-between custom-scrollbar bg-white dark:bg-[#131314]">
          {messages.length === 0 ? (
            /* Empty State */
            <div className="flex-1 flex flex-col items-center justify-center text-center px-4 my-auto animate-in fade-in zoom-in-95 duration-300">
              {/* Star Logo */}
              <div className="mb-6 drop-shadow-sm">
                <QubitStar size={52} />
              </div>

              {/* Greeting */}
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#e3e3e3] mb-8 tracking-tight">
                What's the vibe, {userName}?
              </h2>

              {/* Suggestion Chips */}
              <div className="w-full max-w-sm flex flex-col gap-2.5">
                {suggestionChips.map((chip, idx) => {
                  const Icon = chip.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSend(chip.label)}
                      className="w-full text-left px-4 py-3 bg-[#f8fafd] dark:bg-[#1e1f20] hover:bg-indigo-50/50 dark:hover:bg-[#282a2c] border border-slate-200/90 dark:border-[#2e2f33] hover:border-indigo-300 dark:hover:border-[#4285F4]/40 rounded-2xl text-xs sm:text-sm text-slate-800 dark:text-[#e3e3e3] font-medium flex items-center gap-3 transition-all shadow-xs group"
                    >
                      <Icon size={16} className="text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform flex-shrink-0" />
                      <span className="truncate">{chip.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Chat Messages Thread */
            <div className="space-y-6 pb-2">
              {messages.map((msg, i) => (
                <div 
                  key={i} 
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in duration-200`}
                >
                  {msg.role === 'user' ? (
                    /* User Bubble */
                    <div className="bg-[#f0f4f9] dark:bg-[#282a2c] text-slate-900 dark:text-[#e3e3e3] border border-slate-200/60 dark:border-transparent rounded-3xl px-5 py-3 max-w-[85%] text-sm leading-relaxed shadow-xs">
                      {msg.content}
                    </div>
                  ) : (
                    /* Assistant Response */
                    <div className="w-full flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-indigo-50 dark:bg-[#1e1f20] border border-indigo-100 dark:border-[#333538] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                        <QubitStar size={16} />
                      </div>

                      <div className="flex-1 overflow-hidden">
                        <div className="prose prose-slate dark:prose-invert prose-sm max-w-none text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-[#c4c7c5] prose-headings:text-slate-900 dark:prose-headings:text-white prose-p:my-2 prose-ul:my-2 prose-li:my-0.5 prose-pre:bg-slate-900 dark:prose-pre:bg-[#1e1f20] prose-pre:text-slate-100 prose-pre:rounded-xl prose-pre:border prose-pre:border-slate-800 dark:prose-pre:border-[#333538] prose-code:text-indigo-700 dark:prose-code:text-indigo-300 prose-code:bg-indigo-50/70 dark:prose-code:bg-[#282a2c] prose-code:px-1 prose-code:py-0.5 prose-code:rounded">
                          <ReactMarkdown
                            remarkPlugins={[remarkMath, remarkGfm]}
                            rehypePlugins={[rehypeKatex]}
                          >
                            {msg.content}
                          </ReactMarkdown>
                        </div>

                        {/* Reaction and copy action bar */}
                        <div className="flex items-center gap-1.5 mt-3 pt-1 text-slate-400 dark:text-[#8e918f]">
                          <button
                            onClick={() => handleCopyMessage(msg.content, i)}
                            className="p-1.5 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1e1f20] rounded-lg transition-colors"
                            title="Copy to clipboard"
                          >
                            {copiedIndex === i ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                          </button>
                          <button 
                            className="p-1.5 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1e1f20] rounded-lg transition-colors"
                            title="Good response"
                          >
                            <ThumbsUp size={14} />
                          </button>
                          <button 
                            className="p-1.5 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1e1f20] rounded-lg transition-colors"
                            title="Bad response"
                          >
                            <ThumbsDown size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-indigo-50 dark:bg-[#1e1f20] border border-indigo-100 dark:border-[#333538] flex items-center justify-center flex-shrink-0 mt-0.5 animate-spin-slow">
                    <QubitStar size={16} />
                  </div>
                  <div className="bg-[#f8fafd] dark:bg-[#1e1f20] border border-slate-200 dark:border-[#2e2f33] rounded-2xl px-4 py-2.5 text-xs text-slate-600 dark:text-[#8e918f] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                    <span>Qubit AI is reasoning quantum states...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* 3. Bottom Context Attachment Pill & Input Box */}
        <div className="p-4 bg-white dark:bg-[#131314] flex flex-col gap-2.5 flex-shrink-0 border-t border-slate-100 dark:border-[#222427]">
          {/* Sharing Context Pill */}
          {isSharingContext && (
            <div className="bg-[#f8fafd] dark:bg-[#1e1f20] border border-slate-200 dark:border-[#2e2f33] rounded-xl px-3.5 py-2 flex items-center justify-between text-xs text-slate-700 dark:text-[#c4c7c5] shadow-xs">
              <div className="flex items-center gap-2 truncate">
                <Atom size={14} className="text-indigo-600 dark:text-indigo-400 flex-shrink-0 animate-spin-slow" />
                <span className="truncate font-medium">{contextTitle}</span>
              </div>
              <button
                onClick={() => setIsSharingContext(false)}
                className="p-1 text-slate-400 dark:text-[#8e918f] hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-[#282a2c] rounded-md transition-colors"
                title="Detach context"
              >
                <X size={13} />
              </button>
            </div>
          )}

          {/* Gemini Input Box Pill */}
          <div className="bg-[#f0f4f9] dark:bg-[#1e1f20] focus-within:bg-white dark:focus-within:bg-[#1e1f20] border border-slate-200/90 dark:border-[#333538] focus-within:border-indigo-500 dark:focus-within:border-[#4285F4]/70 focus-within:ring-2 focus-within:ring-indigo-100 dark:focus-within:ring-0 rounded-3xl p-3 flex flex-col gap-2 shadow-xs transition-all">
            {/* Input Textarea */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSharingContext(true)}
                className="p-1.5 text-slate-500 dark:text-[#8e918f] hover:text-slate-800 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-[#282a2c] rounded-full transition-colors"
                title="Add context"
              >
                <Plus size={18} />
              </button>

              <textarea
                ref={textareaRef}
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Qubit AI or type a prompt..."
                className="w-full bg-transparent text-sm text-slate-900 dark:text-[#e3e3e3] placeholder-slate-400 dark:placeholder-[#8e918f] focus:outline-none resize-none leading-relaxed"
                style={{ maxHeight: '120px' }}
              />
            </div>

            {/* Bottom Row inside Input: Model Selector & Send Button */}
            <div className="flex items-center justify-between pt-1 border-t border-slate-200/70 dark:border-[#282a2c]/60 text-xs">
              {/* Model Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowModelDropdown(!showModelDropdown)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white dark:bg-[#282a2c] hover:bg-slate-50 dark:hover:bg-[#333538] border border-slate-200 dark:border-[#3e4042] text-slate-700 dark:text-[#c4c7c5] text-[11px] font-semibold transition-colors shadow-xs"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>{selectedModel === 'Flash' ? 'Qubit Flash' : 'Qubit Pro'}</span>
                  <ChevronDown size={12} className="text-slate-400 dark:text-[#8e918f]" />
                </button>

                {showModelDropdown && (
                  <div className="absolute bottom-8 left-0 w-36 bg-white dark:bg-[#282a2c] border border-slate-200 dark:border-[#3e4042] rounded-xl shadow-xl py-1 z-50 text-xs">
                    <button
                      onClick={() => {
                        setSelectedModel('Flash');
                        setShowModelDropdown(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-slate-700 dark:text-[#e3e3e3] hover:bg-slate-50 dark:hover:bg-[#3e4042] flex items-center justify-between"
                    >
                      <span className="font-medium">Qubit Flash</span>
                      {selectedModel === 'Flash' && <Check size={12} className="text-emerald-600 dark:text-emerald-400" />}
                    </button>
                    <button
                      onClick={() => {
                        setSelectedModel('Pro');
                        setShowModelDropdown(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-slate-700 dark:text-[#e3e3e3] hover:bg-slate-50 dark:hover:bg-[#3e4042] flex items-center justify-between"
                    >
                      <span className="font-medium">Qubit Pro</span>
                      {selectedModel === 'Pro' && <Check size={12} className="text-emerald-600 dark:text-emerald-400" />}
                    </button>
                  </div>
                )}
              </div>

              {/* Send Button */}
              <button
                onClick={() => handleSend(input)}
                disabled={!input.trim() || isLoading}
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                  input.trim() && !isLoading
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm hover:scale-105'
                    : 'bg-slate-200 dark:bg-[#282a2c] text-slate-400 dark:text-[#5e6163] cursor-not-allowed'
                }`}
                title="Send prompt"
              >
                <Send size={13} className={input.trim() ? 'fill-white' : ''} />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
