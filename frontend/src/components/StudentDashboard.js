import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './StudentDashboard.css';
import { FaFileAlt, FaEdit, FaSearch, FaBriefcase, FaMapMarkerAlt, FaCalendarAlt, FaSignOutAlt } from 'react-icons/fa';
import { logout } from '../utils/auth';

const API_BASE_URL = 'http://localhost:5001/api';

const StudentDashboard = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [userName, setUserName] = useState('');

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
    }, [navigate]);

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            logout();
        }
    };

    const fetchSuggestions = async () => {
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
    };

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            fetchSuggestions();
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [searchQuery]);

    const handleSuggestionClick = (suggestion) => {
        setSearchQuery(suggestion.title);
        setShowSuggestions(false);
        navigate('/student/search', { state: { searchQuery: suggestion.title } });
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate('/student/search', { state: { searchQuery } });
        }
    };

    // ✅ ADD THESE HANDLERS
    const handleCardClick = (path) => {
        console.log('🔘 Card clicked, navigating to:', path);
        navigate(path);
    };

    return (
        <div className="dashboard-wrapper">
            {/* Header with Logout Button */}
            <div className="dashboard-header">
                <div className="header-top">
                    <h2>Welcome back{userName ? `, ${userName}` : ''}!</h2>
                    <button className="logout-button" onClick={handleLogout}>
                        <FaSignOutAlt /> Logout
                    </button>
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

            {/* Dashboard Grid - ✅ UPDATED */}
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
                    onClick={() => handleCardClick('/student/profile/edit')}
                    role="button"
                    tabIndex={0}
                    onKeyPress={(e) => e.key === 'Enter' && handleCardClick('/student/profile/edit')}
                >
                    <FaEdit className="dashboard-icon" />
                    <h3>Edit Profile</h3>
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

            {/* Recommended Section */}
            <div className="recommended-section">
                <h3 className="recommended-title">Recommended For You</h3>
                <div className="recommended-list">
                    <div className="event-container">
                        <h4 className="event-title">Tech Career Fair 2025</h4>
                        <div className="event-info">
                            <div className="event-details">
                                <FaMapMarkerAlt className="event-icon" />
                                <span>Virtual</span>
                            </div>
                            <div className="event-details">
                                <FaCalendarAlt className="event-icon" />
                                <span>Oct 25, 2025</span>
                            </div>
                        </div>
                        <button className="event-type-btn">Software Engineering</button>
                        <span className="match-badge">95% Match</span>
                    </div>

                    <div className="event-container">
                        <h4 className="event-title">Google Campus Recruiting</h4>
                        <div className="event-info">
                            <div className="event-details">
                                <FaMapMarkerAlt className="event-icon" />
                                <span>Mountain View, CA</span>
                            </div>
                            <div className="event-details">
                                <FaCalendarAlt className="event-icon" />
                                <span>Nov 2, 2025</span>
                            </div>
                        </div>
                        <button className="event-type-btn">Data Science</button>
                        <span className="match-badge">85% Match</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;