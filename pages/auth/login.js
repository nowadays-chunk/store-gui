import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import {
    Box,
    Container,
    TextField,
    Button,
    Typography,
    Paper,
    Alert,
    Divider,
    IconButton,
} from '@mui/material';
import { Google as GoogleIcon, Facebook as FacebookIcon, Apple as AppleIcon } from '@mui/icons-material';

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(formData);

        if (result.success) {
            router.push('/');
        } else {
            setError(result.error || 'Login failed');
        }

        setLoading(false);
    };

    const handleOAuthLogin = async (provider) => {
        // OAuth login implementation
        console.log(`OAuth login with ${provider}`);
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 8, mb: 4 }}>
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom align="center">
                        Sign In
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
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
                        />

                        <Button
                            fullWidth
                            type="submit"
                            variant="contained"
                            size="large"
                            disabled={loading}
                            sx={{ mt: 3, mb: 2 }}
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </Button>
                    </form>

                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                        <Link href="/auth/forgot-password">
                            <Typography variant="body2" color="primary" sx={{ cursor: 'pointer' }}>
                                Forgot password?
                            </Typography>
                        </Link>
                    </Box>

                    <Divider sx={{ my: 3 }}>OR</Divider>

                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                        <IconButton
                            onClick={() => handleOAuthLogin('google')}
                            sx={{ border: '1px solid #ddd' }}
                        >
                            <GoogleIcon />
                        </IconButton>
                        <IconButton
                            onClick={() => handleOAuthLogin('facebook')}
                            sx={{ border: '1px solid #ddd' }}
                        >
                            <FacebookIcon />
                        </IconButton>
                        <IconButton
                            onClick={() => handleOAuthLogin('apple')}
                            sx={{ border: '1px solid #ddd' }}
                        >
                            <AppleIcon />
                        </IconButton>
                    </Box>

                    <Box sx={{ textAlign: 'center', mt: 3 }}>
                        <Typography variant="body2">
                            Don't have an account?{' '}
                            <Link href="/auth/register">
                                <Typography component="span" color="primary" sx={{ cursor: 'pointer', fontWeight: 'bold' }}>
                                    Sign up
                                </Typography>
                            </Link>
                        </Typography>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
}
