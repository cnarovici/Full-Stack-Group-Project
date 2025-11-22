import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './EmployerMessages.css';

const API_BASE_URL = 'http://localhost:5001/api';

const EmployerMessages = () => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState({});
    const [replyBox, setReplyBox] = useState({ open: false, sender: '', messageId: null });
    const [replyText, setReplyText] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            
            if (!token) {
                navigate('/login');
                return;
            }

            console.log('📥 Fetching messages...');

            const response = await fetch(`${API_BASE_URL}/messages`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    navigate('/login');
                    return;
                }
                throw new Error('Failed to fetch messages');
            }

            const data = await response.json();
            console.log('✅ Messages received:', data);
            
            setMessages(data);
        } catch (err) {
            console.error('❌ Error fetching messages:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const toggleExpand = async (messageId) => {
        setExpanded((prev) => ({ ...prev, [messageId]: !prev[messageId] }));
        
        // Mark as read when expanded
        const message = messages.find(m => m.id === messageId);
        if (message && !message.is_read && !expanded[messageId]) {
            try {
                const token = localStorage.getItem('token');
                await fetch(`${API_BASE_URL}/messages/${messageId}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                // Update local state
                setMessages(prev =>
                    prev.map(msg =>
                        msg.id === messageId ? { ...msg, is_read: true } : msg
                    )
                );
            } catch (err) {
                console.error('Error marking message as read:', err);
            }
        }
    };

    const handleReply = (messageId, sender) => {
        setReplyBox({ open: true, sender, messageId });
    };

    const handleDelete = async (messageId) => {
        if (!window.confirm('Are you sure you want to delete this message?')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/messages/${messageId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
                alert('Message deleted successfully');
            } else {
                throw new Error('Failed to delete message');
            }
        } catch (err) {
            console.error('Error deleting message:', err);
            alert('Failed to delete message');
        }
    };

    const closeReplyBox = () => {
        setReplyBox({ open: false, sender: '', messageId: null });
        setReplyText('');
    };

    const sendReply = async () => {
        if (!replyText.trim()) {
            alert('Please enter a reply');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/messages/reply/${replyBox.messageId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message_text: replyText })
            });

            if (response.ok) {
                alert(`Reply sent to ${replyBox.sender}`);
                closeReplyBox();
                fetchMessages(); // Refresh messages
            } else {
                const data = await response.json();
                throw new Error(data.message || 'Failed to send reply');
            }
        } catch (err) {
            console.error('Error sending reply:', err);
            alert(`Failed to send reply: ${err.message}`);
        }
    };

    const getTimeAgo = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);
        
        if (seconds < 60) return `${seconds}s ago`;
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        return `${Math.floor(seconds / 86400)}d ago`;
    };

    if (loading) {
        return (
            <div className="messages-page">
                <button className="back-button" onClick={() => navigate('/employer/dashboard')}>
                    ← Back to Dashboard
                </button>
                <h1 className="page-title">Messages</h1>
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading messages...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="messages-page">
                <button className="back-button" onClick={() => navigate('/employer/dashboard')}>
                    ← Back to Dashboard
                </button>
                <h1 className="page-title">Messages</h1>
                <div className="error-state">
                    <p>Error: {error}</p>
                    <button onClick={fetchMessages} className="retry-button">Retry</button>
                </div>
            </div>
        );
    }

    return (
        <div className="messages-page">
            <button className="back-button" onClick={() => navigate('/employer/dashboard')}>
                ← Back to Dashboard
            </button>

            <h1 className="page-title">Messages</h1>

            {messages.length === 0 ? (
                <div className="no-messages">
                    <p>No messages yet. Students will be able to message you about your events.</p>
                </div>
            ) : (
                <div className="messages-container">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`message-box ${expanded[msg.id] ? 'expanded' : ''}`}
                            onClick={() => toggleExpand(msg.id)}
                        >
                            <div className="message-header">
                                <div className="sender-wrapper">
                                    {!msg.is_read && <span className="unread-dot"></span>}
                                    <span className="sender-name">{msg.sender_name}</span>
                                </div>
                                <span className="message-time">{getTimeAgo(msg.created_at)}</span>
                            </div>

                            {msg.subject && (
                                <div className="message-subject">
                                    <strong>{msg.subject}</strong>
                                </div>
                            )}

                            <div className="message-text">{msg.message_text}</div>

                            {expanded[msg.id] && (
                                <div className="message-actions">
                                    <button
                                        className="action-button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleReply(msg.id, msg.sender_name);
                                        }}
                                    >
                                        Reply
                                    </button>

                                    <button
                                        className="action-button delete"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(msg.id);
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Reply Popup Window */}
            {replyBox.open && (
                <div className="reply-popup">
                    <div className="reply-popup-header">
                        Reply to {replyBox.sender}
                        <button className="reply-close" onClick={closeReplyBox}>✖</button>
                    </div>

                    <textarea
                        className="reply-textarea"
                        placeholder="Type your reply..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                    />

                    <button className="reply-send" onClick={sendReply}>
                        Send
                    </button>
                </div>
            )}
        </div>
    );
};

export default EmployerMessages;