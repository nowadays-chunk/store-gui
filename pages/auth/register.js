import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import apiService from '../../utils/apiService';
import {
    Box,
    Container,
    TextField,
    Button,
    Typography,
    Paper,
    Alert,
    Checkbox,
    FormControlLabel,
} from '@mui/material';

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false,
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        if (!formData.agreeToTerms) {
            setError('You must agree to the terms and conditions');
            setLoading(false);
            return;
        }

        try {
            const { confirmPassword, agreeToTerms, ...registerData } = formData;
            await apiService.auth.register(registerData);
            setSuccess(true);
            setTimeout(() => router.push('/auth/verify-email'), 2000);
        } catch (err) {
            setError(err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 8, mb: 4 }}>
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom align="center">
                        Create Account
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    {success && (
                        <Alert severity="success" sx={{ mb: 2 }}>
                            Registration successful! Please check your email to verify your account.
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                fullWidth
                                label="First Name"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                margin="normal"
                                required
                            />

                            <TextField
                                fullWidth
                                label="Last Name"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                margin="normal"
                                required
                            />
                        </Box>

                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            margin="normal"
                            required
                        />

                        <TextField
                            fullWidth
                            label="Password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            margin="normal"
                            required
                            helperText="Minimum 8 characters"
                        />

                        <TextField
                            fullWidth
                            label="Confirm Password"
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            margin="normal"
                            required
                        />

                        <FormControlLabel
                            control={
                                <Checkbox
                                    name="agreeToTerms"
                                    checked={formData.agreeToTerms}
                                    onChange={handleChange}
                                />
                            }
                            label={
                                <Typography variant="body2">
                                    I agree to the{' '}
                                    <Link href="/terms">
                                        <Typography component="span" color="primary" sx={{ cursor: 'pointer' }}>
                                            Terms and Conditions
                                        </Typography>
                                    </Link>
                                </Typography>
                            }
                            sx={{ mt: 2 }}
                        />

                        <Button
                            fullWidth
                            type="submit"
                            variant="contained"
                            size="large"
                            disabled={loading || success}
                            sx={{ mt: 3, mb: 2 }}
                        >
                            {loading ? 'Creating account...' : 'Sign Up'}
                        </Button>
                    </form>

                    <Box sx={{ textAlign: 'center', mt: 3 }}>
                        <Typography variant="body2">
                            Already have an account?{' '}
                            <Link href="/auth/login">
                                <Typography component="span" color="primary" sx={{ cursor: 'pointer', fontWeight: 'bold' }}>
                                    Sign in
                                </Typography>
                            </Link>
                        </Typography>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
}
