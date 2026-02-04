import { useRouter } from 'next/router';
import AdminLayout from '../../../components/admin/AdminLayout';
import AdminPageHeader from '../../../components/admin/AdminPageHeader';
import { Container, Alert } from '@mui/material';
import { useFormSubmit } from '../../../hooks/useApi';
import apiService from '../../../utils/apiService';
import ProductForm from '../../../components/admin/products/ProductForm';

export default function CreateProductPage() {
  const router = useRouter();
  const { loading, error, success, submit } = useFormSubmit(apiService.products.create);

  const handleSubmit = async (data) => {
    const result = await submit(data);
    if (result.success) {
      router.push('/admin/products');
    }
  };

  const breadcrumbs = [
    { label: 'Products', href: '/admin/products' },
    { label: 'Create', href: '/admin/products/create' },
  ];

  return (
    <AdminLayout>
      <Container maxWidth="xl">
        <AdminPageHeader
          title="Create Product"
          breadcrumbs={breadcrumbs}
        />

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <ProductForm
          onSubmit={handleSubmit}
          loading={loading}
          onCancel={() => router.push('/admin/products')}
        />
      </Container>
    </AdminLayout>
  );
}