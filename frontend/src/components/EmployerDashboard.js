import React from 'react';
import { useNavigate } from 'react-router-dom';

const EmployerDashboard = () => {
    const navigate = useNavigate();
    
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };
    
    return (
        <div style={{ padding: '40px' }}>
            <h1>Employer Dashboard</h1>
            <p>Welcome to your employer dashboard!</p>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default EmployerDashboard;