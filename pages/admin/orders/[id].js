import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
    Box,
    Container,
    Paper,
    Typography,
    Grid,
    Chip,
    Button,
    Divider,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemText,
    Alert,
} from '@mui/material';
import apiService from '../../../utils/apiService';
import { useApi } from '../../../hooks/useApi';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import StatusBadge from '../../../components/common/StatusBadge';
import ConfirmDialog from '../../../components/common/ConfirmDialog';

export default function OrderDetailPage() {
    const router = useRouter();
    const { id } = router.query;
    const { data: order, loading, error, execute } = useApi(apiService.orders.get);
    const [confirmDialog, setConfirmDialog] = useState({ open: false, action: null });

    useEffect(() => {
        if (id) execute(id);
    }, [id]);

    const handleAction = async (action) => {
        try {
            switch (action) {
                case 'cancel':
                    await apiService.orders.cancel(id);
                    break;
                case 'hold':
                    await apiService.orders.hold(id);
                    break;
                case 'release':
                    await apiService.orders.release(id);
                    break;
                case 'reship':
                    await apiService.orders.reship(id);
                    break;
                default:
                    break;
            }
            execute(id); // Refresh order data
            setConfirmDialog({ open: false, action: null });
        } catch (err) {
            console.error('Action failed:', err);
        }
    };

    if (loading) return <LoadingSpinner fullScreen />;
    if (error) return <Alert severity="error">{error}</Alert>;
    if (!order) return null;

    return (
        <Container maxWidth="xl">
            <Box sx={{ py: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4">Order #{order.orderNumber || id}</Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button variant="outlined" onClick={() => router.push('/admin/orders')}>
                            Back to Orders
                        </Button>
                        <Button variant="contained" onClick={() => apiService.orders.downloadInvoice(id)}>
                            Download Invoice
                        </Button>
                    </Box>
                </Box>

                <Grid container spacing={3}>
                    {/* Order Summary */}
                    <Grid item xs={12} md={8}>
                        <Paper sx={{ p: 3, mb: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6">Order Details</Typography>
                                <StatusBadge status={order.status} />
                            </Box>

                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="text.secondary">Order Date</Typography>
                                    <Typography variant="body1">{new Date(order.createdAt).toLocaleDateString()}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="text.secondary">Total Amount</Typography>
                                    <Typography variant="body1">${order.total?.toFixed(2)}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="text.secondary">Payment Method</Typography>
                                    <Typography variant="body1">{order.paymentMethod}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="text.secondary">Shipping Method</Typography>
                                    <Typography variant="body1">{order.shippingMethod}</Typography>
                                </Grid>
                            </Grid>
                        </Paper>

                        {/* Order Items */}
                        <Paper sx={{ p: 3, mb: 3 }}>
                            <Typography variant="h6" gutterBottom>Order Items</Typography>
                            <List>
                                {order.items?.map((item, index) => (
                                    <ListItem key={index} divider>
                                        <ListItemText
                                            primary={item.productName}
                                            secondary={`SKU: ${item.sku} | Qty: ${item.quantity}`}
                                        />
                                        <Typography variant="body1">${item.price?.toFixed(2)}</Typography>
                                    </ListItem>
                                ))}
                            </List>
                        </Paper>

                        {/* Order Timeline */}
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>Order Timeline</Typography>
                            {/* Timeline component would go here */}
                            <Typography variant="body2" color="text.secondary">
                                Timeline data will be loaded from /api/orders/{id}/timeline
                            </Typography>
                        </Paper>
                    </Grid>

                    {/* Sidebar */}
                    <Grid item xs={12} md={4}>
                        {/* Customer Info */}
                        <Card sx={{ mb: 3 }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Customer</Typography>
                                <Typography variant="body1">{order.customer?.name}</Typography>
                                <Typography variant="body2" color="text.secondary">{order.customer?.email}</Typography>
                            </CardContent>
                        </Card>

                        {/* Shipping Address */}
                        <Card sx={{ mb: 3 }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Shipping Address</Typography>
                                <Typography variant="body2">
                                    {order.shippingAddress?.street}<br />
                                    {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zip}<br />
                                    {order.shippingAddress?.country}
                                </Typography>
                            </CardContent>
                        </Card>

                        {/* Actions */}
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Actions</Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    <Button
                                        variant="outlined"
                                        fullWidth
                                        onClick={() => setConfirmDialog({ open: true, action: 'cancel' })}
                                        disabled={order.status === 'cancelled'}
                                    >
                                        Cancel Order
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        fullWidth
                                        onClick={() => setConfirmDialog({ open: true, action: 'hold' })}
                                        disabled={order.status === 'on_hold'}
                                    >
                                        Put on Hold
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        fullWidth
                                        onClick={() => setConfirmDialog({ open: true, action: 'release' })}
                                        disabled={order.status !== 'on_hold'}
                                    >
                                        Release Hold
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        fullWidth
                                        onClick={() => setConfirmDialog({ open: true, action: 'reship' })}
                                    >
                                        Reship Order
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        fullWidth
                                        onClick={() => router.push(`/admin/orders/${id}/timeline`)}
                                    >
                                        View Timeline
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>

            <ConfirmDialog
                open={confirmDialog.open}
                onClose={() => setConfirmDialog({ open: false, action: null })}
                onConfirm={() => handleAction(confirmDialog.action)}
                title={`Confirm ${confirmDialog.action}`}
                message={`Are you sure you want to ${confirmDialog.action} this order?`}
            />
        </Container>
    );
}
