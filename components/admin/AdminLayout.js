import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { styled, ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/router';
import { getTheme } from '../../utils/theme';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Box from '@mui/material/Box';

const Container = styled('div')(({ theme }) => ({
    display: 'flex',
    minHeight: '100vh',
    background: theme.palette.background.default,
    color: theme.palette.text.primary
}));

const Sidebar = styled('aside')(({ theme }) => ({
    width: '260px',
    background: theme.palette.mode === 'dark' ? '#000000' : '#111111', // Pure black or very dark grey
    color: '#fff',
    padding: '2rem 1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    borderRight: `1px solid ${theme.palette.divider}`
}));

const Content = styled('main')(({ theme }) => ({
    flex: 1,
    padding: '2rem',
    overflowY: 'auto',
    background: theme.palette.background.default
}));

const NavLink = styled('a')(({ theme, active }) => ({
    color: '#9CA3AF',
    textDecoration: 'none',
    padding: '0.75rem 1rem',
    borderRadius: 0, // SHARP
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    transition: 'all 0.2s',
    backgroundColor: active ? 'rgba(255,255,255,0.1)' : 'transparent',
    color: active ? '#fff' : '#9CA3AF',
    borderLeft: active ? '2px solid #fff' : '2px solid transparent',
    ':hover': {
        background: 'rgba(255,255,255,0.05)',
        color: '#fff'
    }
}));

const Logo = styled('div')({
    fontSize: '1.25rem',
    fontWeight: 800,
    marginBottom: '3rem',
    color: '#fff',
    letterSpacing: '-0.02em',
    textTransform: 'uppercase',
    paddingLeft: '1rem'
});

export default function AdminLayout({ children }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [mode, setMode] = useState('light');

    const theme = useMemo(() => getTheme(mode), [mode]);

    const toggleColorMode = () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    };

    React.useEffect(() => {
        if (!loading) {
            if (!user || user.role !== 'admin') {
                // Strict check can be uncommented
            }
        }
    }, [user, loading, router]);

    const isActive = (path) => router.pathname === path;

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container>
                <Sidebar>
                    <Logo>Tailored Bridge</Logo>

                    <Box sx={{ mb: 2 }}>
                        <span style={{ fontSize: '0.7rem', color: '#6B7280', paddingLeft: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Overview</span>
                    </Box>

                    <Link href="/admin" passHref legacyBehavior><NavLink active={isActive('/admin')}>Dashboard</NavLink></Link>
                    <Link href="/admin/reports" passHref legacyBehavior><NavLink active={isActive('/admin/reports')}>Rapports</NavLink></Link>

                    <Box sx={{ mt: 3, mb: 1 }}>
                        <span style={{ fontSize: '0.7rem', color: '#6B7280', paddingLeft: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Commerce</span>
                    </Box>

                    <Link href="/admin/orders" passHref legacyBehavior><NavLink active={isActive('/admin/orders')}>Commandes</NavLink></Link>
                    <Link href="/admin/inventory" passHref legacyBehavior><NavLink active={isActive('/admin/inventory')}>Inventaire</NavLink></Link>

                    <Box sx={{ mt: 3, mb: 1 }}>
                        <span style={{ fontSize: '0.7rem', color: '#6B7280', paddingLeft: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Catalog</span>
                    </Box>

                    <Link href="/admin/products" passHref legacyBehavior><NavLink active={isActive('/admin/products')}>Produits</NavLink></Link>
                    <Link href="/admin/categories" passHref legacyBehavior><NavLink active={isActive('/admin/categories')}>Catégories</NavLink></Link>
                    <Link href="/admin/brands" passHref legacyBehavior><NavLink active={isActive('/admin/brands')}>Marques</NavLink></Link>
                    <Link href="/admin/vendors" passHref legacyBehavior><NavLink active={isActive('/admin/vendors')}>Vendeurs</NavLink></Link>

                    <Box sx={{ mt: 3, mb: 1 }}>
                        <span style={{ fontSize: '0.7rem', color: '#6B7280', paddingLeft: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Logistics</span>
                    </Box>

                    <Link href="/admin/warehouses" passHref legacyBehavior><NavLink active={isActive('/admin/warehouses')}>Entrepôts</NavLink></Link>
                    <Link href="/admin/shippers" passHref legacyBehavior><NavLink active={isActive('/admin/shippers')}>Transporteurs</NavLink></Link>

                    <Box sx={{ mt: 3, mb: 1 }}>
                        <span style={{ fontSize: '0.7rem', color: '#6B7280', paddingLeft: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>System</span>
                    </Box>

                    <Link href="/admin/users" passHref legacyBehavior><NavLink active={isActive('/admin/users')}>Utilisateurs</NavLink></Link>
                    <Link href="/admin/cms" passHref legacyBehavior><NavLink active={isActive('/admin/cms')}>CMS Content</NavLink></Link>

                    <Box sx={{ mt: 'auto', pt: 2, borderTop: '1px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: '1rem' }}>
                        <Link href="/" passHref legacyBehavior><a style={{ color: '#fff', textDecoration: 'none', fontSize: '0.8rem', textTransform: 'uppercase' }}>← Site</a></Link>
                    </Box>
                </Sidebar>
                <Content>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                        <IconButton onClick={toggleColorMode} color="inherit">
                            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                        </IconButton>
                    </Box>
                    {children}
                </Content>
            </Container>
        </ThemeProvider>
    );
}
