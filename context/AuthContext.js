import { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../utils/apiService';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(null);

    useEffect(() => {
        // Check for existing token on mount
        const storedToken = localStorage.getItem('authToken');
        if (storedToken) {
            setToken(storedToken);
            loadUser();
        } else {
            setLoading(false);
        }
    }, []);

    const loadUser = async () => {
        try {
            const userData = await apiService.users.getProfile();
            setUser(userData);
        } catch (error) {
            console.error('Failed to load user:', error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        try {
            const response = await apiService.auth.login(credentials);
            const { token: authToken, user: userData } = response;

            localStorage.setItem('authToken', authToken);
            setToken(authToken);
            setUser(userData);

            return { success: true, user: userData };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const register = async (userData) => {
        try {
            const response = await apiService.auth.register(userData);
            return { success: true, data: response };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const logout = async () => {
        try {
            await apiService.auth.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('authToken');
            setToken(null);
            setUser(null);
        }
    };

    const refreshToken = async () => {
        try {
            const response = await apiService.auth.refreshToken();
            const { token: newToken } = response;
            localStorage.setItem('authToken', newToken);
            setToken(newToken);
            return true;
        } catch (error) {
            console.error('Token refresh failed:', error);
            logout();
            return false;
        }
    };

    const updateUser = (updatedData) => {
        setUser(prev => ({ ...prev, ...updatedData }));
    };

    const value = {
        user,
        token,
        loading,
        login,
        register,
        logout,
        refreshToken,
        updateUser,
        isAuthenticated: !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
