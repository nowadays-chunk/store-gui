import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Box, Container, Typography, CircularProgress } from '@mui/material';
import apiService from '../../../utils/apiService';
import { useApi } from '../../../hooks/useApi';

export default function System MonitoringDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { data, loading, error, execute } = useApi(apiService.admin.get);

  useEffect(() => {
    if (id) execute(id);
  }, [id]);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>System Monitoring Details</Typography>
        {/* Add your detail UI here */}
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </Box>
    </Container>
  );
}