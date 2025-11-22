import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './EmployerPostEvents.css';

const API_BASE_URL = 'http://localhost:5001/api';

const EmployerPostEvents = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        event_date: '',
        location: '',
        event_type: 'In-Person',
        tags: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.title || !formData.event_date) {
            alert('Please fill in required fields: Title and Date');
            return;
        }

        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            
            if (!token) {
                navigate('/login');
                return;
            }

            // Convert tags string to array
            const tagsArray = formData.tags
                .split(',')
                .map(tag => tag.trim())
                .filter(tag => tag.length > 0);

            const eventData = {
                ...formData,
                tags: tagsArray
            };

            console.log('📤 Posting event:', eventData);

            const response = await fetch(`${API_BASE_URL}/events`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(eventData)
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to create event');
            }

            const data = await response.json();
            console.log('✅ Event created:', data);

            alert('Event posted successfully!');
            navigate('/employer/dashboard');
        } catch (err) {
            console.error('❌ Error posting event:', err);
            alert(`Failed to post event: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="post-event-container">
            <button className="back-button" onClick={() => navigate('/employer/dashboard')}>
                ← Back to Dashboard
            </button>

            <h1 className="page-title">Post New Event</h1>

            <form className="post-event-form" onSubmit={handleSubmit}>
                <label className="section-label">Event Title *</label>
                <div className="input-wrapper">
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Enter event title"
                        className="input-field"
                        required
                    />
                </div>

                <label className="section-label">Description</label>
                <div className="input-wrapper">
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Describe the event"
                        className="input-field"
                    />
                </div>

                <label className="section-label">Date *</label>
                <div className="input-wrapper">
                    <input
                        type="datetime-local"
                        name="event_date"
                        value={formData.event_date}
                        onChange={handleChange}
                        className="input-field"
                        required
                    />
                </div>

                <label className="section-label">Event Type</label>
                <div className="input-wrapper">
                    <select
                        name="event_type"
                        value={formData.event_type}
                        onChange={handleChange}
                        className="input-field"
                    >
                        <option value="In-Person">In-Person</option>
                        <option value="Virtual">Virtual</option>
                        <option value="Hybrid">Hybrid</option>
                    </select>
                </div>

                <label className="section-label">Location</label>
                <div className="input-wrapper">
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="Enter location"
                        className="input-field"
                    />
                </div>

                <label className="section-label">Tags (comma-separated)</label>
                <div className="input-wrapper">
                    <input
                        type="text"
                        name="tags"
                        value={formData.tags}
                        onChange={handleChange}
                        placeholder="e.g. Software Engineering, Data Science, AI"
                        className="input-field"
                    />
                </div>

                <button type="submit" className="post-button" disabled={loading}>
                    {loading ? 'Posting...' : 'Post Event'}
                </button>
            </form>
        </div>
    );
};

export default EmployerPostEvents;