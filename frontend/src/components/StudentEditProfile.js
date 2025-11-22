import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './StudentProfile.css';
import { FaFileAlt, FaEdit } from 'react-icons/fa';

const API_BASE_URL = 'http://localhost:5001/api';

const StudentProfile = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [savedEvents, setSavedEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
        fetchSavedEvents();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/profile/student`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setProfile(data);
            }
        } catch (err) {
            console.error('Error fetching profile:', err);
        } finally {
            setLoading(false);
        }
    };

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
                setSavedEvents(data.slice(0, 3)); // Show only first 3
            } else {
                console.error('❌ Failed to fetch saved events');
            }
        } catch (err) {
            console.error('Error fetching saved events:', err);
        }
    };

    const handleUnregister = async (eventId) => {
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
                // Refresh the saved events
                fetchSavedEvents();
            } else {
                alert('Failed to unregister from event');
            }
        } catch (err) {
            console.error('Error unregistering:', err);
            alert('Failed to unregister from event');
        }
    };

    const handleViewEvent = (eventId) => {
        navigate(`/student/events/${eventId}`);
    };

    if (loading) {
        return (
            <div className="profile-page">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading profile...</p>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="profile-page">
                <div className="error-state">
                    <p>Profile not found</p>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-page">
            <div className="profile-container">
                {/* Profile Header */}
                <div className="profile-header">
                    <div className="student-avatar">
                        {profile.full_name ? profile.full_name.charAt(0).toUpperCase() : 'S'}
                    </div>
                    <div className="student-info">
                        <h1>{profile.full_name || 'Student'}</h1>
                        <p className="school">{profile.school || 'University'}</p>
                        <p className="major">{profile.major || 'Major'}</p>
                    </div>
                </div>

                {/* Resume Section */}
                <div className="profile-section">
                    <h2>My Resume</h2>
                    <div className="resume-box">
                        <FaFileAlt className="resume-icon" />
                        <p>{profile.resume_url ? 'Resume Uploaded' : 'No Resume Uploaded'}</p>
                        <button 
                            className="upload-resume-btn"
                            onClick={() => navigate('/student/resume')}
                        >
                            {profile.resume_url ? 'Update Resume' : 'Upload Resume'}
                        </button>
                    </div>
                </div>

                {/* Skills & Interests */}
                <div className="profile-section">
                    <h2>Skills & Interests</h2>
                    <div className="tags-container">
                        {profile.skills && profile.skills.length > 0 ? (
                            profile.skills.map((skill, index) => (
                                <span key={index} className="tag">{skill}</span>
                            ))
                        ) : (
                            <p className="no-data">No skills added yet</p>
                        )}
                    </div>
                </div>

                {/* Job Preferences */}
                <div className="profile-section">
                    <h2>Job Preferences</h2>
                    <div className="tags-container">
                        {profile.job_preferences && profile.job_preferences.length > 0 ? (
                            profile.job_preferences.map((pref, index) => (
                                <span key={index} className="tag">{pref}</span>
                            ))
                        ) : (
                            <p className="no-data">No job preferences added yet</p>
                        )}
                    </div>
                </div>

                {/* Saved Events */}
                <div className="profile-section">
                    <div className="section-header">
                        <h2>Saved Events</h2>
                        {savedEvents.length > 0 && (
                            <button 
                                className="view-all-btn"
                                onClick={() => navigate('/student/saved')}
                            >
                                View All
                            </button>
                        )}
                    </div>
                    
                    {savedEvents.length > 0 ? (
                        <div className="saved-events-preview">
                            {savedEvents.map((event) => (
                                <div key={event.id} className="event-preview-card">
                                    <h3>{event.title}</h3>
                                    <p className="event-company">{event.employer?.company_name || 'Company'}</p>
                                    <div className="event-preview-actions">
                                        <button 
                                            className="view-btn"
                                            onClick={() => handleViewEvent(event.id)}
                                        >
                                            View
                                        </button>
                                        <button 
                                            className="remove-btn"
                                            onClick={() => handleUnregister(event.id)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="no-data">No saved events yet</p>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="profile-actions">
                    <button 
                        className="edit-profile-btn"
                        onClick={() => navigate('/student/profile/edit')}
                    >
                        <FaEdit /> Edit Profile
                    </button>
                    <button 
                        className="back-dashboard-btn"
                        onClick={() => navigate('/student/dashboard')}
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StudentProfile;