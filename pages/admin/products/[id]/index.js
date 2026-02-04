import { useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../components/admin/AdminLayout';
import AdminPageHeader from '../../../components/admin/AdminPageHeader';
import { Container, Alert } from '@mui/material';
import { useApi, useFormSubmit } from '../../../hooks/useApi';
import apiService from '../../../utils/apiService';
import ProductForm from '../../../components/admin/products/ProductForm';
import LoadingSpinner from '../../../components/common/LoadingSpinner';

export default function EditProductPage() {
    const router = useRouter();
    const { id } = router.query;

    // Fetch product data
    const { data: product, loading: fetching, execute: fetchProduct } = useApi(apiService.products.get);

    // Handle form submission
    const { loading: saving, error, success, submit } = useFormSubmit(apiService.products.update);

    useEffect(() => {
        if (id) {
            fetchProduct(id);
        }
    }, [id]);

    const handleSubmit = async (data) => {
        const result = await submit(id, data);
        if (result.success) {
            router.push('/admin/products');
        }
    };

    const breadcrumbs = [
        { label: 'Products', href: '/admin/products' },
        { label: product?.name || 'Edit Product', href: `/admin/products/${id}` },
    ];

    if (fetching) return <LoadingSpinner fullScreen />;

    return (
        <AdminLayout>
            <Container maxWidth="xl">
                <AdminPageHeader
                    title={`Edit: ${product?.name || 'Product'}`}
                    breadcrumbs={breadcrumbs}
                />

                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 3 }}>Product updated successfully!</Alert>}

                <ProductForm
                    initialData={product}
                    onSubmit={handleSubmit}
                    loading={saving}
                    isEdit={true}
                    onCancel={() => router.push('/admin/products')}
                />
            </Container>
        </AdminLayout>
    );
}
