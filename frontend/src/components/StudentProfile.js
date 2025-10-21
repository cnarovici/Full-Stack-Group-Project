import React, { useState, useEffect } from 'react';
import { FaFileAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './StudentProfile.css';

const API_BASE_URL = 'http://localhost:5000/api';

const StudentProfile = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [profile, setProfile] = useState(null);
    
    const [savedEvents, setSavedEvents] = useState([
        { name: "Fall Engineer Expo 2025", organizer: "Google Campus 2025", link: "/events/engineer-expo" },
        { name: "Tech Careers Fair 2025", organizer: "UIC Career Center", link: "/events/tech-careers-fair" },
        { name: "AI & Machine Learning Expo", organizer: "Chicago Tech Hub", link: "/events/ai-expo" },
        { name: "Women in STEM Networking", organizer: "W-STEM Org", link: "/events/women-stem" },
        { name: "Startup Job Summit", organizer: "Innovate Chicago", link: "/events/startup-summit" },
    ]);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/');
                return;
            }

            const response = await fetch(`${API_BASE_URL}/profile/student`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch profile');
            }

            setProfile(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (indexToRemove) => {
        setSavedEvents(prev => prev.filter((_, i) => i !== indexToRemove));
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                fontSize: '24px'
            }}>
                Loading...
            </div>
        );
    }

    if (error) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                fontSize: '24px',
                padding: '20px',
                textAlign: 'center'
            }}>
                <p>Error: {error}</p>
                <button 
                    onClick={() => navigate('/student/dashboard')}
                    style={{
                        marginTop: '20px',
                        padding: '12px 24px',
                        background: 'white',
                        color: '#667eea',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: 'pointer'
                    }}
                >
                    Back to Dashboard
                </button>
            </div>
        );
    }

    if (!profile) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                fontSize: '24px'
            }}>
                No profile found
            </div>
        );
    }

    return (
        <div style={{ 
            minHeight: '100vh', 
            backgroundColor: '#f5f7fa',
            padding: '0',
            margin: '0'
        }}>
            <div style={{
                maxWidth: '700px',
                margin: '0 auto',
                padding: '20px 10px'
            }}>
                {/* Profile Header */}
                <div style={{ marginBottom: '20px' }}>
                    <div className="profile-header">
                        <div className="profile-initial-circle">
                            {getInitials(profile.full_name)}
                        </div>
                        <h2 className="profile-name">{profile.full_name}</h2>
                        <div className="personal-details">
                            <p>{profile.major} • {profile.school}</p>
                        </div>
                    </div>
                </div>

                {/* Resume Section */}
                <div className="resume-container">
                    <h3>My Resume</h3>
                    <div className="resume-details">
                        <div className="resume-file-info">
                            <FaFileAlt className="resume-icon" />
                            <span className="resume-filename">
                                {profile.resume_url ? 'Resume Available' : 'No Resume Uploaded'}
                            </span>
                        </div>
                        {profile.resume_url ? (
                            <button
                                className="resume-button"
                                onClick={() => window.open(profile.resume_url, "_blank")}
                            >
                                View Resume
                            </button>
                        ) : (
                            <button
                                className="resume-button"
                                onClick={() => navigate('/student/update-resume')}
                            >
                                Upload Resume
                            </button>
                        )}
                    </div>
                </div>

                {/* Skills Section */}
                <div className="skills-container">
                    <h3>Skills & Interests</h3>
                    <div className="skills-list">
                        {profile.skills && profile.skills.length > 0 ? (
                            profile.skills.map((skill, index) => (
                                <button key={index} className="skill-button">{skill}</button>
                            ))
                        ) : (
                            <p style={{ color: '#666', fontSize: '14px', margin: '0' }}>No skills added yet</p>
                        )}
                    </div>
                </div>

                {/* Job Preferences Section */}
                <div className="skills-container">
                    <h3>Job Preferences</h3>
                    <div className="skills-list">
                        {profile.job_preferences && profile.job_preferences.length > 0 ? (
                            profile.job_preferences.map((pref, index) => (
                                <button key={index} className="skill-button">{pref}</button>
                            ))
                        ) : (
                            <p style={{ color: '#666', fontSize: '14px', margin: '0' }}>No job preferences added yet</p>
                        )}
                    </div>
                </div>

                {/* Saved Events Section */}
                <div className="saved-events-container">
                    <h3>Saved Events</h3>
                    <div className="saved-events-slider">
                        {savedEvents.map((event, index) => (
                            <div key={index} className="event-card">
                                <div className="event-name">{event.name}</div>
                                <div className="event-organizer">{event.organizer}</div>
                                <div className="event-actions">
                                    <button
                                        className="view-btn"
                                        onClick={() => navigate(event.link)}
                                    >
                                        View
                                    </button>
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDelete(index)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="back-button-container">
                    <button 
                        onClick={() => navigate('/student/edit-profile')} 
                        className="edit-profile-button"
                    >
                        Edit Profile
                    </button>
                    <button 
                        onClick={() => navigate('/student/dashboard')} 
                        className="back-button"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StudentProfile;