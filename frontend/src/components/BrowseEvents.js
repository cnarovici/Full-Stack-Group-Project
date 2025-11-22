import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './BrowseEvents.css';
import { FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';

const API_BASE_URL = 'http://localhost:5001/api';

const BrowseEvents = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchBrowseEvents();
    }, []);

    const fetchBrowseEvents = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            
            if (!token) {
                navigate('/login');
                return;
            }

            console.log('🔍 Fetching browse events (topological sort)...');

            const response = await fetch(`${API_BASE_URL}/events/browse`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('📥 Response status:', response.status);

            if (!response.ok) {
                if (response.status === 401) {
                    navigate('/login');
                    return;
                }
                throw new Error('Failed to fetch events');
            }

            const data = await response.json();
            console.log('✅ Browse events received:', data);
            
            setEvents(data);
        } catch (err) {
            console.error('❌ Error fetching browse events:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEventClick = (eventId) => {
        navigate(`/student/events/${eventId}`);
    };

    const handleBack = () => {
        navigate('/student/dashboard');
    };

    if (loading) {
        return (
            <div className="browse-events-container">
                <div className="browse-events-content">
                    <button className="back-button" onClick={handleBack}>
                        ← Back to Dashboard
                    </button>
                    <h1 className="page-title">Browse Events</h1>
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Loading events...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="browse-events-container">
                <div className="browse-events-content">
                    <button className="back-button" onClick={handleBack}>
                        ← Back to Dashboard
                    </button>
                    <h1 className="page-title">Browse Events</h1>
                    <div className="error-state">
                        <p>Error loading events: {error}</p>
                        <button onClick={fetchBrowseEvents} className="retry-button">
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="browse-events-container">
            <div className="browse-events-content">
                <button className="back-button" onClick={handleBack}>
                    ← Back to Dashboard
                </button>

                <h1 className="page-title">Browse Events</h1>

                <h2 className="section-title">
                    Recommended For You - Ranked by Relevance
                </h2>

                {events.length === 0 ? (
                    <div className="no-events">
                        <p>No events found. Check back later!</p>
                    </div>
                ) : (
                    <div className="events-list">
                        {events.map((event, index) => (
                            <div
                                key={event.id}
                                className="event-card"
                                onClick={() => handleEventClick(event.id)}
                            >
                                <div className="event-rank">#{index + 1}</div>
                                <h3 className="event-title">{event.title}</h3>
                                <p className="event-details">
                                    <FaMapMarkerAlt /> {event.location || 'TBD'} • 
                                    <FaCalendarAlt /> {new Date(event.event_date).toLocaleDateString()}
                                </p>
                                <div className="event-tags">
                                    {event.tags && event.tags.length > 0 && event.tags.map((tag, idx) => (
                                        <span key={idx} className="category-tag">
                                            {tag}
                                        </span>
                                    ))}
                                    <span className="event-type-badge">{event.event_type}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BrowseEvents;