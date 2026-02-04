import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../utils/api';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Typography, Box
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const theme = useTheme();

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const data = await api.get('/users');
            setUsers(data);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <AdminLayout>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 800 }}>
                    Utilisateurs
                </Typography>
            </Box>

            <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${theme.palette.divider}` }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Nom d'utilisateur</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Role</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map(u => (
                            <TableRow key={u.id} hover>
                                <TableCell>{u.id}</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>{u.firstName} {u.lastName}</TableCell>
                                <TableCell>{u.email}</TableCell>
                                <TableCell>{u.role || 'User'}</TableCell>
                            </TableRow>
                        ))}
                        {users.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                                    Aucun utilisateur trouvé
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </AdminLayout>
    );
}
