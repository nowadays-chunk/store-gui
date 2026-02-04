const BASE_URL = 'http://localhost:5000/api';

const getAuthToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token') || localStorage.getItem('authToken');
    }
    return null;
};

const getHeaders = (headers = {}) => {
    const token = getAuthToken();
    const defaultHeaders = {
        'Content-Type': 'application/json',
        ...headers
    };
    if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`;
    }
    return defaultHeaders;
};

const api = {
    get: async (endpoint) => {
        try {
            const response = await fetch(`${BASE_URL}${endpoint}`, {
                headers: getHeaders(),
                cache: 'no-store'
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `API call failed: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('API GET error:', error);
            throw error;
        }
    },

    post: async (endpoint, data) => {
        try {
            const response = await fetch(`${BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(data),
                cache: 'no-store'
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `API call failed: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('API POST error:', error);
            throw error;
        }
    },

    put: async (endpoint, data) => {
        try {
            const response = await fetch(`${BASE_URL}${endpoint}`, {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify(data),
                cache: 'no-store'
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `API call failed: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('API PUT error:', error);
            throw error;
        }
    },

    delete: async (endpoint) => {
        try {
            const response = await fetch(`${BASE_URL}${endpoint}`, {
                method: 'DELETE',
                headers: getHeaders(),
                cache: 'no-store'
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `API call failed: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('API DELETE error:', error);
            throw error;
        }
    }
};

export default api;
