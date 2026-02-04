import { useState, useEffect } from 'react';
import {
    Box,
    Paper,
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
    Typography,
    Divider,
    IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import apiService from '../../../utils/apiService';

function TabPanel({ children, value, index }) {
    return value === index ? <Box sx={{ py: 3 }}>{children}</Box> : null;
}

export default function ProductForm({ initialData, onSubmit, loading, isEdit = false, onCancel }) {
    const [tabValue, setTabValue] = useState(0);
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
        ...initialData
    });

    useEffect(() => {
        if (initialData) {
            setFormData(prev => ({ ...prev, ...initialData }));
        }
    }, [initialData]);

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <Paper sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5">{isEdit ? 'Edit Product' : 'Create Product'}</Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button variant="outlined" onClick={onCancel} disabled={loading}>
                        Cancel
                    </Button>
                    <Button variant="contained" onClick={handleFormSubmit} disabled={loading}>
                        {loading ? 'Saving...' : (isEdit ? 'Update Product' : 'Create Product')}
                    </Button>
                </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Tabs value={tabValue} onChange={(e, newVal) => setTabValue(newVal)} variant="scrollable" scrollButtons="auto">
                <Tab label="General" />
                <Tab label="Pricing" />
                <Tab label="Inventory" />
                <Tab label="Media" disabled={!isEdit} />
                <Tab label="Variants" disabled={!isEdit} />
                <Tab label="SEO" />
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
                            value={formData.category} // In real app, this should be a Select fetching categories
                            onChange={handleChange}
                            helperText="Enter category name or ID"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Brand"
                            name="brand"
                            value={formData.brand} // In real app, this should be a Select fetching brands
                            onChange={handleChange}
                            helperText="Enter brand name or ID"
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
                            InputProps={{ startAdornment: <Typography sx={{ mr: 1 }}>$</Typography> }}
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
                            InputProps={{ startAdornment: <Typography sx={{ mr: 1 }}>$</Typography> }}
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
                            InputProps={{ startAdornment: <Typography sx={{ mr: 1 }}>$</Typography> }}
                            helperText="Customers won't see this"
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
                            label="SKU (Stock Keeping Unit)"
                            name="sku"
                            value={formData.sku}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Barcode (ISBN, UPC, GTIN, etc.)"
                            name="barcode"
                            value={formData.barcode}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={formData.trackInventory || false}
                                    onChange={handleChange}
                                    name="trackInventory"
                                />
                            }
                            label="Track inventory"
                        />
                    </Grid>
                </Grid>
            </TabPanel>

            {/* Media Tab (Edit Only) */}
            <TabPanel value={tabValue} index={3}>
                <Box sx={{ p: 2, border: '1px dashed grey', borderRadius: 2, textAlign: 'center', mb: 2 }}>
                    <Button
                        component="label"
                        startIcon={<CloudUploadIcon />}
                    >
                        Upload Images
                        <input type="file" hidden multiple accept="image/*" />
                    </Button>
                    <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                        (Mockup) Actual upload logic connects here
                    </Typography>
                </Box>
                {/* Image List Placeholder */}
                <Typography variant="body2" color="text.secondary">
                    No images uploaded yet.
                </Typography>
            </TabPanel>

            {/* Variants Tab (Edit Only) */}
            <TabPanel value={tabValue} index={4}>
                <Typography variant="body1" gutterBottom>
                    Variants allow you to sell products with options like Size and Color.
                </Typography>
                <Button variant="outlined" sx={{ mt: 1 }}>
                    Add Variant Option
                </Button>
                {/* Variant List Placeholder */}
            </TabPanel>

            {/* SEO Tab */}
            <TabPanel value={tabValue} index={5}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Page Title"
                            name="seoTitle"
                            value={formData.seoTitle || ''}
                            onChange={handleChange}
                            helperText="Optional. Leave blank to use product name."
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Meta Description"
                            name="seoDescription"
                            value={formData.seoDescription || ''}
                            onChange={handleChange}
                            multiline
                            rows={3}
                            helperText="Recommended max 160 characters."
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="URL Handle"
                            name="slug"
                            value={formData.slug || ''}
                            onChange={handleChange}
                            helperText="Unique URL identifier."
                        />
                    </Grid>
                </Grid>
            </TabPanel>
        </Paper>
    );
}
