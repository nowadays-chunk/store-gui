import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import AdminPageHeader from '../../../components/admin/AdminPageHeader';
import DataTable from '../../../components/common/DataTable';
import StatusBadge from '../../../components/common/StatusBadge';
import apiService from '../../../utils/apiService';
import { useApi } from '../../../hooks/useApi';
import { Container, Grid, Paper, Typography, Box } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import DescriptionIcon from '@mui/icons-material/Description';

export default function B2BPage() {
    const { data: accountsData, loading, execute } = useApi(apiService.b2b.getAccounts);
    const { data: quotesData, execute: executeQuotes } = useApi(apiService.b2b.getQuotes);
    const [accounts, setAccounts] = useState([]);
    const [pendingQuotes, setPendingQuotes] = useState(0);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const accRes = await execute();
        if (accRes.success) {
            setAccounts(accRes.data.accounts || accRes.data || []);
        }

        const quoteRes = await executeQuotes();
        if (quoteRes.success) {
            setPendingQuotes(quoteRes.data.quotes?.filter(q => q.status === 'pending').length || 0);
        }
    };

    const columns = [
        { id: 'companyName', label: 'Company', bold: true },
        { id: 'taxId', label: 'Tax ID' },
        { id: 'tier', label: 'Tier', render: (v) => <StatusBadge status={v || 'Bronze'} color="secondary" /> },
        { id: 'creditLimit', label: 'Credit Limit', render: (v) => `$${v?.toLocaleString() || '0'}` },
        {
            id: 'status',
            label: 'Status',
            render: (value) => <StatusBadge status={value || 'Active'} />
        },
    ];

    const breadcrumbs = [
        { label: 'Commerce', href: '/admin/orders' },
        { label: 'B2B Wholesale', href: '/admin/b2b' },
    ];

    const actions = [
        {
            label: 'Add B2B Account',
            icon: <BusinessIcon />,
            onClick: () => console.log('Add account'),
        }
    ];

    return (
        <AdminLayout>
            <Container maxWidth="xl">
                <AdminPageHeader
                    title="B2B & Wholesale"
                    breadcrumbs={breadcrumbs}
                    actions={actions}
                />

                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 3, border: theme => `1px solid ${theme.palette.divider}`, borderRadius: 0, display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ p: 1.5, bgcolor: 'secondary.main', mr: 2 }}>
                                <DescriptionIcon sx={{ color: '#fff' }} />
                            </Box>
                            <Box>
                                <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 800 }}>Pending Quotes</Typography>
                                <Typography variant="h5" sx={{ fontWeight: 800 }}>{pendingQuotes} Waiting Approval</Typography>
                            </Box>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 3, border: theme => `1px solid ${theme.palette.divider}`, borderRadius: 0, display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ p: 1.5, bgcolor: 'primary.main', mr: 2 }}>
                                <BusinessIcon sx={{ color: '#fff' }} />
                            </Box>
                            <Box>
                                <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 800 }}>B2B Volume</Typography>
                                <Typography variant="h5" sx={{ fontWeight: 800 }}>$1.2M This Quarter</Typography>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>

                <DataTable
                    columns={columns}
                    data={accounts}
                    loading={loading}
                    onEdit={(row) => console.log('Edit', row)}
                    searchable
                />
            </Container>
        </AdminLayout>
    );
}
