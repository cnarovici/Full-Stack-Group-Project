import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
// import myImage from "../assets/logo.jpg"; // Uncomment when you have the logo
const API_BASE_URL = 'http://localhost:5001/api';

export default function LoadingScreen() {
    const navigate = useNavigate();
    
    const styles = {
        container: {
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            flexDirection: "column",
            gap: "20px",
        },

        logo: {
            width: "150px",
            height: "150px",
            borderRadius: "50%",
            background: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "48px",
            fontWeight: "bold",
            color: "#667eea",
            marginBottom: "20px",
        },
  
        slogan: {
            fontSize: "1.8rem",
            color: "white",
            fontWeight: "600",
            textAlign: "center",
            padding: "0 20px",
        },

        buttons: {
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            marginTop: "20px",
            alignItems: "center",
        },

        button: {
            padding: "15px 40px",
            borderRadius: "12px",
            //border: "none",
            backgroundColor: "white",
            color: "#667eea",
            cursor: "pointer",
            //fontSize: "1.1rem",
            //fontWeight: "600",
            //transition: "all 0.3s ease",
            //minWidth: "200px", 
            width: "250px", 
            border: "2px solid #5100ff",        
            fontFamily: "Arial sans_serif",
            fontSize: "1.2rem",
            fontWeight: "500", 
            transition: "background 0.3s ease, color 0.3s ease, transform 0.2s ease",
            textAlign: "center", 
        },
    
    };

    // Hover and active handlers
    const handleMouseEnter = (e) => {
        e.target.style.background =
        "linear-gradient(130deg, #cec1e7, #ad91ea, #a27fef)";
        e.target.style.color = "#ffffff";
        e.target.style.transform = "scale(1.05)";
    };

    const handleMouseLeave = (e) => {
        e.target.style.background = "#ffffff";
        e.target.style.color = "#5100ff";
        e.target.style.transform = "scale(1)";
    };

    const handleMouseDown = (e) => {
        e.target.style.transform = "scale(0.98)";
    };

    const handleMouseUp = (e) => {
        e.target.style.transform = "scale(1.05)";
    };

    const handleStudentClick = () => {
        navigate("/student/auth");
    };

    const handleEmployerClick = () => {
        navigate("/employer/auth");
    };

    return (
        <div style={styles.container}>
        <div style={styles.logo}>CC</div>

        <h2 style={styles.slogan}>
            Connecting Talent and Opportunity - Smarter
        </h2>

        <div style={styles.buttons}>
            <button
            style={styles.button}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onClick={handleStudentClick}
            >
            For Students
            </button>
            <button
            style={styles.button}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onClick={handleEmployerClick}
            >
            For Employers
            </button>
        </div>
        </div>
    );
}