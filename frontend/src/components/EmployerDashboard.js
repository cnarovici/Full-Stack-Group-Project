import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './EmployerDashboard.css';
import { FaPlus, FaUsers, FaCalendarAlt, FaSignOutAlt, FaEnvelope, FaEdit } from 'react-icons/fa';
import { logout } from '../utils/auth';

const API_BASE_URL = 'http://localhost:5001/api';

const EmployerDashboard = () => {
    const navigate = useNavigate();
    const [companyName, setCompanyName] = useState('');
    const [postedEvents, setPostedEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        // Verify authentication
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        
        console.log('🏢 Employer Dashboard loading...');
        console.log('Token exists:', !!token);
        
        if (!token) {
            console.log('❌ No token, redirecting to login');
            navigate('/');
            return;
        }

        try {
            const user = JSON.parse(userStr || '{}');
            console.log('✅ Parsed user:', user);
        } catch (e) {
            console.error('Error parsing user:', e);
        }

        fetchEmployerProfile();
        fetchPostedEvents();
        fetchUnreadMessages();
    }, [navigate]);

    const fetchEmployerProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/profile/employer`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setCompanyName(data.company_name || 'Company');
            }
        } catch (err) {
            console.error('Error fetching employer profile:', err);
        }
    };

    const fetchPostedEvents = async () => {
        try {
            const token = localStorage.getItem('token');
            console.log('📅 Fetching posted events...');
            
            const response = await fetch(`${API_BASE_URL}/events`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log('✅ Events fetched:', data);
                setPostedEvents(data);
            } else {
                console.error('❌ Failed to fetch events:', response.status);
            }
        } catch (err) {
            console.error('❌ Error fetching events:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchUnreadMessages = async () => {
        try {
            const token = localStorage.getItem('token');
            console.log('📬 Fetching unread messages...');
            
            const response = await fetch(`${API_BASE_URL}/messages/unread-count`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log('✅ Unread count:', data.unread_count);
                setUnreadCount(data.unread_count || 0);
            } else {
                console.error('❌ Failed to fetch unread count:', response.status);
            }
        } catch (err) {
            console.error('❌ Error fetching unread count:', err);
        }
    };

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            logout();
        }
    };

    const handleViewApplicants = (eventId) => {
        console.log('🔘 Viewing applicants for event:', eventId);
        navigate(`/employer/events/${eventId}/applicants`);
    };

    const handlePostNewEvent = () => {
        console.log('🔘 Navigating to post new event');
        navigate('/employer/events/new');
    };

    const handleViewMessages = () => {
        console.log('🔘 Navigating to messages');
        navigate('/employer/messages');
    };

    const handleEditProfile = () => {
    console.log('🔘 Navigating to view profile');
    navigate('/employer/profile');  // ← Changed from '/employer/profile/edit'
};

    return (
        <div className="employer-dashboard-wrapper">
            {/* Header with Actions */}
            <div className="employer-header">
                <div className="header-top">
                    <h2>Welcome, {companyName} 🏢</h2>
                    <div className="header-actions">
                        <button className="edit-profile-button" onClick={handleEditProfile}>
                            <FaEdit /> View Profile
                        </button>
                        <button className="messages-button" onClick={handleViewMessages}>
                            <FaEnvelope />
                            {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
                            Messages
                        </button>
                        <button className="logout-button" onClick={handleLogout}>
                            <FaSignOutAlt /> Logout
                        </button>
                    </div>
                </div>

                <button className="post-event-button" onClick={handlePostNewEvent}>
                    <FaPlus /> Post New Event
                </button>
            </div>

            {/* Your Posted Events */}
            <div className="posted-events-section">
                <h3>Your Posted Events</h3>
                
                {loading ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Loading events...</p>
                    </div>
                ) : postedEvents.length > 0 ? (
                    <div className="events-list">
                        {postedEvents.map((event) => (
                            <div key={event.id} className="event-card">
                                <div className="event-card-header">
                                    <h4>{event.title}</h4>
                                    <span className="event-type-badge">{event.event_type}</span>
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
                                <button 
                                    className="view-applicants-button"
                                    onClick={() => handleViewApplicants(event.id)}
                                >
                                    View Applicants
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-events">
                        <p>No events posted yet. Create your first event!</p>
                        <button className="create-first-event-btn" onClick={handlePostNewEvent}>
                            <FaPlus /> Create First Event
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmployerDashboard;