import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import LoadingScreen from './components/LoadingScreen';
import LoginPage from './components/LoginPage';
import StudentProfile from './components/StudentProfile';
import StudentEditProfile from './components/StudentEditProfile';
import StudentUpdateResume from './components/StudentUpdateResume';
import EmployerProfile from './components/EmployerProfile';
import EmployerEditProfile from './components/EmployerEditProfile';
import EmployerDashboard from './components/EmployerDashboard';
import StudentDashboard from './components/StudentDashboard';
import EventSearchPage from './components/EventSearchPage'; // ✅ ADD THIS LINE
import EmployerPostEvents from './components/EmployerPostEvents';   // Add this line for the PostEvents

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoadingScreen />} />
        <Route path="/student/auth" element={<LoginPage userType="student" />} />
        <Route path="/employer/auth" element={<LoginPage userType="employer" />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/profile" element={<StudentProfile />} />
        <Route path="/student/edit-profile" element={<StudentEditProfile />} />
        <Route path="/student/update-resume" element={<StudentUpdateResume />} />
        <Route path="/student/browse-events" element={<EventSearchPage />} />
        <Route path="/employer/dashboard" element={<EmployerDashboard />} />
        <Route path="/employer/profile" element={<EmployerProfile />} />
        <Route path="/employer/edit-profile" element={<EmployerEditProfile />} />
        <Route path="/employer/post-event" element={<EmployerPostEvents />} />         
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;