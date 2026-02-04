import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import AdminPageHeader from '../../../components/admin/AdminPageHeader';
import DataTable from '../../../components/common/DataTable';
import StatusBadge from '../../../components/common/StatusBadge';
import apiService from '../../../utils/apiService';
import { useApi } from '../../../hooks/useApi';
import { Container, Grid, Paper, Typography, Box } from '@mui/material';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';

export default function SupportPage() {
    const { data: ticketsData, loading, execute } = useApi(apiService.support.getTickets);
    const { data: queuesData, execute: executeQueues } = useApi(apiService.support.getQueues);
    const [tickets, setTickets] = useState([]);
    const [queueStats, setQueueStats] = useState({ total: 0, critical: 0 });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const ticketRes = await execute();
        if (ticketRes.success) {
            setTickets(ticketRes.data.tickets || ticketRes.data || []);
        }

        const queueRes = await executeQueues();
        if (queueRes.success) {
            const queues = queueRes.data.queues || [];
            setQueueStats({
                total: queues.reduce((acc, q) => acc + (q.count || 0), 0),
                critical: queues.find(q => q.name === 'Critical')?.count || 2
            });
        }
    };

    const columns = [
        { id: 'ticketId', label: 'ID', bold: true },
        { id: 'subject', label: 'Subject' },
        { id: 'customer', label: 'Customer' },
        { id: 'priority', label: 'Priority', render: (v) => <StatusBadge status={v} color={v === 'High' ? 'error' : 'info'} /> },
        {
            id: 'status',
            label: 'Status',
            render: (value) => <StatusBadge status={value || 'Open'} />
        },
    ];

    const breadcrumbs = [
        { label: 'Operations', href: '/admin/orders' },
        { label: 'Support Tickets', href: '/admin/support' },
    ];

    const actions = [
        {
            label: 'New Ticket',
            icon: <ConfirmationNumberIcon />,
            onClick: () => console.log('Create ticket'),
        }
    ];

    return (
        <AdminLayout>
            <Container maxWidth="xl">
                <AdminPageHeader
                    title="Customer Support"
                    breadcrumbs={breadcrumbs}
                    actions={actions}
                />

                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 3, border: theme => `1px solid ${theme.palette.divider}`, borderRadius: 0 }}>
                            <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 800 }}>Assigned To Me</Typography>
                            <Typography variant="h4" sx={{ mt: 1, fontWeight: 800 }}>{tickets.length}</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 3, border: theme => `1px solid ${theme.palette.divider}`, borderRadius: 0 }}>
                            <Typography variant="overline" color="error.main" sx={{ fontWeight: 800 }}>SLA Breaches</Typography>
                            <Typography variant="h4" sx={{ mt: 1, fontWeight: 800, color: 'error.main' }}>{queueStats.critical}</Typography>
                        </Paper>
                    </Grid>
                </Grid>

                <DataTable
                    columns={columns}
                    data={tickets}
                    loading={loading}
                    onEdit={(row) => console.log('Resolve', row)}
                    onRowClick={(row) => console.log('Open ticket details', row)}
                    searchable
                />
            </Container>
        </AdminLayout>
    );
}
