import React from "react";
import "../App.css";
import myImage from "../assets/logo.jpg";

export default function LoadingScreen() {
    
    const styles = {
        container: {
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#f0f4f8",
            flexDirection: "column",
            gap: "20px",
        },

        square: {
            width: "100px",
            height: "100px",
            borderRadius: "10%",  
            border: "2.5px solid #5100ff",
            display: "flex",

        },

        squareImage: {
            width: "100%",         
            height: "100%",
            objectFit: "contain",
            borderRadius: "10%",
        },
  
        slogan: {
            fontSize: "1.5rem",
            color: "#333",
        },

        buttons: {
            display: "flex",
            flexDirection: "column", // stack buttons vertically
            gap: "16px",             // space between buttons
            marginTop: "20px",
            alignItems: "center",    // center horizontally
        },

        button: {
            padding: "10px 20px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#5100ffff",
            color: "#ffffffff",
            cursor: "pointer",
            fontSize: "1rem",
        },
    };

    return (
        <div style={styles.container}>
            <div style={styles.square}>
                <img src={myImage} alt="Logo" style={styles.squareImage} />
            </div>
            
            <h2 style={styles.slogan}>Connecting talent and opportunity - smarter</h2>
            <div style={styles.buttons}>
                <button className="loading-button" onClick={() => alert("Students options!")}>
                            For Students
                </button>
                <button className="loading-button" onClick={() => alert("Employers options!")}>
                            For Employers
                </button>
            </div>
        </div>
    );
}
