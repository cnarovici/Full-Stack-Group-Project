import React, { useState } from 'react';
import './ViewEvent.css';

const ViewEvent = () => {
    // In a real app, you'd fetch this data based on event ID from URL params
    const [event] = useState({
        id: 1,
        title: 'Tech Career Fair 2025',
        company: 'Sample Tech Company',
        date: 'October 25, 2025',
        time: '10:00 AM - 4:00 PM',
        location: 'Virtual Event',
        type: 'Virtual',
        description: 'Join us for our annual tech career fair featuring top companies looking for talented software engineers, data scientists, and product managers. Network with recruiters, attend workshops, and explore exciting career opportunities.',
        categories: ['Software Engineering', 'Data Science', 'Career Fair'],
        interestedCount: 45,
        companiesCount: 12,
        matchPercentage: 95,
        requirements: [
            'Resume required',
            'Portfolio recommended',
            'LinkedIn profile'
        ]
    });

    const [isRSVPed, setIsRSVPed] = useState(false);

    const handleRSVP = () => {
        console.log('RSVP to event:', event.id);
        setIsRSVPed(!isRSVPed);
        // API call to RSVP
        alert(isRSVPed ? 'RSVP cancelled' : 'Successfully RSVP\'d to event!');
    };

    const handleShare = () => {
        console.log('Sharing event:', event.id);
        // Share functionality
        if (navigator.share) {
            navigator.share({
                title: event.title,
                text: event.description,
                url: window.location.href
            });
        } else {
            alert('Share link copied to clipboard!');
        }
    };

    const handleBack = () => {
        console.log('Going back to browse');
        // Navigate back
    };

    return (
        <div className="view-event-container">
            <div className="view-event-content">
                <button className="back-button" onClick={handleBack}>
                    ← Back to Browse
                </button>

                {/* Event Hero Card */}
                <div className="event-hero">
                    <div className="event-type-badge">{event.type}</div>

                    <h1 className="event-hero-title">{event.title}</h1>

                    <div className="event-info">
                        <div className="info-row">
                            <span className="info-icon">🏢</span>
                            <span>{event.company}</span>
                        </div>

                        <div className="info-row">
                            <span className="info-icon">📅</span>
                            <span>{event.date} • {event.time}</span>
                        </div>

                        <div className="info-row">
                            <span className="info-icon">📍</span>
                            <span>{event.location}</span>
                        </div>
                    </div>

                    <p className="event-description">{event.description}</p>

                    {/* Stats Row */}
                    <div className="stats-row">
                        <div className="stat-item">
                            <div className="stat-number">{event.interestedCount}</div>
                            <div className="stat-label">Interested</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">{event.companiesCount}</div>
                            <div className="stat-label">Companies</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">{event.matchPercentage}%</div>
                            <div className="stat-label">Match</div>
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="event-categories">
                        {event.categories.map((category, index) => (
                            <span key={index} className="category-tag">
                                {category}
                            </span>
                        ))}
                    </div>

                    {/* Requirements */}
                    {event.requirements && event.requirements.length > 0 && (
                        <div className="requirements-section">
                            <h3 className="requirements-title">Requirements</h3>
                            <ul className="requirements-list">
                                {event.requirements.map((req, index) => (
                                    <li key={index}>{req}</li>
                                ))}
                            </ul>
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