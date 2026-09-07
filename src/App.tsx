import { Routes, Route } from 'react-router-dom';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import { ProtectedRoute } from './auth/ProtectedRoute';
import { PublicRoute } from './auth/PublicRoute';
import { GlobalAITutor } from './components/GlobalAITutor';

// Pages
import Home from './pages/Home';
import Learn from './pages/Learn';
import LearningPathPage from './pages/LearningPathPage';
import CoursePage from './pages/CoursePage';
import LessonPage from './pages/LessonPage';
import { QuantumLab } from './pages/QuantumLab';
import { Experiments } from './pages/Experiments';
import Algorithms from './pages/Algorithms';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Onboarding from './pages/Onboarding';
import Profile from './pages/Profile';

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1 pt-16 lg:pt-[72px]">
        {children}
      </main>
      <Footer />
      <GlobalAITutor />
    </div>
  );
}

function LessonAppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1 pt-16 lg:pt-[72px]">
        {children}
      </main>
      <GlobalAITutor />
      {/* Intentionally omitting footer for the lesson player */}
    </div>
  );
}

function AuthPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      {children}
    </div>
  );
}

export default function App() {
  // Initialize Lenis smooth scroll globally
  useSmoothScroll();

  return (
    <Routes>
      {/* Auth pages — no Navbar/Footer, split-screen layout handles its own chrome */}
      <Route path="/login" element={
        <AuthPageLayout>
          <PublicRoute><Login /></PublicRoute>
        </AuthPageLayout>
      } />
      <Route path="/signup" element={
        <AuthPageLayout>
          <PublicRoute><Signup /></PublicRoute>
        </AuthPageLayout>
      } />
      <Route path="/forgot-password" element={
        <AuthPageLayout><ForgotPassword /></AuthPageLayout>
      } />

      {/* Onboarding — full-page immersive experience, no Navbar/Footer */}
      <Route path="/onboarding" element={
        <ProtectedRoute><Onboarding /></ProtectedRoute>
      } />

      {/* Public routes with Navbar/Footer */}
      <Route path="/" element={<AppLayout><Home /></AppLayout>} />
      <Route path="/about" element={<AppLayout><About /></AppLayout>} />

      {/* Protected routes with Navbar/Footer */}
      <Route path="/learn" element={
        <AppLayout><ProtectedRoute><Learn /></ProtectedRoute></AppLayout>
      } />
      <Route path="/learn/path/:pathId" element={
        <AppLayout><ProtectedRoute><LearningPathPage /></ProtectedRoute></AppLayout>
      } />
      <Route path="/learn/course/:courseId" element={
        <AppLayout><ProtectedRoute><CoursePage /></ProtectedRoute></AppLayout>
      } />
      
      {/* Lesson route (No footer for full-height experience) */}
      <Route path="/learn/course/:courseId/lesson/:lessonId" element={
        <LessonAppLayout><ProtectedRoute><LessonPage /></ProtectedRoute></LessonAppLayout>
      } />

      <Route path="/quantum-lab" element={
        <AppLayout><ProtectedRoute><QuantumLab /></ProtectedRoute></AppLayout>
      } />
      <Route path="/quantum-lab/experiment/:experimentId" element={
        <AppLayout><ProtectedRoute><QuantumLab /></ProtectedRoute></AppLayout>
      } />
      <Route path="/experiments" element={
        <AppLayout><ProtectedRoute><Experiments /></ProtectedRoute></AppLayout>
      } />
      <Route path="/algorithms" element={
        <AppLayout><ProtectedRoute><Algorithms /></ProtectedRoute></AppLayout>
      } />
      <Route path="/dashboard" element={
        <AppLayout><ProtectedRoute><Dashboard /></ProtectedRoute></AppLayout>
      } />
      <Route path="/profile" element={
        <AppLayout><ProtectedRoute><Profile /></ProtectedRoute></AppLayout>
      } />
    </Routes>
  );
}
