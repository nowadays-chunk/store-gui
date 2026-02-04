import { useState, useEffect } from 'react';
import AdminLayout from '../../../../components/admin/AdminLayout';
import AdminPageHeader from '../../../../components/admin/AdminPageHeader';
import DataTable from '../../../../components/common/DataTable';
import StatusBadge from '../../../../components/common/StatusBadge';
import apiService from '../../../../utils/apiService';
import { useApi } from '../../../../hooks/useApi';
import { Container, Grid, Paper, Typography, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

export default function WorkflowsPage() {
  const { data, loading, execute } = useApi(apiService.workflows.list);
  const healthApi = useApi(apiService.workflows.getHealth);
  const [workflows, setWorkflows] = useState([]);
  const [health, setHealth] = useState(null);

  useEffect(() => {
    loadData();
    loadHealth();
  }, []);

  const loadData = async () => {
    const result = await execute();
    if (result.success) {
      setWorkflows(result.data.workflows || result.data || []);
    }
  };

  const loadHealth = async () => {
    const result = await healthApi.execute();
    if (result.success) {
      setHealth(result.data);
    }
  };

  const columns = [
    { id: 'name', label: 'Workflow Name', bold: true },
    { id: 'trigger', label: 'Trigger Type' },
    { id: 'stateCount', label: 'States', render: (v, row) => row.states?.length || 0 },
    {
      id: 'status',
      label: 'Status',
      render: (value) => <StatusBadge status={value || 'Active'} />
    },
  ];

  const breadcrumbs = [
    { label: 'CRM', href: '/admin/crm' },
    { label: 'Workflows', href: '/admin/crm/workflows' },
  ];

  const actions = [
    {
      label: 'Create Workflow',
      icon: <AddIcon />,
      onClick: () => console.log('Create workflow'),
    }
  ];

  return (
    <AdminLayout>
      <Container maxWidth="xl">
        <AdminPageHeader
          title="Workflow Engine"
          breadcrumbs={breadcrumbs}
          actions={actions}
        />

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, border: theme => `1px solid ${theme.palette.divider}`, borderRadius: 0 }}>
              <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 800 }}>Engine Status</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <StatusBadge status={health?.status || 'Online'} />
                <Typography variant="h6" sx={{ ml: 2, fontWeight: 800 }}>{health?.uptime || '99.9%'}</Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, border: theme => `1px solid ${theme.palette.divider}`, borderRadius: 0 }}>
              <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 800 }}>Active Runs</Typography>
              <Typography variant="h4" sx={{ mt: 1, fontWeight: 800 }}>{health?.activeRuns || 24}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, border: theme => `1px solid ${theme.palette.divider}`, borderRadius: 0 }}>
              <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 800 }}>Success Rate</Typography>
              <Typography variant="h4" sx={{ mt: 1, fontWeight: 800, color: 'success.main' }}>{health?.successRate || '98.5%'}</Typography>
            </Paper>
          </Grid>
        </Grid>

        <DataTable
          columns={columns}
          data={workflows}
          loading={loading}
          onEdit={(row) => console.log('Edit', row)}
          onView={(row) => console.log('View', row)}
          onRowClick={(row) => console.log('Clicked', row)}
          searchable
        />
      </Container>
    </AdminLayout>
  );
}