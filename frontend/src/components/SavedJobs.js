import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SavedJobs.css';
import { FaArrowLeft, FaCalendarAlt, FaMapMarkerAlt, FaBuilding, FaTrash } from 'react-icons/fa';

const API_BASE_URL = 'http://localhost:5001/api';

const SavedJobs = () => {
    const navigate = useNavigate();
    const [savedEvents, setSavedEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSavedEvents();
    }, []);

    const fetchSavedEvents = async () => {
        try {
            const token = localStorage.getItem('token');
            console.log('📥 Fetching saved events...');
            
            const response = await fetch(`${API_BASE_URL}/events/rsvp`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log('✅ Saved events:', data);
                setSavedEvents(data);
            } else {
                console.error('❌ Failed to fetch saved events');
            }
        } catch (err) {
            console.error('Error fetching saved events:', err);
        } finally {
            setLoading(false);
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
                // Remove from list
                setSavedEvents(savedEvents.filter(event => event.id !== eventId));
            } else {
                console.error('❌ Failed to unregister');
                alert('Failed to unregister from event');
            }
        } catch (err) {
            console.error('Error unregistering:', err);
            alert('Failed to unregister from event');
        }
    };

    const handleViewDetails = (eventId) => {
        navigate(`/student/events/${eventId}`);
    };

    return (
        <div className="saved-jobs-page">
            <div className="saved-header">
                <button className="back-button" onClick={() => navigate('/student/dashboard')}>
                    <FaArrowLeft /> Back to Dashboard
                </button>
                <h1>My Registered Events</h1>
            </div>

            {loading ? (
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading your registered events...</p>
                </div>
            ) : savedEvents.length > 0 ? (
                <div className="saved-events-grid">
                    {savedEvents.map((event) => (
                        <div key={event.id} className="saved-event-card">
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

                            {event.tags && event.tags.length > 0 && (
                                <div className="event-tags">
                                    {event.tags.map((tag, index) => (
                                        <span key={index} className="tag">{tag}</span>
                                    ))}
                                </div>
                            )}

                            <div className="event-actions">
                                <button 
                                    className="view-details-button"
                                    onClick={() => handleViewDetails(event.id)}
                                >
                                    View Details
                                </button>
                                <button 
                                    className="unregister-button"
                                    onClick={() => handleUnregister(event.id)}
                                >
                                    <FaTrash /> Unregister
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="no-saved-events">
                    <h2>No Registered Events</h2>
                    <p>You haven't registered for any events yet.</p>
                    <button 
                        className="browse-button"
                        onClick={() => navigate('/student/browse')}
                    >
                        Browse Events
                    </button>
                </div>
            )}
        </div>
    );
};

export default SavedJobs;