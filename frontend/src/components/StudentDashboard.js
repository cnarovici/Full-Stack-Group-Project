import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './StudentDashboard.css';
import { FaFileAlt, FaEdit, FaSearch, FaBriefcase, FaMapMarkerAlt, FaCalendarAlt, FaSignOutAlt, FaEnvelope } from 'react-icons/fa';
import { logout } from '../utils/auth';

const API_BASE_URL = 'http://localhost:5001/api';

const StudentDashboard = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [userName, setUserName] = useState('');
    const [unreadCount, setUnreadCount] = useState(0);
    const [recommendations, setRecommendations] = useState([]); // ← ADD THIS
    const [loadingRecommendations, setLoadingRecommendations] = useState(true); // ← ADD THIS
    const [rsvpStatus, setRsvpStatus] = useState({}); // ← ADD THIS

    // ← ADD THIS FUNCTION
    const fetchRecommendations = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/events/recommendations`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log('✅ Recommendations:', data);
                setRecommendations(data);
                
                // Check RSVP status for recommendations
                if (data.length > 0) {
                    checkRsvpStatus(data.map(event => event.id));
                }
            }
        } catch (err) {
            console.error('Error fetching recommendations:', err);
        } finally {
            setLoadingRecommendations(false);
        }
    }, []);

    useEffect(() => {
        // Verify authentication
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        
        console.log('🔍 Dashboard loading...');
        console.log('Token exists:', !!token);
        console.log('User data:', userStr);
        
        if (!token) {
            console.log('❌ No token, redirecting to login');
            navigate('/');
            return;
        }

        try {
            const user = JSON.parse(userStr || '{}');
            console.log('✅ Parsed user:', user);
            setUserName(user.full_name || '');
        } catch (e) {
            console.error('Error parsing user:', e);
        }

        fetchUnreadMessages();
        fetchRecommendations();
    }, [navigate, fetchRecommendations]);

    // ← ADD THIS FUNCTION
    const checkRsvpStatus = async (eventIds) => {
        try {
            const token = localStorage.getItem('token');
            
            const statusChecks = await Promise.all(
                eventIds.map(async (id) => {
                    try {
                        const response = await fetch(`${API_BASE_URL}/events/${id}/rsvp/status`, {
                            headers: { 'Authorization': `Bearer ${token}` }
                        });
                        
                        if (response.ok) {
                            const data = await response.json();
                            return { id, isRsvped: data.is_rsvped };
                        }
                        return { id, isRsvped: false };
                    } catch (err) {
                        return { id, isRsvped: false };
                    }
                })
            );

            const statusMap = {};
            statusChecks.forEach(({ id, isRsvped }) => {
                statusMap[id] = isRsvped;
            });
            
            setRsvpStatus(statusMap);
        } catch (err) {
            console.error('Error checking RSVP status:', err);
        }
    };

    // ← ADD THIS FUNCTION
    const handleRsvp = async (eventId, e) => {
        e.stopPropagation();
        
        try {
            const token = localStorage.getItem('token');
            const isCurrentlyRsvped = rsvpStatus[eventId];

            const response = await fetch(`${API_BASE_URL}/events/${eventId}/rsvp`, {
                method: isCurrentlyRsvped ? 'DELETE' : 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                console.log('✅ RSVP updated');
                setRsvpStatus(prev => ({
                    ...prev,
                    [eventId]: !isCurrentlyRsvped
                }));
            }
        } catch (err) {
            console.error('RSVP error:', err);
        }
    };

    const fetchUnreadMessages = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/messages/unread-count`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setUnreadCount(data.unread_count || 0);
            }
        } catch (err) {
            console.error('Error fetching unread count:', err);
        }
    };

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            logout();
        }
    };

    const fetchSuggestions = useCallback(async () => {
        if (searchQuery.trim().length < 2) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        console.log('🔍 Fetching suggestions for:', searchQuery);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(
                `${API_BASE_URL}/search/autocomplete?q=${encodeURIComponent(searchQuery)}&type=events`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            
            console.log('📥 Response status:', response.status);
            
            if (!response.ok) {
                throw new Error('Failed to fetch suggestions');
            }

            const data = await response.json();
            console.log('✅ Received suggestions:', data);
            
            setSuggestions(data);
            setShowSuggestions(data.length > 0);
        } catch (error) {
            console.error('❌ Error fetching suggestions:', error);
            setSuggestions([]);
        }
    }, [searchQuery]);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            fetchSuggestions();
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [fetchSuggestions]);

    const handleSuggestionClick = (suggestion) => {
        console.log('🔘 Event clicked:', suggestion);
        setSearchQuery('');
        setShowSuggestions(false);
        navigate(`/student/events/${suggestion.id}`);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate('/student/search', { state: { searchQuery } });
        }
    };

    const handleCardClick = (path) => {
        console.log('🔘 Card clicked, navigating to:', path);
        navigate(path);
    };

    const handleViewMessages = () => {
        console.log('🔘 Navigating to messages');
        navigate('/student/messages');
    };

    // ← ADD THIS FUNCTION
    const handleViewEventDetails = (eventId) => {
        navigate(`/student/events/${eventId}`);
    };

    return (
        <div className="dashboard-wrapper">
            {/* Header with Logout and Messages Buttons */}
            <div className="dashboard-header">
                <div className="header-top">
                    <h2>Welcome back{userName ? `, ${userName}` : ''}!</h2>
                    <div className="header-actions">
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

                {/* Search Container */}
                <div className="search-container">
                    <form onSubmit={handleSearchSubmit} className="search-form-dashboard">
                        <input
                            type="text"
                            className="dashboard-search"
                            placeholder="Search for events, companies, or categories..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
                            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                        />

                        {/* Autocomplete Suggestions */}
                        {showSuggestions && suggestions.length > 0 && (
                            <div className="dashboard-suggestions">
                                {suggestions.map((suggestion) => (
                                    <div
                                        key={suggestion.id}
                                        className="dashboard-suggestion-item"
                                        onClick={() => handleSuggestionClick(suggestion)}
                                    >
                                        <FaCalendarAlt className="suggestion-icon" />
                                        <span className="suggestion-text">{suggestion.title}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </form>
                </div>
            </div>

            {/* Dashboard Grid */}
            <div className="dashboard-grid">
                <div 
                    className="dashboard-card" 
                    onClick={() => handleCardClick('/student/resume')}
                    role="button"
                    tabIndex={0}
                    onKeyPress={(e) => e.key === 'Enter' && handleCardClick('/student/resume')}
                >
                    <FaFileAlt className="dashboard-icon" />
                    <h3>Update Resume</h3>
                </div>

                <div 
                    className="dashboard-card" 
                    onClick={() => handleCardClick('/student/profile')}
                    role="button"
                    tabIndex={0}
                    onKeyPress={(e) => e.key === 'Enter' && handleCardClick('/student/profile')}
                >
                    <FaEdit className="dashboard-icon" />
                    <h3>View Profile</h3>
                </div>

                <div 
                    className="dashboard-card" 
                    onClick={() => handleCardClick('/student/browse')}
                    role="button"
                    tabIndex={0}
                    onKeyPress={(e) => e.key === 'Enter' && handleCardClick('/student/browse')}
                >
                    <FaSearch className="dashboard-icon" />
                    <h3>Browse Event</h3>
                </div>

                <div 
                    className="dashboard-card" 
                    onClick={() => handleCardClick('/student/saved')}
                    role="button"
                    tabIndex={0}
                    onKeyPress={(e) => e.key === 'Enter' && handleCardClick('/student/saved')}
                >
                    <FaBriefcase className="dashboard-icon" />
                    <h3>Saved Job</h3>
                </div>
            </div>

            {/* Recommended Section - NOW DYNAMIC */}
            <div className="recommended-section">
                <h3 className="recommended-title">Recommended For You</h3>
                
                {loadingRecommendations ? (
                    <div className="loading-recommendations">
                        <p>Loading recommendations...</p>
                    </div>
                ) : recommendations.length > 0 ? (
                    <div className="recommended-list">
                        {recommendations.map((event) => (
                            <div key={event.id} className="event-container">
                                <h4 className="event-title">{event.title}</h4>
                                <div className="event-info">
                                    <div className="event-details">
                                        <FaMapMarkerAlt className="event-icon" />
                                        <span>{event.location}</span>
                                    </div>
                                    <div className="event-details">
                                        <FaCalendarAlt className="event-icon" />
                                        <span>{new Date(event.event_date).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}</span>
                                    </div>
                                </div>
                                {event.tags && event.tags.length > 0 && (
                                    <button className="event-type-btn">{event.tags[0]}</button>
                                )}
                                <span className="match-badge">{event.match_percentage}% Match</span>
                                
                                {/* Action Buttons */}
                                <div className="event-actions-row">
                                    <button 
                                        className={`event-rsvp-btn ${rsvpStatus[event.id] ? 'rsvped' : ''}`}
                                        onClick={(e) => handleRsvp(event.id, e)}
                                    >
                                        {rsvpStatus[event.id] ? '✓ Registered' : 'RSVP'}
                                    </button>
                                    <button 
                                        className="event-view-btn"
                                        onClick={() => handleViewEventDetails(event.id)}
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-recommendations">
                        <p>No recommendations available. Update your profile to get personalized suggestions!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentDashboard;