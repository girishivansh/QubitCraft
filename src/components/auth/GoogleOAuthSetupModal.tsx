import React, { useState } from 'react';
import { X, ExternalLink, Key, CheckCircle, ArrowRight } from 'lucide-react';
import { setRuntimeGoogleClientId } from '../../auth/googleAuth';

interface GoogleOAuthSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClientConfigured: (clientId: string) => void;
  onQuickTestLogin: (profile: { name: string; email: string }) => void;
}

export default function GoogleOAuthSetupModal({
  isOpen,
  onClose,
  onClientConfigured,
  onQuickTestLogin,
}: GoogleOAuthSetupModalProps) {
  const [clientIdInput, setClientIdInput] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSaveAndConnect = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = clientIdInput.trim();
    if (!cleaned) {
      setError('Please paste your Google OAuth Client ID');
      return;
    }

    if (cleaned.startsWith('GOCSPX-')) {
      setError('You pasted the Client Secret (starts with GOCSPX-). Please copy the Client ID above it (ends with .apps.googleusercontent.com).');
      return;
    }

    if (!cleaned.includes('.apps.googleusercontent.com') && cleaned.length < 20) {
      setError('A Google Client ID must end with .apps.googleusercontent.com');
      return;
    }

    setError('');
    setRuntimeGoogleClientId(cleaned);
    onClientConfigured(cleaned);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white dark:bg-[#101226] rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-800 overflow-hidden transform transition-all animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative px-6 pt-5 pb-3 border-b border-gray-100 dark:border-slate-800/80">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-2.5 mb-1">
            <svg className="h-6 w-6" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Official Google Sign-In Setup
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            To trigger the official popup from Google's servers, add your Google OAuth Client ID:
          </p>
        </div>

        {/* Steps */}
        <div className="p-5 space-y-4">
          <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                1
              </span>
              <p>
                Visit the{' '}
                <a
                  href="https://console.cloud.google.com/apis/credentials"
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-indigo-600 dark:text-indigo-400 underline inline-flex items-center gap-0.5"
                >
                  Google Cloud Console <ExternalLink size={11} />
                </a>{' '}
                and create an <strong>OAuth 2.0 Client ID</strong> (Web application).
              </p>
            </div>

            <div className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                2
              </span>
              <p>
                Under <strong>Authorized JavaScript origins</strong>, add:
                <code className="block mt-1 p-1 rounded bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-800 dark:text-slate-200 font-mono select-all">
                  http://localhost:5173, http://localhost:5174
                </code>
              </p>
            </div>

            <div className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                3
              </span>
              <p>
                Paste your Client ID below (or place it in your <code>.env</code> file as <code>VITE_GOOGLE_CLIENT_ID</code>):
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSaveAndConnect} className="space-y-2.5">
            {error && (
              <div className="p-2 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-xs text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Key size={14} />
              </div>
              <input
                type="text"
                placeholder="xxxx.apps.googleusercontent.com"
                value={clientIdInput}
                onChange={(e) => setClientIdInput(e.target.value)}
                className="w-full h-9 pl-9 pr-3 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-[#070813] text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full h-9 flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold text-white transition-colors"
            >
              <span>Launch Official Google Popup</span>
              <ArrowRight size={14} />
            </button>
          </form>

          {/* Fallback option */}
          <div className="pt-2 border-t border-gray-100 dark:border-slate-800/80 text-center">
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mb-2">
              Don't have a Google Cloud Client ID handy right now?
            </p>
            <button
              type="button"
              onClick={() => {
                onQuickTestLogin({
                  name: 'Shivansh Giri',
                  email: 'shivanshgiri@gmail.com',
                });
              }}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline"
            >
              <CheckCircle size={13} className="text-emerald-500" />
              <span>Continue with Instant Test Sign-In (Shivansh Giri)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
