import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './LoginPage.css';

const API_BASE_URL = 'http://localhost:5001/api';

const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const [activeTab, setActiveTab] = useState('student');
    const [isLogin, setIsLogin] = useState(true);
    
    // Login form
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });
    
    // Registration form
    const [registerData, setRegisterData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        full_name: '',
        school: '',
        major: '',
        company_name: '',
        industry: '',
        location: ''
    });
    
    // Tag selection
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [selectedPreferences, setSelectedPreferences] = useState([]);
    const [availableSkills, setAvailableSkills] = useState([]);
    const [availablePreferences, setAvailablePreferences] = useState([]);
    const [skillSearchQuery, setSkillSearchQuery] = useState('');
    const [prefSearchQuery, setPrefSearchQuery] = useState('');
    
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch predefined skills and preferences
        fetchTags();
    }, []);

    const fetchTags = async () => {
        try {
            const [skillsRes, prefsRes] = await Promise.all([
                fetch(`${API_BASE_URL}/tags/skills`),
                fetch(`${API_BASE_URL}/tags/preferences`)
            ]);

            if (skillsRes.ok && prefsRes.ok) {
                const skills = await skillsRes.json();
                const prefs = await prefsRes.json();
                setAvailableSkills(skills);
                setAvailablePreferences(prefs);
            }
        } catch (err) {
            console.error('Error fetching tags:', err);
        }
    };

    const handleLoginChange = (e) => {
        setLoginData({
            ...loginData,
            [e.target.name]: e.target.value
        });
    };

    const handleRegisterChange = (e) => {
        setRegisterData({
            ...registerData,
            [e.target.name]: e.target.value
        });
    };

    const handleSkillToggle = (skill) => {
        if (selectedSkills.includes(skill)) {
            setSelectedSkills(selectedSkills.filter(s => s !== skill));
        } else {
            setSelectedSkills([...selectedSkills, skill]);
        }
    };

    const handlePreferenceToggle = (pref) => {
        if (selectedPreferences.includes(pref)) {
            setSelectedPreferences(selectedPreferences.filter(p => p !== pref));
        } else {
            setSelectedPreferences([...selectedPreferences, pref]);
        }
    };

    const filteredSkills = availableSkills.filter(skill =>
        skill.toLowerCase().includes(skillSearchQuery.toLowerCase())
    );

    const filteredPreferences = availablePreferences.filter(pref =>
        pref.toLowerCase().includes(prefSearchQuery.toLowerCase())
    );

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginData)
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                if (data.user.user_type === 'student') {
                    navigate('/student/dashboard');
                } else {
                    navigate('/employer/dashboard');
                }
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (registerData.password !== registerData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (activeTab === 'student') {
            if (selectedSkills.length === 0) {
                setError('Please select at least one skill');
                return;
            }
            if (selectedPreferences.length === 0) {
                setError('Please select at least one job preference');
                return;
            }
        }

        setLoading(true);

        try {
            const payload = {
                email: registerData.email,
                password: registerData.password,
                user_type: activeTab
            };

            if (activeTab === 'student') {
                payload.full_name = registerData.full_name;
                payload.school = registerData.school;
                payload.major = registerData.major;
                payload.skills = selectedSkills;
                payload.job_preferences = selectedPreferences;
            } else {
                payload.company_name = registerData.company_name;
                payload.industry = registerData.industry;
                payload.location = registerData.location;
            }

            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                if (activeTab === 'student') {
                    navigate('/student/dashboard');
                } else {
                    navigate('/employer/dashboard');
                }
            } else {
                setError(data.message || 'Registration failed');
            }
        } catch (err) {
            console.error('Registration error:', err);
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                {/* Tabs */}
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

                {/* Toggle Login/Register */}
                <div className="auth-toggle">
                    <button
                        className={`toggle-btn ${isLogin ? 'active' : ''}`}
                        onClick={() => setIsLogin(true)}
                    >
                        Login
                    </button>
                    <button
                        className={`toggle-btn ${!isLogin ? 'active' : ''}`}
                        onClick={() => setIsLogin(false)}
                    >
                        Register
                    </button>
                </div>

                {error && <div className="error-message">{error}</div>}

                {/* Login Form */}
                {isLogin ? (
                    <form onSubmit={handleLogin} className="login-form">
                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                name="email"
                                className="form-input"
                                placeholder="Enter your email"
                                value={loginData.email}
                                onChange={handleLoginChange}
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
                                value={loginData.password}
                                onChange={handleLoginChange}
                                required
                            />
                        </div>

                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                ) : (
                    /* Register Form */
                    <form onSubmit={handleRegister} className="login-form">
                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                name="email"
                                className="form-input"
                                placeholder="Enter your email"
                                value={registerData.email}
                                onChange={handleRegisterChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                name="password"
                                className="form-input"
                                placeholder="Create a password"
                                value={registerData.password}
                                onChange={handleRegisterChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                className="form-input"
                                placeholder="Confirm your password"
                                value={registerData.confirmPassword}
                                onChange={handleRegisterChange}
                                required
                            />
                        </div>

                        {activeTab === 'student' ? (
                            <>
                                <div className="form-group">
                                    <label className="form-label">Full Name</label>
                                    <input
                                        type="text"
                                        name="full_name"
                                        className="form-input"
                                        placeholder="Enter your full name"
                                        value={registerData.full_name}
                                        onChange={handleRegisterChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">School / University</label>
                                    <input
                                        type="text"
                                        name="school"
                                        className="form-input"
                                        placeholder="Enter your school"
                                        value={registerData.school}
                                        onChange={handleRegisterChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Major</label>
                                    <input
                                        type="text"
                                        name="major"
                                        className="form-input"
                                        placeholder="Enter your major"
                                        value={registerData.major}
                                        onChange={handleRegisterChange}
                                    />
                                </div>

                                {/* Skills Selection */}
                                <div className="form-group">
                                    <label className="form-label">
                                        Skills * (Select at least 1)
                                    </label>
                                    <input
                                        type="text"
                                        className="form-input search-input"
                                        placeholder="Search skills..."
                                        value={skillSearchQuery}
                                        onChange={(e) => setSkillSearchQuery(e.target.value)}
                                    />
                                    <div className="selected-tags">
                                        {selectedSkills.map(skill => (
                                            <span key={skill} className="tag selected">
                                                {skill}
                                                <button
                                                    type="button"
                                                    onClick={() => handleSkillToggle(skill)}
                                                    className="tag-remove"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                    <div className="tag-list">
                                        {filteredSkills.slice(0, 20).map(skill => (
                                            !selectedSkills.includes(skill) && (
                                                <span
                                                    key={skill}
                                                    className="tag"
                                                    onClick={() => handleSkillToggle(skill)}
                                                >
                                                    {skill}
                                                </span>
                                            )
                                        ))}
                                    </div>
                                </div>

                                {/* Job Preferences Selection */}
                                <div className="form-group">
                                    <label className="form-label">
                                        Job Preferences * (Select at least 1)
                                    </label>
                                    <input
                                        type="text"
                                        className="form-input search-input"
                                        placeholder="Search job preferences..."
                                        value={prefSearchQuery}
                                        onChange={(e) => setPrefSearchQuery(e.target.value)}
                                    />
                                    <div className="selected-tags">
                                        {selectedPreferences.map(pref => (
                                            <span key={pref} className="tag selected">
                                                {pref}
                                                <button
                                                    type="button"
                                                    onClick={() => handlePreferenceToggle(pref)}
                                                    className="tag-remove"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                    <div className="tag-list">
                                        {filteredPreferences.slice(0, 20).map(pref => (
                                            !selectedPreferences.includes(pref) && (
                                                <span
                                                    key={pref}
                                                    className="tag"
                                                    onClick={() => handlePreferenceToggle(pref)}
                                                >
                                                    {pref}
                                                </span>
                                            )
                                        ))}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="form-group">
                                    <label className="form-label">Company Name</label>
                                    <input
                                        type="text"
                                        name="company_name"
                                        className="form-input"
                                        placeholder="Enter company name"
                                        value={registerData.company_name}
                                        onChange={handleRegisterChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Industry</label>
                                    <input
                                        type="text"
                                        name="industry"
                                        className="form-input"
                                        placeholder="Enter industry"
                                        value={registerData.industry}
                                        onChange={handleRegisterChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Location</label>
                                    <input
                                        type="text"
                                        name="location"
                                        className="form-input"
                                        placeholder="Enter location"
                                        value={registerData.location}
                                        onChange={handleRegisterChange}
                                    />
                                </div>
                            </>
                        )}

                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default LoginPage;