import React, { useState } from 'react';
import './EmployerProfile.css';

const EmployerProfile = () => {
    const [isEditingOverview, setIsEditingOverview] = useState(false);
    const [companyData, setCompanyData] = useState({
        name: 'TechCorp Inc.',
        industry: 'Technology',
        location: 'San Francisco, CA',
        overview: 'TechCorp is a leading technology company specializing in cloud infrastructure and enterprise solutions. We\'re looking for passionate individuals to join our growing team.',
        website: 'www.techcorp.com',
        email: 'careers@techcorp.com'
    });

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

    const handleOverviewEdit = () => {
        setIsEditingOverview(!isEditingOverview);
    };

    const handleOverviewChange = (e) => {
        setCompanyData(prev => ({
            ...prev,
            overview: e.target.value
        }));
    };

    const handleViewApplicants = (eventId) => {
        console.log(`Viewing applicants for event ${eventId}`);
        // Add navigation logic here
        alert(`Navigating to applicants for event ${eventId}`);
    };

    const handleContactStudent = (studentId) => {
        console.log(`Contacting student ${studentId}`);
        // Add messaging logic here
        alert(`Opening chat with student ${studentId}`);
    };

    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('');
    };

    return (
        <div className="profile-container">
            <div className="profile-content">
                {/* Profile Header */}
                <div className="profile-header">
                    <div className="profile-avatar">
                        {getInitials(companyData.name)}
                    </div>
                    <div className="profile-name">{companyData.name}</div>
                    <div className="profile-subtitle">
                        {companyData.industry} • {companyData.location}
                    </div>
                    <div className="profile-contact-info">
                        <span>🌐 {companyData.website}</span>
                        <span>📧 {companyData.email}</span>
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
                            value={companyData.overview}
                            onChange={handleOverviewChange}
                            rows="5"
                        />
                    ) : (
                        <p className="overview-text">{companyData.overview}</p>
                    )}
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

                {/* Stats Section (Optional) */}
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