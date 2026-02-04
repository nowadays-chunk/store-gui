import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { useRouter } from 'next/router';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Check for token in localStorage on mount
        const token = localStorage.getItem('token');
        if (token) {
            // Validate token and get user info
            api.get('/auth/me') // Assuming we add a /me route or just decode token if simple
                .then(userData => {
                    setUser(userData);
                })
                .catch(() => {
                    localStorage.removeItem('token');
                    setUser(null);
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (email, password) => {
        const data = await api.post('/auth/login', { email, password });
        localStorage.setItem('token', data.token);
        setUser(data.user);
        router.push('/');
        return data;
    };

    const register = async (firstName, lastName, email, password) => {
        const data = await api.post('/auth/register', { firstName, lastName, email, password });
        // Optionally auto-login or redirect to login
        router.push('/auth/login');
        return data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        router.push('/auth/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
