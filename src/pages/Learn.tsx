import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { LEARNING_PATHS, searchCurriculum } from '../data/curriculum';
import { recommendationService } from '../services/recommendationService';
import { progressService } from '../services/progressService';
import ContinueLearningCard from '../components/learn/ContinueLearningCard';
import LearningPathCard from '../components/learn/LearningPathCard';
import type { SkillLevel } from '../types/learning';
import { Search } from 'lucide-react';

export default function Learn() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  if (!user) return null;

  const progress = progressService.getProgress(user.id);
  const continueLearningData = recommendationService.getContinueLearning(
    progress.completedLessonIds,
    progress.currentLessonId,
    progress.currentCourseId,
    progress.currentPathId
  );

  const recommendedPathInfo = recommendationService.getRecommendedPath(
    user.skillLevel as SkillLevel,
    progress.completedLessonIds
  );

  const recommendations = recommendationService.getRecommendations({
    skillLevel: user.skillLevel as SkillLevel,
    learnerType: user.learnerType,
    goals: user.goals,
    completedLessonIds: progress.completedLessonIds,
    currentPathId: progress.currentPathId
  });

  const searchResults = searchQuery.trim().length > 0 ? searchCurriculum(searchQuery) : null;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-navy-900 mb-2">Learn Quantum Computing</h1>
          <p className="text-slate-500">Build your quantum intuition, one concept at a time.</p>
        </div>
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Search lessons, courses, algorithms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-12 pr-4 bg-gray-50 border border-gray-200 rounded-[12px] text-sm text-navy-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all shadow-sm"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        </form>
      </div>

      {/* Search Results */}
      {searchResults !== null && (
        <div className="mb-16">
          <h2 className="text-xl font-bold text-navy-900 mb-6">Search Results ({searchResults.length})</h2>
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((result) => (
                <div key={`${result.type}-${result.id}`} className="bg-white rounded-card border border-gray-100 shadow-card p-6 flex flex-col hover:shadow-card-hover transition-all">
                  <div className="flex items-center gap-2 mb-3 text-xs font-semibold uppercase tracking-wider text-indigo-600">
                    {result.type}
                  </div>
                  <h3 className="text-lg font-bold text-navy-900 mb-2">{result.title}</h3>
                  <p className="text-sm text-slate-600 mb-6 flex-1 line-clamp-2">{result.description}</p>
                  <button
                    onClick={() => navigate(result.href)}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-700 w-fit"
                  >
                    View Details →
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-card p-10 text-center border border-gray-100">
              <p className="text-slate-500">No results found for "{searchQuery}". Try a different term.</p>
            </div>
          )}
        </div>
      )}

      {!searchResults && (
        <>
          {/* Continue Learning */}
          <div className="mb-16">
            <ContinueLearningCard
              continueLearning={continueLearningData}
              recommendedPathId={recommendedPathInfo.pathId}
            />
          </div>

          {/* Recommended For You */}
          {recommendations.length > 0 && (
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-navy-900 mb-2">Recommended For You</h2>
              <p className="text-slate-500 mb-8">Personalized based on your goals and skill level.</p>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {recommendations.map((rec) => {
                  const path = LEARNING_PATHS.find(p => p.id === rec.pathId);
                  if (!path) return null;
                  const completedInPath = path.courseIds.flatMap(cId => {
                     // Since we only have 1 course per path in our mock data
                     // In real app, we'd look up lessons for all courses in path
                     return getCourseLessonIdsQuick(cId);
                  }).filter(id => progress.completedLessonIds.includes(id)).length;
                  const pathProgress = Math.round((completedInPath / path.lessonCount) * 100);

                  return (
                    <LearningPathCard
                      key={rec.pathId}
                      path={path}
                      progress={pathProgress}
                      completedLessons={completedInPath}
                      isRecommended={true}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* All Learning Paths */}
          <div>
            <h2 className="text-2xl font-bold text-navy-900 mb-8">All Learning Paths</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {LEARNING_PATHS.map((path) => {
                const completedInPath = path.courseIds.flatMap(cId => getCourseLessonIdsQuick(cId)).filter(id => progress.completedLessonIds.includes(id)).length;
                const pathProgress = Math.round((completedInPath / path.lessonCount) * 100);
                
                return (
                  <LearningPathCard
                    key={path.id}
                    path={path}
                    progress={pathProgress}
                    completedLessons={completedInPath}
                  />
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Helper for the component
function getCourseLessonIdsQuick(courseId: string): string[] {
  // Hardcoded map for quick lookup in UI
  if (courseId === 'quantum-foundations') return ['qf-what-is-quantum-computing', 'qf-understanding-qubits', 'qf-superposition', 'qf-quantum-measurement', 'qf-quantum-gates', 'qf-build-first-circuit'];
  if (courseId === 'quantum-circuit-mastery') return ['qcm-circuit-fundamentals', 'qcm-single-qubit-gates', 'qcm-multi-qubit-gates', 'qcm-cnot-gate', 'qcm-quantum-entanglement', 'qcm-bell-states', 'qcm-quantum-teleportation'];
  if (courseId === 'quantum-algorithms') return ['qa-intro-quantum-algorithms', 'qa-deutsch-algorithm', 'qa-deutsch-jozsa-algorithm', 'qa-grovers-algorithm', 'qa-quantum-fourier-transform', 'qa-shors-algorithm'];
  return [];
}
