
import { Toaster } from "@/components/ui/toaster";
import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import Index from "./pages/Index";
import TasksPage from "./pages/TasksPage";
import TimerPage from "./pages/TimerPage";
import NotesPage from "./pages/NotesPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import SchedulerPage from "./pages/SchedulerPage";
import TeamPage from "./pages/TeamPage";
import NotificationsPage from "./pages/NotificationsPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import TermsPage from "./pages/TermsPage";
import AuthPage from "./pages/AuthPage";
import FeedbackPage from "./pages/FeedbackPage";
import HelpPage from "./pages/HelpPage";
import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound";
import Layout from "./components/layout/Layout";
import MainLayout from "./components/layout/MainLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import TestsPage from "./pages/TestsPage";
import TestAnalysisPage from "@/components/tests/TestAnalysisPage";
import EditTestPage from "@/components/tests/EditTestPage";
import ProductivityPage from "./pages/ProductivityPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  // Apply theme on app load
  useEffect(() => {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      if (settings.theme) {
        if (settings.theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else if (settings.theme === 'light') {
          document.documentElement.classList.remove('dark');
        } else if (settings.theme === 'system') {
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          if (prefersDark) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
      }
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Layout><Index /></Layout>} />
        <Route path="/about" element={<Layout><AboutPage /></Layout>} />
        <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
        <Route path="/terms" element={<Layout><TermsPage /></Layout>} />
        <Route path="/auth" element={<Layout showSidebar={false}><AuthPage /></Layout>} />
        <Route path="/sign-in" element={<Layout showSidebar={false}><AuthPage /></Layout>} />
        <Route path="/help" element={<Layout><HelpPage /></Layout>} />
        
        {/* Protected routes */}
        <Route path="/home" element={
          <ProtectedRoute>
            <MainLayout>
              <HomePage />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/tasks" element={
          <ProtectedRoute>
            <MainLayout>
              <TasksPage />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/timer" element={
          <ProtectedRoute>
            <MainLayout>
              <TimerPage />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/notes" element={
          <ProtectedRoute>
            <MainLayout>
              <NotesPage />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/tests" element={<MainLayout><TestsPage /></MainLayout>} />
        <Route path="/tests/analysis/:testId" element={<MainLayout><TestAnalysisPage /></MainLayout>} />
        <Route path="/tests/edit/:testId" element={<MainLayout><EditTestPage /></MainLayout>} />
        <Route path="/analytics" element={
          <ProtectedRoute>
            <MainLayout>
              <AnalyticsPage />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/productivity" element={
          <ProtectedRoute>
            <MainLayout>
              <ProductivityPage />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <MainLayout>
              <SettingsPage />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <MainLayout>
              <ProfilePage />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/scheduler" element={
          <ProtectedRoute>
            <MainLayout>
              <SchedulerPage />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/team" element={
          <ProtectedRoute>
            <MainLayout>
              <TeamPage />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/notifications" element={
          <ProtectedRoute>
            <MainLayout>
              <NotificationsPage />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/feedback" element={
          <ProtectedRoute>
            <MainLayout>
              <FeedbackPage />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        {/* Catch all route for 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
