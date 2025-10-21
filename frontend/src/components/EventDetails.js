import React from "react";
import "./EventDetails.css";

const EventDetail = () => {
    const event = {
        title: "Tech Career Fair 2025",
        companies: "TechCorp Inc., Microsoft, Amazon",
        date: "October 25, 2025 • 10:00 AM - 4:00 PM",
        location: "Virtual Event",
        description:
            "Join us for our annual tech career fair featuring top companies looking for talented software engineers, data scientists, and product managers. Network with recruiters and learn about exciting opportunities.",
        tags: ["Data Science", "Software Engineering", "Product Manager"],
        similarEvents: [
            {
                id: 1,
                title: "AI & ML Networking Event",
                date: "Nov 1, 2025",
                location: "San Francisco",
            },
        ],
    };

    return (
        <div className="event-container">
            <div className="event-card">
                <h2 className="event-title">{event.title}</h2>
                <p className="event-companies">🏢 {event.companies}</p>
                <p className="event-date">📅 {event.date}</p>
                <p className="event-location">📍 {event.location}</p>

                <p className="event-description">{event.description}</p>

                <div className="event-tags">
                    {event.tags.map((tag, index) => (
                        <span key={index} className="tag">
                            {tag}
                        </span>
                    ))}
                </div>

                <button className="rsvp-btn">RSVP to Event</button>
            </div>

            <div className="similar-section">
                <h3>Similar Events</h3>
                {event.similarEvents.map((similar) => (
                    <div key={similar.id} className="similar-card">
                        <p className="similar-title">{similar.title}</p>
                        <p className="similar-info">
                            📅 {similar.date} • 📍 {similar.location}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EventDetail;
