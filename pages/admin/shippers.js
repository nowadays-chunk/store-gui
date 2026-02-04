import AdminLayout from '../../components/admin/AdminLayout';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import { Container, Typography, Box } from '@mui/material';

export default function ShippersPage() {
    return (
        <AdminLayout>
            <Container maxWidth="xl">
                <AdminPageHeader title="Shippers" />
                <Box sx={{ p: 3 }}>
                    <Typography>Module under construction</Typography>
                </Box>
            </Container>
        </AdminLayout>
    );
}
