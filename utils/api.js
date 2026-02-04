const BASE_URL = 'http://localhost:5000/api';

const api = {
    get: async (endpoint) => {
        try {
            const response = await fetch(`${BASE_URL}${endpoint}`, {
                cache: 'no-store'
            });
            if (!response.ok) {
                throw new Error(`API call failed: ${response.statusText}`);
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
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
                cache: 'no-store'
            });
            if (!response.ok) {
                const errorData = await response.json();
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
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
                cache: 'no-store'
            });
            if (!response.ok) {
                const errorData = await response.json();
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
                cache: 'no-store'
            });
            if (!response.ok) {
                const errorData = await response.json();
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
