import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, Alert } from '@mui/material';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', password: ''
    });
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData);
            navigate('/');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <Container maxWidth="xs">
            <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">Sign up</Typography>
                {error && <Alert severity="error" sx={{ mt: 2, width: '100%' }}>{error}</Alert>}
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <TextField
                        margin="normal" required fullWidth id="firstName" label="First Name"
                        name="firstName" autoComplete="given-name" autoFocus
                        value={formData.firstName} onChange={handleChange}
                    />
                    <TextField
                        margin="normal" required fullWidth id="lastName" label="Last Name"
                        name="lastName" autoComplete="family-name"
                        value={formData.lastName} onChange={handleChange}
                    />
                    <TextField
                        margin="normal" required fullWidth id="email" label="Email Address"
                        name="email" autoComplete="email"
                        value={formData.email} onChange={handleChange}
                    />
                    <TextField
                        margin="normal" required fullWidth name="password" label="Password"
                        type="password" id="password" autoComplete="new-password"
                        value={formData.password} onChange={handleChange}
                    />
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                        Sign Up
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default RegisterPage;
