import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import AdminPageHeader from '../../../components/admin/AdminPageHeader';
import DataTable from '../../../components/common/DataTable';
import StatusBadge from '../../../components/common/StatusBadge';
import apiService from '../../../utils/apiService';
import { useApi } from '../../../hooks/useApi';
import { Container, Grid, Paper, Typography, Box } from '@mui/material';
import CampaignIcon from '@mui/icons-material/Campaign';
import GroupIcon from '@mui/icons-material/Group';

export default function MarketingPage() {
    const { data: campaignsData, loading, execute } = useApi(apiService.marketing.getCampaigns);
    const { data: segmentsData, execute: executeSegments } = useApi(apiService.marketing.getSegments);
    const [campaigns, setCampaigns] = useState([]);
    const [activeSegments, setActiveSegments] = useState(0);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const campRes = await execute();
        if (campRes.success) {
            setCampaigns(campRes.data.campaigns || campRes.data || []);
        }

        const segRes = await executeSegments();
        if (segRes.success) {
            setActiveSegments(segRes.data.segments?.length || 0);
        }
    };

    const columns = [
        { id: 'name', label: 'Campaign', bold: true },
        { id: 'type', label: 'Type', render: (v) => <StatusBadge status={v || 'Email'} color="info" /> },
        { id: 'reach', label: 'Reach', render: (v) => v?.toLocaleString() || '0' },
        {
            id: 'status',
            label: 'Status',
            render: (value) => <StatusBadge status={value || 'Draft'} />
        },
    ];

    const breadcrumbs = [
        { label: 'Marketing', href: '/admin/marketing' },
        { label: 'Campaigns', href: '/admin/marketing' },
    ];

    const actions = [
        {
            label: 'New Campaign',
            icon: <CampaignIcon />,
            onClick: () => console.log('Create campaign'),
        }
    ];

    return (
        <AdminLayout>
            <Container maxWidth="xl">
                <AdminPageHeader
                    title="Marketing & Growth"
                    breadcrumbs={breadcrumbs}
                    actions={actions}
                />

                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 3, border: theme => `1px solid ${theme.palette.divider}`, borderRadius: 0, display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ p: 1.5, bgcolor: 'primary.main', mr: 2 }}>
                                <GroupIcon sx={{ color: '#fff' }} />
                            </Box>
                            <Box>
                                <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 800 }}>Customer Segments</Typography>
                                <Typography variant="h5" sx={{ fontWeight: 800 }}>{activeSegments} Active Segments</Typography>
                            </Box>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 3, border: theme => `1px solid ${theme.palette.divider}`, borderRadius: 0, display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ p: 1.5, bgcolor: 'success.main', mr: 2 }}>
                                <CampaignIcon sx={{ color: '#fff' }} />
                            </Box>
                            <Box>
                                <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 800 }}>Total Outreach</Typography>
                                <Typography variant="h5" sx={{ fontWeight: 800 }}>45.2K Contacts</Typography>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>

                <DataTable
                    columns={columns}
                    data={campaigns}
                    loading={loading}
                    onEdit={(row) => console.log('Edit', row)}
                    searchable
                />
            </Container>
        </AdminLayout>
    );
}
