import type { SearchResult, LearningPathData, Course } from '../../types/curriculum';
import { LEARNING_PATHS } from './paths';
import { COURSES } from './courses';
import { ACHIEVEMENTS } from './achievements';
import { ALL_LESSONS, getLessonById, getLessonsForCourse } from './lessons';

export {
  LEARNING_PATHS,
  COURSES,
  ACHIEVEMENTS,
  ALL_LESSONS
};

export function getPathById(id: string): LearningPathData | undefined {
  return LEARNING_PATHS.find(path => path.id === id);
}

export function getCourseById(id: string): Course | undefined {
  return COURSES.find(course => course.id === id);
}

export { getLessonById, getLessonsForCourse };

export function getPathForCourse(courseId: string): LearningPathData | undefined {
  const course = getCourseById(courseId);
  if (!course) return undefined;
  return getPathById(course.pathId);
}

export function searchCurriculum(query: string): SearchResult[] {
  const normalizedQuery = query.toLowerCase().trim();
  if (!normalizedQuery) return [];

  const results: SearchResult[] = [];

  // Search paths
  LEARNING_PATHS.forEach(path => {
    if (
      path.title.toLowerCase().includes(normalizedQuery) ||
      path.description.toLowerCase().includes(normalizedQuery)
    ) {
      results.push({
        type: 'path',
        id: path.id,
        title: path.title,
        description: path.description,
        difficulty: path.difficulty,
        pathId: path.id,
        href: `/learn/path/${path.id}`
      });
    }
  });

  // Search courses
  COURSES.forEach(course => {
    if (
      course.title.toLowerCase().includes(normalizedQuery) ||
      course.description.toLowerCase().includes(normalizedQuery)
    ) {
      results.push({
        type: 'course',
        id: course.id,
        title: course.title,
        description: course.description,
        difficulty: course.difficulty,
        pathId: course.pathId,
        courseId: course.id,
        href: `/learn/course/${course.id}`
      });
    }
  });

  // Search lessons
  ALL_LESSONS.forEach(lesson => {
    if (
      lesson.title.toLowerCase().includes(normalizedQuery) ||
      lesson.description.toLowerCase().includes(normalizedQuery) ||
      lesson.topic.toLowerCase().includes(normalizedQuery)
    ) {
      results.push({
        type: 'lesson',
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        difficulty: lesson.difficulty,
        pathId: lesson.pathId,
        courseId: lesson.courseId,
        href: `/learn/course/${lesson.courseId}/lesson/${lesson.id}`
      });
    }
  });

  return results;
}

