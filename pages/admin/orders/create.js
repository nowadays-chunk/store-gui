import AdminLayout from '../../../components/admin/AdminLayout';
import AdminPageHeader from '../../../components/admin/AdminPageHeader';
import { Container, Typography, Box } from '@mui/material';

export default function CreateOrderPage() {
    return (
        <AdminLayout>
            <Container maxWidth="xl">
                <AdminPageHeader title="Create Manual Order" />
                <Box sx={{ p: 3 }}>
                    <Typography>Manual order creation module under construction</Typography>
                </Box>
            </Container>
        </AdminLayout>
    );
}
