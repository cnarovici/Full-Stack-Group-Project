import React, { useState } from 'react';
import './BrowseEvents.css';

const BrowseEvents = () => {
    const [events] = useState([
        {
            id: 1,
            title: 'Tech Career Fair 2025',
            location: 'Virtual',
            date: 'Oct 25, 2025',
            categories: ['Software Engineering'],
            matchPercentage: 95,
            company: 'Sample Tech Company',
            type: 'Virtual'
        },
        {
            id: 2,
            title: 'Data Science Summit',
            location: 'San Francisco',
            date: 'Dec 5, 2025',
            categories: ['Data Science'],
            matchPercentage: 88,
            company: 'DataCorp Analytics',
            type: 'In-Person'
        },
        {
            id: 3,
            title: 'Tech Networking Night',
            location: 'Chicago, IL',
            date: 'Nov 10, 2025',
            categories: ['Networking'],
            matchPercentage: 82,
            company: 'Tech Hub',
            type: 'In-Person'
        },
        {
            id: 4,
            title: 'Product Management Expo',
            location: 'New York, NY',
            date: 'Dec 15, 2025',
            categories: ['Product Management'],
            matchPercentage: 78,
            company: 'PM Association',
            type: 'Hybrid'
        }
    ]);

    const handleEventClick = (eventId) => {
        console.log(`Viewing event ${eventId}`);
        // Navigate to event detail page
    };

    const handleBack = () => {
        console.log('Going back to dashboard');
        // Navigate back to dashboard
    };

    return (
        <div className="browse-events-container">
            <div className="browse-events-content">
                <button className="back-button" onClick={handleBack}>
                    ← Back to Dashboard
                </button>

                <h1 className="page-title">Browse Events</h1>

                <h2 className="section-title">Recommended For You</h2>

                <div className="events-list">
                    {events.map((event) => (
                        <div
                            key={event.id}
                            className="event-card"
                            onClick={() => handleEventClick(event.id)}
                        >
                            <h3 className="event-title">{event.title}</h3>
                            <p className="event-details">
                                📍 {event.location} • 📅 {event.date}
                            </p>
                            <div className="event-tags">
                                {event.categories.map((category, index) => (
                                    <span key={index} className="category-tag">
                                        {category}
                                    </span>
                                ))}
                                <span className="match-badge">{event.matchPercentage}% Match</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BrowseEvents;