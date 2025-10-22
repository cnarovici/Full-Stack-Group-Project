import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './EventSearchPage.css';
import { FaMapMarkerAlt, FaCalendarAlt, FaBuilding } from 'react-icons/fa';

const API_BASE_URL = 'http://localhost:5000/api';

const EventSearchPage = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        
        if (!searchQuery || searchQuery.trim().length < 2) {
            return;
        }

        console.log('🔍 Full search for:', searchQuery);

        setLoading(true);
        setHasSearched(true);

        try {
            const url = `${API_BASE_URL}/search?q=${encodeURIComponent(searchQuery)}&type=events`;
            console.log('📡 Search URL:', url);
            
            const response = await fetch(url);

            console.log('📥 Search response status:', response.status);
            
            if (!response.ok) {
                throw new Error('Search failed');
            }

            const data = await response.json();
            console.log('✅ Search results:', data);
            console.log('📊 Events found:', data.events?.length || 0);
            
            setSearchResults(data.events || []);
        } catch (error) {
            console.error('❌ Error searching events:', error);
            setSearchResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleEventClick = (event) => {
        // Navigate to event details page
        alert(`Event clicked: ${event.title}`);
        // navigate(`/events/${event.id}`);
    };

    return (
        <div className="event-search-page">
            <div className="search-page-header">
                <button 
                    onClick={() => navigate('/student/dashboard')}
                    className="back-button-simple"
                >
                    ← Back to Dashboard
                </button>
                <h1>Search Events</h1>
            </div>

            <div className="search-section">
                <form onSubmit={handleSearchSubmit} className="search-form-full">
                    <div className="search-input-wrapper-full">
                        <input
                            type="text"
                            className="search-input-full"
                            placeholder="Search for events..."
                            value={searchQuery}
                            onChange={handleInputChange}
                        />
                        <button type="submit" className="search-button-full">
                            🔍 Search
                        </button>
                    </div>
                </form>
            </div>

            {loading && (
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Searching events...</p>
                </div>
            )}

            {!loading && hasSearched && (
                <div className="search-results">
                    {searchResults.length > 0 ? (
                        <>
                            <h2 className="results-header">
                                Found {searchResults.length} event{searchResults.length !== 1 ? 's' : ''}
                            </h2>
                            <div className="results-list">
                                {searchResults.map((event) => (
                                    <div 
                                        key={event.id} 
                                        className="result-card"
                                        onClick={() => handleEventClick(event)}
                                    >
                                        <div className="result-header">
                                            <h3 className="result-title">{event.title}</h3>
                                            <span className="result-type">{event.event_type}</span>
                                        </div>
                                        
                                        {event.description && (
                                            <p className="result-description">{event.description}</p>
                                        )}
                                        
                                        <div className="result-details">
                                            {event.employer && (
                                                <div className="result-detail">
                                                    <FaBuilding className="detail-icon" />
                                                    <span>{event.employer.company_name}</span>
                                                </div>
                                            )}
                                            
                                            {event.location && (
                                                <div className="result-detail">
                                                    <FaMapMarkerAlt className="detail-icon" />
                                                    <span>{event.location}</span>
                                                </div>
                                            )}
                                            
                                            {event.event_date && (
                                                <div className="result-detail">
                                                    <FaCalendarAlt className="detail-icon" />
                                                    <span>{new Date(event.event_date).toLocaleDateString()}</span>
                                                </div>
                                            )}
                                        </div>

                                        {event.tags && event.tags.length > 0 && (
                                            <div className="result-tags">
                                                {event.tags.map((tag, index) => (
                                                    <span key={index} className="tag">{tag}</span>
                                                ))}
                                            </div>
                                        )}

                                        <div className="result-actions">
                                            <button className="rsvp-button">RSVP to Event</button>
                                            <button className="details-button">View Details</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="no-results">
                            <p>No events found matching your search.</p>
                            <p>Try different keywords or browse all events.</p>
                        </div>
                    )}
                </div>
            )}

            {!hasSearched && (
                <div className="search-prompt">
                    <h2>🔍 Search for Events</h2>
                    <p>Enter keywords to find career fairs, workshops, networking events, and more!</p>
                </div>
            )}
        </div>
    );
};

export default EventSearchPage;