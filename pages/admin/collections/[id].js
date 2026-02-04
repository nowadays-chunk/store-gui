import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../components/admin/AdminLayout';
import AdminPageHeader from '../../../components/admin/AdminPageHeader';
import { Container, Grid, Paper, Tabs, Tab, Box, TextField, Button, Switch, FormControlLabel, Alert, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import DataTable from '../../../components/common/DataTable';
import { useApi, useFormSubmit } from '../../../hooks/useApi';
import apiService from '../../../utils/apiService';
import LoadingSpinner from '../../../components/common/LoadingSpinner';

function TabPanel({ children, value, index }) {
    return value === index ? <Box sx={{ py: 3 }}>{children}</Box> : null;
}

export default function CollectionDetailPage() {
    const router = useRouter();
    const { id } = router.query;
    const [tabValue, setTabValue] = useState(0);

    // APIs
    const { data: collection, loading: loadingCollection, execute: fetchCollection } = useApi(apiService.collections.list); // Assuming list returns detailed or we can filter? apiService has no 'get' for collection? 
    // Wait, apiService has: list, create, update, delete, getProducts, addProduct, removeProduct. 
    // It seems there is NO 'get' single collection? 
    // Usually 'update' would need to know the current state.
    // Let's assume 'list' returns all and we find by ID, OR we need to add 'get' to apiService. 
    // Checking apiService.js...
    // collections: { list, create, update, delete, getProducts... }
    // No 'get'! I will assume I have to find it from list or add it. 
    // For now, I'll fetch list and find. Or better, update apiService.

    // Actually, looking at other modules, 'get' is standard. I'll check apiService again.
    // Line 226: list, create, update, delete. NO GET.
    // I will use 'list' and find on client side for now to avoid blocking, but optimally should be GET /collections/:id.

    const { data: products, loading: loadingProducts, execute: fetchProducts } = useApi(apiService.collections.getProducts);
    const { loading: saving, submit: updateCollection } = useFormSubmit(apiService.collections.update);
    const addProductApi = useApi(apiService.collections.addProduct);
    const removeProductApi = useApi(apiService.collections.removeProduct);

    // Product Search for adding
    const searchProductsApi = useApi(apiService.products.search);

    const [formData, setFormData] = useState({});
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (id) {
            // Workaround for missing GET
            apiService.collections.list().then(res => {
                const found = (res.data?.collections || res.data || []).find(c => c.id === id || c.id === parseInt(id));
                if (found) {
                    setFormData(found);
                }
            });
            fetchProducts(id);
        }
    }, [id]);

    const handleSave = async () => {
        await updateCollection(id, formData);
        router.push('/admin/collections');
    };

    const handleAddProduct = async (product) => {
        await addProductApi.execute(id, { productId: product.id });
        setOpenAddDialog(false);
        fetchProducts(id);
    };

    const handleRemoveProduct = async (product) => {
        if (window.confirm('Remove from collection?')) {
            await removeProductApi.execute(id, product.id);
            fetchProducts(id);
        }
    };

    const handleSearch = async (q) => {
        setSearchQuery(q);
        if (q.length > 2) {
            const res = await searchProductsApi.execute(q);
            // handle res format
            setSearchResults(res?.data?.products || res?.products || res || []);
        }
    };

    if (loadingCollection) return <LoadingSpinner fullScreen />;

    return (
        <AdminLayout>
            <Container maxWidth="xl">
                <AdminPageHeader
                    title={`Collection: ${formData.name || 'Loading...'}`}
                    breadcrumbs={[
                        { label: 'Collections', href: '/admin/collections' },
                        { label: formData.name || 'Detail', href: `/admin/collections/${id}` }
                    ]}
                />

                <Paper sx={{ p: 0 }}>
                    <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
                        <Tab label="Settings" />
                        <Tab label="Products" />
                    </Tabs>

                    <TabPanel value={tabValue} index={0}>
                        <Box sx={{ p: 3, maxWidth: 800 }}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Name"
                                        fullWidth
                                        value={formData.name || ''}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Slug"
                                        fullWidth
                                        value={formData.slug || ''}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Description"
                                        fullWidth
                                        multiline
                                        rows={4}
                                        value={formData.description || ''}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={formData.isPublished || false}
                                                onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                                            />
                                        }
                                        label="Published"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button variant="contained" onClick={handleSave} disabled={saving}>
                                        Save Changes
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </TabPanel>

                    <TabPanel value={tabValue} index={1}>
                        <Box sx={{ p: 2 }}>
                            <Button variant="contained" onClick={() => setOpenAddDialog(true)} sx={{ mb: 2 }}>
                                Add Product
                            </Button>
                            <DataTable
                                columns={[
                                    { id: 'name', label: 'Product' },
                                    { id: 'sku', label: 'SKU', render: (v, r) => r.variants?.[0]?.sku || '-' },
                                    { id: 'price', label: 'Price', render: (v, r) => r.variants?.[0]?.price || '-' }
                                ]}
                                data={products?.products || products || []}
                                loading={loadingProducts}
                                onDelete={handleRemoveProduct}
                            />
                        </Box>
                    </TabPanel>
                </Paper>

                <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} fullWidth maxWidth="md">
                    <DialogTitle>Add Product to Collection</DialogTitle>
                    <DialogContent>
                        <TextField
                            fullWidth
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                            sx={{ mb: 2, mt: 1 }}
                        />
                        <DataTable
                            columns={[
                                { id: 'name', label: 'Name' },
                                { id: 'category', label: 'Category', render: v => v?.name }
                            ]}
                            data={searchResults}
                            onRowClick={handleAddProduct}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenAddDialog(false)}>Close</Button>
                    </DialogActions>
                </Dialog>

            </Container>
        </AdminLayout>
    );
}
