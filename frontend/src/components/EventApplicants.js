import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './EventApplicants.css';

const API_BASE_URL = 'http://localhost:5001/api';

const EventApplicants = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const [applicants, setApplicants] = useState([]);
    const [eventTitle, setEventTitle] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchApplicants();
    }, [eventId]);

    const fetchApplicants = async () => {
        try {
            const token = localStorage.getItem('token');
            
            // Fetch event details
            const eventResponse = await fetch(`${API_BASE_URL}/events/${eventId}`);
            if (eventResponse.ok) {
                const eventData = await eventResponse.json();
                setEventTitle(eventData.title);
            }

            // Fetch applicants
            const response = await fetch(`${API_BASE_URL}/events/${eventId}/applicants`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setApplicants(data);
            }
        } catch (err) {
            console.error('Error fetching applicants:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="applicants-page">
            <button className="back-button" onClick={() => navigate('/employer/dashboard')}>
                ← Back to Dashboard
            </button>

            <h1 className="page-title">Applicants for: {eventTitle}</h1>
            <p className="applicant-count">{applicants.length} student{applicants.length !== 1 ? 's' : ''} interested</p>

            {loading ? (
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading applicants...</p>
                </div>
            ) : applicants.length === 0 ? (
                <div className="no-applicants">
                    <p>No students have RSVP'd to this event yet.</p>
                </div>
            ) : (
                <div className="applicants-list">
                    {applicants.map((applicant) => (
                        <div key={applicant.id} className="applicant-card">
                            <div className="applicant-header">
                                <div className="applicant-avatar">
                                    {applicant.full_name ? applicant.full_name.charAt(0).toUpperCase() : 'S'}
                                </div>
                                <div className="applicant-info">
                                    <h3>{applicant.full_name || 'Student'}</h3>
                                    <p className="applicant-school">{applicant.school}</p>
                                </div>
                            </div>
                            
                            <div className="applicant-details">
                                <div className="detail-row">
                                    <strong>Major:</strong> {applicant.major || 'Not specified'}
                                </div>
                                <div className="detail-row">
                                    <strong>RSVP Date:</strong> {new Date(applicant.rsvp_date).toLocaleDateString()}
                                </div>
                            </div>
                            
                            {applicant.skills && applicant.skills.length > 0 && (
                                <div className="skills-section">
                                    <strong>Skills:</strong>
                                    <div className="skill-tags">
                                        {applicant.skills.map((skill, idx) => (
                                            <span key={idx} className="skill-tag">{skill}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {applicant.job_preferences && applicant.job_preferences.length > 0 && (
                                <div className="preferences-section">
                                    <strong>Job Interests:</strong>
                                    <div className="preference-tags">
                                        {applicant.job_preferences.map((pref, idx) => (
                                            <span key={idx} className="preference-tag">{pref}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {applicant.resume_url && (
                                <div className="resume-section">
                                    <a href={applicant.resume_url} target="_blank" rel="noopener noreferrer" className="resume-link">
                                        📄 View Resume
                                    </a>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EventApplicants;