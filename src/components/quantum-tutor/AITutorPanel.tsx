import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Bot, User, Sparkles, Loader2, Maximize2, Minimize2, X,
  Zap, ChevronRight, MessageCircle, RefreshCw, Paperclip, Database,
  Cpu, BarChart3, Atom, Search, Lightbulb, Bug
} from 'lucide-react';
import { aiTutorService, TutorContext, TutorMessage } from '../../services/aiTutorService';
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

export function AITutorPanel({ context, isOpen, onClose }: AITutorPanelProps) {
  const [messages, setMessages] = useState<TutorMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
      const response = await aiTutorService.askTutor({
        message: text,
        context: context,
        conversation: messages.slice(-10), 
      });

      const aiMsg: TutorMessage = { role: 'assistant', content: response.message };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (e) {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Quantum Tutor is temporarily unavailable.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  };

  if (!isOpen) return null;

  const containerClasses = isFullScreen 
    ? "fixed inset-0 z-[100] w-full h-full flex flex-col bg-white overflow-hidden"
    : "w-[400px] md:w-[480px] lg:w-[600px] flex flex-col bg-white border-l border-slate-200 shadow-2xl h-full flex-shrink-0 z-30 transition-all duration-300";

  return (
    <div className={containerClasses}>
      {/* Header */}
      <div className="px-6 py-5 flex justify-between items-start bg-white">
        <div className="flex gap-4 items-center">
          <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100">
            <Bot size={32} />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">Quantum Tutor</h2>
              <span className="px-2.5 py-1 bg-purple-50 text-purple-600 text-[11px] font-bold tracking-wide uppercase rounded-full border border-purple-100">AI Assistant</span>
            </div>
            <p className="text-slate-500 text-sm mt-0.5">Your personal guide to quantum computing</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 mt-1">
          <button onClick={() => setIsFullScreen(!isFullScreen)} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors">
            {isFullScreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
          </button>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors">
            <X size={24} />
          </button>
        </div>
      </div>

      {/* Context Bar */}
      <div className="px-6 py-2.5 border-y border-slate-100 flex gap-6 overflow-x-auto items-center text-xs bg-slate-50/50 hide-scrollbar">
        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full font-medium whitespace-nowrap">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
          Context: Connected
        </div>
        <div className={`flex items-center gap-1.5 whitespace-nowrap ${context.circuit ? 'text-indigo-600 font-semibold' : 'text-slate-400 font-medium'}`}>
          <Cpu size={14} /> Current Circuit
        </div>
        <div className={`flex items-center gap-1.5 whitespace-nowrap ${context.simulation ? 'text-purple-600 font-semibold' : 'text-slate-400 font-medium'}`}>
          <BarChart3 size={14} /> Simulation Results
        </div>
        <div className="flex items-center gap-1.5 text-blue-600 font-semibold whitespace-nowrap">
          <Sparkles size={14} /> General
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto overscroll-contain p-6 space-y-6 bg-white" data-lenis-prevent="true">
        {messages.length === 0 ? (
          <div className="max-w-4xl mx-auto pb-8">
            {/* Hero Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 p-8 mb-10 border border-white shadow-sm">
              <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
              
              <div className="max-w-xl relative z-10">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mb-6 text-indigo-600">
                  <Atom size={32} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">How can I help you learn?</h3>
                <p className="text-slate-600 mb-8 leading-relaxed text-base">Ask me anything about your circuit, simulation results, quantum concepts, or get step-by-step explanations.</p>
                <div className="flex flex-wrap gap-3">
                  <span className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 text-sm rounded-full shadow-sm font-semibold border border-slate-100"><div className="w-2 h-2 rounded-full bg-purple-500"></div> Explain</span>
                  <span className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 text-sm rounded-full shadow-sm font-semibold border border-slate-100"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Debug</span>
                  <span className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 text-sm rounded-full shadow-sm font-semibold border border-slate-100"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Learn</span>
                  <span className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 text-sm rounded-full shadow-sm font-semibold border border-slate-100"><div className="w-2 h-2 rounded-full bg-yellow-500"></div> Get Hints</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-10">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Zap className="text-indigo-600" size={20} fill="currentColor" /> Quick Actions</h3>
                <button className="text-indigo-600 text-sm font-bold flex items-center gap-1 hover:text-indigo-700 transition-colors">View More <ChevronRight size={16}/></button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button onClick={() => handleSend('Explain this circuit')} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all group text-left">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform"><Search size={20} /></div>
                    <span className="font-semibold text-slate-700">Explain<br/>this circuit</span>
                  </div>
                  <ChevronRight size={18} className="text-slate-400 group-hover:text-indigo-500" />
                </button>
                <button onClick={() => handleSend('Give me a hint')} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-yellow-200 hover:bg-yellow-50/50 transition-all group text-left">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center group-hover:scale-110 transition-transform"><Lightbulb size={20} /></div>
                    <span className="font-semibold text-slate-700">Give me<br/>a hint</span>
                  </div>
                  <ChevronRight size={18} className="text-slate-400 group-hover:text-yellow-600" />
                </button>
                <button onClick={() => handleSend('Explain this result')} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/50 transition-all group text-left">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform"><BarChart3 size={20} /></div>
                    <span className="font-semibold text-slate-700">Explain<br/>this result</span>
                  </div>
                  <ChevronRight size={18} className="text-slate-400 group-hover:text-emerald-600" />
                </button>
                <button onClick={() => handleSend('Debug my circuit')} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-red-200 hover:bg-red-50/50 transition-all group text-left">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-red-100 text-red-500 flex items-center justify-center group-hover:scale-110 transition-transform"><Bug size={20} /></div>
                    <span className="font-semibold text-slate-700">Debug<br/>my circuit</span>
                  </div>
                  <ChevronRight size={18} className="text-slate-400 group-hover:text-red-500" />
                </button>
              </div>
            </div>

            {/* Suggested Questions */}
            <div>
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><MessageCircle className="text-indigo-600" size={20} /> Suggested Questions</h3>
                <button className="text-slate-500 text-sm font-semibold flex items-center gap-1 hover:text-slate-700 transition-colors"><RefreshCw size={14}/> New suggestions</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {['Why do I get 50/50 results?', 'Explain this statevector', 'What does the H gate do?', 'How does entanglement work?'].map((q, i) => (
                  <button key={i} onClick={() => handleSend(q)} className="flex items-center justify-between px-5 py-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all group text-left">
                    <span className="font-medium text-slate-600 group-hover:text-slate-800">{q}</span>
                    <ChevronRight size={16} className="text-slate-300 group-hover:text-indigo-500" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          messages.map((msg, i) => {
            const isUser = msg.role === 'user';
            const rowClass = isUser ? 'flex gap-4 flex-row-reverse max-w-4xl mx-auto w-full' : 'flex gap-4 max-w-4xl mx-auto w-full';
            const avatarClass = isUser ? 'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-indigo-600 text-white shadow-md' : 'w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 bg-indigo-50 border border-indigo-100 text-indigo-600 shadow-sm';
            const bubbleClass = isUser ? 'rounded-2xl rounded-tr-sm p-4 text-[15px] max-w-[85%] md:max-w-2xl bg-indigo-600 text-white shadow-md' : 'rounded-2xl rounded-tl-sm p-5 text-[15px] max-w-[95%] md:max-w-3xl bg-white border border-slate-100 text-slate-700 shadow-sm leading-relaxed';

            return (
              <div key={i} className={rowClass}>
                <div className={avatarClass}>
                  {isUser ? <User size={20} /> : <Bot size={24} />}
                </div>
                <div className={bubbleClass}>
                  {isUser ? (
                    <span className="whitespace-pre-wrap">{msg.content}</span>
                  ) : (
                    <div className="prose prose-slate prose-p:leading-relaxed max-w-none">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm, remarkMath]}
                        rehypePlugins={[rehypeKatex]}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
        {isLoading && (
          <div className="flex gap-4 max-w-4xl mx-auto w-full">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 bg-indigo-50 border border-indigo-100 text-indigo-600 shadow-sm">
              <Bot size={24} />
            </div>
            <div className="rounded-2xl rounded-tl-sm p-4 text-[15px] bg-white border border-slate-100 text-slate-500 shadow-sm flex items-center gap-3">
              <Loader2 size={16} className="animate-spin text-indigo-600" /> Thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 bg-slate-50/80 border-t border-slate-100">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-white rounded-2xl border border-slate-200 shadow-sm focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all p-2 flex items-end">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Quantum Tutor anything..."
              className="flex-1 resize-none bg-transparent outline-none p-3 text-slate-700 placeholder:text-slate-400 min-h-[52px] max-h-32"
              rows={1}
              disabled={isLoading}
              style={{ overflowY: 'auto' }}
            />
            <button 
              onClick={() => handleSend(input)}
              disabled={!input.trim() || isLoading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl w-12 h-12 flex items-center justify-center flex-shrink-0 shadow-sm disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors m-1"
            >
              <Send size={20} className={isLoading ? "animate-pulse" : ""} />
            </button>
          </div>
          
          {/* Footer Metadata */}
          <div className="flex justify-between items-center mt-3 px-2 text-[12px] text-slate-500 font-semibold">
            <div className="flex gap-5">
              <span className={`flex items-center gap-1.5 transition-colors ${context.circuit ? 'text-indigo-600' : ''}`}>
                <Paperclip size={13}/> Attach circuit context
              </span>
              <span className={`flex items-center gap-1.5 transition-colors ${context.simulation ? 'text-indigo-600' : ''}`}>
                <Database size={13}/> Use current results
              </span>
            </div>
            <div className="flex items-center gap-1.5 hidden sm:flex">
              Press Enter to send <span className="flex items-center gap-0.5 bg-slate-200/70 text-slate-600 px-1.5 py-0.5 rounded text-[10px] font-bold tracking-widest">⌘ ↵</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
