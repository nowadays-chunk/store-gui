import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/router';
import { styled } from '@mui/system';

const Container = styled('div')({
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '2rem',
});

const Title = styled('h1')({
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '2rem',
    color: '#0f172a'
});

const Section = styled('div')({
    background: '#fff',
    padding: '2rem',
    borderRadius: '16px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    marginBottom: '2rem'
});

const SubTitle = styled('h2')({
    fontSize: '1.25rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    color: '#334155'
});

const Info = styled('p')({
    fontSize: '1rem',
    color: '#475569',
    marginBottom: '0.5rem'
});

export default function Account() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/auth/login');
        }
    }, [user, loading, router]);

    if (loading || !user) return <p>Chargement...</p>;

    return (
        <Container>
            <Title>Mon Compte</Title>

            <Section>
                <SubTitle>Mes Informations</SubTitle>
                <Info><strong>Nom:</strong> {user.firstName} {user.lastName}</Info>
                <Info><strong>Email:</strong> {user.email}</Info>
                <Info><strong>Role:</strong> {user.role || 'Client'}</Info>
            </Section>

            <Section>
                <SubTitle>Historique de mes commandes</SubTitle>
                <Info>Vous n'avez pas encore passé de commande.</Info>
                {/* Later integrate with api.get('/orders/me') */}
            </Section>
        </Container>
    );
}
