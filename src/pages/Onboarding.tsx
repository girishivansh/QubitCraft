import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { Logo } from '../components/Logo';
import {
  LEARNER_TYPES,
  SKILL_LEVEL_OPTIONS,
  LEARNING_GOALS,
  LEARNING_PREFERENCES,
  RECOMMENDED_PATHS,
} from '../config/onboarding';
import type { OnboardingData, LearningGoal, LearningPreference } from '../types/learning';
import { CheckCircle } from 'lucide-react';

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    learnerType: null,
    skillLevel: null,
    goals: [],
    learningPreferences: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { completeOnboarding } = useAuth();
  const navigate = useNavigate();

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const handleNext = async () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setIsSubmitting(true);
      const result = await completeOnboarding(data);
      if (result.success) {
        setCurrentStep(5); // Completion screen
      }
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const toggleGoal = (id: LearningGoal) => {
    setData((prev) => ({
      ...prev,
      goals: prev.goals.includes(id) ? prev.goals.filter((g) => g !== id) : [...prev.goals, id],
    }));
  };

  const togglePreference = (id: LearningPreference) => {
    setData((prev) => ({
      ...prev,
      learningPreferences: prev.learningPreferences.includes(id)
        ? prev.learningPreferences.filter((p) => p !== id)
        : [...prev.learningPreferences, id],
    }));
  };

  // Prevent navigating backwards if on completion screen
  if (currentStep === 5) {
    const recommendedPath = data.skillLevel ? RECOMMENDED_PATHS[data.skillLevel] : RECOMMENDED_PATHS['beginner'];

    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mb-6" />
        <h1 className="text-3xl font-bold text-navy-900 mb-2">You're all set!</h1>
        <p className="text-base text-slate-500">Your quantum journey starts here.</p>

        <div className="mt-10 p-8 rounded-card bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 max-w-lg w-full text-left">
          <p className="text-xs font-medium text-indigo-600 uppercase tracking-wider">Your Recommended Path</p>
          <h2 className="text-xl font-bold text-navy-900 mt-2">{recommendedPath?.pathName}</h2>
          <p className="text-sm font-medium text-indigo-600 mt-4">Start with: {recommendedPath?.firstLesson}</p>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full max-w-lg">
          <button
            onClick={() => navigate('/learn')}
            className="flex-1 h-11 flex justify-center items-center rounded-[12px] bg-gradient-to-r from-indigo-600 to-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:from-indigo-500 hover:to-blue-400 transition-all"
          >
            Start Learning →
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex-1 h-11 flex justify-center items-center rounded-[12px] bg-white border border-gray-200 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-gray-50 transition-all"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="px-6 py-4 flex justify-between items-center bg-white z-10">
        <div className="flex items-center gap-2">
          <Logo size={32} />
          <span className="font-bold text-navy-900">QubitCraft</span>
        </div>
        <div className="text-sm text-slate-500 font-medium">
          Step {currentStep} of {totalSteps}
        </div>
      </div>
      
      <div className="h-1 bg-gray-100 w-full">
        <div 
          className="h-full bg-indigo-500 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <main className="flex-1 max-w-2xl w-full mx-auto px-6 py-12 flex flex-col">
        {currentStep === 1 && (
          <div className="flex-1 flex flex-col">
            <h1 className="text-2xl md:text-3xl font-bold text-navy-900 text-center">Let's personalize your quantum journey.</h1>
            <p className="text-base text-slate-500 text-center mt-2 mb-10">What best describes you?</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-auto">
              {LEARNER_TYPES.map((type) => {
                const Icon = type.icon as any;
                const isSelected = data.learnerType === type.id;
                
                return (
                  <div
                    key={type.id}
                    onClick={() => setData((prev) => ({ ...prev, learnerType: type.id as any }))}
                    className={`p-5 rounded-card border-2 cursor-pointer transition-all hover:shadow-card ${
                      isSelected ? 'border-indigo-500 bg-indigo-50 shadow-card' : 'border-gray-200 bg-white'
                    }`}
                  >
                    <Icon className="h-8 w-8 text-indigo-500" />
                    <h3 className="text-sm font-semibold text-navy-900 mt-3">{type.label}</h3>
                    <p className="text-xs text-slate-500 mt-1">{type.description}</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-12 flex justify-end">
              <button
                onClick={handleNext}
                disabled={!data.learnerType}
                className="w-full sm:w-auto h-11 flex justify-center items-center rounded-[12px] bg-gradient-to-r from-indigo-600 to-blue-500 px-8 py-2 text-sm font-semibold text-white shadow-sm hover:from-indigo-500 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="flex-1 flex flex-col">
            <h1 className="text-2xl md:text-3xl font-bold text-navy-900 text-center">What's your quantum experience?</h1>
            <p className="text-base text-slate-500 text-center mt-2 mb-10">How familiar are you with quantum computing?</p>
            
            <div className="space-y-4 mb-auto">
              {SKILL_LEVEL_OPTIONS.map((option) => {
                const isSelected = data.skillLevel === option.level;
                
                return (
                  <div
                    key={option.key}
                    onClick={() => setData((prev) => ({ ...prev, skillLevel: option.level as any }))}
                    className={`w-full p-4 rounded-[12px] border-2 cursor-pointer text-left transition-all ${
                      isSelected ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-200'
                    }`}
                  >
                    <h3 className="text-sm font-semibold text-navy-900">{option.label}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{option.description}</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-12 flex justify-between gap-4">
              <button
                onClick={handleBack}
                className="w-full sm:w-auto h-11 flex justify-center items-center rounded-[12px] bg-white border border-gray-200 px-8 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-gray-50 transition-all"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={!data.skillLevel}
                className="w-full sm:w-auto h-11 flex justify-center items-center rounded-[12px] bg-gradient-to-r from-indigo-600 to-blue-500 px-8 py-2 text-sm font-semibold text-white shadow-sm hover:from-indigo-500 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="flex-1 flex flex-col">
            <h1 className="text-2xl md:text-3xl font-bold text-navy-900 text-center">What do you want to achieve?</h1>
            <p className="text-base text-slate-500 text-center mt-2 mb-10">Select all that apply</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-auto">
              {LEARNING_GOALS.map((goal) => {
                const isSelected = data.goals.includes(goal.id);
                
                return (
                  <div
                    key={goal.id}
                    onClick={() => toggleGoal(goal.id)}
                    className={`p-4 rounded-[12px] border-2 cursor-pointer transition-all flex items-start gap-3 ${
                      isSelected ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-200'
                    }`}
                  >
                    <div className={`mt-0.5 flex-shrink-0 h-5 w-5 rounded border ${isSelected ? 'bg-indigo-600 border-indigo-600 flex items-center justify-center' : 'border-gray-300'}`}>
                      {isSelected && <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                    </div>
                    <span className="text-sm font-medium text-navy-900">{goal.label}</span>
                  </div>
                );
              })}
            </div>

            <div className="mt-12 flex justify-between items-center gap-4">
              <button
                onClick={handleBack}
                className="w-full sm:w-auto h-11 flex justify-center items-center rounded-[12px] bg-white border border-gray-200 px-8 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-gray-50 transition-all"
              >
                Back
              </button>
              <div className="flex items-center gap-4">
                <button
                  onClick={handleNext}
                  className="text-sm font-medium text-slate-500 hover:text-slate-700 hidden sm:block"
                >
                  Skip
                </button>
                <button
                  onClick={handleNext}
                  className="w-full sm:w-auto h-11 flex justify-center items-center rounded-[12px] bg-gradient-to-r from-indigo-600 to-blue-500 px-8 py-2 text-sm font-semibold text-white shadow-sm hover:from-indigo-500 hover:to-blue-400 transition-all"
                >
                  Continue →
                </button>
              </div>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="flex-1 flex flex-col">
            <h1 className="text-2xl md:text-3xl font-bold text-navy-900 text-center">How do you learn best?</h1>
            <p className="text-base text-slate-500 text-center mt-2 mb-10">Select all that apply</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-auto">
              {LEARNING_PREFERENCES.map((pref) => {
                const isSelected = data.learningPreferences.includes(pref.id);
                
                return (
                  <div
                    key={pref.id}
                    onClick={() => togglePreference(pref.id)}
                    className={`p-4 rounded-[12px] border-2 cursor-pointer transition-all flex items-start gap-3 ${
                      isSelected ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-200'
                    }`}
                  >
                    <div className={`mt-0.5 flex-shrink-0 h-5 w-5 rounded border ${isSelected ? 'bg-indigo-600 border-indigo-600 flex items-center justify-center' : 'border-gray-300'}`}>
                      {isSelected && <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                    </div>
                    <span className="text-sm font-medium text-navy-900">{pref.label}</span>
                  </div>
                );
              })}
            </div>

            <div className="mt-12 flex justify-between gap-4">
              <button
                onClick={handleBack}
                disabled={isSubmitting}
                className="w-full sm:w-auto h-11 flex justify-center items-center rounded-[12px] bg-white border border-gray-200 px-8 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-gray-50 disabled:opacity-50 transition-all"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={isSubmitting}
                className="w-full sm:w-auto h-11 flex justify-center items-center rounded-[12px] bg-gradient-to-r from-indigo-600 to-blue-500 px-8 py-2 text-sm font-semibold text-white shadow-sm hover:from-indigo-500 hover:to-blue-400 disabled:opacity-50 transition-all"
              >
                {isSubmitting ? 'Saving...' : 'Start My Journey →'}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
