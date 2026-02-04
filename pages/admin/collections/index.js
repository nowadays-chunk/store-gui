import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../components/admin/AdminLayout';
import AdminPageHeader from '../../../components/admin/AdminPageHeader';
import DataTable from '../../../components/common/DataTable';
import StatusBadge from '../../../components/common/StatusBadge';
import apiService from '../../../utils/apiService';
import { useApi, useFormSubmit } from '../../../hooks/useApi';
import { Container, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, MenuItem, FormControlLabel, Switch } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

export default function CollectionsPage() {
  const router = useRouter();
  const { data, loading, execute } = useApi(apiService.collections.list);
  const createApi = useApi(apiService.collections.create);
  const deleteApi = useApi(apiService.collections.delete);

  const [collections, setCollections] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newCollection, setNewCollection] = useState({ name: '', slug: '', description: '', isPublished: false });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const result = await execute();
    if (result.success) {
      setCollections(result.data.collections || result.data || []);
    } else if (Array.isArray(result)) {
      setCollections(result);
    }
  };

  const handleCreate = async () => {
    const res = await createApi.execute(newCollection);
    if (res) {
      setOpenDialog(false);
      setNewCollection({ name: '', slug: '', description: '', isPublished: false });
      loadData();
    }
  };

  const handleDelete = async (row) => {
    if (window.confirm('Are you sure you want to delete this collection?')) {
      await deleteApi.execute(row.id);
      loadData();
    }
  };

  const columns = [
    { id: 'name', label: 'Collection Name', bold: true },
    { id: 'slug', label: 'Slug' },
    { id: 'productCount', label: 'Products', render: (v) => v || 0 },
    {
      id: 'isPublished',
      label: 'Visibility',
      render: (value) => <StatusBadge status={value ? 'Active' : 'Draft'} />
    },
  ];

  const breadcrumbs = [
    { label: 'Catalog', href: '/admin/products' },
    { label: 'Collections', href: '/admin/collections' },
  ];

  const actions = [
    {
      label: 'New Collection',
      icon: <AddIcon />,
      onClick: () => setOpenDialog(true),
    }
  ];

  return (
    <AdminLayout>
      <Container maxWidth="xl">
        <AdminPageHeader
          title="Collections"
          breadcrumbs={breadcrumbs}
          actions={actions}
        />

        <DataTable
          columns={columns}
          data={collections}
          loading={loading}
          onEdit={(row) => router.push(`/admin/collections/${row.id}`)}
          onDelete={handleDelete}
          searchable
        />

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Create New Collection</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Collection Name"
                fullWidth
                value={newCollection.name}
                onChange={(e) => setNewCollection({ ...newCollection, name: e.target.value })}
              />
              <TextField
                label="Slug"
                fullWidth
                value={newCollection.slug}
                onChange={(e) => setNewCollection({ ...newCollection, slug: e.target.value })}
                helperText="e.g. summer-sale"
              />
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={3}
                value={newCollection.description}
                onChange={(e) => setNewCollection({ ...newCollection, description: e.target.value })}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={newCollection.isPublished}
                    onChange={(e) => setNewCollection({ ...newCollection, isPublished: e.target.checked })}
                  />
                }
                label="Publish Immediately"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button onClick={handleCreate} variant="contained" disabled={createApi.loading}>Create</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </AdminLayout>
  );
}