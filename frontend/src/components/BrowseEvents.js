import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './BrowseEvents.css';
import { FaArrowLeft, FaCalendarAlt, FaMapMarkerAlt, FaBuilding, FaFilter } from 'react-icons/fa';

const API_BASE_URL = 'http://localhost:5001/api';

const BrowseEvents = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [rsvpStatus, setRsvpStatus] = useState({});
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchEvents();
    }, []);

    useEffect(() => {
        filterEvents();
    }, [filter, events]);

    const fetchEvents = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/events`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setEvents(data);
                setFilteredEvents(data);
                
                // Check RSVP status
                if (data.length > 0) {
                    checkRsvpStatus(data.map(event => event.id));
                }
            }
        } catch (err) {
            console.error('Error fetching events:', err);
        } finally {
            setLoading(false);
        }
    };

    const checkRsvpStatus = async (eventIds) => {
        try {
            const token = localStorage.getItem('token');
            const statusChecks = await Promise.all(
                eventIds.map(id =>
                    fetch(`${API_BASE_URL}/events/${id}/rsvp/status`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }).then(r => r.json()).then(data => ({ id, isRsvped: data.is_rsvped }))
                )
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

    const filterEvents = () => {
        if (filter === 'all') {
            setFilteredEvents(events);
        } else {
            setFilteredEvents(events.filter(event => 
                event.event_type.toLowerCase() === filter.toLowerCase()
            ));
        }
    };

    const handleRsvp = async (eventId) => {
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
                setRsvpStatus(prev => ({
                    ...prev,
                    [eventId]: !isCurrentlyRsvped
                }));
            }
        } catch (err) {
            console.error('RSVP error:', err);
        }
    };

    const handleViewDetails = (eventId) => {
        navigate(`/student/events/${eventId}`);
    };

    return (
        <div className="browse-events-page">
            <div className="browse-header">
                <button className="back-button" onClick={() => navigate('/student/dashboard')}>
                    <FaArrowLeft /> Back to Dashboard
                </button>

                <div className="filter-section">
                    <FaFilter />
                    <select 
                        className="filter-select" 
                        value={filter} 
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="all">All Events</option>
                        <option value="virtual">Virtual</option>
                        <option value="in-person">In-Person</option>
                        <option value="hybrid">Hybrid</option>
                    </select>
                </div>
            </div>

            <div className="browse-content">
                <h2>Browse All Events</h2>
                
                {loading ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Loading events...</p>
                    </div>
                ) : filteredEvents.length > 0 ? (
                    <div className="events-grid">
                        {filteredEvents.map((event) => (
                            <div key={event.id} className="event-card">
                                <div className="event-card-header">
                                    <h3>{event.title}</h3>
                                    <span className="event-type-badge">{event.event_type}</span>
                                </div>
                                
                                <p className="event-description">{event.description}</p>

                                <div className="event-meta">
                                    <div className="meta-item">
                                        <FaBuilding />
                                        <span>{event.employer?.company_name || 'Company'}</span>
                                    </div>
                                    <div className="meta-item">
                                        <FaMapMarkerAlt />
                                        <span>{event.location}</span>
                                    </div>
                                    <div className="meta-item">
                                        <FaCalendarAlt />
                                        <span>{new Date(event.event_date).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                <div className="event-tags">
                                    {event.tags.map((tag, index) => (
                                        <span key={index} className="tag">{tag}</span>
                                    ))}
                                </div>

                                <div className="event-actions">
                                    <button 
                                        className={`rsvp-button ${rsvpStatus[event.id] ? 'rsvped' : ''}`}
                                        onClick={() => handleRsvp(event.id)}
                                    >
                                        {rsvpStatus[event.id] ? '✓ Registered' : 'RSVP to Event'}
                                    </button>
                                    <button 
                                        className="view-details-button"
                                        onClick={() => handleViewDetails(event.id)}
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-events">
                        <p>No events found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BrowseEvents;