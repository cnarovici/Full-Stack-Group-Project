import React from 'react';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
    const navigate = useNavigate();
    
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };
    
    return (
        <div style={{ padding: '40px' }}>
            <h1>Student Dashboard</h1>
            <p>Welcome to your dashboard!</p>
            <button onClick={() => navigate('/student/profile')}>View Profile</button>
            <button onClick={handleLogout} style={{ marginLeft: '10px' }}>Logout</button>
        </div>
    );
};

export default StudentDashboard;