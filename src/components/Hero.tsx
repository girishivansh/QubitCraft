import { Sparkles, Code2 } from 'lucide-react';
import Button from './Button';
import { CircuitPreview } from './CircuitPreview';
import { BRAND } from '../lib/constants';

export function Hero() {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="max-w-[1360px] mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          
          {/* Left Column */}
          <div className="w-full lg:w-1/2 flex flex-col items-start text-left z-10 scroll-slide-left">
            <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-full px-4 py-1.5 text-xs font-medium mb-8">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-indigo-700 font-bold">{BRAND.sihCode}</span>
              <span className="text-slate-400 mx-1">•</span>
              <span className="text-slate-600">{BRAND.sihLabel}</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-navy-900 leading-[1.1] tracking-tight">
              <span className="block mb-2">AI-Powered.</span>
              <span className="block mb-2">Interactive.</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">Quantum Learning.</span>
            </h1>
            
            <p className="text-lg text-slate-500 max-w-lg mt-6 leading-relaxed">
              {BRAND.heroSubtext}
            </p>
            
            <div className="flex flex-wrap items-center gap-4 mt-8">
              <Button href="/learn" size="lg" icon={<Sparkles className="w-5 h-5" />}>
                Start Learning
              </Button>
              <Button href="/playground" variant="secondary" size="lg" icon={<Code2 className="w-5 h-5" />}>
                Try Playground
              </Button>
            </div>
            
            <div className="flex items-center gap-4 mt-8 pt-6 border-t border-gray-100">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full border-2 border-white bg-blue-500 flex items-center justify-center text-[10px] font-bold text-white shadow-sm z-[4]">JD</div>
                <div className="w-8 h-8 rounded-full border-2 border-white bg-emerald-500 flex items-center justify-center text-[10px] font-bold text-white shadow-sm z-[3]">SK</div>
                <div className="w-8 h-8 rounded-full border-2 border-white bg-amber-500 flex items-center justify-center text-[10px] font-bold text-white shadow-sm z-[2]">AM</div>
                <div className="w-8 h-8 rounded-full border-2 border-white bg-rose-500 flex items-center justify-center text-[10px] font-bold text-white shadow-sm z-[1]">RT</div>
              </div>
              <p className="text-sm text-slate-500 font-medium">
                Join <span className="text-navy-900 font-bold">1,200+</span> learners exploring quantum
              </p>
            </div>
          </div>
          
          {/* Right Column */}
          <div className="w-full lg:w-1/2 relative z-10 scroll-slide-right">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-100/50 to-blue-50/50 rounded-3xl transform rotate-3 scale-105 -z-10 blur-xl"></div>
            <CircuitPreview />
          </div>
          
        </div>
      </div>
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[800px] h-[800px] bg-indigo-50/50 rounded-full blur-3xl -z-20 pointer-events-none"></div>
    </section>
  );
}

export default Hero;
