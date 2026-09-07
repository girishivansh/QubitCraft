import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { getCourseById, getLessonById, getLessonsForCourse, getPathForCourse } from '../data/curriculum';
import { ACHIEVEMENTS } from '../data/curriculum/achievements';
import { COURSES } from '../data/curriculum/courses';
import { progressService } from '../services/progressService';
import LessonSidebar from '../components/learn/LessonSidebar';
import LessonContentRenderer from '../components/learn/LessonContentRenderer';
import LessonComplete from '../components/learn/LessonComplete';
import ProgressBar from '../components/learn/ProgressBar';
import Breadcrumb from '../components/Breadcrumb';
import { ChevronLeft, ChevronRight, Menu, Clock, Zap, BookOpen } from 'lucide-react';
import type { LessonState } from '../types/curriculum';

export default function LessonPage() {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [completionData, setCompletionData] = useState<{
    xpEarned: number;
    courseCompleted: boolean;
    courseXP: number;
    achievements: string[];
  } | null>(null);

  if (!user || !courseId || !lessonId) return null;

  const course = getCourseById(courseId);
  const lesson = getLessonById(lessonId);
  const path = course ? getPathForCourse(courseId) : undefined;
  const courseLessons = course ? getLessonsForCourse(courseId) : [];

  if (!course || !lesson || !path) {
    return (
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-2xl font-bold text-navy-900 mb-4">Lesson Not Found</h1>
        <p className="text-slate-500 mb-8">The lesson you're looking for doesn't exist.</p>
        <Link to="/learn" className="text-indigo-600 hover:text-indigo-500 font-medium">
          ← Back to Learn
        </Link>
      </div>
    );
  }

  const progress = progressService.getProgress(user.id);
  const completedCheckIds = progress.completedCheckIds;

  // Build lesson states for sidebar
  const sidebarLessons = courseLessons.map(l => {
    let state: LessonState = progressService.getLessonState(user.id, l.id, l.order, course.lessonIds);
    if (l.id === lessonId && state === 'available') state = 'current';
    return { id: l.id, title: l.title, order: l.order, state };
  });

  const currentIndex = courseLessons.findIndex(l => l.id === lessonId);
  const prevLesson = currentIndex > 0 ? courseLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < courseLessons.length - 1 ? courseLessons[currentIndex + 1] : null;
  const nextLessonState = nextLesson ? progressService.getLessonState(user.id, nextLesson.id, nextLesson.order, course.lessonIds) : null;
  const isLessonCompleted = progress.completedLessonIds.includes(lessonId);

  const completedInCourse = courseLessons.filter(l => progress.completedLessonIds.includes(l.id)).length;
  const courseProgress = Math.round((completedInCourse / courseLessons.length) * 100);

  const handleCheckComplete = async (checkId: string) => {
    const result = progressService.completeKnowledgeCheck(user.id, checkId);
    if (result.isNewCompletion) {
      await updateProfile({
        xp: user.xp + result.xpEarned,
        challengesCompleted: user.challengesCompleted + 1,
      });
    }
  };

  const handleCompleteLesson = async () => {
    const result = progressService.completeLesson(
      user.id,
      lessonId,
      courseId,
      path.id,
      course.lessonIds,
      user.streak
    );

    if (result.isNewCompletion) {
      const streakResult = progressService.updateStreak(user.id, user.streak);
      
      // Build path-lesson map for achievement checking
      const pathLessonMap: Record<string, string[]> = {};
      COURSES.forEach(c => { pathLessonMap[c.id] = c.lessonIds; });
      
      const newAchievements = progressService.checkAchievements(user.id, ACHIEVEMENTS, pathLessonMap);

      await updateProfile({
        xp: user.xp + result.xpEarned,
        streak: streakResult.currentStreak,
        lessonsCompleted: user.lessonsCompleted + 1,
      });

      setCompletionData({
        xpEarned: result.xpEarned,
        courseCompleted: result.courseCompleted,
        courseXP: result.courseXP,
        achievements: newAchievements,
      });
      setShowCompletion(true);
    }
  };

  const handleNavigate = (targetLessonId: string) => {
    navigate(`/learn/course/${courseId}/lesson/${targetLessonId}`);
    setSidebarOpen(false);
  };

  const breadcrumbItems = [
    { label: 'Learn', href: '/learn' },
    { label: path.title, href: `/learn/path/${path.id}` },
    { label: course.title, href: `/learn/course/${courseId}` },
    { label: lesson.title },
  ];

  return (
    <div className="min-h-[calc(100vh-72px)]">
      {/* Lesson Header */}
      <div className="bg-white border-b border-gray-100 sticky top-16 lg:top-[72px] z-30">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 text-slate-500 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                aria-label="Toggle lesson navigation"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
                <span className="font-medium text-indigo-600">{path.title}</span>
                <span>•</span>
                <span>Lesson {lesson.order} of {courseLessons.length}</span>
              </div>
              <h1 className="text-sm font-semibold text-navy-900 truncate sm:hidden">
                {lesson.title}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500">
                <Clock className="w-3.5 h-3.5" />
                <span>{lesson.duration}</span>
              </div>
              <div className="w-32">
                <ProgressBar value={courseProgress} size="sm" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="hidden lg:block w-72 flex-shrink-0">
          <LessonSidebar
            lessons={sidebarLessons}
            currentLessonId={lessonId}
            courseId={courseId}
            courseTitle={course.title}
            onNavigate={handleNavigate}
            isOpen={true}
            onClose={() => {}}
          />
        </div>

        {/* Mobile sidebar */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="absolute inset-0 bg-black/20" onClick={() => setSidebarOpen(false)} />
            <div className="absolute left-0 top-0 h-full w-80 max-w-[85vw]">
              <LessonSidebar
                lessons={sidebarLessons}
                currentLessonId={lessonId}
                courseId={courseId}
                courseTitle={course.title}
                onNavigate={handleNavigate}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
              />
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            {/* Breadcrumb (desktop) */}
            <div className="hidden sm:block mb-6">
              <Breadcrumb items={breadcrumbItems} />
            </div>

            {/* Lesson Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-navy-900 mb-2">
              {lesson.title}
            </h1>
            <div className="flex items-center gap-4 mb-8">
              <span className="flex items-center gap-1.5 text-sm text-slate-500">
                <Clock className="w-4 h-4" />
                {lesson.duration}
              </span>
              <span className="flex items-center gap-1.5 text-sm text-slate-500">
                <Zap className="w-4 h-4 text-amber-500" />
                {lesson.xp} XP
              </span>
            </div>

            {/* Learning Objectives */}
            {lesson.objectives.length > 0 && (
              <div className="bg-indigo-50 rounded-[12px] border border-indigo-100 p-5 mb-10">
                <h2 className="text-sm font-semibold text-indigo-900 mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  What you'll learn
                </h2>
                <ul className="space-y-1.5">
                  {lesson.objectives.map((obj, i) => (
                    <li key={i} className="text-sm text-indigo-800 flex items-start gap-2">
                      <span className="text-indigo-400 mt-1">•</span>
                      {obj}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Content */}
            <LessonContentRenderer
              blocks={lesson.contentBlocks}
              completedCheckIds={completedCheckIds}
              onCheckComplete={handleCheckComplete}
            />

            {/* Lesson Complete Button */}
            {!isLessonCompleted && (
              <div className="mt-12 pt-8 border-t border-gray-100">
                <button
                  onClick={handleCompleteLesson}
                  className="w-full sm:w-auto h-12 px-8 rounded-[12px] bg-gradient-to-r from-indigo-600 to-blue-500 text-sm font-semibold text-white hover:from-indigo-500 hover:to-blue-400 transition-all flex items-center justify-center gap-2"
                >
                  Complete Lesson
                  <Zap className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
              {prevLesson ? (
                <Link
                  to={`/learn/course/${courseId}/lesson/${prevLesson.id}`}
                  className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  {prevLesson.title}
                </Link>
              ) : (
                <div />
              )}
              {nextLesson && nextLessonState !== 'locked' ? (
                <Link
                  to={`/learn/course/${courseId}/lesson/${nextLesson.id}`}
                  className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
                >
                  {nextLesson.title}
                  <ChevronRight className="w-4 h-4" />
                </Link>
              ) : (
                <Link
                  to={`/learn/course/${courseId}`}
                  className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  Back to Course
                  <ChevronRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Right Context Panel (desktop) */}
        <div className="hidden xl:block w-64 flex-shrink-0 p-6 border-l border-gray-100">
          <div className="sticky top-32 space-y-6">
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Progress</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Course</span>
                  <span className="font-medium text-navy-900">{courseProgress}%</span>
                </div>
                <ProgressBar value={courseProgress} size="sm" />
                <p className="text-xs text-slate-500">{completedInCourse} of {courseLessons.length} lessons</p>
              </div>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">This Lesson</h3>
              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {lesson.duration}
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  {lesson.xp} XP
                </div>
              </div>
            </div>
            {lesson.objectives.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Objectives</h3>
                <ul className="space-y-1.5">
                  {lesson.objectives.map((obj, i) => (
                    <li key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
                      <span className="text-indigo-400 mt-0.5">•</span>
                      {obj}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Completion Modal */}
      {showCompletion && completionData && (
        <LessonComplete
          lessonTitle={lesson.title}
          xpEarned={completionData.xpEarned}
          courseCompleted={completionData.courseCompleted}
          courseXP={completionData.courseXP}
          achievementsEarned={completionData.achievements}
          nextLessonId={nextLesson && nextLessonState !== 'locked' ? nextLesson.id : null}
          courseId={courseId}
          pathId={path.id}
          onDismiss={() => setShowCompletion(false)}
        />
      )}
    </div>
  );
}
