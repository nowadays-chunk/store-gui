import { CircularProgress, Box } from '@mui/material';

export default function LoadingSpinner({ size = 40, fullScreen = false }) {
    if (fullScreen) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh',
                }}
            >
                <CircularProgress size={size} />
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress size={size} />
        </Box>
    );
}
