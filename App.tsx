import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import { Splash } from './pages/Splash';
import { Onboarding } from './pages/intro/Onboarding';
import { PermissionsFlow } from './pages/intro/PermissionsFlow';
import { Welcome } from './pages/auth/Welcome';
import { Login } from './pages/auth/Login';
import { Signup } from './pages/auth/Signup';
import { ClientHome } from './pages/ClientHome';
import { RequestFlow } from './pages/RequestFlow';
import { Matching } from './pages/Matching';
import { History } from './pages/History';
import { Profile } from './pages/Profile';
import { ArtisanDashboard } from './pages/ArtisanDashboard';
import { JobProposal } from './pages/JobProposal';

// Components
import { NavBar } from './components/NavBar';
import { UserRole } from './types';

// Wrapper to handle initial redirect logic based on local storage
const InitialRedirect: React.FC = () => {
  const introDone = localStorage.getItem('zendo_intro_done');
  
  if (!introDone) {
    return <Navigate to="/onboarding" replace />;
  }
  return <Navigate to="/welcome" replace />;
};

function AppContent() {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <Splash />;
  }

  // Determine if we should show the navbar
  // Hide navbar on auth routes, onboarding, and full screen flows
  const hideNavBarRoutes = ['/auth', '/welcome', '/onboarding', '/permissions', '/matching', '/job-proposal'];
  const isFullScreen = hideNavBarRoutes.some(path => location.pathname.includes(path));
  const showNavBar = user && !isFullScreen;

  // Determine Main Screen based on Role
  const HomeElement = user?.role === UserRole.ARTISAN ? <ArtisanDashboard /> : <ClientHome />;

  return (
    <div className="max-w-md mx-auto min-h-screen bg-black shadow-2xl overflow-hidden relative font-sans text-slate-200">
      <Routes>
        {/* Intro Flow (First Launch) */}
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/permissions" element={<PermissionsFlow />} />

        {/* Public Auth Routes */}
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Signup />} />

        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute>{HomeElement}</ProtectedRoute>} />
        
        {/* Client Routes */}
        <Route path="/request/:serviceId" element={<ProtectedRoute allowedRoles={[UserRole.CLIENT]}><RequestFlow /></ProtectedRoute>} />
        <Route path="/matching" element={<ProtectedRoute allowedRoles={[UserRole.CLIENT]}><Matching /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute allowedRoles={[UserRole.CLIENT]}><History /></ProtectedRoute>} />

        {/* Artisan Routes */}
        <Route path="/job-proposal" element={<ProtectedRoute allowedRoles={[UserRole.ARTISAN]}><JobProposal /></ProtectedRoute>} />

        {/* Shared Routes */}
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />

        {/* Root Fallback - Decides where to go if unauthenticated */}
        <Route path="*" element={
          user ? <Navigate to="/" replace /> : <InitialRedirect />
        } />
      </Routes>

      {showNavBar && <NavBar />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <HashRouter>
          <AppContent />
        </HashRouter>
      </DataProvider>
    </AuthProvider>
  );
}