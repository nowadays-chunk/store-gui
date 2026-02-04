import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import AdminPageHeader from '../../../components/admin/AdminPageHeader';
import DataTable from '../../../components/common/DataTable';
import StatusBadge from '../../../components/common/StatusBadge';
import apiService from '../../../utils/apiService';
import { useApi } from '../../../hooks/useApi';
import { Container, Typography, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

export default function VendorsPage() {
  const { data, loading, error, execute } = useApi(apiService.vendors.list);
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const result = await execute();
    if (result.success) {
      setVendors(result.data.vendors || result.data || []);
    }
  };

  const columns = [
    { id: 'name', label: 'Vendor Name', bold: true },
    { id: 'email', label: 'Email' },
    { id: 'phone', label: 'Phone' },
    { id: 'city', label: 'City' },
    {
      id: 'status',
      label: 'Status',
      render: (value) => <StatusBadge status={value || 'Active'} />
    },
  ];

  const breadcrumbs = [
    { label: 'Catalog', href: '/admin/products' },
    { label: 'Vendors', href: '/admin/vendors' },
  ];

  const actions = [
    {
      label: 'New Vendor',
      icon: <AddIcon />,
      onClick: () => console.log('Add vendor'),
      variant: 'contained'
    }
  ];

  return (
    <AdminLayout>
      <Container maxWidth="xl">
        <AdminPageHeader
          title="Vendor Management"
          breadcrumbs={breadcrumbs}
          actions={actions}
        />

        <DataTable
          columns={columns}
          data={vendors}
          loading={loading}
          onEdit={(row) => console.log('Edit', row)}
          onDelete={(row) => console.log('Delete', row)}
          onView={(row) => console.log('View', row)}
          searchable
        />
      </Container>
    </AdminLayout>
  );
}