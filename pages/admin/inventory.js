import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../utils/api';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Typography, Box, Button, TextField, IconButton
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

const EditableField = ({ value, isEditing, onChange, onSave, placeholder }) => {
    const theme = useTheme();

    if (!isEditing && !value) {
        return (
            <Box
                onClick={() => onChange(value || '')}
                sx={{
                    color: 'text.secondary',
                    fontStyle: 'italic',
                    cursor: 'pointer',
                    p: 0.5,
                    border: '1px dashed',
                    borderColor: 'divider',
                    borderRadius: 1,
                    fontSize: '0.875rem',
                    '&:hover': {
                        borderColor: 'primary.main',
                        bgcolor: 'action.hover'
                    }
                }}
            >
                {placeholder || 'Vide'}
            </Box>
        );
    }

    if (isEditing) {
        return (
            <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                <TextField
                    variant="outlined"
                    size="small"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    autoFocus
                    fullWidth
                    sx={{
                        '& .MuiInputBase-input': { py: 0.5, px: 1 }
                    }}
                />
                <IconButton
                    size="small"
                    onClick={onSave}
                    sx={{ color: 'success.main', border: '1px solid', borderColor: 'success.light', borderRadius: 1 }}
                >
                    <CheckIcon fontSize="small" />
                </IconButton>
                <IconButton
                    size="small"
                    onClick={() => onChange(undefined)}
                    sx={{ color: 'error.main', border: '1px solid', borderColor: 'error.light', borderRadius: 1 }}
                >
                    <CloseIcon fontSize="small" />
                </IconButton>
            </Box>
        );
    }

    return (
        <Box
            onClick={() => onChange(value)}
            sx={{
                cursor: 'pointer',
                p: 0.5,
                border: '1px solid transparent',
                borderRadius: 1,
                '&:hover': {
                    borderColor: 'divider',
                    bgcolor: 'action.hover'
                }
            }}
        >
            {value}
        </Box>
    );
};

export default function AdminInventory() {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editValues, setEditValues] = useState({});
    const theme = useTheme();

    useEffect(() => {
        loadInventory();
    }, []);

    const loadInventory = async () => {
        setLoading(true);
        try {
            const data = await api.get(`/inventory?t=${Date.now()}`);
            setInventory(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleEditChange = (id, field, value) => {
        setEditValues({
            ...editValues,
            [`${field}-${id}`]: value
        });
    };

    const saveStock = async (id) => {
        const newQuantity = editValues[`quantity-${id}`];
        if (newQuantity === undefined) return;

        try {
            await api.put(`/inventory/${id}`, { quantity: parseInt(newQuantity, 10) });
            setInventory(inventory.map(item =>
                item.id === id ? { ...item, quantity: parseInt(newQuantity, 10) } : item
            ));
            const newEditValues = { ...editValues };
            delete newEditValues[`quantity-${id}`];
            setEditValues(newEditValues);
        } catch (err) {
            console.error('Failed to update stock', err);
            alert('Erreur: ' + (err.response?.data?.message || err.message));
        }
    };

    const saveVariantField = async (invId, variantId, field) => {
        const key = `${field}-${invId}`;
        const newValue = editValues[key];
        if (newValue === undefined) return;

        try {
            await api.put(`/products/variants/${variantId}`, { [field]: newValue });

            // Optimistic update
            setInventory(inventory.map(item => {
                if (item.id === invId) {
                    return {
                        ...item,
                        variant: {
                            ...item.variant,
                            [field]: newValue
                        }
                    };
                }
                return item;
            }));

            const newEditValues = { ...editValues };
            delete newEditValues[key];
            setEditValues(newEditValues);
        } catch (err) {
            console.error(`Failed to update ${field}`, err);
            alert('Erreur: ' + (err.response?.data?.message || err.message));
        }
    };

    return (
        <AdminLayout>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 800 }}>
                    Inventaire [V3-TEST]
                </Typography>
                <Button
                    variant="contained"
                    onClick={loadInventory}
                    disabled={loading}
                >
                    {loading ? 'Chargement...' : 'Actualiser'}
                </Button>
            </Box>

            <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${theme.palette.divider}` }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Produit</TableCell>
                            <TableCell>SKU</TableCell>
                            <TableCell>Catégorie</TableCell>
                            <TableCell>Marque</TableCell>
                            <TableCell>Stock Actuel</TableCell>
                            <TableCell>Entrepôt</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                    Chargement en cours...
                                </TableCell>
                            </TableRow>
                        ) : inventory.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                    Aucun article en inventaire
                                </TableCell>
                            </TableRow>
                        ) : (
                            inventory.map(i => (
                                <TableRow key={i.id} hover>
                                    <TableCell>
                                        <Typography sx={{ fontWeight: 'bold' }}>
                                            {i.variant?.product?.name || 'Inconnu'}
                                        </Typography>
                                        <Box sx={{ mt: 1 }}>
                                            <EditableField
                                                value={editValues[`barcode-${i.id}`] !== undefined ? editValues[`barcode-${i.id}`] : (i.variant?.barcode || '')}
                                                isEditing={editValues[`barcode-${i.id}`] !== undefined}
                                                onChange={(val) => handleEditChange(i.id, 'barcode', val)}
                                                onSave={() => saveVariantField(i.id, i.variant?.id, 'barcode')}
                                                placeholder="Code-barres..."
                                            />
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <EditableField
                                            value={editValues[`sku-${i.id}`] !== undefined ? editValues[`sku-${i.id}`] : (i.variant?.sku || '')}
                                            isEditing={editValues[`sku-${i.id}`] !== undefined}
                                            onChange={(val) => handleEditChange(i.id, 'sku', val)}
                                            onSave={() => saveVariantField(i.id, i.variant?.id, 'sku')}
                                            placeholder="SKU..."
                                        />
                                    </TableCell>
                                    <TableCell>{i.variant?.product?.category?.name || '-'}</TableCell>
                                    <TableCell>{i.variant?.product?.brand?.name || '-'}</TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <TextField
                                                type="number"
                                                variant="outlined"
                                                size="small"
                                                value={editValues[`quantity-${i.id}`] !== undefined ? editValues[`quantity-${i.id}`] : i.quantity}
                                                onChange={(e) => handleEditChange(i.id, 'quantity', e.target.value)}
                                                sx={{
                                                    width: '80px',
                                                    '& .MuiInputBase-input': {
                                                        py: 0.5, px: 1,
                                                        color: (i.quantity < (i.lowStockThreshold || 10)) ? 'error.main' : 'inherit',
                                                        fontWeight: (i.quantity < (i.lowStockThreshold || 10)) ? 'bold' : 'normal'
                                                    }
                                                }}
                                            />
                                            {editValues[`quantity-${i.id}`] !== undefined && (
                                                <Button
                                                    size="small"
                                                    variant="contained"
                                                    color="success"
                                                    onClick={() => saveStock(i.id)}
                                                    sx={{ minWidth: 'auto', px: 1 }}
                                                >
                                                    OK
                                                </Button>
                                            )}
                                        </Box>
                                    </TableCell>
                                    <TableCell>{i.warehouse?.name || 'N/A'}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box sx={{ mt: 4, p: 2, bgcolor: 'background.default', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                <details>
                    <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>Debug: Données Brutes (JSON)</summary>
                    <pre style={{ fontSize: '0.75rem', overflow: 'auto', maxHeight: '300px' }}>
                        {JSON.stringify(inventory, null, 2)}
                    </pre>
                </details>
            </Box>
        </AdminLayout>
    );
}
