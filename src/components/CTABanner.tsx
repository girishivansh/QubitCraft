import { Link } from 'react-router-dom';

export function CTABanner() {
  return (
    <section className="max-w-container mx-auto px-4 md:px-6 lg:px-8 py-8 scroll-scale">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-blue-600 px-8 md:px-12 py-10 md:py-14">
        {/* Decorative SVGs */}
        <div className="absolute top-0 right-0 z-0 pointer-events-none opacity-20 transform translate-x-1/3 -translate-y-1/3">
          <svg width="300" height="300" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="40" stroke="white" strokeWidth="1" />
            <circle cx="50" cy="50" r="30" stroke="white" strokeWidth="0.75" />
            <circle cx="50" cy="50" r="20" stroke="white" strokeWidth="0.5" />
          </svg>
        </div>
        <div className="absolute bottom-0 left-0 z-0 pointer-events-none opacity-20 transform -translate-x-1/3 translate-y-1/3">
          <svg width="150" height="150" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="40" stroke="white" strokeWidth="1" />
            <circle cx="50" cy="50" r="20" stroke="white" strokeWidth="0.5" />
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Ready to start your quantum journey?
            </h2>
            <p className="text-base text-indigo-100 mt-3 max-w-lg mx-auto md:mx-0">
              Explore quantum computing through interactive lessons, experiments and AI-guided learning.
            </p>
          </div>
          <div className="flex-shrink-0">
            <Link
              to="/learn"
              className="inline-block bg-white text-indigo-700 font-semibold px-8 py-3.5 rounded-button hover:bg-indigo-50 transition shadow-lg text-sm"
            >
              Get Started Now &rarr;
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
