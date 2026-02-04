import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../utils/api';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Button, Typography, Box, Modal, TextField, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '', slug: '', basePrice: '', description: '', categoryId: '', brandId: ''
    });
    const theme = useTheme();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [prodRes, catRes, brandRes] = await Promise.all([
                api.get('/products'),
                api.get('/products/categories'),
                api.get('/products/brands')
            ]);
            setProducts(prodRes);
            setCategories(catRes);
            setBrands(brandRes);
        } catch (err) {
            console.error(err);
        }
    };

    const handleOpenModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name,
                slug: product.slug,
                basePrice: product.basePrice,
                description: product.description || '',
                categoryId: product.categoryId || '',
                brandId: product.brandId || ''
            });
        } else {
            setEditingProduct(null);
            setFormData({ name: '', slug: '', basePrice: '', description: '', categoryId: '', brandId: '' });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingProduct) {
                await api.put(`/products/${editingProduct.id}`, formData);
                alert('Produit mis à jour');
            } else {
                await api.post('/products', formData);
                alert('Produit créé');
            }
            handleCloseModal();
            loadData();
        } catch (err) {
            alert('Erreur: ' + (err.message || 'Unknown error'));
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
            try {
                await api.delete(`/products/${id}`);
                loadData();
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
                    Gestion des Produits
                </Typography>
                <Button
                    variant="contained"
                    onClick={() => handleOpenModal()}
                >
                    + Nouveau Produit
                </Button>
            </Box>

            <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${theme.palette.divider}` }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nom</TableCell>
                            <TableCell>Prix (DHS)</TableCell>
                            <TableCell>Catégorie</TableCell>
                            <TableCell>Marque</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map(p => (
                            <TableRow key={p.id} hover>
                                <TableCell sx={{ fontWeight: 'bold' }}>{p.name}</TableCell>
                                <TableCell>{p.basePrice}</TableCell>
                                <TableCell>{p.category?.name || '-'}</TableCell>
                                <TableCell>{p.brand?.name || '-'}</TableCell>
                                <TableCell align="right">
                                    <Button
                                        size="small"
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleOpenModal(p)}
                                        sx={{ mr: 1 }}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        size="small"
                                        variant="contained"
                                        color="error"
                                        onClick={() => handleDelete(p.id)}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {products.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                                    Aucun produit trouvé
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
                        {editingProduct ? 'Modifier Produit' : 'Nouveau Produit'}
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Nom du produit"
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
                        <TextField
                            fullWidth
                            label="Prix (DHS)"
                            name="basePrice"
                            type="number"
                            value={formData.basePrice}
                            onChange={handleChange}
                            margin="normal"
                            required
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
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Catégorie</InputLabel>
                            <Select
                                name="categoryId"
                                value={formData.categoryId}
                                label="Catégorie"
                                onChange={handleChange}
                            >
                                <MenuItem value=""><em>Aucune</em></MenuItem>
                                {categories.map(c => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Marque</InputLabel>
                            <Select
                                name="brandId"
                                value={formData.brandId}
                                label="Marque"
                                onChange={handleChange}
                            >
                                <MenuItem value=""><em>Aucune</em></MenuItem>
                                {brands.map(b => <MenuItem key={b.id} value={b.id}>{b.name}</MenuItem>)}
                            </Select>
                        </FormControl>
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
