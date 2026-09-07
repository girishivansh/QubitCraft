import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { BookOpen, Cpu, User, Zap, Flame, Trophy, ArrowRight } from 'lucide-react';
import { progressService } from '../services/progressService';
import { recommendationService } from '../services/recommendationService';
import { LEARNING_PATHS } from '../data/curriculum';
import type { SkillLevel } from '../types/learning';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function getFirstName(name: string): string {
  return name.split(' ')[0];
}

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) return null;

  const greeting = getGreeting();
  const firstName = getFirstName(user.name);
  const skillLevel = (user.skillLevel as SkillLevel) || 'beginner';
  
  const progress = progressService.getProgress(user.id);
  const continueLearningData = recommendationService.getContinueLearning(
    progress.completedLessonIds,
    progress.currentLessonId,
    progress.currentCourseId,
    progress.currentPathId
  );
  
  const recommendedPathInfo = recommendationService.getRecommendedPath(
    skillLevel,
    progress.completedLessonIds
  );

  const recommendedPath = LEARNING_PATHS.find(p => p.id === recommendedPathInfo.pathId);

  // Calculate rough progress percentage across the platform
  // There are exactly 19 lessons in total across the 3 paths right now
  const totalPossibleLessons = 19;
  const progressPercent = Math.min(
    Math.round((progress.completedLessonIds.length / totalPossibleLessons) * 100),
    100
  );

  const stats = [
    { label: 'XP Earned', value: user.xp, icon: Zap, color: 'text-amber-500' },
    { label: 'Day Streak', value: `${user.streak}`, icon: Flame, color: 'text-orange-500' },
    { label: 'Lessons', value: progress.completedLessonIds.length, icon: BookOpen, color: 'text-blue-500' },
    { label: 'Challenges', value: user.challengesCompleted, icon: Trophy, color: 'text-green-500' },
  ];

  const quickActions = [
    { label: 'Continue Learning', description: continueLearningData ? continueLearningData.lessonTitle : 'Explore learning paths', href: '/learn', icon: BookOpen, gradient: 'from-indigo-500 to-blue-500' },
    { label: 'Quantum Lab', description: 'Build and simulate circuits', href: '/playground', icon: Cpu, gradient: 'from-violet-500 to-purple-500' },
    { label: 'View Profile', description: 'Your learning profile', href: '/profile', icon: User, gradient: 'from-blue-500 to-cyan-500' },
  ];

  return (
    <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      {/* Greeting */}
      <div className="mb-10">
        <h1 className="text-2xl md:text-3xl font-bold text-navy-900">
          {greeting}, {firstName}.
        </h1>
        <p className="text-base text-slate-500 mt-1">
          Ready to continue your quantum journey?
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="bg-white rounded-card border border-gray-100 shadow-card p-5 flex items-center gap-4"
          >
            <div className={`flex-shrink-0 w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl font-bold text-navy-900">{value}</p>
              <p className="text-xs text-slate-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recommended Next + Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <div className="lg:col-span-2 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-card border border-indigo-100 p-6 md:p-8 flex flex-col justify-center">
          <p className="text-xs font-medium text-indigo-600 uppercase tracking-wider mb-2">
            {continueLearningData ? 'Continue Learning' : 'Recommended Path'}
          </p>
          <h2 className="text-xl md:text-2xl font-bold text-navy-900 mb-2">
            {continueLearningData ? continueLearningData.courseTitle : recommendedPath?.title}
          </h2>
          <p className="text-sm text-slate-600 mb-6 max-w-lg">
            {continueLearningData 
              ? `You're on lesson ${continueLearningData.lessonNumber} of ${continueLearningData.totalLessons}. Next up: ${continueLearningData.lessonTitle}.`
              : recommendedPath?.description}
          </p>
          
          <Link
            to={continueLearningData ? `/learn/course/${continueLearningData.courseId}/lesson/${continueLearningData.lessonId}` : `/learn/path/${recommendedPath?.id}`}
            className="inline-flex items-center gap-2 h-10 px-6 rounded-[12px] bg-gradient-to-r from-indigo-600 to-blue-500 text-sm font-semibold text-white hover:from-indigo-500 hover:to-blue-400 transition-all w-fit"
          >
            {continueLearningData ? 'Resume Lesson' : 'Start Path'}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="bg-white rounded-card border border-gray-100 shadow-card p-6 flex flex-col items-center justify-center text-center">
          <div className="relative w-24 h-24 mb-4">
            <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="#f1f5f9" strokeWidth="8" />
              <circle
                cx="50" cy="50" r="42" fill="none"
                stroke="url(#progressGrad)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 42}`}
                strokeDashoffset={`${2 * Math.PI * 42 * (1 - progressPercent / 100)}`}
                className="transition-all duration-500"
              />
              <defs>
                <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4f46e5" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-navy-900">
              {progressPercent}%
            </span>
          </div>
          <p className="text-sm font-semibold text-navy-900">Platform Progress</p>
          <p className="text-xs text-slate-500 mt-1 capitalize">Level: {skillLevel}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <h2 className="text-lg font-semibold text-navy-900 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {quickActions.map(({ label, description, href, icon: Icon, gradient }) => (
          <Link
            key={label}
            to={href}
            className="group bg-white rounded-card border border-gray-100 shadow-card hover:shadow-card-hover p-5 transition-all"
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${gradient} flex items-center justify-center mb-4`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-sm font-semibold text-navy-900 group-hover:text-indigo-600 transition-colors">
              {label}
            </h3>
            <p className="text-xs text-slate-500 mt-1">{description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
