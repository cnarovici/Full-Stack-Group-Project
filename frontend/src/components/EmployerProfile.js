import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './EmployerProfile.css';

const API_BASE_URL = 'http://localhost:5001/api';

const EmployerProfile = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [profile, setProfile] = useState(null);
    const [isEditingOverview, setIsEditingOverview] = useState(false);
    const [overviewText, setOverviewText] = useState('');

    const [postedEvents] = useState([
        {
            id: 1,
            title: 'Fall Engineering Expo',
            date: 'Oct 30, 2025',
            interestedStudents: 45,
            status: 'Active'
        },
        {
            id: 2,
            title: 'Product Management Workshop',
            date: 'Nov 5, 2025',
            interestedStudents: 32,
            status: 'Active'
        },
        {
            id: 3,
            title: 'Summer Internship Fair',
            date: 'Dec 15, 2025',
            interestedStudents: 28,
            status: 'Upcoming'
        }
    ]);

    const [interestedStudents] = useState([
        {
            id: 1,
            name: 'Sarah Chen',
            major: 'Computer Science',
            school: 'Stanford University',
            interests: ['Software Engineering', 'AI/ML']
        },
        {
            id: 2,
            name: 'Michael Brown',
            major: 'Electrical Engineering',
            school: 'MIT',
            interests: ['Hardware', 'Robotics']
        },
        {
            id: 3,
            name: 'Emily Davis',
            major: 'Data Science',
            school: 'UC Berkeley',
            interests: ['Analytics', 'Machine Learning']
        },
        {
            id: 4,
            name: 'James Wilson',
            major: 'Business Administration',
            school: 'Harvard University',
            interests: ['Product Management', 'Strategy']
        }
    ]);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/');
                return;
            }

            const response = await fetch(`${API_BASE_URL}/profile/employer`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch profile');
            }

            setProfile(data);
            setOverviewText(data.description || '');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleOverviewEdit = async () => {
        if (isEditingOverview) {
            // Save the changes
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_BASE_URL}/profile/employer`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        description: overviewText
                    })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Failed to update profile');
                }

                setProfile(prev => ({ ...prev, description: overviewText }));
            } catch (err) {
                alert('Error updating profile: ' + err.message);
            }
        }
        setIsEditingOverview(!isEditingOverview);
    };

    const handleOverviewChange = (e) => {
        setOverviewText(e.target.value);
    };

    const handleViewApplicants = (eventId) => {
        console.log(`Viewing applicants for event ${eventId}`);
        alert(`Navigating to applicants for event ${eventId}`);
    };

    const handleContactStudent = (studentId) => {
        console.log(`Contacting student ${studentId}`);
        alert(`Opening chat with student ${studentId}`);
    };

    const getInitials = (name) => {
        if (!name) return 'C';
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                fontSize: '24px'
            }}>
                Loading...
            </div>
        );
    }

    if (error) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                fontSize: '24px',
                padding: '20px',
                textAlign: 'center'
            }}>
                <p>Error: {error}</p>
                <button 
                    onClick={() => navigate('/employer/dashboard')}
                    style={{
                        marginTop: '20px',
                        padding: '12px 24px',
                        background: 'white',
                        color: '#667eea',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: 'pointer'
                    }}
                >
                    Back to Dashboard
                </button>
            </div>
        );
    }

    if (!profile) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                fontSize: '24px'
            }}>
                No profile found
            </div>
        );
    }

    return (
        <div className="profile-container">
            <div className="profile-content">
                {/* Profile Header */}
                <div className="profile-header">
                    <div className="profile-avatar">
                        {getInitials(profile.company_name)}
                    </div>
                    <div className="profile-name">{profile.company_name}</div>
                    <div className="profile-subtitle">
                        {profile.industry} • {profile.location || 'Location not set'}
                    </div>
                    <div className="profile-contact-info">
                        {profile.website && <span>🌐 {profile.website}</span>}
                        <span>✉️ {profile.user?.email || 'Email not available'}</span>
                    </div>
                </div>

                {/* Company Overview Section */}
                <div className="profile-section">
                    <div className="section-header">
                        <h3 className="section-title">Company Overview</h3>
                        <button className="edit-btn" onClick={handleOverviewEdit}>
                            {isEditingOverview ? 'Save' : 'Edit'}
                        </button>
                    </div>
                    {isEditingOverview ? (
                        <textarea
                            className="overview-textarea"
                            value={overviewText}
                            onChange={handleOverviewChange}
                            rows="5"
                            placeholder="Tell students about your company..."
                        />
                    ) : (
                        <p className="overview-text">
                            {profile.description || 'No company description available. Click Edit to add one.'}
                        </p>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="profile-section">
                    <div className="section-header">
                        <h3 className="section-title">Quick Actions</h3>
                    </div>
                    <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                        <button 
                            className="add-btn"
                            onClick={() => navigate('/employer/edit-profile')}
                        >
                            Edit Profile
                        </button>
                        <button 
                            className="add-btn"
                            onClick={() => navigate('/employer/dashboard')}
                        >
                            Back to Dashboard
                        </button>
                    </div>
                </div>

                {/* Posted Events Section */}
                <div className="profile-section">
                    <div className="section-header">
                        <h3 className="section-title">Posted Events</h3>
                        <button className="add-btn">+ New Event</button>
                    </div>
                    <div className="events-list">
                        {postedEvents.map(event => (
                            <div key={event.id} className="event-card">
                                <div className="event-content">
                                    <div className="event-header">
                                        <h4 className="event-title">{event.title}</h4>
                                        <span className={`event-status status-${event.status.toLowerCase()}`}>
                                            {event.status}
                                        </span>
                                    </div>
                                    <p className="event-details">
                                        📅 {event.date} • 👥 {event.interestedStudents} Interested Students
                                    </p>
                                </div>
                                <button
                                    className="btn-secondary"
                                    onClick={() => handleViewApplicants(event.id)}
                                >
                                    View Applicants
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Interested Students Section */}
                <div className="profile-section">
                    <div className="section-header">
                        <h3 className="section-title">Interested Students</h3>
                        <span className="student-count">{interestedStudents.length} students</span>
                    </div>
                    <div className="students-list">
                        {interestedStudents.map(student => (
                            <div key={student.id} className="student-card">
                                <div className="student-avatar">
                                    {getInitials(student.name)}
                                </div>
                                <div className="student-info">
                                    <h4 className="student-name">{student.name}</h4>
                                    <p className="student-details">
                                        {student.major} • {student.school}
                                    </p>
                                    <div className="student-interests">
                                        {student.interests.map((interest, index) => (
                                            <span key={index} className="interest-tag">
                                                {interest}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="student-actions">
                                    <button
                                        className="btn-message"
                                        onClick={() => handleContactStudent(student.id)}
                                    >
                                        💬 Message
                                    </button>
                                    <button className="btn-view-profile">
                                        View Profile
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Stats Section */}
                <div className="profile-section">
                    <h3 className="section-title">Quick Stats</h3>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-number">{postedEvents.length}</div>
                            <div className="stat-label">Active Events</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-number">
                                {postedEvents.reduce((sum, event) => sum + event.interestedStudents, 0)}
                            </div>
                            <div className="stat-label">Total Interested</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-number">{interestedStudents.length}</div>
                            <div className="stat-label">Contacted Students</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-number">24</div>
                            <div className="stat-label">Applications</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployerProfile;