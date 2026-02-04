import { Chip } from '@mui/material';

const statusColors = {
    active: 'success',
    inactive: 'default',
    pending: 'warning',
    completed: 'success',
    cancelled: 'error',
    processing: 'info',
    draft: 'default',
    published: 'success',
    archived: 'default',
};

export default function StatusBadge({ status, label, color }) {
    const badgeColor = color || statusColors[status?.toLowerCase()] || 'default';
    const displayLabel = label || status;

    return (
        <Chip
            label={displayLabel}
            color={badgeColor}
            size="small"
            variant="filled"
            sx={{
                textTransform: 'uppercase',
                fontWeight: 800,
                fontSize: '0.6rem',
                letterSpacing: '0.05em',
                borderRadius: 0,
                height: '20px',
                '& .MuiChip-label': {
                    px: 1
                }
            }}
        />
    );
}
