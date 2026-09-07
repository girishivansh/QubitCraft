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
        className="w-full bg-white rounded-2xl border border-gray-200 shadow-2xl overflow-hidden flex flex-col font-sans transition-transform duration-300 ease-out"
        style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
      >
        {/* Header bar */}
        <div className="h-12 border-b border-gray-200 flex items-center justify-between px-4 bg-gray-50/50">
          <h3 className="font-semibold text-sm text-navy-900 flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-600" />
            Quantum Circuit Builder
          </h3>
          <div className="flex items-center gap-2">
            <button className="bg-indigo-600 hover:bg-indigo-700 transition-colors text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium shadow-[0_2px_0_0_#4338ca] active:shadow-none active:translate-y-[2px]">
              <Play className="w-3 h-3 fill-current" />
              Run
            </button>
            <button className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row flex-1">
          {/* Main Workspace */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Circuit Editor */}
            <div className="flex flex-col md:flex-row flex-1 border-b md:border-b-0 border-gray-200">
              {/* Palette */}
              <div className="w-full md:w-16 border-b md:border-b-0 md:border-r border-gray-200 bg-gray-50 flex md:flex-col items-center py-3 md:py-6 px-4 md:px-0 gap-4 overflow-x-auto">
                <div className="w-10 h-10 rounded-lg bg-indigo-500 text-sm font-bold text-white flex items-center justify-center shadow-[0_4px_0_0_#4338ca,0_4px_10px_rgba(0,0,0,0.1)] cursor-pointer hover:-translate-y-0.5 active:translate-y-[4px] active:shadow-none transition-all shrink-0 border border-indigo-400">H</div>
                <div className="w-10 h-10 rounded-lg bg-blue-500 text-sm font-bold text-white flex items-center justify-center shadow-[0_4px_0_0_#1d4ed8,0_4px_10px_rgba(0,0,0,0.1)] cursor-pointer hover:-translate-y-0.5 active:translate-y-[4px] active:shadow-none transition-all shrink-0 border border-blue-400">X</div>
                <div className="w-10 h-10 rounded-lg bg-emerald-500 text-sm font-bold text-white flex items-center justify-center shadow-[0_4px_0_0_#047857,0_4px_10px_rgba(0,0,0,0.1)] cursor-pointer hover:-translate-y-0.5 active:translate-y-[4px] active:shadow-none transition-all shrink-0 border border-emerald-400">Y</div>
                <div className="w-10 h-10 rounded-lg bg-amber-500 text-sm font-bold text-white flex items-center justify-center shadow-[0_4px_0_0_#b45309,0_4px_10px_rgba(0,0,0,0.1)] cursor-pointer hover:-translate-y-0.5 active:translate-y-[4px] active:shadow-none transition-all shrink-0 border border-amber-400">Z</div>
                <div className="w-10 h-10 rounded-lg bg-slate-600 text-sm font-bold text-white flex items-center justify-center shadow-[0_4px_0_0_#334155,0_4px_10px_rgba(0,0,0,0.1)] cursor-pointer hover:-translate-y-0.5 active:translate-y-[4px] active:shadow-none transition-all shrink-0 border border-slate-500">+</div>
              </div>

            {/* Circuit Grid (SVG) */}
            <div className="flex-1 overflow-x-auto bg-white p-6 relative min-h-[200px]">
              <svg width="100%" height="160" viewBox="0 0 400 160" className="min-w-[400px]">
                <defs>
                  <filter id="gateShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="3" stdDeviation="2" floodOpacity="0.15" />
                  </filter>
                </defs>
                {/* Wires */}
                <line x1="40" y1="30" x2="380" y2="30" stroke="#E2E8F0" strokeWidth="2" />
                <line x1="40" y1="80" x2="380" y2="80" stroke="#E2E8F0" strokeWidth="2" />
                <line x1="40" y1="130" x2="380" y2="130" stroke="#E2E8F0" strokeWidth="2" />

                {/* Labels */}
                <text x="10" y="34" fontSize="12" fill="#64748B" fontWeight="600">q0</text>
                <text x="30" y="34" fontSize="10" fill="#94A3B8">|0⟩</text>
                
                <text x="10" y="84" fontSize="12" fill="#64748B" fontWeight="600">q1</text>
                <text x="30" y="84" fontSize="10" fill="#94A3B8">|0⟩</text>
                
                <text x="10" y="134" fontSize="12" fill="#64748B" fontWeight="600">q2</text>
                <text x="30" y="134" fontSize="10" fill="#94A3B8">|0⟩</text>

                {/* q0: H gate */}
                <rect x="70" y="15" width="30" height="30" rx="6" fill="#6366F1" filter="url(#gateShadow)" />
                <text x="85" y="34" fontSize="12" fill="white" fontWeight="bold" textAnchor="middle">H</text>

                {/* q2: H gate */}
                <rect x="70" y="115" width="30" height="30" rx="6" fill="#6366F1" filter="url(#gateShadow)" />
                <text x="85" y="134" fontSize="12" fill="white" fontWeight="bold" textAnchor="middle">H</text>

                {/* CNOT: q0 -> q1 */}
                <line x1="140" y1="30" x2="140" y2="80" stroke="#3B82F6" strokeWidth="2" />
                <circle cx="140" cy="30" r="4" fill="#3B82F6" />
                <circle cx="140" cy="80" r="12" fill="white" stroke="#3B82F6" strokeWidth="2" filter="url(#gateShadow)" />
                <line x1="140" y1="68" x2="140" y2="92" stroke="#3B82F6" strokeWidth="2" />
                <line x1="128" y1="80" x2="152" y2="80" stroke="#3B82F6" strokeWidth="2" />

                {/* q1: X gate */}
                <rect x="190" y="65" width="30" height="30" rx="6" fill="#3B82F6" filter="url(#gateShadow)" />
                <text x="205" y="84" fontSize="12" fill="white" fontWeight="bold" textAnchor="middle">X</text>

                {/* q2: Measurement */}
                <rect x="250" y="115" width="30" height="30" rx="6" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="2" filter="url(#gateShadow)" />
                <path d="M 255 135 A 10 10 0 0 1 275 135" fill="none" stroke="#64748B" strokeWidth="1.5" />
                <line x1="265" y1="135" x2="270" y2="122" stroke="#64748B" strokeWidth="1.5" />
                <line x1="280" y1="130" x2="380" y2="130" stroke="#94A3B8" strokeWidth="2" strokeDasharray="4 2" />
                <line x1="280" y1="134" x2="380" y2="134" stroke="#94A3B8" strokeWidth="2" strokeDasharray="4 2" />
              </svg>
            </div>
          </div>

          {/* OpenQASM Panel */}
          <div className="h-48 border-t border-gray-200 bg-gray-50 flex flex-col">
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
              <span className="text-xs font-semibold text-slate-600">OpenQASM 3.0</span>
              <button className="text-slate-400 hover:text-slate-600 flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider">
                <Copy className="w-3 h-3" />
                Copy
              </button>
            </div>
            <div className="p-4 overflow-y-auto flex-1 text-xs font-mono text-slate-600 leading-loose">
              <div className="flex"><span className="w-6 text-slate-400 select-none">1</span><span>OPENQASM 3.0;</span></div>
              <div className="flex"><span className="w-6 text-slate-400 select-none">2</span><span>include "stdgates.inc";</span></div>
              <div className="flex"><span className="w-6 text-slate-400 select-none">3</span><span className="text-indigo-600 font-semibold">qreg</span> q[3];</div>
              <div className="flex"><span className="w-6 text-slate-400 select-none">4</span><span className="text-blue-600">h</span> q[0];</div>
              <div className="flex"><span className="w-6 text-slate-400 select-none">5</span><span className="text-blue-600">cx</span> q[0], q[1];</div>
              <div className="flex"><span className="w-6 text-slate-400 select-none">6</span><span className="text-blue-600">x</span> q[1];</div>
              <div className="flex"><span className="w-6 text-slate-400 select-none">7</span><span className="text-blue-600">h</span> q[2];</div>
              <div className="flex"><span className="w-6 text-slate-400 select-none">8</span><span className="text-emerald-600">measure</span> q -&gt; c;</div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Analytics */}
        <div className="w-full md:w-64 border-t md:border-t-0 md:border-l border-gray-200 bg-white flex flex-col shrink-0">
          {/* Bloch Sphere */}
          <div className="p-4 border-b border-gray-200 flex-1 flex flex-col">
            <h4 className="text-xs font-semibold text-slate-700 mb-4 uppercase tracking-wider">Bloch Sphere</h4>
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
            <h4 className="text-xs font-semibold text-slate-700 mb-3 uppercase tracking-wider">State Vector</h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-mono text-slate-600">α <span className="text-slate-400">0.71 + 0.00i</span></span>
                  <span className="text-slate-500">50%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full" style={{ width: '50%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-mono text-slate-600">β <span className="text-slate-400">0.00 + 0.71i</span></span>
                  <span className="text-slate-500">50%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: '50%' }}></div>
                </div>
              </div>
              <div className="pt-2 border-t border-gray-100 mt-3 text-center">
                <span className="text-xs font-mono text-slate-700">|ψ⟩ = 0.71|0⟩ + 0.71|1⟩</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};
