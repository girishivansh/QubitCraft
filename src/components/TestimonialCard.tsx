import { Star } from 'lucide-react';

export interface TestimonialCardProps {
  quote: string;
  name: string;
  role: string;
  rating: number;
  initials: string;
  color: string;
}

export function TestimonialCard({ quote, name, role, rating, initials, color }: TestimonialCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 md:p-8 flex flex-col h-full">
      <span className="text-4xl leading-none text-indigo-200 font-serif mb-4 block">❝</span>
      <p className="text-sm md:text-base text-slate-600 leading-relaxed mb-6 flex-grow">
        {quote}
      </p>
      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${color}`}>
            {initials}
          </div>
          <div>
            <div className="text-sm font-semibold text-navy-900">{name}</div>
            <div className="text-xs text-slate-400">{role}</div>
          </div>
        </div>
        <div className="flex items-center">
          {Array.from({ length: rating }).map((_, i) => (
            <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
          ))}
        </div>
      </div>
    </div>
  );
}
