import React from "react";
import { FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./EmployerDashboard.css";

const EmployerDashboard = () => {
    const navigate = useNavigate();

    const yourEvents = [
        {
            title: "TechCorp Hiring Fair 2025",
            location: "Chicago, IL",
            date: "Oct 28, 2025",
            type: "Software Engineering"
        },
        {
            title: "AI Recruitment Day",
            location: "San Francisco, CA",
            date: "Nov 10, 2025",
            type: "Machine Learning"
        },
        {
            title: "Intern Networking Event",
            location: "Virtual",
            date: "Dec 3, 2025",
            type: "Data Science"
        }
    ];

    const messages = [
        { from: "John Tran", text: "Hello! I’m interested in your Software Engineering event." },
        { from: "Emma Lee", text: "Is there a resume submission link for the AI event?" },
        { from: "Carlos M.", text: "Can I still register for the internship fair?" },
        { from: "Maya K.", text: "Thank you for hosting such a great session!" },
    ];

    return (
        <div className="dashboard-wrapper">
            {/* Header */}
            <div className="dashboard-header">
                <input
                    type="text"
                    placeholder="Welcome, TechCorp Inc"
                    className="dashboard-search"
                    readOnly
                />
                <div className="post-btn-container">
                    <button
                        className="post-event-btn"
                        onClick={() => navigate("/employer/post-event")}
                    >
                        + Post New Event
                    </button>
                </div>
            </div>


            {/* Your Posted Events Section */}
            <div className="recommended-section">
                <h3 className="recommended-title">Your Posted Events</h3>
                <div className="recommended-list">
                    {yourEvents.map((event, index) => (
                        <div key={index} className="event-container">
                            <div className="event-title">{event.title}</div>
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

            {/* Recent Messages Section */}
            <div className="messages-section">
                <h3 className="recommended-title">Recent Messages</h3>
                <div className="messages-slider">
                    {messages.map((msg, index) => (
                        <div key={index} className="message-card">
                            <p className="message-from">{msg.from}</p>
                            <p className="message-text">{msg.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EmployerDashboard;
