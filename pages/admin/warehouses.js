import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../utils/api';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Button, Typography, Box, Modal, TextField
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

export default function AdminWarehouses() {
    const [warehouses, setWarehouses] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingWarehouse, setEditingWarehouse] = useState(null);
    const [formData, setFormData] = useState({ name: '', code: '', address: '', city: '', country: 'Maroc' });
    const theme = useTheme();

    useEffect(() => { loadWarehouses(); }, []);

    const loadWarehouses = async () => {
        try {
            const data = await api.get('/warehouses');
            setWarehouses(data);
        } catch (err) { console.error(err); }
    };

    const handleOpenModal = (warehouse = null) => {
        if (warehouse) {
            setEditingWarehouse(warehouse);
            setFormData({
                name: warehouse.name, code: warehouse.code || '', address: warehouse.address || '', city: warehouse.city || '', country: warehouse.country || 'Maroc'
            });
        } else {
            setEditingWarehouse(null);
            setFormData({ name: '', code: '', address: '', city: '', country: 'Maroc' });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => { setIsModalOpen(false); setEditingWarehouse(null); };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingWarehouse) await api.put(`/warehouses/${editingWarehouse.id}`, formData);
            else await api.post('/warehouses', formData);
            handleCloseModal();
            loadWarehouses();
            alert('Enregistré avec succès');
        } catch (err) { alert('Erreur: ' + err.message); }
    };

    const handleDelete = async (id) => {
        if (confirm('Supprimer cet entrepôt ?')) {
            try { await api.delete(`/warehouses/${id}`); loadWarehouses(); } catch (err) { alert('Erreur suppression'); }
        }
    };

    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 500,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        maxHeight: '90vh',
        overflowY: 'auto'
    };

    return (
        <AdminLayout>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 800 }}>
                    Gestion des Entrepôts
                </Typography>
                <Button
                    variant="contained"
                    onClick={() => handleOpenModal()}
                >
                    + Nouveau Entrepôt
                </Button>
            </Box>

            <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${theme.palette.divider}` }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nom</TableCell>
                            <TableCell>Code</TableCell>
                            <TableCell>Ville</TableCell>
                            <TableCell>Adresse</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {warehouses.map(w => (
                            <TableRow key={w.id} hover>
                                <TableCell sx={{ fontWeight: 'bold' }}>{w.name}</TableCell>
                                <TableCell>{w.code}</TableCell>
                                <TableCell>{w.city}</TableCell>
                                <TableCell>{w.address}</TableCell>
                                <TableCell align="right">
                                    <Button
                                        size="small"
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleOpenModal(w)}
                                        sx={{ mr: 1 }}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        size="small"
                                        variant="contained"
                                        color="error"
                                        onClick={() => handleDelete(w.id)}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {warehouses.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                                    Aucun entrepôt trouvé
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Modal
                open={isModalOpen}
                onClose={handleCloseModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalStyle}>
                    <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
                        {editingWarehouse ? 'Modifier Entrepôt' : 'Nouveau Entrepôt'}
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Nom"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Code (Unique)"
                            name="code"
                            value={formData.code}
                            onChange={handleChange}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Ville"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Adresse"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            margin="normal"
                            multiline
                            rows={2}
                        />
                        <TextField
                            fullWidth
                            label="Pays"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            margin="normal"
                        />
                        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                            <Button onClick={handleCloseModal} color="inherit">Annuler</Button>
                            <Button type="submit" variant="contained">Enregistrer</Button>
                        </Box>
                    </form>
                </Box>
            </Modal>
        </AdminLayout>
    );
}
