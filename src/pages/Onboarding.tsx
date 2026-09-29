import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { useTheme } from '../context/ThemeContext';
import { Logo } from '../components/Logo';
import {
  LEARNER_TYPES,
  SKILL_LEVEL_OPTIONS,
  LEARNING_GOALS,
  LEARNING_PREFERENCES,
  RECOMMENDED_PATHS,
} from '../config/onboarding';
import type { OnboardingData, LearningGoal, LearningPreference } from '../types/learning';
import { CheckCircle, Sun, Moon, Check } from 'lucide-react';

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    learnerType: null,
    skillLevel: null,
    selectedSkillKey: null,
    goals: [],
    learningPreferences: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { completeOnboarding } = useAuth();
  const { isDark, toggleTheme } = useTheme();
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
      <div className="min-h-screen bg-white dark:bg-[#070813] text-slate-900 dark:text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 text-center transition-colors duration-200 relative overflow-y-auto">
        <div className="absolute top-4 sm:top-6 right-4 sm:right-6">
          <button
            onClick={toggleTheme}
            className="p-2 text-slate-500 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle dark mode"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        <CheckCircle className="h-12 w-12 sm:h-14 sm:w-14 text-emerald-500 mb-4 sm:mb-5" />
        <h1 className="text-2xl sm:text-3xl font-bold text-navy-900 dark:text-white mb-1.5">You're all set!</h1>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">Your quantum journey starts here.</p>

        <div className="mt-6 sm:mt-8 p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-[#0d0e24] dark:to-[#131638] border border-indigo-100 dark:border-slate-800 max-w-lg w-full text-left shadow-sm">
          <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Your Recommended Path</p>
          <h2 className="text-lg sm:text-xl font-bold text-navy-900 dark:text-white mt-1.5">{recommendedPath?.pathName}</h2>
          <p className="text-xs sm:text-sm font-medium text-indigo-600 dark:text-indigo-300 mt-3">Start with: {recommendedPath?.firstLesson}</p>
        </div>

        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3.5 w-full max-w-lg">
          <button
            onClick={() => navigate('/learn')}
            className="flex-1 h-10 sm:h-11 flex justify-center items-center rounded-xl bg-gradient-to-r from-indigo-600 to-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:from-indigo-500 hover:to-blue-400 transition-all"
          >
            Start Learning →
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex-1 h-10 sm:h-11 flex justify-center items-center rounded-xl bg-white dark:bg-[#0d0e24] border border-gray-200 dark:border-slate-700 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 shadow-sm hover:bg-gray-50 dark:hover:bg-slate-800 transition-all"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#070813] text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200 overflow-y-auto">
      {/* Top Header */}
      <div className="px-4 sm:px-6 py-3 sm:py-3.5 flex justify-between items-center bg-white/90 dark:bg-[#070813]/90 backdrop-blur-sm border-b border-gray-100 dark:border-slate-800/80 z-10 transition-colors duration-200">
        <div className="flex items-center gap-2">
          <Logo size={28} />
          <span className="font-bold text-navy-900 dark:text-white text-base sm:text-lg">QubitCraft</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            Step {currentStep} of {totalSteps}
          </div>
          <button
            onClick={toggleTheme}
            className="p-1.5 text-slate-500 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle dark mode"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="h-1 bg-gray-100 dark:bg-slate-800 w-full">
        <div 
          className="h-full bg-indigo-500 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Main Content Area - Vertically Centered */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10 flex flex-col justify-center">
        {/* Step 1: Learner Type */}
        {currentStep === 1 && (
          <div className="w-full my-auto flex flex-col">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-navy-900 dark:text-white text-center">Let's personalize your quantum journey.</h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 text-center mt-1 mb-5 sm:mb-6">What best describes you?</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {LEARNER_TYPES.map((type) => {
                const Icon = type.icon as any;
                const isSelected = data.learnerType === type.id;
                
                return (
                  <div
                    key={type.id}
                    onClick={() => setData((prev) => ({ ...prev, learnerType: type.id as any }))}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-card flex flex-col justify-between ${
                      isSelected 
                        ? 'border-indigo-500 dark:border-indigo-500 bg-indigo-50/80 dark:bg-indigo-950/40 shadow-card' 
                        : 'border-gray-200 dark:border-slate-800 bg-white dark:bg-[#0d0e24] hover:border-indigo-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className={`p-2.5 rounded-lg w-fit transition-colors ${
                        isSelected 
                          ? 'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400' 
                          : 'bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400'
                      }`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="text-sm font-semibold text-navy-900 dark:text-white mt-3">{type.label}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{type.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 sm:mt-8 flex justify-end">
              <button
                onClick={handleNext}
                disabled={!data.learnerType}
                className="w-full sm:w-auto h-10 sm:h-11 flex justify-center items-center rounded-xl bg-gradient-to-r from-indigo-600 to-blue-500 px-7 py-2 text-sm font-semibold text-white shadow-sm hover:from-indigo-500 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Skill Level */}
        {currentStep === 2 && (
          <div className="w-full my-auto flex flex-col">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-navy-900 dark:text-white text-center">What's your quantum experience?</h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 text-center mt-1 mb-5 sm:mb-6">How familiar are you with quantum computing?</p>
            
            <div className="space-y-2.5 sm:space-y-3">
              {SKILL_LEVEL_OPTIONS.map((option) => {
                const isSelected = data.selectedSkillKey === option.key;
                
                return (
                  <div
                    key={option.key}
                    onClick={() => setData((prev) => ({ 
                      ...prev, 
                      selectedSkillKey: option.key,
                      skillLevel: option.level as any 
                    }))}
                    className={`w-full py-2.5 sm:py-3 px-4 rounded-xl border-2 cursor-pointer text-left transition-all ${
                      isSelected 
                        ? 'border-indigo-500 dark:border-indigo-500 bg-indigo-50/80 dark:bg-indigo-950/40 shadow-sm' 
                        : 'border-gray-200 dark:border-slate-800 bg-white dark:bg-[#0d0e24] hover:border-indigo-200 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-navy-900 dark:text-white">{option.label}</h3>
                      <div className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ml-3 ${
                        isSelected
                          ? 'border-indigo-600 dark:border-indigo-400 bg-indigo-600 dark:bg-indigo-500'
                          : 'border-slate-300 dark:border-slate-600'
                      }`}>
                        {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{option.description}</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 sm:mt-8 flex justify-between gap-4">
              <button
                onClick={handleBack}
                className="w-full sm:w-auto h-10 sm:h-11 flex justify-center items-center rounded-xl bg-white dark:bg-[#0d0e24] border border-gray-200 dark:border-slate-700 px-6 sm:px-7 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 shadow-sm hover:bg-gray-50 dark:hover:bg-slate-800 transition-all"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={!data.selectedSkillKey}
                className="w-full sm:w-auto h-10 sm:h-11 flex justify-center items-center rounded-xl bg-gradient-to-r from-indigo-600 to-blue-500 px-7 sm:px-8 py-2 text-sm font-semibold text-white shadow-sm hover:from-indigo-500 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Goals */}
        {currentStep === 3 && (
          <div className="w-full my-auto flex flex-col">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-navy-900 dark:text-white text-center">What do you want to achieve?</h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 text-center mt-1 mb-5 sm:mb-6">Select all that apply</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {LEARNING_GOALS.map((goal, index) => {
                const Icon = (goal as any).icon;
                const isSelected = data.goals.includes(goal.id);
                const isLastOdd = index === LEARNING_GOALS.length - 1 && LEARNING_GOALS.length % 2 !== 0;
                
                return (
                  <div
                    key={goal.id}
                    onClick={() => toggleGoal(goal.id)}
                    className={`py-3 px-3.5 sm:px-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between gap-3 ${
                      isSelected 
                        ? 'border-indigo-500 dark:border-indigo-500 bg-indigo-50/80 dark:bg-indigo-950/40 shadow-sm' 
                        : 'border-gray-200 dark:border-slate-800 bg-white dark:bg-[#0d0e24] hover:border-indigo-200 dark:hover:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-[#11132c]'
                    } ${isLastOdd ? 'sm:col-span-2 sm:max-w-xs sm:mx-auto sm:w-full' : ''}`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {Icon && (
                        <div className={`p-2 rounded-lg shrink-0 transition-colors ${
                          isSelected 
                            ? 'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400' 
                            : 'bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                      )}
                      <span className="text-xs sm:text-sm font-medium text-navy-900 dark:text-white truncate">{goal.label}</span>
                    </div>

                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-all ${
                      isSelected 
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm' 
                        : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800/80'
                    }`}>
                      {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 sm:mt-8 flex justify-between items-center gap-4">
              <button
                onClick={handleBack}
                className="w-full sm:w-auto h-10 sm:h-11 flex justify-center items-center rounded-xl bg-white dark:bg-[#0d0e24] border border-gray-200 dark:border-slate-700 px-6 sm:px-7 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 shadow-sm hover:bg-gray-50 dark:hover:bg-slate-800 transition-all"
              >
                Back
              </button>
              <div className="flex items-center gap-4">
                <button
                  onClick={handleNext}
                  className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hidden sm:block"
                >
                  Skip
                </button>
                <button
                  onClick={handleNext}
                  className="w-full sm:w-auto h-10 sm:h-11 flex justify-center items-center rounded-xl bg-gradient-to-r from-indigo-600 to-blue-500 px-7 sm:px-8 py-2 text-sm font-semibold text-white shadow-sm hover:from-indigo-500 hover:to-blue-400 transition-all"
                >
                  Continue →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Learning Preferences */}
        {currentStep === 4 && (
          <div className="w-full my-auto flex flex-col">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-navy-900 dark:text-white text-center">How do you learn best?</h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 text-center mt-1 mb-5 sm:mb-6">Select all that apply</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {LEARNING_PREFERENCES.map((pref, index) => {
                const Icon = (pref as any).icon;
                const isSelected = data.learningPreferences.includes(pref.id);
                const isLastOdd = index === LEARNING_PREFERENCES.length - 1 && LEARNING_PREFERENCES.length % 2 !== 0;
                
                return (
                  <div
                    key={pref.id}
                    onClick={() => togglePreference(pref.id)}
                    className={`py-3 px-3.5 sm:px-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between gap-3 ${
                      isSelected 
                        ? 'border-indigo-500 dark:border-indigo-500 bg-indigo-50/80 dark:bg-indigo-950/40 shadow-sm' 
                        : 'border-gray-200 dark:border-slate-800 bg-white dark:bg-[#0d0e24] hover:border-indigo-200 dark:hover:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-[#11132c]'
                    } ${isLastOdd ? 'sm:col-span-2 sm:max-w-xs sm:mx-auto sm:w-full' : ''}`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {Icon && (
                        <div className={`p-2 rounded-lg shrink-0 transition-colors ${
                          isSelected 
                            ? 'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400' 
                            : 'bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                      )}
                      <span className="text-xs sm:text-sm font-medium text-navy-900 dark:text-white truncate">{pref.label}</span>
                    </div>

                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-all ${
                      isSelected 
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm' 
                        : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800/80'
                    }`}>
                      {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 sm:mt-8 flex justify-between gap-4">
              <button
                onClick={handleBack}
                disabled={isSubmitting}
                className="w-full sm:w-auto h-10 sm:h-11 flex justify-center items-center rounded-xl bg-white dark:bg-[#0d0e24] border border-gray-200 dark:border-slate-700 px-6 sm:px-7 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 shadow-sm hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-50 transition-all"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={isSubmitting}
                className="w-full sm:w-auto h-10 sm:h-11 flex justify-center items-center rounded-xl bg-gradient-to-r from-indigo-600 to-blue-500 px-7 sm:px-8 py-2 text-sm font-semibold text-white shadow-sm hover:from-indigo-500 hover:to-blue-400 disabled:opacity-50 transition-all"
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
