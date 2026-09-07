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
            <h2 className="text-2xl font-bold text-navy-900 mb-2">Forgot your password?</h2>
            <p className="text-sm text-slate-500 mb-8">Enter your email and we'll send instructions to reset your password.</p>

            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
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
                className="w-full h-11 flex justify-center items-center rounded-[12px] bg-gradient-to-r from-indigo-600 to-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:from-indigo-500 hover:to-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Sending...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-slate-500">
              <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                Back to sign in
              </Link>
            </p>
          </>
        ) : (
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-50 mb-6">
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-navy-900 mb-2">Check your inbox</h2>
            <p className="text-sm text-slate-500 mb-8">
              We've sent password reset instructions to <span className="font-medium text-navy-900">{email}</span>. Please check your email.
            </p>
            <Link
              to="/login"
              className="w-full h-11 flex justify-center items-center rounded-[12px] bg-white border border-gray-200 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-200 transition-all"
            >
              Back to sign in
            </Link>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
