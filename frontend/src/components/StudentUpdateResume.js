import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFileAlt, FaUpload } from 'react-icons/fa';
import './StudentUpdateResume.css';

const API_BASE_URL = 'http://localhost:5001/api';

const StudentUpdateResume = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [profile, setProfile] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [resumeUrl, setResumeUrl] = useState('');

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

            setProfile(data);
            setResumeUrl(data.resume_url || '');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file type
            const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!validTypes.includes(file.type)) {
                setError('Please upload a PDF or Word document');
                return;
            }

            // Check file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError('File size must be less than 5MB');
                return;
            }

            setSelectedFile(file);
            setError('');
        }
    };

    const handleUrlSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setUploading(true);

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
                body: JSON.stringify({
                    resume_url: resumeUrl
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to update resume');
            }

            setSuccess('Resume URL updated successfully!');
            setTimeout(() => {
                navigate('/student/profile');
            }, 1500);

        } catch (err) {
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };

    const handleFileUpload = async () => {
        if (!selectedFile) {
            setError('Please select a file first');
            return;
        }

        setError('');
        setSuccess('');
        setUploading(true);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/');
                return;
            }

            // Create FormData for file upload
            const formData = new FormData();
            formData.append('resume', selectedFile);

            console.log('📤 Uploading resume file:', selectedFile.name);

            const response = await fetch(`${API_BASE_URL}/profile/student/resume`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                    // Don't set Content-Type - browser will set it with boundary for FormData
                },
                body: formData
            });

            const data = await response.json();
            console.log('📥 Upload response:', data);

            if (!response.ok) {
                throw new Error(data.message || 'Failed to upload resume');
            }

            setSuccess('Resume uploaded successfully!');
            setSelectedFile(null);
            
            // Update the profile to show new resume
            if (data.resume_url) {
                setProfile(prev => ({ ...prev, resume_url: data.resume_url }));
                setResumeUrl(data.resume_url);
            }

            setTimeout(() => {
                navigate('/student/profile');
            }, 1500);

        } catch (err) {
            console.error('❌ Upload error:', err);
            setError(err.message);
        } finally {
            setUploading(false);
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
        <div className="update-resume-container">
            <div className="update-resume-card">
                <div className="update-resume-header">
                    <button 
                        onClick={() => navigate('/student/profile')}
                        className="back-button"
                    >
                        ← Back to Profile
                    </button>
                    <h1>Update Resume</h1>
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

                {/* Current Resume */}
                {profile?.resume_url && (
                    <div className="current-resume-section">
                        <h3>Current Resume</h3>
                        <div className="current-resume-card">
                            <FaFileAlt className="resume-icon-large" />
                            <div className="resume-info">
                                <p className="resume-label">Current Resume:</p>
                                <a 
                                    href={profile.resume_url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="resume-link"
                                >
                                    {profile.resume_url.length > 50 
                                        ? profile.resume_url.substring(0, 50) + '...' 
                                        : profile.resume_url}
                                </a>
                            </div>
                        </div>
                    </div>
                )}

                {/* Upload Options */}
                <div className="upload-options">
                    
                    {/* Option 1: File Upload */}
                    <div className="upload-section">
                        <h3>Option 1: Upload File</h3>
                        <p className="section-description">
                            Upload your resume directly (PDF or Word document)
                        </p>
                        <div className="file-upload-area">
                            <FaUpload className="upload-icon" />
                            <input
                                type="file"
                                id="resume-file"
                                className="file-input-hidden"
                                accept=".pdf,.doc,.docx"
                                onChange={handleFileSelect}
                            />
                            <label htmlFor="resume-file" className="file-upload-label">
                                {selectedFile ? '✓ ' + selectedFile.name : 'Choose File'}
                            </label>
                            <p className="file-hint">PDF, DOC, or DOCX (Max 5MB)</p>
                            {selectedFile && (
                                <button 
                                    onClick={handleFileUpload}
                                    className="btn-secondary"
                                    disabled={uploading}
                                >
                                    {uploading ? 'Uploading...' : 'Upload Selected File'}
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="divider">
                        <span>OR</span>
                    </div>

                    {/* Option 2: Resume URL */}
                    <div className="upload-section">
                        <h3>Option 2: Resume URL</h3>
                        <p className="section-description">
                            If your resume is hosted online (Google Drive, Dropbox, etc.), paste the link here
                        </p>
                        <form onSubmit={handleUrlSubmit} className="url-form">
                            <div className="form-group">
                                <label className="form-label">Resume URL</label>
                                <input
                                    type="url"
                                    className="form-input"
                                    value={resumeUrl}
                                    onChange={(e) => setResumeUrl(e.target.value)}
                                    placeholder="https://drive.google.com/..."
                                    required
                                />
                                <small className="form-hint">
                                    Make sure the link is publicly accessible
                                </small>
                            </div>
                            <button 
                                type="submit" 
                                className="btn-primary"
                                disabled={uploading}
                            >
                                {uploading ? 'Updating...' : 'Update Resume URL'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Instructions */}
                <div className="instructions-section">
                    <h4>📋 Instructions:</h4>
                    <ul>
                        <li><strong>File Upload:</strong> Click "Choose File" and select your resume from your computer</li>
                        <li><strong>URL Option:</strong> For Google Drive, right-click your resume → Share → Change to "Anyone with the link" → Copy link</li>
                        <li>Make sure your resume is up-to-date before sharing</li>
                        <li>Use a professional filename (e.g., "FirstName_LastName_Resume.pdf")</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default StudentUpdateResume;