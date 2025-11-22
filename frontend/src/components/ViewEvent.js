import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ViewEvent.css';
import { FaArrowLeft, FaCalendarAlt, FaMapMarkerAlt, FaBuilding, FaEnvelope, FaGlobe } from 'react-icons/fa';

const API_BASE_URL = 'http://localhost:5001/api';

const ViewEvent = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isRsvped, setIsRsvped] = useState(false);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [messageText, setMessageText] = useState('');
    const [messageSending, setMessageSending] = useState(false);

    useEffect(() => {
        fetchEventDetails();
        checkRsvpStatus();
    }, [eventId]);

    const fetchEventDetails = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log('✅ Event details:', data);
                setEvent(data);
            } else {
                console.error('Failed to fetch event');
            }
        } catch (err) {
            console.error('Error fetching event:', err);
        } finally {
            setLoading(false);
        }
    };

    const checkRsvpStatus = async () => {
        try {
            const token = localStorage.getItem('token');
            console.log('🔍 Checking RSVP status for event:', eventId);
            
            const response = await fetch(`${API_BASE_URL}/events/${eventId}/rsvp/status`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log('✅ RSVP Status:', data);
                setIsRsvped(data.is_rsvped);
            }
        } catch (err) {
            console.error('Error checking RSVP status:', err);
        }
    };

    const handleRsvp = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/events/${eventId}/rsvp`, {
                method: isRsvped ? 'DELETE' : 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                console.log('✅ RSVP toggled');
                setIsRsvped(!isRsvped);
            }
        } catch (err) {
            console.error('RSVP error:', err);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!messageText.trim()) return;

        setMessageSending(true);
        console.log('📤 Sending message...');
        
        try {
            const token = localStorage.getItem('token');
            const payload = {
                recipient_id: event.employer.id,
                subject: `Inquiry about ${event.title}`,
                message_text: messageText
            };

            console.log('📦 Payload:', payload);

            const response = await fetch(`${API_BASE_URL}/messages`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            console.log('📥 Response status:', response.status);

            if (response.ok) {
                const data = await response.json();
                console.log('✅ Message sent:', data);
                setShowMessageModal(false);
                setMessageText('');
                alert('Message sent successfully!');
            } else {
                const errorData = await response.json();
                console.error('❌ Failed to send message:', errorData);
                alert(`Failed to send message: ${errorData.message || 'Unknown error'}`);
            }
        } catch (err) {
            console.error('❌ Error sending message:', err);
            alert('Failed to send message');
        } finally {
            setMessageSending(false);
        }
    };

    if (loading) {
        return (
            <div className="view-event-page">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading event details...</p>
                </div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="view-event-page">
                <div className="error-state">
                    <p>Event not found</p>
                    <button onClick={() => navigate('/student/browse')} className="back-button">
                        Back to Events
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="view-event-page">
            <div className="event-detail-container">
                <button className="back-button" onClick={() => navigate(-1)}>
                    <FaArrowLeft /> Back
                </button>

                {/* Event Header */}
                <div className="event-detail-header">
                    <div className="header-content">
                        <h1>{event.title}</h1>
                        <span className="event-type-badge">{event.event_type}</span>
                    </div>
                    
                    {/* Company Info */}
                    <div className="company-section">
                        <div className="company-avatar">
                            {event.employer.company_name.charAt(0).toUpperCase()}
                        </div>
                        <div className="company-info">
                            <h3>{event.employer.company_name}</h3>
                            <p>{event.employer.industry}</p>
                        </div>
                    </div>
                </div>

                {/* Event Details */}
                <div className="event-detail-body">
                    <div className="detail-section">
                        <h3>Event Details</h3>
                        <div className="detail-grid">
                            <div className="detail-item">
                                <FaCalendarAlt className="detail-icon" />
                                <div>
                                    <strong>Date</strong>
                                    <p>{new Date(event.event_date).toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}</p>
                                </div>
                            </div>

                            <div className="detail-item">
                                <FaMapMarkerAlt className="detail-icon" />
                                <div>
                                    <strong>Location</strong>
                                    <p>{event.location}</p>
                                </div>
                            </div>

                            {event.employer.website && (
                                <div className="detail-item">
                                    <FaGlobe className="detail-icon" />
                                    <div>
                                        <strong>Website</strong>
                                        <a href={event.employer.website} target="_blank" rel="noopener noreferrer">
                                            {event.employer.website}
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="detail-section">
                        <h3>About This Event</h3>
                        <p className="event-description">{event.description}</p>
                    </div>

                    {/* Tags */}
                    {event.tags && event.tags.length > 0 && (
                        <div className="detail-section">
                            <h3>Tags</h3>
                            <div className="event-tags">
                                {event.tags.map((tag, index) => (
                                    <span key={index} className="tag">{tag}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Company Description */}
                    {event.employer.description && (
                        <div className="detail-section">
                            <h3>About {event.employer.company_name}</h3>
                            <p>{event.employer.description}</p>
                        </div>
                    )}
                </div>

                {/* Action Buttons - ALWAYS SHOW MESSAGE BUTTON IF RSVP'D */}
                <div className="event-actions-section">
                    <button 
                        className={`rsvp-button ${isRsvped ? 'rsvped' : ''}`}
                        onClick={handleRsvp}
                    >
                        {isRsvped ? '✓ Registered' : 'Register for Event'}
                    </button>

                    {/* ✅ ALWAYS SHOW MESSAGE BUTTON IF RSVP'D */}
                    {isRsvped && (
                        <button 
                            className="message-button"
                            onClick={() => setShowMessageModal(true)}
                        >
                            <FaEnvelope /> Message Employer
                        </button>
                    )}
                </div>
            </div>

            {/* Message Modal */}
            {showMessageModal && (
                <div className="modal-overlay" onClick={() => setShowMessageModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>Send Message to {event.employer.company_name}</h3>
                        <form onSubmit={handleSendMessage}>
                            <textarea
                                className="message-textarea"
                                placeholder="Type your message here..."
                                value={messageText}
                                onChange={(e) => setMessageText(e.target.value)}
                                rows="6"
                                required
                            />
                            <div className="modal-actions">
                                <button 
                                    type="button" 
                                    className="cancel-button"
                                    onClick={() => setShowMessageModal(false)}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="send-button"
                                    disabled={messageSending}
                                >
                                    {messageSending ? 'Sending...' : 'Send Message'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewEvent;