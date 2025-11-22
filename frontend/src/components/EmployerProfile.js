import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './EmployerProfile.css';
import { FaBuilding, FaGlobe, FaMapMarkerAlt, FaCalendarAlt, FaUsers } from 'react-icons/fa';

const API_BASE_URL = 'http://localhost:5001/api';

const EmployerProfile = () => {
    const navigate = useNavigate();
    const { employerId } = useParams();
    const [profile, setProfile] = useState(null);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isOwnProfile, setIsOwnProfile] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, [employerId]);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const user = JSON.parse(localStorage.getItem('user') || '{}');

            let url;
            if (employerId) {
                // Viewing someone else's profile
                url = `${API_BASE_URL}/profile/employer/${employerId}`;
            } else {
                // Viewing own profile
                url = `${API_BASE_URL}/profile/employer`;
                setIsOwnProfile(true);
            }

            console.log('📥 Fetching employer profile from:', url);

            const headers = token ? {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            } : {};

            const response = await fetch(url, { headers });

            if (response.ok) {
                const data = await response.json();
                console.log('✅ Profile data:', data);
                setProfile(data);
                setEvents(data.events || []);
            } else {
                console.error('❌ Failed to fetch profile:', response.status);
            }
        } catch (err) {
            console.error('❌ Error fetching profile:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleViewApplicants = (eventId) => {
        console.log('🔘 Navigating to applicants for event:', eventId);
        navigate(`/employer/events/${eventId}/applicants`);
    };

    const handleEditProfile = () => {
        console.log('🔘 Navigating to edit profile');
        navigate('/employer/profile/edit');
    };

    const handleBackToDashboard = () => {
        console.log('🔘 Navigating back to dashboard');
        navigate('/employer/dashboard');
    };

    const handleNewEvent = () => {
        console.log('🔘 Navigating to create new event');
        navigate('/employer/events/new');
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
                    <button onClick={() => navigate(-1)} className="back-button">
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-page">
            <div className="profile-container">
                <div className="profile-header">
                    <div className="company-avatar">
                        {profile.company_name ? profile.company_name.charAt(0).toUpperCase() : 'C'}
                    </div>
                    <div className="company-info">
                        <h1>{profile.company_name || 'Company Name'}</h1>
                        <p className="industry">{profile.industry || 'Industry'}</p>
                        
                        {/* Location & Website inside header */}
                        <div className="profile-details">
                            {profile.location && (
                                <div className="detail-item">
                                    <FaMapMarkerAlt className="detail-icon" />
                                    <span>{profile.location}</span>
                                </div>
                            )}
                            {profile.website && (
                                <div className="detail-item">
                                    <FaGlobe className="detail-icon" />
                                    <a href={profile.website} target="_blank" rel="noopener noreferrer">
                                        {profile.website.replace(/^https?:\/\//, '')}
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {profile.description && (
                    <div className="profile-description">
                        <h3>About Us</h3>
                        <p>{profile.description}</p>
                    </div>
                )}

                {/* Quick Actions (Only for own profile) */}
                {isOwnProfile && (
                    <div className="quick-actions">
                        <h3>Quick Actions</h3>
                        <div className="action-buttons">
                            <button className="action-btn primary" onClick={handleEditProfile}>
                                Edit Profile
                            </button>
                            <button className="action-btn secondary" onClick={handleBackToDashboard}>
                                Back to Dashboard
                            </button>
                        </div>
                    </div>
                )}

                {/* Posted Events */}
                <div className="posted-events">
                    <div className="section-header">
                        <h3>Posted Events</h3>
                        {isOwnProfile && (
                            <button className="new-event-btn" onClick={handleNewEvent}>
                                + New Event
                            </button>
                        )}
                    </div>

                    {events.length === 0 ? (
                        <div className="no-events">
                            <p>No events posted yet.</p>
                            {isOwnProfile && (
                                <button className="create-event-btn" onClick={handleNewEvent}>
                                    Create Your First Event
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="events-list">
                            {events.map((event) => (
                                <div key={event.id} className="event-item">
                                    <div className="event-header">
                                        <h4>{event.title}</h4>
                                        <span className={`event-status ${event.event_type?.toLowerCase()}`}>
                                            {event.event_type}
                                        </span>
                                    </div>
                                    <p className="event-description">{event.description}</p>
                                    <div className="event-meta">
                                        <span className="event-date">
                                            <FaCalendarAlt /> {new Date(event.event_date).toLocaleDateString()}
                                        </span>
                                        <span className="event-interested">
                                            <FaUsers /> {event.rsvp_count || 0} Interested Students
                                        </span>
                                    </div>
                                    {isOwnProfile && (
                                        <button 
                                            className="view-applicants-btn"
                                            onClick={() => handleViewApplicants(event.id)}
                                        >
                                            View Applicants
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Interested Students (if viewing own profile) */}
                {isOwnProfile && events.length > 0 && (
                    <div className="interested-students">
                        <h3>Interested Students</h3>
                        <p className="student-count">
                            {events.reduce((total, event) => total + (event.rsvp_count || 0), 0)} students total
                        </p>
                        <p className="view-all-link">
                            View individual event pages to see student details
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmployerProfile;