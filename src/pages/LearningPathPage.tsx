import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { getPathById, getCourseById, getLessonsForCourse } from '../data/curriculum';
import { progressService } from '../services/progressService';
import Breadcrumb from '../components/Breadcrumb';
import LearningRoadmap from '../components/learn/LearningRoadmap';
import { Atom, Cpu, Brain, Clock, Zap, BookOpen, ChevronRight } from 'lucide-react';
import type { LessonState } from '../types/curriculum';

export default function LearningPathPage() {
  const { pathId } = useParams<{ pathId: string }>();
  const { user } = useAuth();

  if (!user || !pathId) return null;

  const path = getPathById(pathId);
  const course = path && path.courseIds.length > 0 ? getCourseById(path.courseIds[0]) : null;

  if (!path || !course) {
    return (
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-2xl font-bold text-navy-900 mb-4">Learning Path Not Found</h1>
        <p className="text-slate-500 mb-8">The path you're looking for doesn't exist.</p>
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
    { label: path.title }
  ];

  const getIcon = (name: string) => {
    switch (name) {
      case 'Atom': return <Atom className="w-8 h-8" />;
      case 'Cpu': return <Cpu className="w-8 h-8" />;
      case 'Brain': return <Brain className="w-8 h-8" />;
      default: return <Atom className="w-8 h-8" />;
    }
  };

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

      {/* Path Header */}
      <div className="bg-white rounded-card border border-gray-100 shadow-card p-6 md:p-10 mb-10">
        <div className="flex flex-col md:flex-row gap-6 md:items-start">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
            {getIcon(path.icon)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${difficultyColors[path.difficulty]} capitalize`}>
                {path.difficulty}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-navy-900 mb-3">{path.title}</h1>
            <p className="text-slate-600 mb-6">{path.description}</p>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-8">
              <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4" /> {path.lessonCount} Lessons</span>
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {path.estimatedDuration}</span>
              <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-amber-500" /> {path.totalXP} XP</span>
            </div>

            <Link
              to={startOrContinueHref}
              className="inline-flex items-center gap-2 h-12 px-8 rounded-[12px] bg-gradient-to-r from-indigo-600 to-blue-500 text-sm font-semibold text-white hover:from-indigo-500 hover:to-blue-400 transition-all shadow-md hover:shadow-lg"
            >
              {courseProgress > 0 && courseProgress < 100 ? 'Continue Learning' : courseProgress === 100 ? 'Review Path' : 'Start Path'}
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Objectives */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-navy-900 mb-6">What You'll Learn</h2>
        <div className="bg-indigo-50 rounded-[20px] p-6 border border-indigo-100">
          <ul className="grid sm:grid-cols-2 gap-y-4 gap-x-8">
            {path.objectives.map((obj, i) => (
              <li key={i} className="flex items-start gap-3 text-indigo-900 text-sm font-medium">
                <span className="text-indigo-500 mt-1 flex-shrink-0">•</span>
                {obj}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Roadmap */}
      <div>
        <h2 className="text-xl font-bold text-navy-900 mb-8">Learning Roadmap</h2>
        <LearningRoadmap lessons={roadmapLessons} courseId={course.id} />
      </div>
    </div>
  );
}
