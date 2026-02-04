import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { styled } from '@mui/system';

const StatsGrid = styled('div')({
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem'
});

const StatCard = styled('div')({
    background: '#fff',
    padding: '1.5rem',
    borderRadius: '12px',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
});

const StatValue = styled('div')({
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#0f172a'
});

const StatLabel = styled('div')({
    color: '#64748b',
    fontSize: '0.875rem'
});

export default function AdminDashboard() {
    return (
        <AdminLayout>
            <h1>Tableau de bord</h1>
            <StatsGrid>
                <StatCard>
                    <StatLabel>Ventes Totales</StatLabel>
                    <StatValue>12,500 DHS</StatValue>
                </StatCard>
                <StatCard>
                    <StatLabel>Commandes</StatLabel>
                    <StatValue>45</StatValue>
                </StatCard>
                <StatCard>
                    <StatLabel>Produits</StatLabel>
                    <StatValue>12</StatValue>
                </StatCard>
                <StatCard>
                    <StatLabel>Clients</StatLabel>
                    <StatValue>89</StatValue>
                </StatCard>
            </StatsGrid>

            <div style={{ background: '#fff', padding: '2rem', borderRadius: '12px' }}>
                <h2>Dernières Commandes</h2>
                <p>Aucune commande récente.</p>
            </div>
        </AdminLayout>
    );
}
