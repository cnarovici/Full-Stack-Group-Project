import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ConversationList.css';
import { FaArrowLeft, FaEnvelope, FaEnvelopeOpen, FaCircle } from 'react-icons/fa';

const API_BASE_URL = 'http://localhost:5001/api';

const ConversationList = () => {
    const navigate = useNavigate();
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Get user type from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userType = user.user_type;

    useEffect(() => {
        fetchConversations();
    }, []);

    const fetchConversations = async () => {
        try {
            const token = localStorage.getItem('token');
            console.log('📥 Fetching conversations...');
            
            const response = await fetch(`${API_BASE_URL}/messages/conversations`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log('✅ Conversations:', data);
                setConversations(data);
            } else {
                console.error('❌ Failed to fetch conversations');
            }
        } catch (err) {
            console.error('Error fetching conversations:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleConversationClick = (conversationId) => {
        // Navigate based on user type
        if (userType === 'student') {
            navigate(`/student/conversation/${conversationId}`);
        } else {
            navigate(`/employer/conversation/${conversationId}`);
        }
    };

    const handleBack = () => {
        // Navigate based on user type
        if (userType === 'student') {
            navigate('/student/dashboard');
        } else {
            navigate('/employer/dashboard');
        }
    };

    const handleBrowse = () => {
        // Navigate based on user type
        if (userType === 'student') {
            navigate('/student/browse');
        } else {
            navigate('/employer/dashboard');
        }
    };

    return (
        <div className="conversation-list-page">
            <div className="conversation-header">
                <button className="back-button" onClick={handleBack}>
                    <FaArrowLeft /> Back to Dashboard
                </button>
                <h1>Messages</h1>
            </div>

            {loading ? (
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading conversations...</p>
                </div>
            ) : conversations.length > 0 ? (
                <div className="conversations-container">
                    {conversations.map((conv) => (
                        <div 
                            key={conv.conversation_id} 
                            className={`conversation-item ${conv.unread_count > 0 ? 'unread' : ''}`}
                            onClick={() => handleConversationClick(conv.conversation_id)}
                        >
                            <div className="conversation-icon">
                                {conv.unread_count > 0 ? <FaEnvelope /> : <FaEnvelopeOpen />}
                            </div>
                            
                            <div className="conversation-content">
                                <div className="conversation-top">
                                    <h3>{conv.other_participant.name}</h3>
                                    <span className="conversation-time">
                                        {new Date(conv.last_message_time).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                </div>
                                
                                <p className="conversation-subject">{conv.subject}</p>
                                
                                <div className="conversation-bottom">
                                    <p className="conversation-preview">{conv.last_message}</p>
                                    {conv.unread_count > 0 && (
                                        <span className="unread-badge">
                                            <FaCircle /> {conv.unread_count}
                                        </span>
                                    )}
                                </div>
                                
                                <span className="message-count">{conv.message_count} message{conv.message_count !== 1 ? 's' : ''}</span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="no-conversations">
                    <h2>No Messages</h2>
                    <p>You haven't {userType === 'student' ? 'sent any messages' : 'received any messages'} yet.</p>
                    <button 
                        className="browse-button"
                        onClick={handleBrowse}
                    >
                        {userType === 'student' ? 'Browse Events' : 'Back to Dashboard'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default ConversationList;