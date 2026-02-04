import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import AdminPageHeader from '../../../components/admin/AdminPageHeader';
import DataTable from '../../../components/common/DataTable';
import apiService from '../../../utils/apiService';
import { useApi } from '../../../hooks/useApi';
import { Container, Avatar, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

export default function BrandsPage() {
    const { data: result, loading, execute } = useApi(apiService.brands.list);
    const createApi = useApi(apiService.brands.create);
    const updateApi = useApi(apiService.brands.update);
    const deleteApi = useApi(apiService.brands.delete);

    const [brands, setBrands] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingBrand, setEditingBrand] = useState(null);
    const [formData, setFormData] = useState({ name: '', slug: '', description: '' });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const res = await execute();
        if (res?.success) {
            setBrands(res.data.brands || res.data || []);
        } else if (Array.isArray(res)) {
            setBrands(res);
        }
    };

    const handleOpenDialog = (brand = null) => {
        if (brand) {
            setEditingBrand(brand);
            setFormData({
                name: brand.name || '',
                slug: brand.slug || '',
                description: brand.description || ''
            });
        } else {
            setEditingBrand(null);
            setFormData({ name: '', slug: '', description: '' });
        }
        setOpenDialog(true);
    };

    const handleSave = async () => {
        let res;
        if (editingBrand) {
            res = await updateApi.execute(editingBrand.id, formData);
        } else {
            res = await createApi.execute(formData);
        }

        if (res?.success || res) {
            setOpenDialog(false);
            loadData();
        }
    };

    const handleDelete = async (row) => {
        if (window.confirm('Are you sure you want to delete this brand?')) {
            const res = await deleteApi.execute(row.id);
            if (res?.success || res) {
                loadData();
            }
        }
    };

    const columns = [
        { id: 'logo', label: 'Logo', render: (v) => <Avatar src={v} variant="rounded" sx={{ width: 40, height: 40 }} /> },
        { id: 'name', label: 'Name', bold: true },
        { id: 'slug', label: 'Slug' },
        { id: 'productCount', label: 'Products', render: (v) => v || 0 }
    ];

    const breadcrumbs = [
        { label: 'Catalogue', href: '/admin/products' },
        { label: 'Brands', href: '/admin/brands' },
    ];

    const actions = [
        {
            label: 'Add Brand',
            icon: <AddIcon />,
            onClick: () => handleOpenDialog(null),
        }
    ];

    return (
        <AdminLayout>
            <Container maxWidth="xl">
                <AdminPageHeader
                    title="Brands"
                    breadcrumbs={breadcrumbs}
                    actions={actions}
                />

                <DataTable
                    columns={columns}
                    data={brands}
                    loading={loading}
                    onEdit={handleOpenDialog}
                    onDelete={handleDelete}
                    searchable
                />

                <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                    <DialogTitle>{editingBrand ? 'Edit Brand' : 'Create New Brand'}</DialogTitle>
                    <DialogContent>
                        <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField
                                label="Brand Name"
                                fullWidth
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                            <TextField
                                label="Slug"
                                fullWidth
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                helperText="URL friendly name (e.g. nike-sportswear)"
                            />
                            <TextField
                                label="Description"
                                fullWidth
                                multiline
                                rows={3}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                        <Button
                            onClick={handleSave}
                            variant="contained"
                            disabled={createApi.loading || updateApi.loading}
                        >
                            {editingBrand ? 'Update' : 'Create'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </AdminLayout>
    );
}
