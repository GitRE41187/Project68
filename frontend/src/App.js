import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import MainMenu from './components/MainMenu';
import DashboardOverview from './components/dashboard/DashboardOverview';
import Booking from './components/booking/Booking';
import RobotControl from './components/robot/RobotControl';

import History from './components/history/History';
import Help from './components/help/Help';
import AccountSettings from './components/settings/AccountSettings';
import AdminMonitor from './components/admin/AdminMonitor';
import Navigation from './components/common/Navigation';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Admin Route Component (for teachers and engineers only)
const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (user?.userType !== 'teacher' && user?.userType !== 'engineer') {
    return <Navigate to="/main-menu" replace />;
  }
  
  return children;
};

// App Routes Component
const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={
        isAuthenticated ? <Navigate to="/main-menu" replace /> : <Login />
      } />
      <Route path="/register" element={
        isAuthenticated ? <Navigate to="/main-menu" replace /> : <Register />
      } />
      
      {/* Protected Routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <Navigate to="/main-menu" replace />
        </ProtectedRoute>
      } />
      
      <Route path="/main-menu" element={
        <ProtectedRoute>
          <Navigation />
          <MainMenu />
        </ProtectedRoute>
      } />
      
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Navigation />
          <DashboardOverview />
        </ProtectedRoute>
      } />
      
      <Route path="/booking" element={
        <ProtectedRoute>
          <Navigation />
          <Booking />
        </ProtectedRoute>
      } />
      
      <Route path="/robot-control" element={
        <ProtectedRoute>
          <Navigation />
          <RobotControl />
        </ProtectedRoute>
      } />
      
      {/* Camera functionality is now combined with Robot Control */}
      
      <Route path="/history" element={
        <ProtectedRoute>
          <Navigation />
          <History />
        </ProtectedRoute>
      } />
      
      <Route path="/settings" element={
        <ProtectedRoute>
          <Navigation />
          <AccountSettings />
        </ProtectedRoute>
      } />
      
      <Route path="/help" element={
        <ProtectedRoute>
          <Navigation />
          <Help />
        </ProtectedRoute>
      } />
      
      {/* Admin Routes */}
      <Route path="/admin/monitor" element={
        <AdminRoute>
          <Navigation />
          <AdminMonitor />
        </AdminRoute>
      } />
      
      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/main-menu" replace />} />
    </Routes>
  );
};

// Main App Component
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
