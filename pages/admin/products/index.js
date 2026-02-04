import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import AdminPageHeader from '../../../components/admin/AdminPageHeader';
import DataTable from '../../../components/common/DataTable';
import StatusBadge from '../../../components/common/StatusBadge';
import apiService from '../../../utils/apiService';
import { useApi } from '../../../hooks/useApi';
import { Container, Avatar, Box, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useRouter } from 'next/router';

export default function ProductsListPage() {
    const router = useRouter();
    const { data: result, loading, execute } = useApi(apiService.products.list);
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState('');

    useEffect(() => {
        loadData();
    }, [page, limit, search]);

    const loadData = async () => {
        const res = await execute({ page, limit, search });
        if (res?.success) {
            setProducts(res.data.products || res.data || []);
        } else if (res?.products) {
            setProducts(res.products);
        }
    };

    const columns = [
        {
            id: 'image',
            label: 'Image',
            render: (v) => <Avatar src={v} variant="rounded" sx={{ width: 50, height: 50 }} />
        },
        {
            id: 'name',
            label: 'Product',
            bold: true,
            render: (v, row) => (
                <Box>
                    <Typography variant="body2" fontWeight="bold">{v}</Typography>
                    <Typography variant="caption" color="text.secondary">SKU: {row.variants?.[0]?.sku || 'N/A'}</Typography>
                </Box>
            )
        },
        { id: 'category', label: 'Category', render: (v) => v?.name || 'Uncategorized' },
        { id: 'brand', label: 'Brand', render: (v) => v?.name || '-' },
        {
            id: 'price',
            label: 'Price',
            render: (v, row) => {
                const price = row.variants?.[0]?.price || 0;
                return `$${price.toFixed(2)}`;
            }
        },
        {
            id: 'stock',
            label: 'Stock',
            render: (v, row) => {
                const stock = row.variants?.reduce((acc, curr) => acc + (curr.inventory || 0), 0) || 0;
                return <Typography color={stock < 10 ? 'error' : 'text.primary'}>{stock}</Typography>;
            }
        },
        {
            id: 'isActive',
            label: 'Status',
            render: (value) => <StatusBadge status={value ? 'Active' : 'Draft'} />
        },
    ];

    const breadcrumbs = [
        { label: 'Catalogue', href: '/admin/products' },
        { label: 'Products', href: '/admin/products' },
    ];

    const actions = [
        {
            label: 'Add Product',
            icon: <AddIcon />,
            onClick: () => router.push('/admin/products/create'),
        }
    ];

    return (
        <AdminLayout>
            <Container maxWidth="xl">
                <AdminPageHeader
                    title="Products"
                    breadcrumbs={breadcrumbs}
                    actions={actions}
                />

                <DataTable
                    columns={columns}
                    data={products}
                    loading={loading}
                    onEdit={(row) => router.push(`/admin/products/${row.id}`)}
                    searchable
                    onSearch={(q) => setSearch(q)}
                />
            </Container>
        </AdminLayout>
    );
}
