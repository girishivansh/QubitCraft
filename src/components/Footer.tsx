import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Youtube } from 'lucide-react';
import { FOOTER_LINKS, BRAND } from '../lib/constants';
import Logo from './Logo';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-navy-900 text-white">
      <div className="max-w-[1360px] mx-auto px-4 md:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-16">
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <Logo size={32} />
              <div className="flex flex-col">
                <span className="text-xl font-bold leading-tight">QubitCraft</span>
                <span className="text-[10px] text-navy-300 uppercase tracking-widest">{BRAND?.tagline || 'Craft. Compute. Conquer.'}</span>
              </div>
            </Link>
            <p className="text-sm text-navy-300 mb-6 leading-relaxed">
              {BRAND?.description || 'AI-powered interactive quantum algorithm learning platform. Master quantum computing through hands-on crafting.'}
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-navy-300 hover:text-indigo-400 transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-navy-300 hover:text-indigo-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-navy-300 hover:text-indigo-400 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-navy-300 hover:text-indigo-400 transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-6">Platform</h4>
            <ul className="flex flex-col gap-4">
              {FOOTER_LINKS.platform.map((link) => (
                <li key={link.label}>
                  <Link to={link.path} className="text-sm text-navy-300 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-6">Resources</h4>
            <ul className="flex flex-col gap-4">
              {FOOTER_LINKS.resources.map((link) => (
                <li key={link.label}>
                  <Link to={link.path} className="text-sm text-navy-300 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-6">Company</h4>
            <ul className="flex flex-col gap-4">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.label}>
                  <Link to={link.path} className="text-sm text-navy-300 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-6">Stay Updated</h4>
            <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-navy-800 border border-navy-700 rounded-[12px] text-sm px-4 py-3 text-white focus:outline-none focus:border-indigo-500 w-full"
                required
              />
              <button 
                type="submit" 
                className="btn-gradient text-white text-sm font-medium rounded-[12px] py-3 px-4 w-full hover:shadow-lg transition-all active:scale-[0.98]"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-navy-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-navy-400 text-sm">
            &copy; {currentYear} QubitCraft. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="text-sm text-navy-400 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-sm text-navy-400 hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
