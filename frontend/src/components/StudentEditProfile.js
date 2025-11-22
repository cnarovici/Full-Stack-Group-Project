import React, { useState, useEffect } from 'react';
import { FaFileAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './StudentProfile.css';

const API_BASE_URL = 'http://localhost:5001/api';

const StudentProfile = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [profile, setProfile] = useState(null);
    const [savedEvents, setSavedEvents] = useState([]); // ✅ NOW DYNAMIC

    useEffect(() => {
        fetchProfile();
        fetchSavedEvents(); // ✅ ADD THIS
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

    // ✅ ADD THIS FUNCTION
    const fetchSavedEvents = async () => {
        try {
            const token = localStorage.getItem('token');
            console.log('📥 Fetching saved events for profile...');
            
            const response = await fetch(`${API_BASE_URL}/events/rsvp`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log('✅ Saved events:', data);
                setSavedEvents(data.slice(0, 5)); // Show first 5
            } else {
                console.error('❌ Failed to fetch saved events');
            }
        } catch (err) {
            console.error('Error fetching saved events:', err);
        }
    };

    // ✅ ADD THIS FUNCTION
    const handleDelete = async (eventId) => {
        if (!window.confirm('Are you sure you want to unregister from this event?')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/events/${eventId}/rsvp`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                console.log('✅ Unregistered successfully');
                // Refresh saved events
                fetchSavedEvents();
            } else {
                alert('Failed to unregister from event');
            }
        } catch (err) {
            console.error('Error unregistering:', err);
            alert('Failed to unregister from event');
        }
    };

    // ✅ ADD THIS FUNCTION
    const handleViewEvent = (eventId) => {
        navigate(`/student/events/${eventId}`);
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
                                onClick={() => navigate('/student/resume')}
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

                {/* Saved Events Section - NOW DYNAMIC */}
                <div className="saved-events-container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 style={{ margin: 0 }}>Saved Events</h3>
                        {savedEvents.length > 0 && (
                            <button
                                onClick={() => navigate('/student/saved')}
                                style={{
                                    padding: '8px 16px',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                }}
                            >
                                View All
                            </button>
                        )}
                    </div>

                    {savedEvents.length > 0 ? (
                        <div className="saved-events-slider">
                            {savedEvents.map((event) => (
                                <div key={event.id} className="event-card">
                                    <div className="event-name">{event.title}</div>
                                    <div className="event-organizer">{event.employer?.company_name || 'Company'}</div>
                                    <div className="event-actions">
                                        <button
                                            className="view-btn"
                                            onClick={() => handleViewEvent(event.id)}
                                        >
                                            View
                                        </button>
                                        <button
                                            className="delete-btn"
                                            onClick={() => handleDelete(event.id)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p style={{ color: '#666', fontSize: '14px', textAlign: 'center', margin: '20px 0' }}>
                            No saved events yet. Register for events to see them here!
                        </p>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="back-button-container">
                    <button 
                        onClick={() => navigate('/student/profile/edit')} 
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