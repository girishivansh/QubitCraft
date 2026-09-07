import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { getCourseById, getPathForCourse, getLessonsForCourse } from '../data/curriculum';
import { progressService } from '../services/progressService';
import Breadcrumb from '../components/Breadcrumb';
import LearningRoadmap from '../components/learn/LearningRoadmap';
import { Clock, Zap, BookOpen, ChevronRight, GraduationCap } from 'lucide-react';
import type { LessonState } from '../types/curriculum';

export default function CoursePage() {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();

  if (!user || !courseId) return null;

  const course = getCourseById(courseId);
  const path = getPathForCourse(courseId);

  if (!course || !path) {
    return (
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-2xl font-bold text-navy-900 mb-4">Course Not Found</h1>
        <p className="text-slate-500 mb-8">The course you're looking for doesn't exist.</p>
        <Link to="/learn" className="text-indigo-600 hover:text-indigo-500 font-medium">
          ← Back to Learn
        </Link>
      </div>
    );
  }

  const courseLessons = getLessonsForCourse(course.id);
  const progress = progressService.getProgress(user.id);

  const completedInCourse = courseLessons.filter(l => progress.completedLessonIds.includes(l.id)).length;
  const courseProgress = Math.round((completedInCourse / courseLessons.length) * 100);

  // Build lesson states for roadmap
  const roadmapLessons = courseLessons.map(l => {
    let state: LessonState = progressService.getLessonState(user.id, l.id, l.order, course.lessonIds);
    if (progress.currentLessonId === l.id && state === 'available') state = 'current';
    return {
      id: l.id,
      title: l.title,
      description: l.description,
      duration: l.duration,
      xp: l.xp,
      order: l.order,
      state
    };
  });

  const nextLessonId = progressService.getNextLessonId(user.id, course.lessonIds);
  const startOrContinueHref = nextLessonId 
    ? `/learn/course/${course.id}/lesson/${nextLessonId}`
    : `/learn/course/${course.id}/lesson/${course.lessonIds[0]}`; // If all done, review first lesson

  const breadcrumbItems = [
    { label: 'Learn', href: '/learn' },
    { label: path.title, href: `/learn/path/${path.id}` },
    { label: course.title }
  ];

  const difficultyColors = {
    beginner: 'bg-green-50 text-green-700 border-green-200',
    intermediate: 'bg-blue-50 text-blue-700 border-blue-200',
    advanced: 'bg-purple-50 text-purple-700 border-purple-200',
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="mb-8">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      {/* Course Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${difficultyColors[course.difficulty]} capitalize`}>
            {course.difficulty}
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-navy-900 mb-4">{course.title}</h1>
        <p className="text-lg text-slate-600 mb-8">{course.description}</p>
        
        <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600 mb-8 p-4 bg-gray-50 rounded-xl">
          <span className="flex items-center gap-2"><BookOpen className="w-5 h-5 text-indigo-500" /> {course.lessonIds.length} Lessons</span>
          <span className="flex items-center gap-2"><Clock className="w-5 h-5 text-indigo-500" /> {course.estimatedDuration}</span>
          <span className="flex items-center gap-2"><Zap className="w-5 h-5 text-amber-500" /> {course.totalXP} XP</span>
        </div>

        <Link
          to={startOrContinueHref}
          className="inline-flex items-center gap-2 h-12 px-8 rounded-[12px] bg-gradient-to-r from-indigo-600 to-blue-500 text-sm font-semibold text-white hover:from-indigo-500 hover:to-blue-400 transition-all shadow-md hover:shadow-lg"
        >
          {courseProgress > 0 && courseProgress < 100 ? 'Continue Course' : courseProgress === 100 ? 'Review Course' : 'Start Course'}
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Prerequisites */}
      {course.prerequisites.length > 0 && (
        <div className="mb-12">
          <h2 className="text-xl font-bold text-navy-900 mb-4">Prerequisites</h2>
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2 text-indigo-700 font-medium">
              <GraduationCap className="w-5 h-5" />
              Recommended prior knowledge:
            </div>
            <ul className="space-y-2 ml-8 list-disc text-slate-600 text-sm">
              {course.prerequisites.map((prereq, i) => (
                <li key={i}>{prereq}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Objectives */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-navy-900 mb-6">Course Objectives</h2>
        <div className="bg-indigo-50 rounded-[20px] p-6 border border-indigo-100">
          <ul className="grid sm:grid-cols-2 gap-y-4 gap-x-8">
            {course.objectives.map((obj, i) => (
              <li key={i} className="flex items-start gap-3 text-indigo-900 text-sm font-medium">
                <span className="text-indigo-500 mt-1 flex-shrink-0">•</span>
                {obj}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Curriculum */}
      <div>
        <h2 className="text-xl font-bold text-navy-900 mb-8">Course Curriculum</h2>
        <LearningRoadmap lessons={roadmapLessons} courseId={course.id} />
      </div>
    </div>
  );
}
