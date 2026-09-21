import React, { useState, useRef, MouseEvent } from 'react';
import { Play, MoreHorizontal, Copy, Activity } from 'lucide-react';

export const CircuitPreview: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;
    
    // Calculate tilt angles (max 5 degrees)
    const tiltX = (0.5 - y) * 10;
    const tiltY = (x - 0.5) * 10;
    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div 
      className="w-full relative"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      ref={containerRef}
      style={{ perspective: '1200px' }}
    >
      <div 
        className="w-full bg-white dark:bg-[#0d0e24] rounded-2xl border border-gray-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col font-sans transition-transform duration-300 ease-out"
        style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
      >
        {/* Header bar */}
        <div className="h-12 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between px-4 bg-gray-50/50 dark:bg-[#070813]/60">
          <h3 className="font-semibold text-sm text-navy-900 dark:text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Quantum Circuit Builder
          </h3>
          <div className="flex items-center gap-2">
            <button className="bg-indigo-600 hover:bg-indigo-700 transition-colors text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium shadow-[0_2px_0_0_#4338ca] active:shadow-none active:translate-y-[2px]">
              <Play className="w-3 h-3 fill-current" />
              Run
            </button>
            <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row flex-1">
          {/* Main Workspace */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Circuit Editor */}
            <div className="flex flex-col md:flex-row flex-1 border-b md:border-b-0 border-gray-200 dark:border-slate-800">
              {/* Palette */}
              <div className="w-full md:w-16 border-b md:border-b-0 md:border-r border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-[#070813] flex md:flex-col items-center py-3 md:py-6 px-4 md:px-0 gap-4 overflow-hidden md:overflow-visible">
                <div className="w-10 h-10 rounded-lg bg-indigo-500 text-sm font-bold text-white flex items-center justify-center shadow-[0_4px_0_0_#4338ca,0_4px_10px_rgba(0,0,0,0.1)] cursor-pointer hover:-translate-y-0.5 active:translate-y-[4px] active:shadow-none transition-all shrink-0 border border-indigo-400">H</div>
                <div className="w-10 h-10 rounded-lg bg-blue-500 text-sm font-bold text-white flex items-center justify-center shadow-[0_4px_0_0_#1d4ed8,0_4px_10px_rgba(0,0,0,0.1)] cursor-pointer hover:-translate-y-0.5 active:translate-y-[4px] active:shadow-none transition-all shrink-0 border border-blue-400">X</div>
                <div className="w-10 h-10 rounded-lg bg-emerald-500 text-sm font-bold text-white flex items-center justify-center shadow-[0_4px_0_0_#047857,0_4px_10px_rgba(0,0,0,0.1)] cursor-pointer hover:-translate-y-0.5 active:translate-y-[4px] active:shadow-none transition-all shrink-0 border border-emerald-400">Y</div>
                <div className="w-10 h-10 rounded-lg bg-amber-500 text-sm font-bold text-white flex items-center justify-center shadow-[0_4px_0_0_#b45309,0_4px_10px_rgba(0,0,0,0.1)] cursor-pointer hover:-translate-y-0.5 active:translate-y-[4px] active:shadow-none transition-all shrink-0 border border-amber-400">Z</div>
                <div className="w-10 h-10 rounded-lg bg-slate-600 text-sm font-bold text-white flex items-center justify-center shadow-[0_4px_0_0_#334155,0_4px_10px_rgba(0,0,0,0.1)] cursor-pointer hover:-translate-y-0.5 active:translate-y-[4px] active:shadow-none transition-all shrink-0 border border-slate-500">+</div>
              </div>

            {/* Circuit Grid (SVG) */}
            <div className="flex-1 bg-white dark:bg-[#0a0b1c] px-3 py-4 sm:px-4 sm:py-5 relative flex items-center justify-center overflow-hidden min-h-[170px]">
              <svg width="100%" height="100%" viewBox="0 0 340 155" preserveAspectRatio="xMidYMid meet" className="w-full h-full select-none">
                <defs>
                  <filter id="gateShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="3" stdDeviation="2" floodOpacity="0.15" />
                  </filter>
                </defs>
                {/* Wires */}
                <line x1="38" y1="28" x2="336" y2="28" stroke="#E2E8F0" strokeWidth="2" />
                <line x1="38" y1="78" x2="336" y2="78" stroke="#E2E8F0" strokeWidth="2" />
                <line x1="38" y1="128" x2="336" y2="128" stroke="#E2E8F0" strokeWidth="2" />

                {/* Labels */}
                <text x="8" y="32" fontSize="12" fill="#64748B" fontWeight="600">q0</text>
                <text x="26" y="32" fontSize="10" fill="#94A3B8">|0⟩</text>
                
                <text x="8" y="82" fontSize="12" fill="#64748B" fontWeight="600">q1</text>
                <text x="26" y="82" fontSize="10" fill="#94A3B8">|0⟩</text>
                
                <text x="8" y="132" fontSize="12" fill="#64748B" fontWeight="600">q2</text>
                <text x="26" y="132" fontSize="10" fill="#94A3B8">|0⟩</text>

                {/* q0: H gate */}
                <rect x="65" y="12" width="32" height="32" rx="7" fill="#6366F1" filter="url(#gateShadow)" />
                <text x="81" y="33" fontSize="13" fill="white" fontWeight="bold" textAnchor="middle">H</text>

                {/* q2: H gate */}
                <rect x="65" y="112" width="32" height="32" rx="7" fill="#6366F1" filter="url(#gateShadow)" />
                <text x="81" y="133" fontSize="13" fill="white" fontWeight="bold" textAnchor="middle">H</text>

                {/* CNOT: q0 -> q1 */}
                <line x1="135" y1="28" x2="135" y2="78" stroke="#3B82F6" strokeWidth="2" />
                <circle cx="135" cy="28" r="4.5" fill="#3B82F6" />
                <circle cx="135" cy="78" r="13" fill="white" stroke="#3B82F6" strokeWidth="2" filter="url(#gateShadow)" />
                <line x1="135" y1="65" x2="135" y2="91" stroke="#3B82F6" strokeWidth="2" />
                <line x1="122" y1="78" x2="148" y2="78" stroke="#3B82F6" strokeWidth="2" />

                {/* q1: X gate */}
                <rect x="185" y="62" width="32" height="32" rx="7" fill="#3B82F6" filter="url(#gateShadow)" />
                <text x="201" y="83" fontSize="13" fill="white" fontWeight="bold" textAnchor="middle">X</text>

                {/* q2: Measurement */}
                <rect x="245" y="112" width="32" height="32" rx="7" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="2" filter="url(#gateShadow)" />
                <path d="M 251 132 A 10 10 0 0 1 271 132" fill="none" stroke="#64748B" strokeWidth="1.5" />
                <line x1="261" y1="132" x2="266" y2="119" stroke="#64748B" strokeWidth="1.5" />
                <line x1="277" y1="126" x2="336" y2="126" stroke="#94A3B8" strokeWidth="2" strokeDasharray="4 2" />
                <line x1="277" y1="130" x2="336" y2="130" stroke="#94A3B8" strokeWidth="2" strokeDasharray="4 2" />
              </svg>
            </div>
          </div>

          {/* OpenQASM Panel */}
          <div className="border-t border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-[#070813] flex flex-col">
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-slate-800">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">OpenQASM 3.0</span>
              <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider">
                <Copy className="w-3 h-3" />
                Copy
              </button>
            </div>
            <div className="p-4 overflow-hidden text-xs font-mono text-slate-600 dark:text-slate-300 leading-relaxed">
              <div className="flex"><span className="w-6 text-slate-400 select-none">1</span><span>OPENQASM 3.0;</span></div>
              <div className="flex"><span className="w-6 text-slate-400 select-none">2</span><span>include "stdgates.inc";</span></div>
              <div className="flex"><span className="w-6 text-slate-400 select-none">3</span><span className="text-indigo-600 dark:text-indigo-400 font-semibold">qreg</span> q[3];</div>
              <div className="flex"><span className="w-6 text-slate-400 select-none">4</span><span className="text-blue-600 dark:text-blue-400">h</span> q[0];</div>
              <div className="flex"><span className="w-6 text-slate-400 select-none">5</span><span className="text-blue-600 dark:text-blue-400">cx</span> q[0], q[1];</div>
              <div className="flex"><span className="w-6 text-slate-400 select-none">6</span><span className="text-blue-600 dark:text-blue-400">x</span> q[1];</div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Analytics */}
        <div className="w-full md:w-64 border-t md:border-t-0 md:border-l border-gray-200 dark:border-slate-800 bg-white dark:bg-[#0d0e24] flex flex-col shrink-0">
          {/* Bloch Sphere */}
          <div className="p-4 border-b border-gray-200 dark:border-slate-800 flex-1 flex flex-col">
            <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-4 uppercase tracking-wider">Bloch Sphere</h4>
            <div className="flex-1 flex items-center justify-center min-h-[160px]">
              <svg width="140" height="140" viewBox="0 0 140 140">
                <defs>
                  <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="8" stdDeviation="6" floodOpacity="0.15" />
                  </filter>
                  <radialGradient id="sphereGrad" cx="35%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="50%" stopColor="#e0e7ff" />
                    <stop offset="100%" stopColor="#c7d2fe" />
                  </radialGradient>
                  <radialGradient id="surfaceTint" cx="50%" cy="50%" r="50%">
                    <stop offset="85%" stopColor="#818cf8" stopOpacity="0" />
                    <stop offset="100%" stopColor="#818cf8" stopOpacity="0.4" />
                  </radialGradient>
                  <linearGradient id="vectorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4f46e5" />
                    <stop offset="100%" stopColor="#3730a3" />
                  </linearGradient>
                </defs>
                <circle cx="70" cy="70" r="60" fill="url(#sphereGrad)" filter="url(#dropShadow)" />
                <circle cx="70" cy="70" r="60" fill="url(#surfaceTint)" />
                <circle cx="70" cy="70" r="60" fill="none" stroke="#a5b4fc" strokeWidth="1" opacity="0.5" />
                
                {/* Equator */}
                <ellipse cx="70" cy="70" rx="60" ry="20" fill="none" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4 4" />
                {/* Prime Meridian (animated) */}
                <ellipse cx="70" cy="70" rx="20" ry="60" fill="none" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4 4" className="origin-center animate-spin-y" />
                
                {/* Axes */}
                <line x1="70" y1="10" x2="70" y2="130" stroke="#cbd5e1" strokeWidth="1" />
                <line x1="10" y1="70" x2="130" y2="70" stroke="#cbd5e1" strokeWidth="1" />
                
                {/* State Vector */}
                <line x1="70" y1="70" x2="90" y2="25" stroke="url(#vectorGrad)" strokeWidth="2.5" />
                <circle cx="90" cy="25" r="4" fill="url(#vectorGrad)" filter="url(#dropShadow)" />
                
                {/* Labels */}
                <text x="70" y="8" fontSize="10" fill="#64748b" textAnchor="middle">|0⟩</text>
                <text x="70" y="139" fontSize="10" fill="#64748b" textAnchor="middle">|1⟩</text>
                <text x="135" y="73" fontSize="10" fill="#64748b">y</text>
                <text x="5" y="73" fontSize="10" fill="#64748b">x</text>
              </svg>
            </div>
          </div>

          {/* State Vector Probabilities */}
          <div className="p-4">
            <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-3 uppercase tracking-wider">State Vector</h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-mono text-slate-600 dark:text-slate-300">α <span className="text-slate-400 dark:text-slate-500">0.71 + 0.00i</span></span>
                  <span className="text-slate-500 dark:text-slate-400">50%</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full" style={{ width: '50%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-mono text-slate-600 dark:text-slate-300">β <span className="text-slate-400 dark:text-slate-500">0.00 + 0.71i</span></span>
                  <span className="text-slate-500 dark:text-slate-400">50%</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: '50%' }}></div>
                </div>
              </div>
              <div className="pt-2 border-t border-gray-100 dark:border-slate-800 mt-3 text-center">
                <span className="text-xs font-mono text-slate-700 dark:text-slate-300">|ψ⟩ = 0.71|0⟩ + 0.71|1⟩</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};
