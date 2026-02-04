import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { styled } from '@mui/system';

const Container = styled('div')({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '80vh',
    background: '#f1f5f9'
});

const FormCard = styled('form')({
    background: '#fff',
    padding: '2rem',
    borderRadius: '16px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
});

const Title = styled('h1')({
    fontSize: '1.5rem',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '1rem',
    color: '#0f172a'
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
    padding: '0.75rem',
    borderRadius: '8px',
    background: '#0f172a',
    color: '#fff',
    fontWeight: 'bold',
    cursor: 'pointer',
    border: 'none',
    ':hover': {
        opacity: 0.9
    }
});

const ErrorMsg = styled('div')({
    color: 'red',
    fontSize: '0.875rem',
    textAlign: 'center'
});

export default function Register() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { register } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await register(firstName, lastName, email, password);
        } catch (err) {
            setError(err.message || 'Registration failed');
        }
    };

    return (
        <Container>
            <FormCard onSubmit={handleSubmit}>
                <Title>Inscription</Title>
                {error && <ErrorMsg>{error}</ErrorMsg>}
                <Input
                    type="text"
                    placeholder="Prénom"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                />
                <Input
                    type="text"
                    placeholder="Nom"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                />
                <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <Input
                    type="password"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <Button type="submit">S'inscrire</Button>
            </FormCard>
        </Container>
    );
}
