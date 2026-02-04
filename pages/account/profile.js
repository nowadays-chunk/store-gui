import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { styled } from '@mui/system';
import api from '../../utils/api';

const Container = styled('div')({
    maxWidth: '800px',
    margin: '2rem auto',
    padding: '2rem',
    background: '#fff',
    borderRadius: '16px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
});

const Title = styled('h1')({
    fontSize: '1.875rem',
    fontWeight: 'bold',
    marginBottom: '2rem',
    color: '#0f172a'
});

const Form = styled('form')({
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
});

const FormGroup = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
});

const Label = styled('label')({
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#475569'
});

const Input = styled('input')({
    padding: '0.75rem',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    outline: 'none',
    ':focus': {
        borderColor: '#0f172a'
    }
});

const Button = styled('button')({
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    background: '#0f172a',
    color: '#fff',
    fontWeight: 'bold',
    cursor: 'pointer',
    border: 'none',
    alignSelf: 'flex-start',
    ':hover': {
        opacity: 0.9
    }
});

const Message = styled('div')(({ type }) => ({
    padding: '0.75rem',
    borderRadius: '8px',
    background: type === 'success' ? '#dcfce7' : '#fee2e2',
    color: type === 'success' ? '#166534' : '#991b1b',
    fontSize: '0.875rem'
}));

export default function ProfilePage() {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: ''
    });
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:5000/api/users/me', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                setFormData({
                    firstName: data.firstName || '',
                    lastName: data.lastName || '',
                    email: data.email || ''
                });
            } catch (error) {
                console.error('Failed to fetch profile:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        try {
            const token = localStorage.getItem('token');
            await fetch('http://localhost:5000/api/users/me', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update profile' });
        }
    };

    if (loading) return <Container>Loading...</Container>;

    return (
        <Container>
            <Title>My Profile</Title>
            {message && <Message type={message.type}>{message.text}</Message>}
            <Form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label>First Name</Label>
                    <Input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                    />
                </FormGroup>
                <FormGroup>
                    <Label>Last Name</Label>
                    <Input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                    />
                </FormGroup>
                <FormGroup>
                    <Label>Email</Label>
                    <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </FormGroup>
                <Button type="submit">Save Changes</Button>
            </Form>
        </Container>
    );
}
