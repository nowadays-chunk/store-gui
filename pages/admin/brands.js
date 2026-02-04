import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../utils/api';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Button, Typography, Box, Modal, TextField, Avatar
} from '@mui/material';
import ImageUpload from '../../components/common/ImageUpload';
import { useTheme } from '@mui/material/styles';

export default function AdminBrands() {
    const [brands, setBrands] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBrand, setEditingBrand] = useState(null);
    const [formData, setFormData] = useState({
        name: '', slug: '', website: '', description: '', logo: ''
    });
    const theme = useTheme();

    useEffect(() => {
        loadBrands();
    }, []);

    const loadBrands = async () => {
        try {
            const data = await api.get('/brands');
            setBrands(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleOpenModal = (brand = null) => {
        if (brand) {
            setEditingBrand(brand);
            setFormData({
                name: brand.name,
                slug: brand.slug,
                website: brand.website || '',
                description: brand.description || '',
                logo: brand.logo || ''
            });
        } else {
            setEditingBrand(null);
            setFormData({ name: '', slug: '', website: '', description: '', logo: '' });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingBrand(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingBrand) {
                await api.put(`/brands/${editingBrand.id}`, formData);
                alert('Marque mise à jour');
            } else {
                await api.post('/brands', formData);
                alert('Marque créée');
            }
            handleCloseModal();
            loadBrands();
        } catch (err) {
            alert('Erreur: ' + (err.message || 'Unknown error'));
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Êtes-vous sûr ?')) {
            try {
                await api.delete(`/brands/${id}`);
                loadBrands();
            } catch (err) {
                alert('Impossible de supprimer');
            }
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
                    Gestion des Marques
                </Typography>
                <Button
                    variant="contained"
                    onClick={() => handleOpenModal()}
                >
                    + Nouvelle Marque
                </Button>
            </Box>

            <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${theme.palette.divider}` }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Logo</TableCell>
                            <TableCell>Nom</TableCell>
                            <TableCell>Slug</TableCell>
                            <TableCell>Site Web</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {brands.map(b => (
                            <TableRow key={b.id} hover>
                                <TableCell>
                                    {b.logo ? (
                                        <Avatar
                                            src={`http://localhost:5000${b.logo}`}
                                            alt={b.name}
                                            variant="square"
                                            sx={{ width: 40, height: 40 }}
                                        />
                                    ) : '-'}
                                </TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>{b.name}</TableCell>
                                <TableCell>{b.slug}</TableCell>
                                <TableCell>
                                    {b.website ? (
                                        <a href={b.website} target="_blank" rel="noopener noreferrer" style={{ color: theme.palette.primary.main }}>
                                            {b.website}
                                        </a>
                                    ) : '-'}
                                </TableCell>
                                <TableCell align="right">
                                    <Button
                                        size="small"
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleOpenModal(b)}
                                        sx={{ mr: 1 }}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        size="small"
                                        variant="contained"
                                        color="error"
                                        onClick={() => handleDelete(b.id)}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {brands.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                                    Aucune marque trouvée
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
                        {editingBrand ? 'Modifier Marque' : 'Nouvelle Marque'}
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
                            <ImageUpload value={formData.logo} onChange={(url) => setFormData({ ...formData, logo: url })} />
                        </Box>
                        <TextField
                            fullWidth
                            label="Site Web"
                            name="website"
                            value={formData.website}
                            onChange={handleChange}
                            margin="normal"
                            placeholder="https://..."
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
