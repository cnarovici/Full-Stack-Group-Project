import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import LoadingScreen from './components/LoadingScreen';
import LoginPage from './components/LoginPage';
import StudentProfile from './components/StudentProfile';
import EmployerDashboard from './components/EmployerDashboard';
import StudentDashboard from './components/StudentDashboard';
import EventDetail from './components/EventDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoadingScreen />} />
        <Route path="/student/auth" element={<LoginPage userType="student" />} />
        <Route path="/employer/auth" element={<LoginPage userType="employer" />} />
        <Route path="/student/dashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
        <Route path="/student/profile" element={<ProtectedRoute><StudentProfile /></ProtectedRoute>} />
        <Route path="/employer/dashboard" element={<ProtectedRoute><EmployerDashboard /></ProtectedRoute>} />
        <Route path="/event/detail" element={<EventDetail />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/" />;
  }
  return children;
}

export default App;
