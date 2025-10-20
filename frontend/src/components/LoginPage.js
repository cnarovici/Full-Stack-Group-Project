import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const API_BASE_URL = 'http://localhost:5000/api';

const LoginPage = ({ userType = 'student' }) => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(userType);
    const [isLogin, setIsLogin] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: '',
        schoolOrCompany: '',
        majorOrIndustry: '',
        resume: null,
        jobPreferencesOrDescription: '',
        website: '',
        skills: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setActiveTab(userType);
    }, [userType]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({
            ...prev,
            resume: e.target.files[0]
        }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            if (data.user.user_type === 'student') {
                navigate('/student/dashboard');
            } else {
                navigate('/employer/dashboard');
            }

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const registrationData = {
                email: formData.email,
                password: formData.password,
                user_type: activeTab
            };

            if (activeTab === 'student') {
                registrationData.full_name = formData.fullName;
                registrationData.school = formData.schoolOrCompany;
                registrationData.major = formData.majorOrIndustry;
                registrationData.job_preferences = formData.jobPreferencesOrDescription
                    .split(',')
                    .map(pref => pref.trim())
                    .filter(pref => pref !== '');
                registrationData.skills = formData.skills
                    .split(',')
                    .map(skill => skill.trim())
                    .filter(skill => skill !== '');
                registrationData.resume_url = '';
            } else {
                registrationData.company_name = formData.fullName;
                registrationData.industry = formData.schoolOrCompany;
                registrationData.description = formData.jobPreferencesOrDescription;
                registrationData.website = formData.website;
            }

            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registrationData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            if (activeTab === 'student') {
                navigate('/student/dashboard');
            } else {
                navigate('/employer/dashboard');
            }

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        if (isLogin) {
            handleLogin(e);
        } else {
            handleRegister(e);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <button 
                    onClick={() => navigate('/')}
                    style={{
                        position: 'absolute',
                        top: '15px',
                        left: '15px',
                        background: 'none',
                        border: 'none',
                        fontSize: '24px',
                        cursor: 'pointer',
                        color: '#667eea',
                        zIndex: 10
                    }}
                >
                    ← Back
                </button>

                {!isLogin && (
                    <div className="tabs">
                        <button
                            className={`tab ${activeTab === 'student' ? 'active' : ''}`}
                            onClick={() => setActiveTab('student')}
                        >
                            Student
                        </button>
                        <button
                            className={`tab ${activeTab === 'employer' ? 'active' : ''}`}
                            onClick={() => setActiveTab('employer')}
                        >
                            Employer
                        </button>
                    </div>
                )}

                <form className="login-form" onSubmit={handleSubmit}>
                    <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>
                        {isLogin ? 'Login' : `Create ${activeTab === 'student' ? 'Student' : 'Employer'} Account`}
                    </h2>

                    {error && (
                        <div style={{
                            padding: '10px',
                            marginBottom: '15px',
                            backgroundColor: '#fee',
                            border: '1px solid #fcc',
                            borderRadius: '6px',
                            color: '#c33',
                            fontSize: '14px'
                        }}>
                            {error}
                        </div>
                    )}

                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="form-input"
                            placeholder="your.email@example.com"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="form-input"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    {!isLogin && (
                        <>
                            <div className="form-group">
                                <label className="form-label">
                                    {activeTab === 'student' ? 'Full Name' : 'Company Name'}
                                </label>
                                <input
                                    type="text"
                                    name="fullName"
                                    className="form-input"
                                    placeholder={activeTab === 'student' ? 'John Doe' : 'TechCorp Inc.'}
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    {activeTab === 'student' ? 'School / University' : 'Industry'}
                                </label>
                                <input
                                    type="text"
                                    name="schoolOrCompany"
                                    className="form-input"
                                    placeholder={activeTab === 'student' ? 'University of Illinois at Chicago' : 'Technology'}
                                    value={formData.schoolOrCompany}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            {activeTab === 'student' ? (
                                <>
                                    <div className="form-group">
                                        <label className="form-label">Major</label>
                                        <input
                                            type="text"
                                            name="majorOrIndustry"
                                            className="form-input"
                                            placeholder="Computer Science"
                                            value={formData.majorOrIndustry}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Skills (comma-separated)</label>
                                        <input
                                            type="text"
                                            name="skills"
                                            className="form-input"
                                            placeholder="Python, JavaScript, React"
                                            value={formData.skills}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </>
                            ) : (
                                <div className="form-group">
                                    <label className="form-label">Website</label>
                                    <input
                                        type="url"
                                        name="website"
                                        className="form-input"
                                        placeholder="https://yourcompany.com"
                                        value={formData.website}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            )}

                            <div className="form-group">
                                <label className="form-label">
                                    {activeTab === 'student' ? 'Job Preferences (comma-separated)' : 'Company Description'}
                                </label>
                                <input
                                    type="text"
                                    name="jobPreferencesOrDescription"
                                    className="form-input"
                                    placeholder={
                                        activeTab === 'student'
                                            ? 'Software Engineering, Data Science'
                                            : 'Brief description...'
                                    }
                                    value={formData.jobPreferencesOrDescription}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </>
                    )}

                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Create Account')}
                    </button>

                    <p className="login-link">
                        {isLogin ? (
                            <>
                                Don't have an account?{' '}
                                <a href="#" onClick={(e) => { e.preventDefault(); setIsLogin(false); }}>
                                    Sign up
                                </a>
                            </>
                        ) : (
                            <>
                                Already have an account?{' '}
                                <a href="#" onClick={(e) => { e.preventDefault(); setIsLogin(true); }}>
                                    Log in
                                </a>
                            </>
                        )}
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;