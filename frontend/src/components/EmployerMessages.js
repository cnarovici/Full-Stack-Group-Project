import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './EmployerMessages.css';

const initialMessages = [
{
    id: 1,
    sender: 'Sarah',
    time: '2m ago',
    text: 'Hey! Can we discuss the event planning for next week? I have some ideas I want to share.',
    unread: true,
},
{
    id: 2,
    sender: 'John',
    time: '10m ago',
    text: 'Please review the document I sent you. Let me know your thoughts.',
    unread: true,
},
{
    id: 3,
    sender: 'Emma',
    time: '1h ago',
    text: 'Don’t forget the meeting tomorrow at 3 PM.',
    unread: false,
},
{
    id: 4,
    sender: 'Michael',
    time: '3h ago',
    text: `This is a really long message to test the expansion feature. It goes on for more than five lines so that we can see how the message box behaves when expanded. The purpose of this message is purely for testing and demonstration.`,
    unread: true,
},
];

const Messages = () => {
const navigate = useNavigate();
const [messages, setMessages] = useState(initialMessages);
const [expanded, setExpanded] = useState({});
const [replyBox, setReplyBox] = useState({ open: false, sender: '', id: null });
const [replyText, setReplyText] = useState('');

const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
    setMessages((prev) =>
    prev.map((msg) =>
        msg.id === id ? { ...msg, unread: false } : msg
    )
    );
};

const handleReply = (id, sender) => {
    setReplyBox({ open: true, sender, id });
};

const handleDelete = (id) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
};

const closeReplyBox = () => {
    setReplyBox({ open: false, sender: '', id: null });
    setReplyText('');
};

const sendReply = () => {
    alert(`Reply to ${replyBox.sender}: ${replyText}`);
    closeReplyBox();
};

const getPreviewText = (text, isExpanded) => {
    if (isExpanded) return text;
    const words = text.split(' ');
    if (words.length <= 6) return text;
    return words.slice(0, 6).join(' ') + '...';
};

return (
    <div className="messages-page">
    <button className="back-button" onClick={() => navigate('/employer/dashboard')}>
        &larr; Back to Dashboard
    </button>

    <h1 className="page-title">Message</h1>

    <div className="messages-container">
        {messages.map((msg) => (
        <div
            key={msg.id}
            className={`message-box ${expanded[msg.id] ? 'expanded' : ''}`}
            onClick={() => toggleExpand(msg.id)}
        >
            <div className="message-header">
            <div className="sender-wrapper">
                {msg.unread && <span className="unread-dot"></span>}
                <span className="sender-name">{msg.sender}</span>
            </div>
            <span className="message-time">{msg.time}</span>
            </div>

            <div className="message-text">
            {getPreviewText(msg.text, expanded[msg.id])}
            </div>

            {expanded[msg.id] && (
            <div className="message-actions">
                <button
                className="action-button"
                onClick={(e) => {
                    e.stopPropagation();
                    handleReply(msg.id, msg.sender);
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

export default Messages;

