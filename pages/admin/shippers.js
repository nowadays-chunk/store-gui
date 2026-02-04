import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../utils/api';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Button, Typography, Box, Modal, TextField, Avatar
} from '@mui/material';
import ImageUpload from '../../components/common/ImageUpload';
import { useTheme } from '@mui/material/styles';

export default function AdminShippers() {
    const [shippers, setShippers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingShipper, setEditingShipper] = useState(null);
    const [formData, setFormData] = useState({ name: '', logo: '', website: '', contactPhone: '' });
    const theme = useTheme();

    useEffect(() => { loadShippers(); }, []);

    const loadShippers = async () => {
        try {
            const data = await api.get('/shippers');
            setShippers(data);
        } catch (err) { console.error(err); }
    };

    const handleOpenModal = (shipper = null) => {
        if (shipper) {
            setEditingShipper(shipper);
            setFormData({
                name: shipper.name, logo: shipper.logo || '', website: shipper.website || '', contactPhone: shipper.contactPhone || ''
            });
        } else {
            setEditingShipper(null);
            setFormData({ name: '', logo: '', website: '', contactPhone: '' });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => { setIsModalOpen(false); setEditingShipper(null); };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingShipper) await api.put(`/shippers/${editingShipper.id}`, formData);
            else await api.post('/shippers', formData);
            handleCloseModal();
            loadShippers();
            alert('Enregistré avec succès');
        } catch (err) { alert('Erreur: ' + err.message); }
    };

    const handleDelete = async (id) => {
        if (confirm('Supprimer ce transporteur ?')) {
            try { await api.delete(`/shippers/${id}`); loadShippers(); } catch (err) { alert('Erreur suppression'); }
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
                    Gestion des Transporteurs
                </Typography>
                <Button
                    variant="contained"
                    onClick={() => handleOpenModal()}
                >
                    + Nouveau Transporteur
                </Button>
            </Box>

            <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${theme.palette.divider}` }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Logo</TableCell>
                            <TableCell>Nom</TableCell>
                            <TableCell>Contact</TableCell>
                            <TableCell>Site Web</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {shippers.map(s => (
                            <TableRow key={s.id} hover>
                                <TableCell>
                                    {s.logo ? (
                                        <Avatar
                                            src={`http://localhost:5000${s.logo}`}
                                            alt={s.name}
                                            variant="square"
                                            sx={{ width: 40, height: 40 }}
                                        />
                                    ) : '-'}
                                </TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>{s.name}</TableCell>
                                <TableCell>{s.contactPhone || '-'}</TableCell>
                                <TableCell>
                                    {s.website ? (
                                        <a href={s.website} target="_blank" rel="noopener noreferrer" style={{ color: theme.palette.primary.main }}>
                                            {s.website}
                                        </a>
                                    ) : '-'}
                                </TableCell>
                                <TableCell align="right">
                                    <Button
                                        size="small"
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleOpenModal(s)}
                                        sx={{ mr: 1 }}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        size="small"
                                        variant="contained"
                                        color="error"
                                        onClick={() => handleDelete(s.id)}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {shippers.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                                    Aucun transporteur trouvé
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
                        {editingShipper ? 'Modifier Transporteur' : 'Nouveau Transporteur'}
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
                        <Box sx={{ my: 2 }}>
                            <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>Logo</Typography>
                            <ImageUpload value={formData.logo} onChange={url => setFormData({ ...formData, logo: url })} />
                        </Box>
                        <TextField
                            fullWidth
                            label="Téléphone"
                            name="contactPhone"
                            value={formData.contactPhone}
                            onChange={handleChange}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Site Web"
                            name="website"
                            value={formData.website}
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
