import React, { useState, useEffect, useRef } from 'react';
import './SearchBar.css';

const API_BASE_URL = 'http://localhost:5000/api';

const SearchBar = ({ onEventSelect, onSearch, showFullSearch = false }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);
    const searchRef = useRef(null);

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Fetch autocomplete suggestions
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (searchQuery.trim().length < 2) {
                setSuggestions([]);
                setShowSuggestions(false);
                return;
            }

            setLoading(true);
            try {
                const response = await fetch(
                    `${API_BASE_URL}/search/autocomplete?q=${encodeURIComponent(searchQuery)}&type=events`
                );
                
                if (!response.ok) {
                    throw new Error('Failed to fetch suggestions');
                }

                const data = await response.json();
                setSuggestions(data);
                setShowSuggestions(data.length > 0);
            } catch (error) {
                console.error('Error fetching suggestions:', error);
                setSuggestions([]);
            } finally {
                setLoading(false);
            }
        };

        // Debounce the search
        const timeoutId = setTimeout(() => {
            fetchSuggestions();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const handleInputChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSuggestionClick = (suggestion) => {
        setSearchQuery(suggestion.title);
        setShowSuggestions(false);
        if (onEventSelect) {
            onEventSelect(suggestion);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim() && onSearch) {
            setShowSuggestions(false);
            onSearch(searchQuery);
        }
    };

    return (
        <div className="search-bar-container" ref={searchRef}>
            <form onSubmit={handleSearch} className="search-form">
                <div className="search-input-wrapper">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search for events..."
                        value={searchQuery}
                        onChange={handleInputChange}
                        onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                    />
                    {showFullSearch && (
                        <button type="submit" className="search-button">
                            🔍 Search
                        </button>
                    )}
                </div>

                {showSuggestions && (
                    <div className="suggestions-dropdown">
                        {loading ? (
                            <div className="suggestion-item loading">
                                Loading...
                            </div>
                        ) : (
                            suggestions.map((suggestion, index) => (
                                <div
                                    key={suggestion.id}
                                    className="suggestion-item"
                                    onClick={() => handleSuggestionClick(suggestion)}
                                >
                                    <span className="suggestion-icon">📅</span>
                                    <span className="suggestion-text">{suggestion.title}</span>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </form>
        </div>
    );
};

export default SearchBar;