import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './StudentEditProfile.css';

const API_BASE_URL = 'http://localhost:5000/api';

const StudentEditProfile = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    const [formData, setFormData] = useState({
        full_name: '',
        school: '',
        major: '',
        skills: [],
        job_preferences: []
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
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

            setFormData({
                full_name: data.full_name || '',
                school: data.school || '',
                major: data.major || '',
                skills: data.skills || [],
                job_preferences: data.job_preferences || []
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSkillsChange = (e) => {
        const skillsArray = e.target.value.split(',').map(s => s.trim()).filter(s => s !== '');
        setFormData(prev => ({
            ...prev,
            skills: skillsArray
        }));
    };

    const handleJobPreferencesChange = (e) => {
        const prefsArray = e.target.value.split(',').map(p => p.trim()).filter(p => p !== '');
        setFormData(prev => ({
            ...prev,
            job_preferences: prefsArray
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setSaving(true);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/');
                return;
            }

            const response = await fetch(`${API_BASE_URL}/profile/student`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to update profile');
            }

            setSuccess('Profile updated successfully!');
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
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                fontSize: '24px'
            }}>
                Loading...
            </div>
        );
    }

    return (
        <div className="edit-profile-container">
            <div className="edit-profile-card">
                <div className="edit-profile-header">
                    <button 
                        onClick={() => navigate('/student/profile')}
                        className="back-button"
                    >
                        ← Back to Profile
                    </button>
                    <h1>Edit Profile</h1>
                </div>

                {error && (
                    <div className="alert alert-error">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="alert alert-success">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="edit-form">
                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input
                            type="text"
                            name="full_name"
                            className="form-input"
                            value={formData.full_name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">School / University</label>
                        <input
                            type="text"
                            name="school"
                            className="form-input"
                            value={formData.school}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Major</label>
                        <input
                            type="text"
                            name="major"
                            className="form-input"
                            value={formData.major}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Skills (comma-separated)</label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.skills.join(', ')}
                            onChange={handleSkillsChange}
                            placeholder="Python, JavaScript, React"
                        />
                        <small className="form-hint">
                            Separate skills with commas
                        </small>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Job Preferences (comma-separated)</label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.job_preferences.join(', ')}
                            onChange={handleJobPreferencesChange}
                            placeholder="Software Engineering, Data Science"
                        />
                        <small className="form-hint">
                            Separate preferences with commas
                        </small>
                    </div>

                    <div className="form-actions">
                        <button 
                            type="button" 
                            onClick={() => navigate('/student/profile')}
                            className="btn-cancel"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="btn-save"
                            disabled={saving}
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StudentEditProfile;