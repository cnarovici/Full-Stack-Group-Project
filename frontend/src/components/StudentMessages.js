import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './StudentMessages.css';

const API_BASE_URL = 'http://localhost:5001/api';

const StudentMessages = () => {
    const navigate = useNavigate();
    const [employers, setEmployers] = useState([]);
    const [selectedEmployer, setSelectedEmployer] = useState('');
    const [subject, setSubject] = useState('');
    const [messageText, setMessageText] = useState('');
    const [sentMessages, setSentMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showSent, setShowSent] = useState(false);

    useEffect(() => {
        fetchEmployers();
        fetchSentMessages();
    }, []);

    const fetchEmployers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/events`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const events = await response.json();
                // Extract unique employers
                const uniqueEmployers = [];
                const employerIds = new Set();
                
                events.forEach(event => {
                    if (event.employer && !employerIds.has(event.employer.id)) {
                        employerIds.add(event.employer.id);
                        uniqueEmployers.push(event.employer);
                    }
                });
                
                setEmployers(uniqueEmployers);
            }
        } catch (err) {
            console.error('Error fetching employers:', err);
        }
    };

    const fetchSentMessages = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/messages`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setSentMessages(data);
            }
        } catch (err) {
            console.error('Error fetching sent messages:', err);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (!selectedEmployer || !messageText.trim()) {
            alert('Please select an employer and enter a message');
            return;
        }

        try {
            setLoading(true);
            const token = localStorage.getItem('token');

            const response = await fetch(`${API_BASE_URL}/messages`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    recipient_id: selectedEmployer,
                    subject: subject || 'Message from Student',
                    message_text: messageText
                })
            });

            if (response.ok) {
                alert('Message sent successfully!');
                setSelectedEmployer('');
                setSubject('');
                setMessageText('');
                fetchSentMessages();
            } else {
                const data = await response.json();
                throw new Error(data.message);
            }
        } catch (err) {
            console.error('Error sending message:', err);
            alert(`Failed to send message: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="student-messages-page">
            <button className="back-button" onClick={() => navigate('/student/dashboard')}>
                ← Back to Dashboard
            </button>

            <h1 className="page-title">Messages</h1>

            <div className="message-tabs">
                <button
                    className={`tab ${!showSent ? 'active' : ''}`}
                    onClick={() => setShowSent(false)}
                >
                    Send Message
                </button>
                <button
                    className={`tab ${showSent ? 'active' : ''}`}
                    onClick={() => setShowSent(true)}
                >
                    Sent Messages ({sentMessages.length})
                </button>
            </div>

            {!showSent ? (
                <form className="message-form" onSubmit={handleSendMessage}>
                    <label className="form-label">Send To</label>
                    <select
                        className="form-select"
                        value={selectedEmployer}
                        onChange={(e) => setSelectedEmployer(e.target.value)}
                        required
                    >
                        <option value="">Select an employer...</option>
                        {employers.map(emp => (
                            <option key={emp.id} value={emp.id}>
                                {emp.company_name}
                            </option>
                        ))}
                    </select>

                    <label className="form-label">Subject (Optional)</label>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Enter subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                    />

                    <label className="form-label">Message</label>
                    <textarea
                        className="form-textarea"
                        placeholder="Type your message here..."
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        rows="6"
                        required
                    />

                    <button type="submit" className="send-button" disabled={loading}>
                        {loading ? 'Sending...' : 'Send Message'}
                    </button>
                </form>
            ) : (
                <div className="sent-messages-list">
                    {sentMessages.length === 0 ? (
                        <p className="no-messages">No sent messages yet</p>
                    ) : (
                        sentMessages.map(msg => (
                            <div key={msg.id} className="sent-message-card">
                                <div className="message-to">
                                    To: <strong>{msg.recipient_name}</strong>
                                </div>
                                {msg.subject && (
                                    <div className="message-subject">{msg.subject}</div>
                                )}
                                <div className="message-content">{msg.message_text}</div>
                                <div className="message-date">
                                    Sent: {new Date(msg.created_at).toLocaleString()}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default StudentMessages;