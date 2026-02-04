import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import AdminPageHeader from '../../../components/admin/AdminPageHeader';
import DataTable from '../../../components/common/DataTable';
import apiService from '../../../utils/apiService';
import { useApi } from '../../../hooks/useApi';
import { Container, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, MenuItem } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

export default function CategoriesPage() {
    const { data: result, loading, execute } = useApi(apiService.categories.list);
    const createApi = useApi(apiService.categories.create);
    const updateApi = useApi(apiService.categories.update);
    const deleteApi = useApi(apiService.categories.delete);

    const [categories, setCategories] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({ name: '', slug: '', parentId: '' });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const res = await execute();
        if (res?.success) {
            setCategories(res.data.categories || res.data || []);
        } else if (Array.isArray(res)) {
            setCategories(res);
        }
    };

    const handleOpenDialog = (category = null) => {
        if (category) {
            setEditingCategory(category);
            setFormData({
                name: category.name || '',
                slug: category.slug || '',
                parentId: category.parentId || category.parent?.id || ''
            });
        } else {
            setEditingCategory(null);
            setFormData({ name: '', slug: '', parentId: '' });
        }
        setOpenDialog(true);
    };

    const handleSave = async () => {
        let res;
        if (editingCategory) {
            res = await updateApi.execute(editingCategory.id, formData);
        } else {
            res = await createApi.execute(formData);
        }

        if (res?.success || res) { // Adapt based on actual API response structure
            setOpenDialog(false);
            loadData();
        }
    };

    const handleDelete = async (row) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            const res = await deleteApi.execute(row.id);
            if (res?.success || res) {
                loadData();
            }
        }
    };

    const columns = [
        { id: 'name', label: 'Name', bold: true },
        { id: 'slug', label: 'Slug' },
        { id: 'productCount', label: 'Products', render: (v) => v || 0 },
        { id: 'parent', label: 'Parent Category', render: (v) => v?.name || '-' }
    ];

    const breadcrumbs = [
        { label: 'Catalogue', href: '/admin/products' },
        { label: 'Categories', href: '/admin/categories' },
    ];

    const actions = [
        {
            label: 'Add Category',
            icon: <AddIcon />,
            onClick: () => handleOpenDialog(null),
        }
    ];

    return (
        <AdminLayout>
            <Container maxWidth="xl">
                <AdminPageHeader
                    title="Categories"
                    breadcrumbs={breadcrumbs}
                    actions={actions}
                />

                <DataTable
                    columns={columns}
                    data={categories}
                    loading={loading}
                    onEdit={handleOpenDialog}
                    onDelete={handleDelete}
                    searchable
                />

                <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                    <DialogTitle>{editingCategory ? 'Edit Category' : 'Create New Category'}</DialogTitle>
                    <DialogContent>
                        <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField
                                label="Category Name"
                                fullWidth
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                            <TextField
                                label="Slug"
                                fullWidth
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                helperText="e.g. men-shoes"
                            />
                            <TextField
                                select
                                label="Parent Category (Optional)"
                                fullWidth
                                value={formData.parentId}
                                onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                            >
                                <MenuItem value="">None</MenuItem>
                                {categories.filter(c => c.id !== editingCategory?.id).map((cat) => (
                                    <MenuItem key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                        <Button
                            onClick={handleSave}
                            variant="contained"
                            disabled={createApi.loading || updateApi.loading}
                        >
                            {editingCategory ? 'Update' : 'Create'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </AdminLayout>
    );
}
