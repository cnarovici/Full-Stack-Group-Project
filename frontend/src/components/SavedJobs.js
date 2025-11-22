import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SavedJobs.css';

const API_BASE_URL = 'http://localhost:5001/api';

const SavedJobs = () => {
    const navigate = useNavigate();
    const [rsvpedEvents, setRsvpedEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRSVPs();
    }, []);

    const fetchRSVPs = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/my-rsvps`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setRsvpedEvents(data);
            }
        } catch (err) {
            console.error('Error fetching RSVPs:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="saved-jobs-page">
            <button className="back-button" onClick={() => navigate('/student/dashboard')}>
                ← Back to Dashboard
            </button>

            <h1 className="page-title">Saved Jobs & Events</h1>

            {loading ? (
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading...</p>
                </div>
            ) : rsvpedEvents.length === 0 ? (
                <div className="no-events">
                    <p>You haven't RSVP'd to any events yet.</p>
                    <button onClick={() => navigate('/student/browse')} className="browse-button">
                        Browse Events
                    </button>
                </div>
            ) : (
                <div className="events-list">
                    {rsvpedEvents.map((event) => (
                        <div 
                            key={event.id} 
                            className="event-card"
                            onClick={() => navigate(`/student/events/${event.id}`)}
                        >
                            <h3>{event.title}</h3>
                            <p>{event.description}</p>
                            <p className="event-date">
                                RSVP'd on: {new Date(event.rsvp_date).toLocaleDateString()}
                            </p>
                            <p className="event-date">
                                Event Date: {new Date(event.event_date).toLocaleDateString()}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SavedJobs;