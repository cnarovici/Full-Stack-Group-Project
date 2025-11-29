import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './StudentProfile.css';

const API_BASE_URL = 'http://localhost:5001/api';

// Predefined options (should match backend)
const PREDEFINED_SKILLS = [
    'Python', 'JavaScript', 'Java', 'C++', 'React', 'Node.js',
    'SQL', 'Machine Learning', 'Data Analysis', 'AWS', 'Docker',
    'Git', 'TypeScript', 'Go', 'Rust', 'Kubernetes'
];

const JOB_PREFERENCES = [
    'Software Engineering', 'Data Science', 'Product Management',
    'UX Design', 'DevOps', 'Machine Learning', 'Frontend Development',
    'Backend Development', 'Full Stack', 'Mobile Development',
    'Cloud Engineering', 'Cybersecurity'
];

const StudentEditProfile = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    // Form state
    const [fullName, setFullName] = useState('');
    const [school, setSchool] = useState('');
    const [major, setMajor] = useState('');
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [selectedPreferences, setSelectedPreferences] = useState([]);

    const fetchProfile = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/');
                return;
            }

            const response = await fetch(`${API_BASE_URL}/profile/student`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch profile');
            }

            // Populate form with existing data
            setFullName(data.full_name || '');
            setSchool(data.school || '');
            setMajor(data.major || '');
            setSelectedSkills(data.skills || []);
            setSelectedPreferences(data.job_preferences || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const toggleSkill = (skill) => {
        setSelectedSkills(prev => 
            prev.includes(skill)
                ? prev.filter(s => s !== skill)
                : [...prev, skill]
        );
    };

    const togglePreference = (pref) => {
        setSelectedPreferences(prev =>
            prev.includes(pref)
                ? prev.filter(p => p !== pref)
                : [...prev, pref]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('token');
            
            const response = await fetch(`${API_BASE_URL}/profile/student`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    full_name: fullName,
                    school: school,
                    major: major,
                    skills: selectedSkills,
                    job_preferences: selectedPreferences
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to update profile');
            }

            // Update localStorage with new name
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                user.full_name = fullName;
                localStorage.setItem('user', JSON.stringify(user));
            }

            setSuccess('Profile updated successfully!');
            
            // Redirect after short delay
            setTimeout(() => {
                navigate('/student/profile');
            }, 1500);

        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#f5f7fa',
                color: '#667eea',
                fontSize: '24px'
            }}>
                Loading...
            </div>
        );
    }

    return (
        <div style={{ 
            minHeight: '100vh', 
            backgroundColor: '#f5f7fa',
            padding: '0',
            margin: '0'
        }}>
            <div style={{
                maxWidth: '700px',
                margin: '0 auto',
                padding: '20px 10px'
            }}>
                {/* Page Title */}
                <div className="profile-header">
                    <h2 className="profile-name">Edit Profile</h2>
                </div>

                {error && (
                    <div style={{
                        background: '#fee2e2',
                        color: '#dc2626',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        marginBottom: '20px',
                        fontSize: '14px'
                    }}>
                        {error}
                    </div>
                )}
                
                {success && (
                    <div style={{
                        background: '#d1fae5',
                        color: '#059669',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        marginBottom: '20px',
                        fontSize: '14px'
                    }}>
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Basic Info */}
                    <div className="skills-container">
                        <h3>Basic Information</h3>
                        
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ 
                                display: 'block', 
                                marginBottom: '6px', 
                                fontWeight: '500',
                                color: '#555',
                                fontSize: '14px'
                            }}>
                                Full Name
                            </label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Enter your full name"
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    border: '2px solid #e0e0e0',
                                    borderRadius: '8px',
                                    fontSize: '15px',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ 
                                display: 'block', 
                                marginBottom: '6px', 
                                fontWeight: '500',
                                color: '#555',
                                fontSize: '14px'
                            }}>
                                School
                            </label>
                            <input
                                type="text"
                                value={school}
                                onChange={(e) => setSchool(e.target.value)}
                                placeholder="Enter your school"
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    border: '2px solid #e0e0e0',
                                    borderRadius: '8px',
                                    fontSize: '15px',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '0' }}>
                            <label style={{ 
                                display: 'block', 
                                marginBottom: '6px', 
                                fontWeight: '500',
                                color: '#555',
                                fontSize: '14px'
                            }}>
                                Major
                            </label>
                            <input
                                type="text"
                                value={major}
                                onChange={(e) => setMajor(e.target.value)}
                                placeholder="Enter your major"
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    border: '2px solid #e0e0e0',
                                    borderRadius: '8px',
                                    fontSize: '15px',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>
                    </div>

                    {/* Skills Section */}
                    <div className="skills-container">
                        <h3>Skills</h3>
                        <div className="skills-list">
                            {PREDEFINED_SKILLS.map((skill) => (
                                <button
                                    key={skill}
                                    type="button"
                                    className="skill-button"
                                    onClick={() => toggleSkill(skill)}
                                    style={{
                                        background: selectedSkills.includes(skill) 
                                            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                                            : '#f0f4ff',
                                        color: selectedSkills.includes(skill) ? 'white' : '#667eea',
                                        border: selectedSkills.includes(skill) ? 'none' : '2px solid #667eea',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {skill}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Job Preferences Section */}
                    <div className="skills-container">
                        <h3>Job Preferences</h3>
                        <div className="skills-list">
                            {JOB_PREFERENCES.map((pref) => (
                                <button
                                    key={pref}
                                    type="button"
                                    className="skill-button"
                                    onClick={() => togglePreference(pref)}
                                    style={{
                                        background: selectedPreferences.includes(pref) 
                                            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                                            : '#f0f4ff',
                                        color: selectedPreferences.includes(pref) ? 'white' : '#667eea',
                                        border: selectedPreferences.includes(pref) ? 'none' : '2px solid #667eea',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {pref}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="back-button-container">
                        <button
                            type="submit"
                            className="edit-profile-button"
                            disabled={saving}
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                            type="button"
                            className="back-button"
                            onClick={() => navigate('/student/profile')}
                            disabled={saving}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StudentEditProfile;