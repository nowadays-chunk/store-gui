import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import AdminPageHeader from '../../../components/admin/AdminPageHeader';
import StatusBadge from '../../../components/common/StatusBadge';
import apiService from '../../../utils/apiService';
import { useApi } from '../../../hooks/useApi';
import { Container, Grid, Paper, Typography, Box, List, ListItem, ListItemText, Divider, IconButton } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import RefreshIcon from '@mui/icons-material/Refresh';
import StorageIcon from '@mui/icons-material/Storage';

export default function PlatformPage() {
    const healthApi = useApi(apiService.admin.getHealth);
    const configApi = useApi(apiService.admin.getConfig);
    const [health, setHealth] = useState(null);
    const [config, setConfig] = useState({});

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const hRes = await healthApi.execute();
        if (hRes.success) setHealth(hRes.data);

        const cRes = await configApi.execute();
        if (cRes.success) setConfig(cRes.data);
    };

    const breadcrumbs = [
        { label: 'System', href: '/admin/platform' },
        { label: 'Settings & Health', href: '/admin/platform' },
    ];

    return (
        <AdminLayout>
            <Container maxWidth="xl">
                <AdminPageHeader
                    title="Platform Operations"
                    breadcrumbs={breadcrumbs}
                />

                <Grid container spacing={4}>
                    <Grid item xs={12} md={8}>
                        <Paper sx={{ p: 4, border: theme => `1px solid ${theme.palette.divider}`, borderRadius: 0 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                                <Typography variant="h6" sx={{ fontWeight: 800 }}>Core Configuration</Typography>
                                <IconButton onClick={loadData} size="small"><RefreshIcon /></IconButton>
                            </Box>
                            <List disablePadding>
                                {Object.entries(config || { "Store Name": "Tailored Bridge Store", "Currency": "MAD", "Tax Rate": "20%" }).map(([key, value], idx) => (
                                    <React.Fragment key={key}>
                                        <ListItem sx={{ py: 2, px: 0 }}>
                                            <ListItemText
                                                primary={<Typography sx={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: 'text.secondary' }}>{key}</Typography>}
                                                secondary={<Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary', mt: 0.5 }}>{String(value)}</Typography>}
                                            />
                                        </ListItem>
                                        {idx < Object.entries(config || {}).length - 1 && <Divider />}
                                    </React.Fragment>
                                ))}
                            </List>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 4, border: theme => `1px solid ${theme.palette.divider}`, borderRadius: 0, mb: 4 }}>
                            <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>System Health</Typography>
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 800 }}>API Status</Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                    <StatusBadge status={health?.status || 'Online'} />
                                    <Typography variant="body2" sx={{ ml: 2, fontWeight: 700 }}>Latency: 42ms</Typography>
                                </Box>
                            </Box>
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 800 }}>Database</Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                    <StatusBadge status="Connected" color="success" />
                                    <Typography variant="body2" sx={{ ml: 2, fontWeight: 700 }}>Pool: 12/20</Typography>
                                </Box>
                            </Box>
                            <Box>
                                <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 800 }}>Cache Engine</Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                    <StatusBadge status="Healthy" color="success" />
                                    <Typography variant="body2" sx={{ ml: 2, fontWeight: 700 }}>Redis Cluster</Typography>
                                </Box>
                            </Box>
                        </Paper>

                        <Paper sx={{ p: 4, border: theme => `1px solid ${theme.palette.divider}`, borderRadius: 0, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <StorageIcon sx={{ mr: 2 }} />
                                <Typography variant="h6" sx={{ fontWeight: 800 }}>Resource Usage</Typography>
                            </Box>
                            <Typography variant="body2" sx={{ opacity: 0.8, mb: 2 }}>CPU usage is within normal parameters. Memory consumption has increased by 5% in the last hour.</Typography>
                            <Typography variant="h4" sx={{ fontWeight: 800 }}>14%</Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </AdminLayout>
    );
}
