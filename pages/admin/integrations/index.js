import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import AdminPageHeader from '../../../components/admin/AdminPageHeader';
import DataTable from '../../../components/common/DataTable';
import StatusBadge from '../../../components/common/StatusBadge';
import apiService from '../../../utils/apiService';
import { useApi } from '../../../hooks/useApi';
import { Container, Box, Tabs, Tab, Grid, Paper, Typography, Button } from '@mui/material';
import ExtensionIcon from '@mui/icons-material/Extension';
import WebhookIcon from '@mui/icons-material/Webhook';
import SyncIcon from '@mui/icons-material/Sync';

export default function IntegrationsPage() {
  const [currentTab, setCurrentTab] = useState(0);
  const integrationsApi = useApi(apiService.integrations.list);
  const webhooksApi = useApi(apiService.webhooks.list);
  const [data, setData] = useState([]);

  useEffect(() => {
    loadTabData();
  }, [currentTab]);

  const loadTabData = async () => {
    if (currentTab === 0) {
      const res = await integrationsApi.execute();
      if (res.success) setData(res.data.integrations || res.data || []);
    } else {
      const res = await webhooksApi.execute();
      if (res.success) setData(res.data.webhooks || res.data || []);
    }
  };

  const columns = currentTab === 0 ? [
    { id: 'name', label: 'Integration', bold: true },
    { id: 'provider', label: 'Provider' },
    { id: 'type', label: 'Type' },
    { id: 'status', label: 'Status', render: (v) => <StatusBadge status={v || 'Connected'} color="success" /> },
  ] : [
    { id: 'url', label: 'Webhook URL', bold: true },
    { id: 'event', label: 'Event' },
    { id: 'method', label: 'Method', render: (v) => <Typography sx={{ fontSize: '0.7rem', fontWeight: 800 }}>{v || 'POST'}</Typography> },
    { id: 'active', label: 'Active', render: (v) => <StatusBadge status={v ? 'Active' : 'Disabled'} /> },
  ];

  const breadcrumbs = [
    { label: 'System', href: '/admin/platform' },
    { label: 'Integrations & API', href: '/admin/integrations' },
  ];

  const actions = [
    {
      label: currentTab === 0 ? 'Add Integration' : 'Add Webhook',
      icon: currentTab === 0 ? <ExtensionIcon /> : <WebhookIcon />,
      onClick: () => console.log('Add integration/webhook'),
    }
  ];

  return (
    <AdminLayout>
      <Container maxWidth="xl">
        <AdminPageHeader
          title="Integrations & API"
          breadcrumbs={breadcrumbs}
          actions={actions}
        />

        {currentTab === 0 && (
          <Box sx={{ mb: 4 }}>
            <Paper sx={{ p: 3, border: theme => `1px solid ${theme.palette.divider}`, borderRadius: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <SyncIcon sx={{ mr: 2, color: 'primary.main' }} />
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Dernière Synchronisation Globale</Typography>
                  <Typography variant="body2" color="text.secondary">Il y a 14 minutes • 1,248 enregistrements mis à jour</Typography>
                </Box>
              </Box>
              <Button variant="outlined" startIcon={<SyncIcon />}>Forcer Synchro</Button>
            </Paper>
          </Box>
        )}

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={currentTab} onChange={(e, v) => setCurrentTab(v)}>
            <Tab label="INTEGRATIONS" />
            <Tab label="WEBHOOKS" />
            <Tab label="API KEYS" disabled />
          </Tabs>
        </Box>

        <DataTable
          columns={columns}
          data={data}
          loading={currentTab === 0 ? integrationsApi.loading : webhooksApi.loading}
          onEdit={(row) => console.log('Edit', row)}
          searchable
        />
      </Container>
    </AdminLayout>
  );
}