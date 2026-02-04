import { useState, useEffect } from 'react';
import { Box, Container, Typography, Button, CircularProgress } from '@mui/material';
import apiService from '../../../utils/apiService';
import { useApi } from '../../../hooks/useApi';

export default function Knowledge BasePage() {
  const { data, loading, error, execute } = useApi(apiService.support.list);

  useEffect(() => {
    execute();
  }, []);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>Knowledge Base</Typography>
        {/* Add your list UI here */}
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </Box>
    </Container>
  );
}