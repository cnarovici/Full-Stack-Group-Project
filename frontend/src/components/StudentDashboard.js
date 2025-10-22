import React, { useState, useEffect, useRef } from "react";
import { AiOutlineFileText } from "react-icons/ai";
import { FiEdit3, FiSearch } from "react-icons/fi";
import { FaBriefcase, FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./StudentDashboard.css";

const API_BASE_URL = 'http://localhost:5000/api';

const StudentDashboard = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchRef = useRef(null);

    const handleCardClick = (path) => {
        navigate(path);
    };

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Fetch autocomplete suggestions
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (searchQuery.trim().length < 2) {
                setSuggestions([]);
                setShowSuggestions(false);
                return;
            }

            try {
                const response = await fetch(
                    `${API_BASE_URL}/search/autocomplete?q=${encodeURIComponent(searchQuery)}&type=events`
                );
                
                if (!response.ok) {
                    throw new Error('Failed to fetch suggestions');
                }

                const data = await response.json();
                setSuggestions(data);
                setShowSuggestions(data.length > 0);
            } catch (error) {
                console.error('Error fetching suggestions:', error);
                setSuggestions([]);
            }

            if (searchQuery.trim().length < 2) {
                setSuggestions([]);
                setShowSuggestions(false);
                return;
            }

            console.log('🔍 Fetching suggestions for:', searchQuery);
            console.log('📡 API URL:', `${API_BASE_URL}/search/autocomplete?q=${encodeURIComponent(searchQuery)}&type=events`);

            try {
                const response = await fetch(
                    `${API_BASE_URL}/search/autocomplete?q=${encodeURIComponent(searchQuery)}&type=events`
                );
                
                console.log('📥 Response status:', response.status);
                console.log('📥 Response ok:', response.ok);
                
                if (!response.ok) {
                    throw new Error('Failed to fetch suggestions');
                }

                const data = await response.json();
                console.log('✅ Received suggestions:', data);
                console.log('📊 Number of suggestions:', data.length);
                
                setSuggestions(data);
                setShowSuggestions(data.length > 0);
                console.log('👁️ Show suggestions:', data.length > 0);
            } catch (error) {
                console.error('❌ Error fetching suggestions:', error);
                setSuggestions([]);
            }
        };

        // Debounce the search
        const timeoutId = setTimeout(() => {
            fetchSuggestions();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSuggestionClick = (suggestion) => {
        setSearchQuery('');
        setShowSuggestions(false);
        // Navigate to event details or search page with this event
        alert(`Selected: ${suggestion.title}`);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            // Navigate to full search page with query
            navigate(`/student/browse-events?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    // Example recommended events
    const recommendedEvents = [
        {
            title: "Tech Innovators Meetup 2025",
            location: "Chicago Tech Hub",
            date: "Nov 12, 2025",
            type: "Software Engineering",
        },
        {
            title: "AI & Data Career Expo",
            location: "UIC Convention Center",
            date: "Dec 5, 2025",
            type: "Data Engineering",
        },
        {
            title: "Women in STEM Networking Night",
            location: "Google Campus",
            date: "Nov 30, 2025",
            type: "Networking",
        },
    ];

    return (
        <div className="dashboard-wrapper">
            {/* Search Bar with Autocomplete */}
            <div className="dashboard-header">
                <h2 style={{ 
                    fontSize: '24px', 
                    color: '#333', 
                    marginBottom: '20px',
                    textAlign: 'center'
                }}>
                    Welcome back!
                </h2>
                
                <div className="search-container" ref={searchRef}>
                    <form onSubmit={handleSearchSubmit} className="search-form-dashboard">
                        <input
                            type="text"
                            placeholder="Search for events..."
                            className="dashboard-search"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                        />
                        
                        {showSuggestions && suggestions.length > 0 && (
                            <div className="dashboard-suggestions">
                                {suggestions.map((suggestion) => (
                                    <div
                                        key={suggestion.id}
                                        className="dashboard-suggestion-item"
                                        onClick={() => handleSuggestionClick(suggestion)}
                                    >
                                        <span className="suggestion-icon">📅</span>
                                        <span className="suggestion-text">{suggestion.title}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </form>
                </div>
            </div>

            {/* Dashboard 4 Boxes */}
            <div className="dashboard-grid">
                <div className="dashboard-card" onClick={() => handleCardClick("/student/update-resume")}>
                    <AiOutlineFileText className="dashboard-icon" />
                    <h3>Update Resume</h3>
                </div>

                <div className="dashboard-card" onClick={() => handleCardClick("/student/edit-profile")}>
                    <FiEdit3 className="dashboard-icon" />
                    <h3>Edit Profile</h3>
                </div>

                <div className="dashboard-card" onClick={() => handleCardClick("/student/browse-events")}>
                    <FiSearch className="dashboard-icon" />
                    <h3>Browse Event</h3>
                </div>

                <div className="dashboard-card" onClick={() => handleCardClick("/student/saved-jobs")}>
                    <FaBriefcase className="dashboard-icon" />
                    <h3>Saved Job</h3>
                </div>
            </div>

            {/* Recommended Section */}
            <div className="recommended-section">
                <h2 className="recommended-title">Recommended For You</h2>

                <div className="recommended-list">
                    {recommendedEvents.map((event, index) => (
                        <div key={index} className="event-container">
                            <h3 className="event-title">{event.title}</h3>
                            <div className="event-info">
                                <div className="event-details">
                                    <FaMapMarkerAlt className="event-icon" />
                                    <span>{event.location}</span>
                                </div>
                                <div className="event-details">
                                    <FaCalendarAlt className="event-icon" />
                                    <span>{event.date}</span>
                                </div>
                            </div>
                            <button className="event-type-btn">{event.type}</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;