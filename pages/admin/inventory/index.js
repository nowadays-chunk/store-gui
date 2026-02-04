import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../components/admin/AdminLayout';
import AdminPageHeader from '../../../components/admin/AdminPageHeader';
import DataTable from '../../../components/common/DataTable';
import StatusBadge from '../../../components/common/StatusBadge';
import apiService from '../../../utils/apiService';
import { useApi, useFormSubmit } from '../../../hooks/useApi';
import { Container, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Typography, MenuItem } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

export default function InventoryPage() {
    const { data, loading, execute } = useApi(apiService.inventory.getOverview);
    const adjustStockApi = useApi(apiService.inventory.adjustStock);

    const [inventory, setInventory] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [adjustment, setAdjustment] = useState({ type: 'add', quantity: 0, reason: '' });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const result = await execute();
        if (result?.success) {
            setInventory(result.data.inventory || result.data || []);
        } else if (Array.isArray(result)) {
            setInventory(result);
        }
    };

    const handleOpenAdjust = (row) => {
        setSelectedItem(row);
        setAdjustment({ type: 'add', quantity: 0, reason: '' });
        setOpenDialog(true);
    };

    const handleAdjust = async () => {
        if (!selectedItem) return;

        // Calculate new quantity or send delta
        const qty = parseInt(adjustment.quantity);
        const finalQty = adjustment.type === 'set' ? qty : (adjustment.type === 'add' ? qty : -qty);

        // Using adjustStock(variantId, data)
        await adjustStockApi.execute(selectedItem.id, {
            quantity: finalQty,
            type: adjustment.type,
            reason: adjustment.reason
        });

        setOpenDialog(false);
        loadData();
    };

    const columns = [
        {
            id: 'productName',
            label: 'Product',
            bold: true,
            render: (v, r) => (
                <Box>
                    <Typography variant="body2" fontWeight="bold">{v}</Typography>
                    <Typography variant="caption" color="text.secondary">{r.variantName}</Typography>
                </Box>
            )
        },
        { id: 'sku', label: 'SKU' },
        {
            id: 'inventory',
            label: 'Available',
            render: (v) => <Typography color={v < 10 ? 'error' : 'text.primary'} fontWeight="bold">{v}</Typography>
        },
        { id: 'reserved', label: 'Reserved' },
        { id: 'incoming', label: 'Incoming' },
        {
            id: 'status',
            label: 'Stock Status',
            render: (v, r) => <StatusBadge status={r.inventory > 0 ? 'In Stock' : 'Out of Stock'} color={r.inventory > 0 ? 'success' : 'error'} />
        }
    ];

    const breadcrumbs = [
        { label: 'Commerce', href: '/admin/orders' },
        { label: 'Inventory', href: '/admin/inventory' },
    ];

    return (
        <AdminLayout>
            <Container maxWidth="xl">
                <AdminPageHeader
                    title="Inventory"
                    breadcrumbs={breadcrumbs}
                />

                <DataTable
                    columns={columns}
                    data={inventory}
                    loading={loading}
                    actions={[
                        {
                            label: 'Adjust',
                            icon: <EditIcon />, // Used as action column really? DataTable supports 'actions' prop? 
                            // DataTable actions prop adds to header usually. 
                            // We want row action. DataTable supports onEdit.
                        }
                    ]}
                    // We hijack onEdit for "Adjust Stock"
                    onEdit={handleOpenAdjust}
                    searchable
                />

                <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="xs" fullWidth>
                    <DialogTitle>Adjust Stock</DialogTitle>
                    <DialogContent>
                        <Typography variant="subtitle2" gutterBottom>
                            {selectedItem?.productName} - {selectedItem?.sku}
                        </Typography>
                        <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField
                                select
                                label="Adjustment Type"
                                fullWidth
                                value={adjustment.type}
                                onChange={(e) => setAdjustment({ ...adjustment, type: e.target.value })}
                            >
                                <MenuItem value="add">Add Stock</MenuItem>
                                <MenuItem value="remove">Remove Stock</MenuItem>
                                <MenuItem value="set">Set Quantity</MenuItem>
                            </TextField>
                            <TextField
                                label="Quantity"
                                type="number"
                                fullWidth
                                value={adjustment.quantity}
                                onChange={(e) => setAdjustment({ ...adjustment, quantity: e.target.value })}
                            />
                            <TextField
                                label="Reason"
                                fullWidth
                                value={adjustment.reason}
                                onChange={(e) => setAdjustment({ ...adjustment, reason: e.target.value })}
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                        <Button onClick={handleAdjust} variant="contained" disabled={adjustStockApi.loading}>
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </AdminLayout>
    );
}
