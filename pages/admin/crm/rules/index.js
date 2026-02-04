import { useState, useEffect } from 'react';
import AdminLayout from '../../../../components/admin/AdminLayout';
import AdminPageHeader from '../../../../components/admin/AdminPageHeader';
import DataTable from '../../../../components/common/DataTable';
import StatusBadge from '../../../../components/common/StatusBadge';
import apiService from '../../../../utils/apiService';
import { useApi } from '../../../../hooks/useApi';
import { Container, Grid, Paper, Typography, Box, Chip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import TuneIcon from '@mui/icons-material/Tune';

export default function RulesPage() {
  const { data, loading, execute } = useApi(apiService.rules.list);
  const engineApi = useApi(apiService.rules.getEngineStatus);
  const [rules, setRules] = useState([]);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    loadData();
    loadStatus();
  }, []);

  const loadData = async () => {
    const result = await execute();
    if (result.success) {
      setRules(result.data.rules || result.data || []);
    }
  };

  const loadStatus = async () => {
    const result = await engineApi.execute();
    if (result.success) {
      setStatus(result.data);
    }
  };

  const columns = [
    { id: 'name', label: 'Rule Name', bold: true },
    { id: 'priority', label: 'Priority', render: (v) => <Chip label={v} size="small" variant="outlined" sx={{ borderRadius: 0, fontWeight: 700 }} /> },
    { id: 'category', label: 'Category' },
    {
      id: 'enabled',
      label: 'State',
      render: (value) => <StatusBadge status={value ? 'Active' : 'Disabled'} />
    },
  ];

  const breadcrumbs = [
    { label: 'CRM', href: '/admin/crm' },
    { label: 'Business Rules', href: '/admin/crm/rules' },
  ];

  const actions = [
    {
      label: 'New Rule',
      icon: <AddIcon />,
      onClick: () => console.log('Create rule'),
    }
  ];

  return (
    <AdminLayout>
      <Container maxWidth="xl">
        <AdminPageHeader
          title="Business Rules"
          breadcrumbs={breadcrumbs}
          actions={actions}
        />

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, border: theme => `1px solid ${theme.palette.divider}`, borderRadius: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 800 }}>Rules Engine</Typography>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>{status?.version || 'V2.14.0'}</Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <StatusBadge status={status?.status || 'Active'} />
                <Typography variant="body2" sx={{ mt: 0.5, fontSize: '0.7rem', color: 'text.secondary' }}>Last reload: 2h ago</Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, border: theme => `1px solid ${theme.palette.divider}`, borderRadius: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 800 }}>Conflicts Detected</Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: 'error.main' }}>{status?.conflicts || 0}</Typography>
              </Box>
              <TuneIcon sx={{ color: 'text.disabled', fontSize: '2rem' }} />
            </Paper>
          </Grid>
        </Grid>

        <DataTable
          columns={columns}
          data={rules}
          loading={loading}
          onEdit={(row) => console.log('Edit', row)}
          onDelete={(row) => console.log('Delete', row)}
          searchable
        />
      </Container>
    </AdminLayout>
  );
}