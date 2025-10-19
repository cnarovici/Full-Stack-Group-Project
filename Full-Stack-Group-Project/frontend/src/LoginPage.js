import React, { useState } from 'react';
import './LoginPage.css';

const LoginPage = () => {
    const [activeTab, setActiveTab] = useState('student');
    const [formData, setFormData] = useState({
        fullName: '',
        schoolOrCompany: '',
        majorOrIndustry: '',
        resume: null,
        jobPreferencesOrContact: ''
    });

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

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        alert(`Account created successfully as ${activeTab}!`);
    };

    return (
        <div className="login-container">
            <div className="login-card">
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

                <form className="login-form" onSubmit={handleSubmit}>
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
                            placeholder={activeTab === 'student' ? 'University Name' : 'Technology'}
                            value={formData.schoolOrCompany}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            {activeTab === 'student' ? 'Major' : 'Contact Email'}
                        </label>
                        <input
                            type={activeTab === 'student' ? 'text' : 'email'}
                            name="majorOrIndustry"
                            className="form-input"
                            placeholder={activeTab === 'student' ? 'Computer Science' : 'contact@company.com'}
                            value={formData.majorOrIndustry}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    {activeTab === 'student' ? (
                        <div className="form-group">
                            <label className="form-label">Upload Resume</label>
                            <input
                                type="file"
                                name="resume"
                                className="form-input file-input"
                                accept=".pdf,.doc,.docx"
                                onChange={handleFileChange}
                            />
                            {formData.resume && (
                                <span className="file-name">📄 {formData.resume.name}</span>
                            )}
                        </div>
                    ) : (
                        <div className="form-group">
                            <label className="form-label">Phone Number</label>
                            <input
                                type="tel"
                                name="majorOrIndustry"
                                className="form-input"
                                placeholder="+1 (555) 123-4567"
                                value={formData.majorOrIndustry}
                                onChange={handleInputChange}
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label className="form-label">
                            {activeTab === 'student' ? 'Job Preferences' : 'Company Description'}
                        </label>
                        <input
                            type="text"
                            name="jobPreferencesOrContact"
                            className="form-input"
                            placeholder={
                                activeTab === 'student'
                                    ? 'Software Engineering, Data Science...'
                                    : 'Brief description of your company...'
                            }
                            value={formData.jobPreferencesOrContact}
                            onChange={handleInputChange}
                        />
                    </div>

                    <button type="submit" className="btn-primary">
                        Create Account
                    </button>

                    <p className="login-link">
                        Already have an account? <a href="/login">Log in</a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
