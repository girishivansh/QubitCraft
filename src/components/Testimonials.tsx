import { Link } from 'react-router-dom';
import { TestimonialCard } from './TestimonialCard';
import { testimonials } from '../data/testimonials';

export function Testimonials() {
  return (
    <section className="scroll-trigger max-w-container mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-20">
      <div className="flex items-center justify-between mb-10 stagger-child">
        <h2 className="text-2xl md:text-3xl font-bold text-navy-900">
          What Our Learners Say
        </h2>
        <Link to="/testimonials" className="text-sm text-indigo-600 hover:text-indigo-700 hidden sm:block">
          View all testimonials &rarr;
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((testimonial, idx) => (
          <div key={idx} className="stagger-child h-full">
            <TestimonialCard {...testimonial} />
          </div>
        ))}
      </div>
      <div className="mt-6 text-center sm:hidden stagger-child">
        <Link to="/testimonials" className="text-sm text-indigo-600 hover:text-indigo-700">
          View all testimonials &rarr;
        </Link>
      </div>
    </section>
  );
}
