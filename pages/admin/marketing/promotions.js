import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import AdminPageHeader from '../../../components/admin/AdminPageHeader';
import DataTable from '../../../components/common/DataTable';
import StatusBadge from '../../../components/common/StatusBadge';
import apiService from '../../../utils/apiService';
import { useApi } from '../../../hooks/useApi';
import { Container, Box, Tabs, Tab } from '@mui/material';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';

export default function PromotionsPage() {
    const [currentTab, setCurrentTab] = useState(0);
    const promosApi = useApi(apiService.promotions.list);
    const couponsApi = useApi(apiService.coupons.list);
    const giftCardsApi = useApi(apiService.giftCards.list);
    const [data, setData] = useState([]);

    useEffect(() => {
        loadTabData();
    }, [currentTab]);

    const loadTabData = async () => {
        let res;
        if (currentTab === 0) res = await promosApi.execute();
        else if (currentTab === 1) res = await couponsApi.execute();
        else res = await giftCardsApi.execute();

        if (res?.success) {
            setData(res.data.promotions || res.data.coupons || res.data.giftCards || res.data || []);
        }
    };

    const columns = [
        { id: 'name', label: 'Name', bold: true },
        { id: 'code', label: 'Code', render: (v) => v || 'N/A' },
        { id: 'discount', label: 'Value', render: (v, row) => `${v}${row.type === 'percentage' ? '%' : ' MAD'}` },
        { id: 'expiry', label: 'Expiry', render: (v) => v ? new Date(v).toLocaleDateString() : 'Never' },
        {
            id: 'status',
            label: 'Status',
            render: (value) => <StatusBadge status={value || 'Active'} />
        },
    ];

    const breadcrumbs = [
        { label: 'Marketing', href: '/admin/marketing' },
        { label: 'Promotions & Rewards', href: '/admin/marketing/promotions' },
    ];

    const actions = [
        {
            label: 'Create New',
            icon: <CardGiftcardIcon />,
            onClick: () => console.log('Create reward'),
        }
    ];

    return (
        <AdminLayout>
            <Container maxWidth="xl">
                <AdminPageHeader
                    title="Promotions & Rewards"
                    breadcrumbs={breadcrumbs}
                    actions={actions}
                />

                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                    <Tabs value={currentTab} onChange={(e, v) => setCurrentTab(v)}>
                        <Tab label="PROMOTIONS" />
                        <Tab label="COUPONS" />
                        <Tab label="GIFT CARDS" />
                    </Tabs>
                </Box>

                <DataTable
                    columns={columns}
                    data={data}
                    loading={promosApi.loading || couponsApi.loading || giftCardsApi.loading}
                    onEdit={(row) => console.log('Edit', row)}
                    onDelete={(row) => console.log('Delete', row)}
                    searchable
                />
            </Container>
        </AdminLayout>
    );
}
