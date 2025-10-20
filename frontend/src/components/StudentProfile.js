import React from 'react';
import { useNavigate } from 'react-router-dom';

const StudentProfile = () => {
    const navigate = useNavigate();
    
    return (
        <div style={{ padding: '40px', textAlign: 'center' }}>
            <h1>Student Profile</h1>
            <p>Profile page coming soon...</p>
            <button onClick={() => navigate('/student/dashboard')}>
                Back to Dashboard
            </button>
        </div>
    );
};

export default StudentProfile;