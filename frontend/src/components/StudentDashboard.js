import React from "react";
import { AiOutlineFileText } from "react-icons/ai";
import { FiEdit3, FiSearch } from "react-icons/fi";
import { FaBriefcase, FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./StudentDashboard.css";

const StudentDashboard = () => {
    const navigate = useNavigate();

    const handleCardClick = (path) => {
        navigate(path);
    };

    // Example recommended events
    const recommendedEvents = [
        {
            title: "Tech Innovators Meetup 2025",
            location: "Chicago Tech Hub",
            date: "Nov 12, 2025",
            type: "Software Engineering",
        },
        {
            title: "AI & Data Career Expo",
            location: "UIC Convention Center",
            date: "Dec 5, 2025",
            type: "Data Engineering",
        },
        {
            title: "Women in STEM Networking Night",
            location: "Google Campus",
            date: "Nov 30, 2025",
            type: "Networking",
        },
    ];

    return (
        <div className="dashboard-wrapper">
            {/* Search Bar */}
            <div className="dashboard-header">
                <input
                    type="text"
                    placeholder="Welcome back...!"
                    className="dashboard-search"
                />
            </div>

            {/* Dashboard 4 Boxes */}
            <div className="dashboard-grid">
                <div className="dashboard-card" onClick={() => handleCardClick("/student/update-resume")}>
                    <AiOutlineFileText className="dashboard-icon" />
                    <h3>Update Resume</h3>
                </div>

                <div className="dashboard-card" onClick={() => handleCardClick("/student/edit-profile")}>
                    <FiEdit3 className="dashboard-icon" />
                    <h3>Edit Profile</h3>
                </div>

                <div className="dashboard-card" onClick={() => handleCardClick("/student/browse-events")}>
                    <FiSearch className="dashboard-icon" />
                    <h3>Browse Event</h3>
                </div>

                <div className="dashboard-card" onClick={() => handleCardClick("/student/saved-jobs")}>
                    <FaBriefcase className="dashboard-icon" />
                    <h3>Saved Job</h3>
                </div>
            </div>

            {/* Recommended Section */}
            <div className="recommended-section">
                <h2 className="recommended-title">Recommended For You</h2>

                <div className="recommended-list">
                    {recommendedEvents.map((event, index) => (
                        <div key={index} className="event-container">
                            <h3 className="event-title">{event.title}</h3>
                            <div className="event-info">
                                <div className="event-details">
                                    <FaMapMarkerAlt className="event-icon" />
                                    <span>{event.location}</span>
                                </div>
                                <div className="event-details">
                                    <FaCalendarAlt className="event-icon" />
                                    <span>{event.date}</span>
                                </div>
                            </div>
                            <button className="event-type-btn">{event.type}</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
