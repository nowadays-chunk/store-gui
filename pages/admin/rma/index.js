import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import AdminPageHeader from '../../../components/admin/AdminPageHeader';
import DataTable from '../../../components/common/DataTable';
import StatusBadge from '../../../components/common/StatusBadge';
import apiService from '../../../utils/apiService';
import { useApi } from '../../../hooks/useApi';
import { Container, Grid, Paper, Typography, Box } from '@mui/material';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

export default function RMAPage() {
  const { data: rmaData, loading, execute } = useApi(apiService.rma.list);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const res = await execute();
    if (res.success) {
      setRequests(res.data.requests || res.data || []);
    }
  };

  const columns = [
    { id: 'rmaNumber', label: 'RMA #', bold: true },
    { id: 'orderNumber', label: 'Order #' },
    { id: 'customer', label: 'Customer' },
    { id: 'reason', label: 'Reason' },
    {
      id: 'status',
      label: 'Status',
      render: (value) => <StatusBadge status={value || 'Pending'} />
    },
  ];

  const breadcrumbs = [
    { label: 'Commerce', href: '/admin/orders' },
    { label: 'Returns (RMA)', href: '/admin/rma' },
  ];

  const actions = [
    {
      label: 'New Return Request',
      icon: <AssignmentReturnIcon />,
      onClick: () => console.log('Create RMA'),
      variant: 'outlined'
    }
  ];

  return (
    <AdminLayout>
      <Container maxWidth="xl">
        <AdminPageHeader
          title="Returns & RMA"
          breadcrumbs={breadcrumbs}
          actions={actions}
        />

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, border: theme => `1px solid ${theme.palette.divider}`, borderRadius: 0 }}>
              <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 800 }}>Awaiting Reception</Typography>
              <Typography variant="h4" sx={{ mt: 1, fontWeight: 800 }}>8</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, border: theme => `1px solid ${theme.palette.divider}`, borderRadius: 0 }}>
              <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 800 }}>Processing</Typography>
              <Typography variant="h4" sx={{ mt: 1, fontWeight: 800 }}>12</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, border: theme => `1px solid ${theme.palette.divider}`, borderRadius: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <LocalShippingIcon sx={{ mr: 1, color: 'primary.main' }} fontSize="small" />
                <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 800 }}>In Transit</Typography>
              </Box>
              <Typography variant="h4" sx={{ mt: 1, fontWeight: 800 }}>4</Typography>
            </Paper>
          </Grid>
        </Grid>

        <DataTable
          columns={columns}
          data={requests}
          loading={loading}
          onEdit={(row) => console.log('Process', row)}
          onView={(row) => console.log('View details', row)}
          searchable
        />
      </Container>
    </AdminLayout>
  );
}