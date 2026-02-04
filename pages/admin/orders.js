import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../utils/api';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Checkbox, Button, Typography, Box, Chip, CircularProgress
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

const STATUSES = [
    { value: 'PENDING', label: 'En attente', color: 'warning' },
    { value: 'PROCESSING', label: 'En cours', color: 'info' },
    { value: 'SHIPPED', label: 'Expédiée', color: 'primary' },
    { value: 'DELIVERED', label: 'Livrée', color: 'success' },
    { value: 'CANCELLED', label: 'Annulée', color: 'error' },
    { value: 'RETURNED', label: 'Retournée', color: 'default' },
];

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState([]);
    const [updating, setUpdating] = useState(false);
    const theme = useTheme();

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        setLoading(true);
        try {
            const data = await api.get(`/orders?t=${Date.now()}`);
            setOrders(data);
            setSelected([]); // Clear selection on reload
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectAll = (event) => {
        if (event.target.checked) {
            const newSelected = orders.map((n) => n.id);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };

    const updateStatus = async (status) => {
        if (selected.length === 0) return;
        setUpdating(true);
        try {
            // Process updates in parallel
            await Promise.all(selected.map(id => api.put(`/orders/${id}/status`, { status })));
            await loadOrders();
            alert('Statut mis à jour avec succès');
        } catch (err) {
            console.error('Update status error:', err);
            alert(`Erreur: ${err.message}`);
        } finally {
            setUpdating(false);
        }
    };

    const isSelected = (id) => selected.indexOf(id) !== -1;

    return (
        <AdminLayout>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 800 }}>
                    Commandes
                </Typography>
                <Button
                    variant="contained"
                    onClick={loadOrders}
                    disabled={loading}
                >
                    {loading ? 'Chargement...' : 'Actualiser'}
                </Button>
            </Box>

            <Paper sx={{ mb: 2, p: 2, display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center', background: theme.palette.background.paper }}>
                <Typography variant="subtitle2" sx={{ mr: 2 }}>
                    Changer le statut ({selected.length}) :
                </Typography>
                {STATUSES.map((status) => (
                    <Button
                        key={status.value}
                        variant="outlined"
                        size="small"
                        disabled={selected.length === 0 || updating}
                        onClick={() => updateStatus(status.value)}
                        color={status.color}
                        sx={{ borderRadius: 0 }}
                    >
                        {status.label}
                    </Button>
                ))}
                {updating && <CircularProgress size={24} sx={{ ml: 2 }} />}
            </Paper>

            <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${theme.palette.divider}` }}>
                <Table sx={{ minWidth: 650 }} aria-label="orders table">
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    color="primary"
                                    indeterminate={selected.length > 0 && selected.length < orders.length}
                                    checked={orders.length > 0 && selected.length === orders.length}
                                    onChange={handleSelectAll}
                                />
                            </TableCell>
                            <TableCell>ID</TableCell>
                            <TableCell>Client</TableCell>
                            <TableCell>Total</TableCell>
                            <TableCell>Statut</TableCell>
                            <TableCell>Date</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                    <CircularProgress />
                                </TableCell>
                            </TableRow>
                        ) : orders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center">Aucune commande trouvée</TableCell>
                            </TableRow>
                        ) : (
                            orders.map((o) => {
                                const isItemSelected = isSelected(o.id);
                                return (
                                    <TableRow
                                        hover
                                        onClick={(event) => handleClick(event, o.id)}
                                        role="checkbox"
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        key={o.id}
                                        selected={isItemSelected}
                                        sx={{ cursor: 'pointer' }}
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                color="primary"
                                                checked={isItemSelected}
                                            />
                                        </TableCell>
                                        <TableCell component="th" scope="row" sx={{ fontFamily: 'monospace' }}>
                                            #{o.id.toString().slice(0, 8)}
                                        </TableCell>
                                        <TableCell>{o.customerName || 'Invité'}</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>{o.totalAmount} DHS</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={STATUSES.find(s => s.value === o.status)?.label || o.status}
                                                color={STATUSES.find(s => s.value === o.status)?.color || 'default'}
                                                size="small"
                                                variant="outlined"
                                                sx={{ borderRadius: 0, fontWeight: 700 }}
                                            />
                                        </TableCell>
                                        <TableCell>{new Date(o.createdAt).toLocaleDateString()}</TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box sx={{ mt: 3 }}>
                <details>
                    <summary style={{ cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem', color: theme.palette.text.secondary }}>Debug: JSON</summary>
                    <pre style={{ fontSize: '0.7rem', overflow: 'auto', background: theme.palette.action.hover, padding: '1rem' }}>
                        {JSON.stringify(orders, null, 2)}
                    </pre>
                </details>
            </Box>
        </AdminLayout>
    );
}
