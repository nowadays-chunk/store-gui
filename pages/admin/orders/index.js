import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import AdminPageHeader from '../../../components/admin/AdminPageHeader';
import DataTable from '../../../components/common/DataTable';
import StatusBadge from '../../../components/common/StatusBadge';
import apiService from '../../../utils/apiService';
import { useApi } from '../../../hooks/useApi';
import { Container, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useRouter } from 'next/router';

export default function OrdersListPage() {
    const router = useRouter();
    const { data: result, loading, execute } = useApi(apiService.orders.adminListAll);
    const [orders, setOrders] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    useEffect(() => {
        loadData();
    }, [page, limit]);

    const loadData = async () => {
        const res = await execute({ page, limit });
        if (res?.success) {
            setOrders(res.data.orders || res.data || []);
        } else if (res?.orders) {
            setOrders(res.orders);
        }
    };

    const columns = [
        {
            id: 'orderNumber',
            label: 'Order #',
            bold: true,
            render: (v) => `#${v}`
        },
        {
            id: 'createdAt',
            label: 'Date',
            render: (v) => new Date(v).toLocaleDateString()
        },
        {
            id: 'user',
            label: 'Customer',
            render: (v) => v ? `${v.firstName} ${v.lastName}` : 'Guest'
        },
        {
            id: 'paymentStatus',
            label: 'Payment',
            render: (value) => <StatusBadge status={value} />
        },
        {
            id: 'fulfillmentStatus',
            label: 'Fulfillment',
            render: (value) => <StatusBadge status={value} />
        },
        {
            id: 'total',
            label: 'Total',
            render: (v) => `$${parseFloat(v).toFixed(2)}`
        },
    ];

    const breadcrumbs = [
        { label: 'Commerce', href: '/admin/orders' },
        { label: 'Orders', href: '/admin/orders' },
    ];

    const actions = [
        {
            label: 'Create Order',
            icon: <AddIcon />,
            onClick: () => router.push('/admin/orders/create'), // Assuming manual creation exists
        }
    ];

    return (
        <AdminLayout>
            <Container maxWidth="xl">
                <AdminPageHeader
                    title="Orders"
                    breadcrumbs={breadcrumbs}
                    actions={actions}
                />

                <DataTable
                    columns={columns}
                    data={orders}
                    loading={loading}
                    onEdit={(row) => router.push(`/admin/orders/${row.id}`)}
                    searchable={false}
                />
            </Container>
        </AdminLayout>
    );
}
