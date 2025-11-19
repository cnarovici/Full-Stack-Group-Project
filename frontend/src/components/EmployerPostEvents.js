import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './EmployerPostEvents.css';

const PostEvents = () => {
    const navigate = useNavigate();

    const [eventTitle, setEventTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [location, setLocation] = useState('');
    const [category, setCategory] = useState('');

    return (
    <div className="post-event-container">
        <button className="back-button" onClick={() => navigate('/employer/dashboard')}>
            &larr; Back to Dashboard
        </button>

        <h1 className="page-title">Post New Event</h1>

        <form className="post-event-form" onSubmit={(e) => e.preventDefault()}>
            <label className="section-label">Event Title</label>
            <div className="input-wrapper">
            <input
                type="text"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                placeholder="Enter event title"
                className="input-field"
            />
            </div>

        <label className="section-label">Description</label>
        <div className="input-wrapper">
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the event"
                className="input-field"
            />
        </div>

        <label className="section-label">Date</label>
        <div className="input-wrapper">
            <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="input-field"
            />
        </div>

        <label className="section-label">Location</label>
        <div className="input-wrapper">
            <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter location"
                className="input-field"
            />
        </div>

        <label className="section-label">Categories</label>
        <div className="input-wrapper">
            <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Enter categories separated by comma"
                className="input-field"
            />
        </div>

        <button type="submit" className="post-button">Post Event</button>
        <button type="button" className="post-button draft-button">Save as Draft</button>
        </form>
    </div>
    );
};

export default PostEvents;
