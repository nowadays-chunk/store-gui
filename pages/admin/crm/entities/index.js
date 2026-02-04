import { useState, useEffect } from 'react';
import AdminLayout from '../../../../components/admin/AdminLayout';
import AdminPageHeader from '../../../../components/admin/AdminPageHeader';
import DataTable from '../../../../components/common/DataTable';
import StatusBadge from '../../../../components/common/StatusBadge';
import apiService from '../../../../utils/apiService';
import { useApi } from '../../../../hooks/useApi';
import { Container, Paper, Typography, Box, Grid } from '@mui/material';
import ExtensionIcon from '@mui/icons-material/Extension';
import SchemaIcon from '@mui/icons-material/Schema';

export default function EntitiesPage() {
  const { data, loading, execute } = useApi(apiService.entities.list);
  const [entities, setEntities] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const result = await execute();
    if (result.success) {
      setEntities(result.data.entities || result.data || []);
    }
  };

  const columns = [
    { id: 'name', label: 'Entity Name', bold: true },
    { id: 'tableName', label: 'Database Table' },
    { id: 'fieldCount', label: 'Fields', render: (v, row) => row.fields?.length || 0 },
    {
      id: 'isSystem',
      label: 'Type',
      render: (value) => value ? <StatusBadge status="System" /> : <StatusBadge status="Custom" color="info" />
    },
  ];

  const breadcrumbs = [
    { label: 'CRM', href: '/admin/crm' },
    { label: 'Entity Designer', href: '/admin/crm/entities' },
  ];

  const actions = [
    {
      label: 'Define Entity',
      icon: <ExtensionIcon />,
      onClick: () => console.log('Define entity'),
    }
  ];

  return (
    <AdminLayout>
      <Container maxWidth="xl">
        <AdminPageHeader
          title="Entity Designer"
          breadcrumbs={breadcrumbs}
          actions={actions}
        />

        <Box sx={{ mb: 4 }}>
          <Paper
            sx={{
              p: 3,
              border: theme => `1px solid ${theme.palette.divider}`,
              borderRadius: 0,
              background: theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <SchemaIcon sx={{ mr: 2, color: 'primary.main' }} />
              <Typography variant="h6" sx={{ fontWeight: 800 }}>Schema Overview</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Gérez les modèles de données dynamiques de votre application. Définissez de nouvelles entités, ajoutez des champs personnalisés et configurez les relations sans écrire de code SQL.
            </Typography>
          </Paper>
        </Box>

        <DataTable
          columns={columns}
          data={entities}
          loading={loading}
          onEdit={(row) => console.log('Edit', row)}
          onView={(row) => console.log('View', row)}
          searchable
        />
      </Container>
    </AdminLayout>
  );
}