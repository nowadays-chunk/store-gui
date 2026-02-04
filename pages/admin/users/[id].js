import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../components/admin/AdminLayout';
import AdminPageHeader from '../../../components/admin/AdminPageHeader';
import { Container, Grid, Paper, Tabs, Tab, Box, TextField, Button, Avatar, Typography, Divider } from '@mui/material';
import DataTable from '../../../components/common/DataTable';
import StatusBadge from '../../../components/common/StatusBadge';
import { useApi, useFormSubmit } from '../../../hooks/useApi';
import apiService from '../../../utils/apiService';
import LoadingSpinner from '../../../components/common/LoadingSpinner';

function TabPanel({ children, value, index }) {
    return value === index ? <Box sx={{ py: 3 }}>{children}</Box> : null;
}

export default function UserDetailPage() {
    const router = useRouter();
    const { id } = router.query;
    const [tabValue, setTabValue] = useState(0);

    const { data: user, loading, execute: fetchUser } = useApi(apiService.users.getUser);
    const { loading: saving, submit: updateUser } = useFormSubmit(apiService.users.updateUser);

    // We might need a specific API to get user orders by ID, usually list orders with customer_id query
    const { data: orders, execute: fetchOrders } = useApi(apiService.orders.list);

    const [formData, setFormData] = useState({});

    useEffect(() => {
        if (id) {
            fetchUser(id);
            fetchOrders({ customerId: id }); // Assuming filter support
        }
    }, [id]);

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                role: user.role || 'customer',
                phone: user.phone || ''
            });
        }
    }, [user]);

    const handleSave = async () => {
        await updateUser(id, formData);
        fetchUser(id);
    };

    if (loading) return <LoadingSpinner fullScreen />;

    return (
        <AdminLayout>
            <Container maxWidth="xl">
                <AdminPageHeader
                    title={`User: ${user?.firstName} ${user?.lastName}`}
                    breadcrumbs={[
                        { label: 'Users', href: '/admin/users' },
                        { label: 'Profile', href: `/admin/users/${id}` }
                    ]}
                />

                <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                            <Avatar src={user?.avatar} sx={{ width: 100, height: 100, mb: 2 }} />
                            <Typography variant="h5">{user?.firstName} {user?.lastName}</Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>{user?.email}</Typography>
                            <Box sx={{ mt: 1 }}>
                                <StatusBadge status={user?.role} color="info" />
                                <Box component="span" sx={{ mx: 1 }} />
                                <StatusBadge status={user?.isActive ? 'Active' : 'Banned'} color={user?.isActive ? 'success' : 'error'} />
                            </Box>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={8}>
                        <Paper sx={{ p: 0 }}>
                            <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
                                <Tab label="Profile" />
                                <Tab label="Orders" />
                                <Tab label="Addresses" disabled />
                                <Tab label="Activity" disabled />
                            </Tabs>

                            <TabPanel value={tabValue} index={0}>
                                <Box sx={{ p: 3 }}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                label="First Name"
                                                fullWidth
                                                value={formData.firstName}
                                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                label="Last Name"
                                                fullWidth
                                                value={formData.lastName}
                                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                label="Email"
                                                fullWidth
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                label="Phone"
                                                fullWidth
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Button variant="contained" onClick={handleSave} disabled={saving}>
                                                Update Profile
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </TabPanel>

                            <TabPanel value={tabValue} index={1}>
                                <DataTable
                                    columns={[
                                        { id: 'orderNumber', label: 'Order #', render: v => `#${v}` },
                                        { id: 'createdAt', label: 'Date', render: v => new Date(v).toLocaleDateString() },
                                        { id: 'total', label: 'Total', render: v => `$${v}` },
                                        { id: 'status', label: 'Status', render: v => <StatusBadge status={v} /> }
                                    ]}
                                    data={orders?.orders || orders || []}
                                    onEdit={(row) => router.push(`/admin/orders/${row.id}`)}
                                />
                            </TabPanel>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </AdminLayout>
    );
}
