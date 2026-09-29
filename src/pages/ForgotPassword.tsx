import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';
import FormInput from '../components/auth/FormInput';
import { Loader2, CheckCircle } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);

    if (!email) {
      setError('Email is required');
      return;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email address is invalid');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  return (
    <AuthLayout title="Reset your password." subtitle="We'll help you get back to learning.">
      <div className="w-full max-w-md mx-auto">
        {!isSuccess ? (
          <>
            <h2 className="text-xl sm:text-2xl font-bold text-navy-900 dark:text-white mb-1">Forgot your password?</h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-4">Enter your email and we'll send instructions to reset your password.</p>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <FormInput
                id="email"
                label="Email address"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(val: string) => {
                  setEmail(val);
                  if (error) setError(undefined);
                }}
                error={error}
                disabled={isSubmitting}
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-9 sm:h-9.5 flex justify-center items-center rounded-[10px] bg-gradient-to-r from-indigo-600 to-blue-500 px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-xs hover:from-indigo-500 hover:to-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-3.5 w-3.5" />
                    Sending...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </form>

            <p className="mt-4 text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              <Link to="/login" className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">
                Back to sign in
              </Link>
            </p>
          </>
        ) : (
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-50 dark:bg-green-950/40 mb-4">
              <CheckCircle className="h-7 w-7 text-green-500 dark:text-green-400" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-navy-900 dark:text-white mb-1.5">Check your inbox</h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6">
              We've sent password reset instructions to <span className="font-medium text-navy-900 dark:text-white">{email}</span>. Please check your email.
            </p>
            <Link
              to="/login"
              className="w-full h-9 sm:h-9.5 flex justify-center items-center rounded-[10px] bg-white dark:bg-[#0d0e24] border border-gray-200 dark:border-slate-700/80 px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 shadow-xs hover:bg-gray-50 dark:hover:bg-slate-800/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-200 dark:focus-visible:outline-slate-700 transition-all"
            >
              Back to sign in
            </Link>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
