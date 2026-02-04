import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../utils/api';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Button, Typography, Box, Modal, TextField, Avatar
} from '@mui/material';
import ImageUpload from '../../components/common/ImageUpload';
import { useTheme } from '@mui/material/styles';

export default function AdminVendors() {
    const [vendors, setVendors] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingVendor, setEditingVendor] = useState(null);
    const [formData, setFormData] = useState({ name: '', slug: '', description: '', logo: '', banner: '', commissionRate: '10' });
    const theme = useTheme();

    useEffect(() => { loadVendors(); }, []);

    const loadVendors = async () => {
        try {
            const data = await api.get('/vendors');
            setVendors(data);
        } catch (err) { console.error(err); }
    };

    const handleOpenModal = (vendor = null) => {
        if (vendor) {
            setEditingVendor(vendor);
            setFormData({
                name: vendor.name, slug: vendor.slug, description: vendor.description || '',
                logo: vendor.logo || '', banner: vendor.banner || '', commissionRate: vendor.commissionRate || '10'
            });
        } else {
            setEditingVendor(null);
            setFormData({ name: '', slug: '', description: '', logo: '', banner: '', commissionRate: '10' });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => { setIsModalOpen(false); setEditingVendor(null); };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingVendor) await api.put(`/vendors/${editingVendor.id}`, formData);
            else await api.post('/vendors', formData);
            handleCloseModal();
            loadVendors();
            alert('Enregistré avec succès');
        } catch (err) { alert('Erreur: ' + err.message); }
    };

    const handleDelete = async (id) => {
        if (confirm('Supprimer ce vendeur ?')) {
            try { await api.delete(`/vendors/${id}`); loadVendors(); } catch (err) { alert('Erreur suppression'); }
        }
    };

    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
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
                    Gestion des Vendeurs
                </Typography>
                <Button
                    variant="contained"
                    onClick={() => handleOpenModal()}
                >
                    + Nouveau Vendeur
                </Button>
            </Box>

            <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${theme.palette.divider}` }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Logo</TableCell>
                            <TableCell>Nom</TableCell>
                            <TableCell>Slug</TableCell>
                            <TableCell>Commission (%)</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {vendors.map(v => (
                            <TableRow key={v.id} hover>
                                <TableCell>
                                    {v.logo ? (
                                        <Avatar
                                            src={`http://localhost:5000${v.logo}`}
                                            alt={v.name}
                                            variant="square"
                                            sx={{ width: 40, height: 40 }}
                                        />
                                    ) : '-'}
                                </TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>{v.name}</TableCell>
                                <TableCell>{v.slug}</TableCell>
                                <TableCell>{v.commissionRate}%</TableCell>
                                <TableCell align="right">
                                    <Button
                                        size="small"
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleOpenModal(v)}
                                        sx={{ mr: 1 }}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        size="small"
                                        variant="contained"
                                        color="error"
                                        onClick={() => handleDelete(v.id)}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {vendors.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                                    Aucun vendeur trouvé
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
                        {editingVendor ? 'Modifier Vendeur' : 'Nouveau Vendeur'}
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
                            label="Slug"
                            name="slug"
                            value={formData.slug}
                            onChange={handleChange}
                            margin="normal"
                            required
                        />
                        <Box sx={{ my: 2 }}>
                            <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>Logo</Typography>
                            <ImageUpload value={formData.logo} onChange={url => setFormData({ ...formData, logo: url })} />
                        </Box>
                        <Box sx={{ my: 2 }}>
                            <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>Bannière</Typography>
                            <ImageUpload value={formData.banner} onChange={url => setFormData({ ...formData, banner: url })} />
                        </Box>
                        <TextField
                            fullWidth
                            label="Commission (%)"
                            name="commissionRate"
                            type="number"
                            value={formData.commissionRate}
                            onChange={handleChange}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            margin="normal"
                            multiline
                            rows={3}
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
