
import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Layout from '@/components/layout/Layout';
import MainLayout from '@/components/layout/MainLayout';

// Pages
import Index from '@/pages/Index';
import HomePage from '@/pages/HomePage';
import AboutPage from '@/pages/AboutPage';
import AuthPage from '@/pages/AuthPage';
import ContactPage from '@/pages/ContactPage';
import FeedbackPage from '@/pages/FeedbackPage';
import NotesPage from '@/pages/NotesPage';
import NotificationsPage from '@/pages/NotificationsPage';
import ProfilePage from '@/pages/ProfilePage';
import SchedulerPage from '@/pages/SchedulerPage';
import SettingsPage from '@/pages/SettingsPage';
import TasksPage from '@/pages/TasksPage';
import TeamPage from '@/pages/TeamPage';
import TermsPage from '@/pages/TermsPage';
import TimerPage from '@/pages/TimerPage';
import AnalyticsPage from '@/pages/AnalyticsPage';
import NotFound from '@/pages/NotFound';
import HelpPage from '@/pages/HelpPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Index /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'feedback', element: <FeedbackPage /> },
      { path: 'terms', element: <TermsPage /> },
      { path: 'auth', element: <AuthPage /> },
    ],
    errorElement: <NotFound />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout showSidebar={true}>
          {/* Child routes will be rendered here */}
        </Layout>
      </ProtectedRoute>
    ),
    children: [
      { path: 'home', element: <HomePage /> },
      { path: 'notes', element: <NotesPage /> },
      { path: 'notifications', element: <NotificationsPage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'scheduler', element: <SchedulerPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'tasks', element: <TasksPage /> },
      { path: 'team', element: <TeamPage /> },
      { path: 'timer', element: <TimerPage /> },
      { path: 'analytics', element: <AnalyticsPage /> },
      { path: 'help', element: <HelpPage /> },
    ],
  },
]);

export default router;
