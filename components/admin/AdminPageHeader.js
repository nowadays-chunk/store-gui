import React from 'react';
import { Box, Typography, Button, Breadcrumbs, Link as MuiLink } from '@mui/material';
import Link from 'next/link';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

export default function AdminPageHeader({ title, breadcrumbs = [], actions = [] }) {
    return (
        <Box sx={{ mb: 4 }}>
            {breadcrumbs.length > 0 && (
                <Breadcrumbs
                    separator={<NavigateNextIcon fontSize="small" />}
                    sx={{ mb: 1, '& .MuiTypography-root': { fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' } }}
                >
                    <Link href="/admin" passHref legacyBehavior>
                        <MuiLink underline="hover" color="inherit">Admin</MuiLink>
                    </Link>
                    {breadcrumbs.map((bc, index) => (
                        index === breadcrumbs.length - 1 ? (
                            <Typography key={index} color="text.primary">{bc.label}</Typography>
                        ) : (
                            <Link key={index} href={bc.href} passHref legacyBehavior>
                                <MuiLink underline="hover" color="inherit">{bc.label}</MuiLink>
                            </Link>
                        )
                    ))}
                </Breadcrumbs>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <Box>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
                        {title}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    {actions.map((action, index) => (
                        <Button
                            key={index}
                            variant={action.variant || 'contained'}
                            color={action.color || 'primary'}
                            onClick={action.onClick}
                            startIcon={action.icon}
                            sx={{ px: 3 }}
                        >
                            {action.label}
                        </Button>
                    ))}
                </Box>
            </Box>
        </Box>
    );
}
