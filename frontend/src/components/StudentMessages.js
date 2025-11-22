import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './StudentMessages.css';
import { FaArrowLeft, FaEnvelope, FaEnvelopeOpen } from 'react-icons/fa';

const API_BASE_URL = 'http://localhost:5001/api';

const StudentMessages = () => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const token = localStorage.getItem('token');
            console.log('📥 Fetching messages...');
            
            const response = await fetch(`${API_BASE_URL}/messages`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log('✅ Messages:', data);
                setMessages(data);
            } else {
                console.error('❌ Failed to fetch messages');
            }
        } catch (err) {
            console.error('Error fetching messages:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="student-messages-page">
            <div className="messages-header">
                <button className="back-button" onClick={() => navigate('/student/dashboard')}>
                    <FaArrowLeft /> Back to Dashboard
                </button>
                <h1>My Messages</h1>
            </div>

            {loading ? (
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading messages...</p>
                </div>
            ) : messages.length > 0 ? (
                <div className="messages-list">
                    {messages.map((message) => (
                        <div key={message.id} className="message-card">
                            <div className="message-header">
                                <div className="message-icon">
                                    <FaEnvelope />
                                </div>
                                <div className="message-info">
                                    <h3>{message.subject}</h3>
                                    <p className="message-from">
                                        To: {message.recipient?.company_name || 'Employer'}
                                    </p>
                                    <p className="message-date">
                                        {new Date(message.created_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            </div>
                            <div className="message-body">
                                <p>{message.message_text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="no-messages">
                    <h2>No Messages</h2>
                    <p>You haven't sent any messages to employers yet.</p>
                    <button 
                        className="browse-button"
                        onClick={() => navigate('/student/browse')}
                    >
                        Browse Events
                    </button>
                </div>
            )}
        </div>
    );
};

export default StudentMessages;