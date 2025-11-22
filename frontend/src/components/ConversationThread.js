import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ConversationThread.css';
import { FaArrowLeft, FaPaperPlane } from 'react-icons/fa';

const API_BASE_URL = 'http://localhost:5001/api';

const ConversationThread = () => {
    const { conversationId } = useParams();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);
    
    // Get user info from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userType = user.user_type;
    const userId = userType === 'student' ? user.id : user.id; // User's own ID

    useEffect(() => {
        fetchMessages();
    }, [conversationId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchMessages = async () => {
        try {
            const token = localStorage.getItem('token');
            console.log('📥 Fetching conversation messages...');
            
            const response = await fetch(`${API_BASE_URL}/messages/conversation/${conversationId}`, {
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

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        setSending(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/messages/conversation/${conversationId}/reply`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message_text: newMessage
                })
            });

            if (response.ok) {
                console.log('✅ Message sent');
                setNewMessage('');
                fetchMessages(); // Refresh messages
            } else {
                const errorData = await response.json();
                console.error('❌ Failed to send message:', errorData);
                alert(errorData.message || 'Failed to send message');
            }
        } catch (err) {
            console.error('Error sending message:', err);
            alert('Failed to send message');
        } finally {
            setSending(false);
        }
    };

    const handleBack = () => {
        // Navigate based on user type
        if (userType === 'student') {
            navigate('/student/messages');
        } else {
            navigate('/employer/messages');
        }
    };

    // ✅ FIXED: Better logic to determine if message is from current user
    const isMyMessage = (message) => {
        console.log('Checking message:', message);
        console.log('Current user type:', userType);
        
        if (userType === 'student') {
            // Student sent this message if sender exists and sender type is student
            return message.sender && message.sender.type === 'student';
        } else {
            // Employer sent this message if sender exists and sender type is employer
            return message.sender && message.sender.type === 'employer';
        }
    };

    // ✅ FIXED: Get sender name
    const getSenderName = (message, isMine) => {
        if (isMine) {
            return 'You';
        }
        
        // Get the other person's name
        if (message.sender) {
            return message.sender.name || 'Other';
        } else if (message.recipient) {
            return message.recipient.company_name || message.recipient.name || 'Other';
        }
        
        return 'Other';
    };

    return (
        <div className="conversation-thread-page">
            <div className="thread-header">
                <button className="back-button" onClick={handleBack}>
                    <FaArrowLeft /> Back to Messages
                </button>
                {messages.length > 0 && (
                    <div className="thread-info">
                        <h2>
                            {userType === 'student' 
                                ? messages[0].recipient?.company_name || 'Employer'
                                : messages[0].sender?.name || 'Student'}
                        </h2>
                        <p>{messages[0].subject}</p>
                    </div>
                )}
            </div>

            <div className="thread-container">
                {loading ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Loading conversation...</p>
                    </div>
                ) : (
                    <>
                        <div className="messages-thread">
                            {messages.map((message) => {
                                const isMine = isMyMessage(message);
                                return (
                                    <div 
                                        key={message.id} 
                                        className={`message-bubble ${isMine ? 'my-message' : 'their-message'}`}
                                    >
                                        <div className="message-sender">
                                            {getSenderName(message, isMine)}
                                        </div>
                                        <div className="message-text">
                                            {message.message_text}
                                        </div>
                                        <div className="message-time">
                                            {new Date(message.created_at).toLocaleString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        <form className="message-input-form" onSubmit={handleSendMessage}>
                            <input
                                type="text"
                                className="message-input"
                                placeholder="Type your message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                disabled={sending}
                            />
                            <button 
                                type="submit" 
                                className="send-button"
                                disabled={sending || !newMessage.trim()}
                            >
                                <FaPaperPlane />
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default ConversationThread;