import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { StoryProvider } from './context/StoryContext';

// Layouts
import { PublicLayout } from './components/layout/PublicLayout';
import { AppLayout } from './components/layout/AppLayout';

// Public pages
import { LandingPage } from './features/landing/LandingPage';
import { FeaturesPage } from './features/landing/FeaturesPage';
import { AboutPage } from './features/landing/AboutPage';
import { PrivacyPage } from './features/landing/PrivacyPage';
import { TermsPage } from './features/landing/TermsPage';

// Auth pages
import { LoginPage } from './features/auth/LoginPage';
import { RegisterPage } from './features/auth/RegisterPage';
import { ForgotPasswordPage } from './features/auth/ForgotPasswordPage';

// App pages
import { DashboardPage } from './features/dashboard/DashboardPage';
import { StoryListPage } from './features/stories/StoryListPage';
import { StoryNewPage } from './features/stories/StoryNewPage';
import { StoryDetailPage } from './features/stories/StoryDetailPage';
import { ChapterEditorPage } from './features/editor/ChapterEditorPage';
import { CharacterStudioPage } from './features/characters/CharacterStudioPage';
import { MemoryHubPage } from './features/memory/MemoryHubPage';
import { BranchExplorerPage } from './features/branches/BranchExplorerPage';
import { AIAssistantPage } from './features/assistant/AIAssistantPage';
import { InnovationsPage } from './features/innovations/InnovationsPage';
import { SettingsPage } from './features/settings/SettingsPage';

// Protected Route Guard
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-mono text-text-muted">Loading Story Universe...</span>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <StoryProvider>
          <Routes>
            {/* Public Marketing & Legal Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/features" element={<FeaturesPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            </Route>

            {/* Protected Workspace Routes */}
            <Route
              path="/app"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardPage />} />
              <Route path="stories" element={<StoryListPage />} />
              <Route path="stories/new" element={<StoryNewPage />} />
              <Route path="stories/:storyId" element={<StoryDetailPage />} />
              <Route path="stories/:storyId/chapters/:chapterId" element={<ChapterEditorPage />} />
              <Route path="characters" element={<CharacterStudioPage />} />
              <Route path="memory" element={<MemoryHubPage />} />
              <Route path="branches" element={<BranchExplorerPage />} />
              <Route path="assistant" element={<AIAssistantPage />} />
              <Route path="innovations" element={<InnovationsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </StoryProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
