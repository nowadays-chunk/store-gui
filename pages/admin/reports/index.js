import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import AdminPageHeader from '../../../components/admin/AdminPageHeader';
import { Container, Grid, Paper, Typography, Box } from '@mui/material';
import { Line, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import apiService from '../../../utils/apiService';
import { useApi } from '../../../hooks/useApi';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function ReportsDashboard() {
    // In a real app, we'd fetch data from apiService.analytics
    // const { data: salesData } = useApi(apiService.analytics.getSales); 

    // Mock Data for demonstration
    const salesData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [
            {
                label: 'Sales ($)',
                data: [12000, 19000, 15000, 25000, 22000, 30000, 35000],
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
            },
        ],
    };

    const customersData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [
            {
                label: 'New Customers',
                data: [50, 60, 45, 80, 75, 90, 100],
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    };

    return (
        <AdminLayout>
            <Container maxWidth="xl">
                <AdminPageHeader
                    title="Reports & Analytics"
                    breadcrumbs={[
                        { label: 'Dashboard', href: '/admin' },
                        { label: 'Reports', href: '/admin/reports' }
                    ]}
                />

                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>Sales Overview</Typography>
                            <Line options={{ responsive: true }} data={salesData} />
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>Customer Growth</Typography>
                            <Bar options={{ responsive: true }} data={customersData} />
                        </Paper>
                    </Grid>
                    {/* Add more charts/tables here */}
                    <Grid item xs={12}>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>Recent Performance</Typography>
                            <Typography variant="body2" color="text.secondary">
                                Detailed tabular reports can be generated here.
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </AdminLayout>
    );
}
