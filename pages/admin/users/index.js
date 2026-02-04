import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../components/admin/AdminLayout';
import AdminPageHeader from '../../../components/admin/AdminPageHeader';
import DataTable from '../../../components/common/DataTable';
import StatusBadge from '../../../components/common/StatusBadge';
import apiService from '../../../utils/apiService';
import { useApi } from '../../../hooks/useApi';
import { Container } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

export default function UsersPage() {
  const router = useRouter();
  const { data, loading, execute } = useApi(apiService.users.list);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const result = await execute();
    if (result?.success) {
      setUsers(result.data.users || result.data || []);
    } else if (Array.isArray(result)) {
      setUsers(result);
    }
  };

  const columns = [
    {
      id: 'name',
      label: 'Name',
      bold: true,
      render: (v, row) => `${row.firstName || ''} ${row.lastName || ''}`.trim() || row.name || 'N/A'
    },
    { id: 'email', label: 'Email' },
    { id: 'role', label: 'Role', render: (v) => <StatusBadge status={v} color={v === 'admin' ? 'error' : 'default'} /> },
    { id: 'isActive', label: 'Status', render: (v) => <StatusBadge status={v ? 'Active' : 'Banned'} color={v ? 'success' : 'error'} /> },
    { id: 'createdAt', label: 'Joined', render: (v) => new Date(v).toLocaleDateString() }
  ];

  const breadcrumbs = [
    { label: 'System', href: '/admin/platform' },
    { label: 'Users', href: '/admin/users' },
  ];

  const actions = [
    {
      label: 'Invite User',
      icon: <PersonAddIcon />,
      onClick: () => console.log('Invite user'), // To implement
    }
  ];

  return (
    <AdminLayout>
      <Container maxWidth="xl">
        <AdminPageHeader
          title="Users"
          breadcrumbs={breadcrumbs}
          actions={actions}
        />

        <DataTable
          columns={columns}
          data={users}
          loading={loading}
          onEdit={(row) => router.push(`/admin/users/${row.id}`)}
          searchable
        />
      </Container>
    </AdminLayout>
  );
}