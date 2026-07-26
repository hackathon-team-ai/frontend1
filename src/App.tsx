import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { AppLayout } from './components/layout/AppLayout';

import { DashboardPage } from './pages/DashboardPage';
import { ChatbotPage } from './pages/ChatbotPage';
import { DiseaseDetectionPage } from './pages/DiseaseDetectionPage';
import { KnowledgeBasePage } from './pages/KnowledgeBasePage';
import { CropAdvisorPage } from './pages/CropAdvisorPage';
import { WeatherPage } from './pages/WeatherPage';
import { SchemesPage } from './pages/SchemesPage';
import { CalendarPage } from './pages/CalendarPage';
import { AdminPage } from './pages/AdminPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

const queryClient = new QueryClient();

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-darkbg-900 flex items-center justify-center text-agri-400 font-bold">
        Loading KrishiMitra AI...
      </div>
    );
  }
  return user ? <AppLayout>{children}</AppLayout> : <Navigate to="/login" replace />;
};

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
              <Route path="/chat" element={<ProtectedRoute><ChatbotPage /></ProtectedRoute>} />
              <Route path="/disease" element={<ProtectedRoute><DiseaseDetectionPage /></ProtectedRoute>} />
              <Route path="/rag" element={<ProtectedRoute><KnowledgeBasePage /></ProtectedRoute>} />
              <Route path="/crop-advisor" element={<ProtectedRoute><CropAdvisorPage /></ProtectedRoute>} />
              <Route path="/weather" element={<ProtectedRoute><WeatherPage /></ProtectedRoute>} />
              <Route path="/schemes" element={<ProtectedRoute><SchemesPage /></ProtectedRoute>} />
              <Route path="/calendar" element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
};

export default App;
