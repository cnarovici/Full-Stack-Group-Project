import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ViewEvent.css';
import { FaBuilding, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';

const API_BASE_URL = 'http://localhost:5001/api';

const ViewEvent = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();
    
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isRSVPed, setIsRSVPed] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchEventDetails();
        checkRSVPStatus();
    }, [eventId]);

    const fetchEventDetails = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/events/${eventId}`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch event details');
            }

            const data = await response.json();
            console.log('✅ Event details:', data);
            setEvent(data);
        } catch (err) {
            console.error('❌ Error fetching event:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const checkRSVPStatus = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await fetch(`${API_BASE_URL}/my-rsvps`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const rsvps = await response.json();
                const hasRSVP = rsvps.some(rsvp => rsvp.id === parseInt(eventId));
                setIsRSVPed(hasRSVP);
            }
        } catch (err) {
            console.error('Error checking RSVP status:', err);
        }
    };

    const handleRSVP = async () => {
        try {
            const token = localStorage.getItem('token');
            
            if (!token) {
                navigate('/login');
                return;
            }

            const method = isRSVPed ? 'DELETE' : 'POST';
            const response = await fetch(`${API_BASE_URL}/events/${eventId}/rsvp`, {
                method: method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                setIsRSVPed(!isRSVPed);
                alert(isRSVPed ? 'RSVP cancelled' : 'Successfully RSVP\'d to event!');
            } else {
                const data = await response.json();
                alert(data.message || 'Failed to RSVP');
            }
        } catch (err) {
            console.error('❌ Error with RSVP:', err);
            alert('Failed to process RSVP');
        }
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: event.title,
                text: event.description,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    const handleBack = () => {
        navigate('/student/browse');
    };

    if (loading) {
        return (
            <div className="view-event-container">
                <div className="view-event-content">
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Loading event details...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !event) {
        return (
            <div className="view-event-container">
                <div className="view-event-content">
                    <button className="back-button" onClick={handleBack}>
                        ← Back to Browse
                    </button>
                    <div className="error-state">
                        <p>Error loading event: {error || 'Event not found'}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="view-event-container">
            <div className="view-event-content">
                <button className="back-button" onClick={handleBack}>
                    ← Back to Browse
                </button>

                {/* Event Hero Card */}
                <div className="event-hero">
                    <div className="event-type-badge">{event.event_type}</div>

                    <h1 className="event-hero-title">{event.title}</h1>

                    <div className="event-info">
                        {event.employer && (
                            <div className="info-row">
                                <FaBuilding className="info-icon" />
                                <span>{event.employer.company_name}</span>
                            </div>
                        )}

                        <div className="info-row">
                            <FaCalendarAlt className="info-icon" />
                            <span>{new Date(event.event_date).toLocaleString()}</span>
                        </div>

                        <div className="info-row">
                            <FaMapMarkerAlt className="info-icon" />
                            <span>{event.location || 'TBD'}</span>
                        </div>
                    </div>

                    <p className="event-description">{event.description}</p>

                    {/* Categories */}
                    {event.tags && event.tags.length > 0 && (
                        <div className="event-categories">
                            {event.tags.map((tag, index) => (
                                <span key={index} className="category-tag">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <button
                    className={`btn-rsvp ${isRSVPed ? 'rsvped' : ''}`}
                    onClick={handleRSVP}
                >
                    {isRSVPed ? '✓ RSVP Confirmed' : 'RSVP to Event'}
                </button>

                <button className="btn-share" onClick={handleShare}>
                    Share Event
                </button>
            </div>
        </div>
    );
};

export default ViewEvent;