import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import AuthLayout from '../components/auth/AuthLayout';
import FormInput from '../components/auth/FormInput';
import PasswordInput from '../components/auth/PasswordInput';
import PasswordStrength from '../components/auth/PasswordStrength';
import { Loader2 } from 'lucide-react';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; confirmPassword?: string; general?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!name.trim()) newErrors.name = 'Full Name is required';
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email address is invalid';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = 'Password must contain at least one uppercase letter';
    } else if (!/[0-9]/.test(password)) {
      newErrors.password = 'Password must contain at least one number';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirm Password is required';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setErrors({});

    const result = await signup({ name, email, password });
    if (result.success) {
      navigate('/onboarding');
    } else {
      setErrors({ general: result.error || 'Failed to create account' });
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = () => {
    alert('Google sign-in will be available when the backend is connected.');
  };

  return (
    <AuthLayout title="Start your quantum journey." subtitle="Create your QubitCraft account and learn quantum computing through interactive experiences.">
      <div className="w-full max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-navy-900 mb-8">Create your account</h2>

        {errors.general && (
          <div className="mb-6 p-4 rounded-card bg-red-50 border border-red-100 text-sm text-red-600" role="alert">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <FormInput
            id="name"
            label="Full Name"
            autoComplete="name"
            value={name}
            onChange={(val: string) => {
              setName(val);
              if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
            }}
            error={errors.name}
            disabled={isSubmitting}
          />

          <FormInput
            id="email"
            label="Email address"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(val: string) => {
              setEmail(val);
              if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            error={errors.email}
            disabled={isSubmitting}
          />

          <div>
            <PasswordInput
              id="password"
              label="Password"
              autoComplete="new-password"
              value={password}
              onChange={(val: string) => {
                setPassword(val);
                if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                if (errors.confirmPassword && val === confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
              }}
              error={errors.password}
              disabled={isSubmitting}
            />
            {password && <div className="mt-2"><PasswordStrength password={password} /></div>}
          </div>

          <PasswordInput
            id="confirmPassword"
            label="Confirm Password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(val: string) => {
              setConfirmPassword(val);
              if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
            }}
            error={errors.confirmPassword}
            disabled={isSubmitting}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 w-full h-11 flex justify-center items-center rounded-[12px] bg-gradient-to-r from-indigo-600 to-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:from-indigo-500 hover:to-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                Creating account...
              </>
            ) : (
              'Create Account →'
            )}
          </button>
        </form>

        <div className="mt-8 flex items-center gap-4">
          <hr className="flex-1 border-gray-200" />
          <span className="text-sm text-slate-400 font-medium">OR</span>
          <hr className="flex-1 border-gray-200" />
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="mt-8 w-full h-11 flex justify-center items-center gap-3 rounded-[12px] bg-white px-4 py-2 text-sm font-semibold text-slate-700 border border-gray-200 shadow-sm hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-200 transition-all"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
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
          Continue with Google
        </button>

        <p className="mt-8 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
