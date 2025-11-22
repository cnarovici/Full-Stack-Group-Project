import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Auth Pages
import LoadingScreen from './components/LoadingScreen';
import LoginPage from './components/LoginPage';

// Student Pages
import StudentDashboard from './components/StudentDashboard';
import StudentProfile from './components/StudentProfile';
import StudentEditProfile from './components/StudentEditProfile';
import StudentUpdateResume from './components/StudentUpdateResume';
import EventSearchPage from './components/EventSearchPage';
import BrowseEvents from './components/BrowseEvents';
import ViewEvent from './components/ViewEvent';
import SavedJobs from './components/SavedJobs';
import ConversationList from './components/ConversationList';
import ConversationThread from './components/ConversationThread';

// Employer Pages
import EmployerDashboard from './components/EmployerDashboard';
import EmployerProfile from './components/EmployerProfile';
import EmployerEditProfile from './components/EmployerEditProfile';
import EmployerPostEvents from './components/EmployerPostEvents';
import EventApplicants from './components/EventApplicants';

import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children, requiredType }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    console.log('❌ No token found, redirecting to login');
    return <Navigate to="/" replace />;
  }

  // Parse user safely
  let user = {};
  try {
    const userStr = localStorage.getItem('user');
    user = userStr ? JSON.parse(userStr) : {};
  } catch (e) {
    console.error('Error parsing user:', e);
    return <Navigate to="/" replace />;
  }

  console.log('✅ User:', user);
  console.log('🔒 Required type:', requiredType);

  if (requiredType && user.user_type !== requiredType) {
    console.log('❌ Wrong user type, redirecting');
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LoadingScreen />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/student/auth" element={<LoginPage />} />
          <Route path="/employer/auth" element={<LoginPage />} />

          {/* Student Routes */}
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute requiredType="student">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/profile"
            element={
              <ProtectedRoute requiredType="student">
                <StudentProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/profile/edit"
            element={
              <ProtectedRoute requiredType="student">
                <StudentEditProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/resume"
            element={
              <ProtectedRoute requiredType="student">
                <StudentUpdateResume />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/search"
            element={
              <ProtectedRoute requiredType="student">
                <EventSearchPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/browse"
            element={
              <ProtectedRoute requiredType="student">
                <BrowseEvents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/events/:eventId"
            element={
              <ProtectedRoute requiredType="student">
                <ViewEvent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/saved"
            element={
              <ProtectedRoute requiredType="student">
                <SavedJobs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/messages"
            element={
              <ProtectedRoute requiredType="student">
                <ConversationList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/conversation/:conversationId"
            element={
              <ProtectedRoute requiredType="student">
                <ConversationThread />
              </ProtectedRoute>
            }
          />

          {/* Employer Routes */}
          <Route
            path="/employer/dashboard"
            element={
              <ProtectedRoute requiredType="employer">
                <EmployerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employer/profile"
            element={
              <ProtectedRoute requiredType="employer">
                <EmployerProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employer/profile/edit"
            element={
              <ProtectedRoute requiredType="employer">
                <EmployerEditProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employer/events/new"
            element={
              <ProtectedRoute requiredType="employer">
                <EmployerPostEvents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employer/messages"
            element={
              <ProtectedRoute requiredType="employer">
                <ConversationList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employer/conversation/:conversationId"
            element={
              <ProtectedRoute requiredType="employer">
                <ConversationThread />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employer/events/:eventId/applicants"
            element={
              <ProtectedRoute requiredType="employer">
                <EventApplicants />
              </ProtectedRoute>
            }
          />

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;