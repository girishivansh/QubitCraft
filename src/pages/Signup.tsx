import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import AuthLayout from '../components/auth/AuthLayout';
import FormInput from '../components/auth/FormInput';
import PasswordInput from '../components/auth/PasswordInput';
import PasswordStrength from '../components/auth/PasswordStrength';
import GoogleOAuthSetupModal from '../components/auth/GoogleOAuthSetupModal';
import { getGoogleClientId, triggerGoogleOAuth } from '../auth/googleAuth';
import { Loader2 } from 'lucide-react';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; confirmPassword?: string; general?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);

  const { signup, loginWithGoogle } = useAuth();
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

  const performGoogleOAuth = async (clientId: string) => {
    setIsGoogleLoading(true);
    setErrors({});

    await triggerGoogleOAuth(
      clientId,
      async (googleProfile) => {
        const result = await loginWithGoogle(googleProfile);
        setIsGoogleLoading(false);
        if (result.success && result.user) {
          if (!result.user.onboardingCompleted) {
            navigate('/onboarding');
          } else {
            navigate('/dashboard');
          }
        } else {
          setErrors({ general: result.error || 'Failed to authenticate with Google' });
        }
      },
      (errorMsg) => {
        setIsGoogleLoading(false);
        setErrors({ general: `Google Sign-In: ${errorMsg}` });
      }
    );
  };

  const handleGoogleSignIn = () => {
    const clientId = getGoogleClientId();
    if (clientId) {
      performGoogleOAuth(clientId);
    } else {
      setIsSetupModalOpen(true);
    }
  };

  const handleQuickTestLogin = async (profile: { name: string; email: string }) => {
    setIsSetupModalOpen(false);
    setIsGoogleLoading(true);
    const result = await loginWithGoogle(profile);
    setIsGoogleLoading(false);
    if (result.success && result.user) {
      if (!result.user.onboardingCompleted) {
        navigate('/onboarding');
      } else {
        navigate('/dashboard');
      }
    } else {
      setErrors({ general: result.error || 'Failed to authenticate with Google' });
    }
  };

  return (
    <AuthLayout title="Start your quantum journey." subtitle="Create your QubitCraft account and learn quantum computing through interactive experiences.">
      <div className="w-full max-w-md mx-auto">
        <h2 className="text-xl sm:text-2xl font-bold text-navy-900 dark:text-white mb-3">Create your account</h2>

        {errors.general && (
          <div className="mb-3 p-2.5 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900/60 text-xs text-red-600 dark:text-red-400" role="alert">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-2.5" noValidate>
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
            {password && <PasswordStrength password={password} />}
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
            className="mt-1 w-full h-9 sm:h-9.5 flex justify-center items-center rounded-[10px] bg-gradient-to-r from-indigo-600 to-blue-500 px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-xs hover:from-indigo-500 hover:to-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-2 h-3.5 w-3.5" />
                Creating account...
              </>
            ) : (
              'Create Account →'
            )}
          </button>
        </form>

        <div className="mt-3 flex items-center gap-3">
          <hr className="flex-1 border-gray-200 dark:border-slate-800" />
          <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">OR</span>
          <hr className="flex-1 border-gray-200 dark:border-slate-800" />
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isSubmitting || isGoogleLoading}
          className="mt-3 w-full h-9 sm:h-9.5 flex justify-center items-center gap-2.5 rounded-[10px] bg-white dark:bg-[#0d0e24] px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 border border-gray-200 dark:border-slate-700/80 shadow-xs hover:bg-gray-50 dark:hover:bg-slate-800/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-200 dark:focus-visible:outline-slate-700 transition-all disabled:opacity-50"
        >
          {isGoogleLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-indigo-600 dark:text-indigo-400" />
              <span>Connecting to Google...</span>
            </>
          ) : (
            <>
              <svg className="h-4 w-4" viewBox="0 0 24 24">
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
              <span>Continue with Google</span>
            </>
          )}
        </button>

        <p className="mt-3 text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">
            Sign in
          </Link>
        </p>
      </div>

      <GoogleOAuthSetupModal
        isOpen={isSetupModalOpen}
        onClose={() => setIsSetupModalOpen(false)}
        onClientConfigured={(clientId) => {
          setIsSetupModalOpen(false);
          performGoogleOAuth(clientId);
        }}
        onQuickTestLogin={handleQuickTestLogin}
      />
    </AuthLayout>
  );
}
