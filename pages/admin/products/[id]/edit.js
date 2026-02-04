import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
    Box,
    Container,
    Paper,
    Typography,
    Grid,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Switch,
    FormControlLabel,
    Tabs,
    Tab,
    Alert,
} from '@mui/material';
import apiService from '../../../utils/apiService';
import { useApi, useFormSubmit } from '../../../hooks/useApi';
import LoadingSpinner from '../../../components/common/LoadingSpinner';

function TabPanel({ children, value, index }) {
    return value === index ? <Box sx={{ py: 3 }}>{children}</Box> : null;
}

export default function ProductEditPage() {
    const router = useRouter();
    const { id } = router.query;
    const [tabValue, setTabValue] = useState(0);
    const { data: product, loading, execute } = useApi(apiService.products.get);
    const { loading: saving, error, success, submit } = useFormSubmit(apiService.products.update);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        compareAtPrice: '',
        cost: '',
        sku: '',
        barcode: '',
        trackInventory: true,
        status: 'draft',
        category: '',
        brand: '',
        tags: [],
    });

    useEffect(() => {
        if (id) execute(id);
    }, [id]);

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || '',
                description: product.description || '',
                price: product.price || '',
                compareAtPrice: product.compareAtPrice || '',
                cost: product.cost || '',
                sku: product.sku || '',
                barcode: product.barcode || '',
                trackInventory: product.trackInventory !== false,
                status: product.status || 'draft',
                category: product.category || '',
                brand: product.brand || '',
                tags: product.tags || [],
            });
        }
    }, [product]);

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await submit(id, formData);
        if (result.success) {
            router.push('/admin/products');
        }
    };

    if (loading) return <LoadingSpinner fullScreen />;

    return (
        <Container maxWidth="xl">
            <Box sx={{ py: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4">Edit Product</Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button variant="outlined" onClick={() => router.push('/admin/products')}>
                            Cancel
                        </Button>
                        <Button variant="contained" onClick={handleSubmit} disabled={saving}>
                            {saving ? 'Saving...' : 'Save Product'}
                        </Button>
                    </Box>
                </Box>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 2 }}>Product updated successfully!</Alert>}

                <Paper>
                    <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
                        <Tab label="General" />
                        <Tab label="Pricing" />
                        <Tab label="Inventory" />
                        <Tab label="SEO" />
                        <Tab label="Media" />
                        <Tab label="Variants" />
                    </Tabs>

                    {/* General Tab */}
                    <TabPanel value={tabValue} index={0}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Product Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    multiline
                                    rows={4}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Status</InputLabel>
                                    <Select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        label="Status"
                                    >
                                        <MenuItem value="draft">Draft</MenuItem>
                                        <MenuItem value="active">Active</MenuItem>
                                        <MenuItem value="archived">Archived</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Brand"
                                    name="brand"
                                    value={formData.brand}
                                    onChange={handleChange}
                                />
                            </Grid>
                        </Grid>
                    </TabPanel>

                    {/* Pricing Tab */}
                    <TabPanel value={tabValue} index={1}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="Price"
                                    name="price"
                                    type="number"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                    InputProps={{ startAdornment: '$' }}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="Compare at Price"
                                    name="compareAtPrice"
                                    type="number"
                                    value={formData.compareAtPrice}
                                    onChange={handleChange}
                                    InputProps={{ startAdornment: '$' }}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="Cost per Item"
                                    name="cost"
                                    type="number"
                                    value={formData.cost}
                                    onChange={handleChange}
                                    InputProps={{ startAdornment: '$' }}
                                />
                            </Grid>
                        </Grid>
                    </TabPanel>

                    {/* Inventory Tab */}
                    <TabPanel value={tabValue} index={2}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="SKU"
                                    name="sku"
                                    value={formData.sku}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Barcode"
                                    name="barcode"
                                    value={formData.barcode}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={formData.trackInventory}
                                            onChange={handleChange}
                                            name="trackInventory"
                                        />
                                    }
                                    label="Track inventory"
                                />
                            </Grid>
                        </Grid>
                    </TabPanel>

                    {/* SEO Tab */}
                    <TabPanel value={tabValue} index={3}>
                        <Typography variant="body2" color="text.secondary">
                            SEO settings can be managed via /api/products/{id}/seo
                        </Typography>
                    </TabPanel>

                    {/* Media Tab */}
                    <TabPanel value={tabValue} index={4}>
                        <Typography variant="body2" color="text.secondary">
                            Product images and videos can be managed via /api/products/{id}/images and /api/products/{id}/videos
                        </Typography>
                    </TabPanel>

                    {/* Variants Tab */}
                    <TabPanel value={tabValue} index={5}>
                        <Typography variant="body2" color="text.secondary">
                            Product variants can be managed via /api/products/{id}/variants
                        </Typography>
                        <Button
                            variant="outlined"
                            sx={{ mt: 2 }}
                            onClick={() => router.push(`/admin/products/${id}/variants`)}
                        >
                            Manage Variants
                        </Button>
                    </TabPanel>
                </Paper>
            </Box>
        </Container>
    );
}
