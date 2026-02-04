import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import { Container, Grid, Paper, Typography, Box, Card, CardContent } from '@mui/material';
import apiService from '../../utils/apiService';
import { useApi } from '../../hooks/useApi';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import InventoryIcon from '@mui/icons-material/Inventory';

function StatCard({ title, value, icon, color }) {
    return (
        <Card sx={{ height: '100%' }}>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                        <Typography color="text.secondary" gutterBottom variant="overline">
                            {title}
                        </Typography>
                        <Typography variant="h4" component="div">
                            {value}
                        </Typography>
                    </Box>
                    <Box sx={{
                        color: color,
                        bgcolor: `${color}20`,
                        p: 1,
                        borderRadius: 1,
                        display: 'flex'
                    }}>
                        {icon}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}

export default function AdminDashboard() {
    // Ideally we fetch stats from API. For now, mock or use partials.
    // const { data: stats } = useApi(apiService.analytics.getDashboardStats);

    const stats = {
        orders: 125,
        revenue: '$12,450',
        customers: 48,
        products: 320
    };

    return (
        <AdminLayout>
            <Container maxWidth="xl">
                <AdminPageHeader title="Dashboard" />

                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            title="Total Orders"
                            value={stats.orders}
                            icon={<ShoppingCartIcon />}
                            color="#3b82f6"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            title="Total Revenue"
                            value={stats.revenue}
                            icon={<AttachMoneyIcon />}
                            color="#10b981"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            title="Active Customers"
                            value={stats.customers}
                            icon={<PeopleIcon />}
                            color="#8b5cf6"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            title="Low Stock Items"
                            value="12"
                            icon={<InventoryIcon />}
                            color="#f59e0b"
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Paper sx={{ p: 3, mt: 3 }}>
                            <Typography variant="h6" gutterBottom>Recent Activity</Typography>
                            <Typography variant="body2" color="text.secondary">
                                Activity feed will be displayed here.
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </AdminLayout>
    );
}
