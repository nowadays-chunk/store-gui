import { useState, useEffect } from 'react';
import AdminLayout from '../../../../components/admin/AdminLayout';
import AdminPageHeader from '../../../../components/admin/AdminPageHeader';
import DataTable from '../../../../components/common/DataTable';
import StatusBadge from '../../../../components/common/StatusBadge';
import apiService from '../../../../utils/apiService';
import { useApi } from '../../../../hooks/useApi';
import { Container, Grid, Paper, Typography, Box } from '@mui/material';
import StorageIcon from '@mui/icons-material/Storage';
import BarChartIcon from '@mui/icons-material/BarChart';

export default function BIPage() {
    const { data, loading, execute } = useApi(apiService.bi.getDatasets);
    const [datasets, setDatasets] = useState([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const result = await execute();
        if (result.success) {
            setDatasets(result.data.datasets || result.data || []);
        }
    };

    const columns = [
        { id: 'name', label: 'Dataset Name', bold: true },
        { id: 'source', label: 'Source' },
        { id: 'lastRefresh', label: 'Last Refresh', render: (v) => v ? new Date(v).toLocaleString() : 'Never' },
        {
            id: 'status',
            label: 'Status',
            render: (value) => <StatusBadge status={value || 'Ready'} />
        },
    ];

    const breadcrumbs = [
        { label: 'CRM', href: '/admin/crm' },
        { label: 'Business Intelligence', href: '/admin/crm/bi' },
    ];

    const actions = [
        {
            label: 'New Dataset',
            icon: <StorageIcon />,
            onClick: () => console.log('Create dataset'),
        }
    ];

    return (
        <AdminLayout>
            <Container maxWidth="xl">
                <AdminPageHeader
                    title="Business Intelligence"
                    breadcrumbs={breadcrumbs}
                    actions={actions}
                />

                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={6}>
                        <Box sx={{ p: 4, textAlign: 'center', border: theme => `1px dashed ${theme.palette.divider}`, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <BarChartIcon sx={{ fontSize: '3rem', color: 'text.disabled', mb: 2, mx: 'auto' }} />
                            <Typography variant="h6" sx={{ fontWeight: 800 }}>Dataset Visualization</Typography>
                            <Typography variant="body2" color="text.secondary">Connectez vos sources de données pour créer des rapports personnalisés et des tableaux de bord interactifs.</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 3, border: theme => `1px solid ${theme.palette.divider}`, borderRadius: 0 }}>
                            <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 800 }}>Storage Usage</Typography>
                            <Box sx={{ mt: 2, height: '8px', bgcolor: 'rgba(0,0,0,0.1)', width: '100%' }}>
                                <Box sx={{ height: '100%', bgcolor: 'primary.main', width: '45%' }} />
                            </Box>
                            <Typography variant="body2" sx={{ mt: 1, fontWeight: 700 }}>4.2 GB / 10 GB</Typography>
                        </Paper>
                    </Grid>
                </Grid>

                <DataTable
                    columns={columns}
                    data={datasets}
                    loading={loading}
                    onEdit={(row) => console.log('Edit', row)}
                    searchable
                />
            </Container>
        </AdminLayout>
    );
}
