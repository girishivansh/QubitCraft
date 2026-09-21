import { useState } from 'react';
import {
  ABOUT_HERO,
  COMPARISONS,
  FOUR_PILLARS,
  TECH_STACK,
  TEAM_MEMBERS,
  ROADMAP,
  FAQS,
} from '../data/aboutData';
import {
  Sparkles,
  Layers,
  Cpu,
  Bot,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Atom,
  ShieldCheck,
  Compass,
  Award,
  Terminal,
} from 'lucide-react';
import Button from '../components/Button';

export default function About() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const getPillarIcon = (id: string) => {
    switch (id) {
      case 'composer':
        return <Cpu className="w-6 h-6 text-indigo-600" />;
      case 'algorithms':
        return <Layers className="w-6 h-6 text-purple-600" />;
      case 'tutor':
        return <Bot className="w-6 h-6 text-emerald-600" />;
      case 'curriculum':
        return <BookOpen className="w-6 h-6 text-blue-600" />;
      default:
        return <Atom className="w-6 h-6 text-indigo-600" />;
    }
  };

  return (
    <div className="py-12 md:py-20 flex flex-col gap-24">
      {/* 1. HERO SECTION */}
      <section className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900/60 rounded-full px-4 py-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300 mb-6 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{ABOUT_HERO.badge}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-navy-900 dark:text-white tracking-tight max-w-4xl mx-auto leading-[1.15] mb-6">
          {ABOUT_HERO.title}
        </h1>

        <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed mb-12">
          {ABOUT_HERO.subtitle}
        </p>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto">
          {ABOUT_HERO.metrics.map((metric, i) => (
            <div
              key={i}
              className="bg-white dark:bg-[#0d0e24] rounded-2xl border border-gray-100 dark:border-slate-800 p-6 shadow-card hover:shadow-card-hover transition-all flex flex-col items-center justify-center text-center"
            >
              <span className="text-2xl sm:text-3xl font-extrabold text-navy-900 dark:text-white mb-1">
                {metric.value}
              </span>
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
                {metric.label}
              </span>
              <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                {metric.sub}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 2. THE PROBLEM & SOLUTION (Split Comparison) */}
      <section className="bg-slate-50 dark:bg-[#05060f] py-16 border-y border-slate-200/70 dark:border-slate-800">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
              The Paradigm Shift
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-navy-900 dark:text-white mt-2 mb-4">
              Why Traditional Quantum Education Fails
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              Quantum physics is counter-intuitive. Textbooks rely on dry linear algebra that leaves 85% of students unable to visualize what qubits actually do.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* The Old Way */}
            <div className="bg-white dark:bg-[#0d0e24] rounded-3xl p-8 border border-rose-100 dark:border-rose-950/50 shadow-sm flex flex-col gap-6 relative overflow-hidden">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                  <Terminal className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-navy-900 dark:text-white">Traditional Quantum Learning</h3>
                  <p className="text-xs text-rose-600 dark:text-rose-400 font-semibold">The High-Friction Route</p>
                </div>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800 flex flex-col">
                {COMPARISONS.map((item, idx) => (
                  <div key={idx} className="py-4 flex flex-col gap-1">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{item.title}</span>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{item.traditional}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* The QubitCraft Way */}
            <div className="bg-gradient-to-b from-indigo-900 to-navy-900 text-white rounded-3xl p-8 shadow-xl flex flex-col gap-6 relative overflow-hidden border border-indigo-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-400/30 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">The QubitCraft Approach</h3>
                  <p className="text-xs text-indigo-300 font-semibold">Visual, Interactive & AI-Powered</p>
                </div>
              </div>

              <div className="divide-y divide-indigo-800/60 flex flex-col">
                {COMPARISONS.map((item, idx) => (
                  <div key={idx} className="py-4 flex flex-col gap-1">
                    <span className="text-xs font-bold text-indigo-200">{item.title}</span>
                    <p className="text-xs text-slate-300 leading-relaxed">{item.qubitcraft}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FOUR CORE INNOVATION PILLARS */}
      <section className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
            Core Architecture
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-navy-900 dark:text-white mt-2 mb-4">
            The Four Pillars of QubitCraft
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Every feature in QubitCraft was deliberately engineered to provide immediate pedagogical feedback and deepen quantum intuition.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {FOUR_PILLARS.map((pillar) => (
            <div
              key={pillar.id}
              className="bg-white dark:bg-[#0d0e24] rounded-2xl border border-gray-100 dark:border-slate-800 p-8 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800/70 flex items-center justify-center mb-6">
                  {getPillarIcon(pillar.id)}
                </div>
                <h3 className="text-xl font-bold text-navy-900 dark:text-white mb-3">{pillar.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                  {pillar.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>{pillar.highlight}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. UNDER THE HOOD: TECH STACK */}
      <section className="bg-slate-50 dark:bg-[#05060f] py-16 border-y border-slate-200/70 dark:border-slate-800">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
              Under The Hood
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-navy-900 dark:text-white mt-2 mb-4">
              Engineered with Modern Technology
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              Combining world-class quantum simulation libraries with cutting-edge web frontend and ultra-low latency AI inference.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {TECH_STACK.map((item, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-[#0d0e24] rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-card flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2 block">
                    {item.category}
                  </span>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-4 border-t border-slate-100 dark:border-slate-800">
                  {item.techs.map((tech, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-mono font-medium rounded-lg"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. NATIONAL QUANTUM MISSION & NEP 2020 ALIGNMENT */}
      <section className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-indigo-50 via-blue-50 to-purple-50 dark:from-indigo-950/40 dark:via-[#0d0e24] dark:to-purple-950/30 rounded-3xl border border-indigo-100/80 dark:border-indigo-900/50 p-8 sm:p-12 max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-lg">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">
                National Strategic Impact
              </span>
              <h3 className="text-2xl font-bold text-navy-900 dark:text-white mt-1 mb-3">
                Aligned with India’s National Quantum Mission (NQM) & NEP 2020
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                The National Quantum Mission aims to make India a leading quantum technology hub. By building QubitCraft for Smart India Hackathon 2026, we empower colleges and universities across the nation to deliver hands-on quantum lab training without requiring multi-million dollar dilution refrigerators or physical hardware access.
              </p>
              <div className="flex flex-wrap gap-4 text-xs font-semibold text-indigo-800 dark:text-indigo-300">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  Democratized Access
                </span>
                <span className="flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  Experiential Pedagogy
                </span>
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  Open Source Mindset
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TEAM SECTION */}
      <section className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
            The Builders
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-navy-900 dark:text-white mt-2 mb-4">
            Meet the QubitCraft Team
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            The passionate team behind SIH Problem Statement SIH26140, dedicated to revolutionizing quantum computing education.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {TEAM_MEMBERS.map((member, i) => (
            <div
              key={i}
              className="bg-white dark:bg-[#0d0e24] rounded-2xl border border-gray-100 dark:border-slate-800 p-6 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between text-center items-center"
            >
              <div>
                <div
                  className={`w-16 h-16 rounded-2xl ${member.avatarBg} text-white flex items-center justify-center font-bold text-lg mb-4 shadow-md mx-auto`}
                >
                  {member.avatarInitials}
                </div>
                <h3 className="text-base font-bold text-navy-900 dark:text-white mb-1">{member.name}</h3>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mb-3">{member.role}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">{member.bio}</p>
              </div>

              <div className="w-full pt-3 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 block">
                  {member.specialty}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. ROADMAP */}
      <section className="bg-slate-50 dark:bg-[#05060f] py-16 border-y border-slate-200/70 dark:border-slate-800">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
              Looking Ahead
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-navy-900 dark:text-white mt-2 mb-4">
              Project Milestones & Roadmap
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              Our vision spans from browser simulation to actual execution on superconducting quantum hardware.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {ROADMAP.map((item, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-[#0d0e24] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between relative"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      {item.phase}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        item.status === 'Completed'
                          ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60'
                          : item.status === 'In Progress'
                          ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60'
                          : 'bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-navy-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">{item.description}</p>

                  <ul className="flex flex-col gap-2 text-xs text-slate-600 dark:text-slate-300 mb-4">
                    {item.deliverables.map((del, dIdx) => (
                      <li key={dIdx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
                        <span>{del}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FAQ SECTION */}
      <section className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
            Common Questions
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-navy-900 dark:text-white mt-2 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Everything you need to know about QubitCraft and quantum computing education.
          </p>
        </div>

        <div className="max-w-3xl mx-auto divide-y divide-slate-200 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-[#0d0e24] shadow-sm overflow-hidden">
          {FAQS.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div key={index} className="transition-colors">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-navy-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-indigo-600 dark:text-indigo-400' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 9. BOTTOM CTA BANNER */}
      <section className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-navy-900 rounded-3xl p-8 sm:p-16 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="max-w-2xl mx-auto relative z-10 flex flex-col items-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 tracking-tight">
              Ready to Craft Your Quantum Intuition?
            </h2>
            <p className="text-sm sm:text-base text-slate-300 mb-8 leading-relaxed">
              Explore step-by-step quantum algorithms, compose multi-qubit circuits, and get instant answers from our AI Tutor.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button href="/algorithms" size="lg" icon={<Sparkles className="w-4 h-4" />}>
                Explore Algorithms
              </Button>
              <Button href="/quantum-lab" variant="secondary" size="lg" icon={<Cpu className="w-4 h-4" />}>
                Launch Quantum Lab
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
