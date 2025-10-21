import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './EmployerEditProfile.css';

const API_BASE_URL = 'http://localhost:5000/api';

const EmployerEditProfile = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    const [formData, setFormData] = useState({
        company_name: '',
        industry: '',
        description: '',
        website: '',
        location: ''  // ✅ ADDED
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

            const response = await fetch(`${API_BASE_URL}/profile/employer`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch profile');
            }

            setFormData({
                company_name: data.company_name || '',
                industry: data.industry || '',
                description: data.description || '',
                website: data.website || '',
                location: data.location || ''  // ✅ ADDED
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

            const response = await fetch(`${API_BASE_URL}/profile/employer`, {
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
                navigate('/employer/profile');
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
                        onClick={() => navigate('/employer/profile')}
                        className="back-button"
                    >
                        ← Back to Profile
                    </button>
                    <h1>Edit Company Profile</h1>
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
                        <label className="form-label">Company Name</label>
                        <input
                            type="text"
                            name="company_name"
                            className="form-input"
                            value={formData.company_name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Industry</label>
                        <input
                            type="text"
                            name="industry"
                            className="form-input"
                            value={formData.industry}
                            onChange={handleInputChange}
                            placeholder="e.g., Technology, Finance, Healthcare"
                            required
                        />
                    </div>

                    {/* ✅ NEW LOCATION FIELD */}
                    <div className="form-group">
                        <label className="form-label">Location</label>
                        <input
                            type="text"
                            name="location"
                            className="form-input"
                            value={formData.location}
                            onChange={handleInputChange}
                            placeholder="e.g., San Francisco, CA"
                        />
                        <small className="form-hint">
                            City and state where your company is located
                        </small>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Company Description</label>
                        <textarea
                            name="description"
                            className="form-textarea"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows="5"
                            placeholder="Tell students about your company, culture, and what makes you unique..."
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Website</label>
                        <input
                            type="url"
                            name="website"
                            className="form-input"
                            value={formData.website}
                            onChange={handleInputChange}
                            placeholder="https://yourcompany.com"
                        />
                        <small className="form-hint">
                            Must start with http:// or https://
                        </small>
                    </div>

                    <div className="form-actions">
                        <button 
                            type="button" 
                            onClick={() => navigate('/employer/profile')}
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

export default EmployerEditProfile;