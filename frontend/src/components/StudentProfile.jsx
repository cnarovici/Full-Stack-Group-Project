import React, { useState } from "react";
import "../App.css";
import { FaFileAlt } from "react-icons/fa";

export default function StudentProfile() {
  
  const [savedEvents, setSavedEvents] = useState([
    { name: "Fall Engineer Expo 2025", organizer: "Google Campus 2025", link: "/events/tech-careers-fair" },
    { name: "Tech Careers Fair 2025", organizer: "UIC Career Center", link: "/events/tech-careers-fair" },
    { name: "AI & Machine Learning Expo", organizer: "Chicago Tech Hub", link: "/events/ai-expo" },
    { name: "Women in STEM Networking", organizer: "W-STEM Org", link: "/events/women-stem" },
    { name: "Startup Job Summit", organizer: "Innovate Chicago", link: "/events/startup-summit" },
  ]);

  const handleDelete = (indexToRemove) => {
    setSavedEvents((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  return (
    <div className="profile-wrapper">
      {/* Profile Section */}
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-initial-circle">JT</div>
          <h2 className="profile-name">John Tran</h2>
          <hr className="divider" />
          <div className="personal-details">
            <p>Computer Science • University of Illinois at Chicago</p>
          </div>
        </div>
      </div>

      {/* Resume Section */}
      <div className="resume-container">
        <h3>My Resume</h3>
        <div className="resume-details">
          <div className="resume-file-info">
            <FaFileAlt className="resume-icon" />
            <span className="resume-filename">John_Tran_Resume_2025.pdf</span>
          </div>
          <button
            className="resume-button"
            onClick={() => window.open("/resumes/Alice_Resume_2025.pdf", "_blank")}
          >
            View Resume
          </button>
        </div>
      </div>

      {/* Skills Section */}
      <div className="skills-container">
        <h3>Skills & Interests</h3>
        <div className="skills-list">
          {["Python", "JavaScript", "Machine Learning", "React", "Node.js", "CSS", "Git"].map((skill, index) => (
            <button key={index} className="skill-button">{skill}</button>
          ))}
        </div>
      </div>

      {/* Saved Events Section */}
      <div className="saved-events-container">
        <h3>Saved Events</h3>
        <div className="saved-events-slider">
          {savedEvents.map((event, index) => (
              <div key={index} className="event-card">
              <div className="event-name">{event.name}</div>
              <div className="event-organizer">{event.organizer}</div>
              <div className="event-actions">
                <button
                  className="view-btn"
                  onClick={() => window.location.href = event.link}
                >
                    View
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(index)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}



