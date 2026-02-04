import { useState, useEffect } from 'react';
import AdminLayout from '../../../../components/admin/AdminLayout';
import AdminPageHeader from '../../../../components/admin/AdminPageHeader';
import DataTable from '../../../../components/common/DataTable';
import StatusBadge from '../../../../components/common/StatusBadge';
import apiService from '../../../../utils/apiService';
import { useApi } from '../../../../hooks/useApi';
import { Container, Paper, Typography, Box, Grid } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import SecurityIcon from '@mui/icons-material/Security';
import DownloadIcon from '@mui/icons-material/Download';

export default function AuditPage() {
  const { data, loading, execute } = useApi(apiService.audit.getLogs);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const result = await execute({ limit: 50 });
    if (result.success) {
      setLogs(result.data.logs || result.data || []);
    }
  };

  const columns = [
    { id: 'timestamp', label: 'Timestamp', render: (v) => new Date(v || Date.now()).toLocaleString() },
    { id: 'userId', label: 'User', bold: true },
    { id: 'action', label: 'Action', render: (v) => <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>{v}</Typography> },
    { id: 'entity', label: 'Entity' },
    {
      id: 'severity',
      label: 'Severity',
      render: (value) => {
        const colors = { high: 'error', medium: 'warning', low: 'info' };
        return <StatusBadge status={value || 'Low'} color={colors[value?.toLowerCase()] || 'default'} />
      }
    },
  ];

  const breadcrumbs = [
    { label: 'CRM', href: '/admin/crm' },
    { label: 'Audit Logs', href: '/admin/crm/audit' },
  ];

  const actions = [
    {
      label: 'Export Logs',
      icon: <DownloadIcon />,
      onClick: () => console.log('Export logs'),
      variant: 'outlined'
    }
  ];

  return (
    <AdminLayout>
      <Container maxWidth="xl">
        <AdminPageHeader
          title="Audit & Security Logs"
          breadcrumbs={breadcrumbs}
          actions={actions}
        />

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, border: theme => `1px solid ${theme.palette.divider}`, borderRadius: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <HistoryIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="overline" sx={{ fontWeight: 800 }}>Total Events</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>12,482</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, border: theme => `1px solid ${theme.palette.divider}`, borderRadius: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <SecurityIcon sx={{ mr: 1, color: 'error.main' }} />
                <Typography variant="overline" sx={{ fontWeight: 800 }}>Security Alerts</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: 'error.main' }}>3</Typography>
            </Paper>
          </Grid>
        </Grid>

        <DataTable
          columns={columns}
          data={logs}
          loading={loading}
          onView={(row) => console.log('View full payload', row)}
          searchable
        />
      </Container>
    </AdminLayout>
  );
}