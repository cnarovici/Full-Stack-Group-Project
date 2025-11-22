const API_BASE_URL = 'http://localhost:5001/api';

export const logout = async () => {
    try {
        const token = localStorage.getItem('token');
        
        if (token) {
            // Call backend logout endpoint
            await fetch(`${API_BASE_URL}/auth/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
        }
        
        // Clear token from localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Redirect to login page
        window.location.href = '/';
        
    } catch (error) {
        console.error('Logout error:', error);
        // Still clear local data even if API call fails
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
    }
};