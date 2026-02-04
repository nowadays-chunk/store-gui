import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    TableSortLabel,
    Paper,
    Checkbox,
    IconButton,
    Tooltip,
    TextField,
    Box,
    CircularProgress,
    Typography,
    useTheme,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Visibility as ViewIcon } from '@mui/icons-material';
import { useState } from 'react';

export default function DataTable({
    columns,
    data: rawData = [],
    selectable = false,
    onSelectionChange,
    onRowClick,
    actions,
    pagination = true,
    totalCount = 0,
    page = 0,
    rowsPerPage = 10,
    onPageChange,
    onRowsPerPageChange,
    sortable = true,
    searchable = false,
    onSearch,
    loading = false,
    onEdit,
    onDelete,
    onView,
}) {
    const theme = useTheme();
    const data = Array.isArray(rawData) ? rawData : (rawData?.data || rawData?.items || rawData?.products || rawData?.inventory || rawData?.orders || rawData?.vendors || rawData?.shippers || rawData?.warehouses || []);
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('');
    const [order, setOrder] = useState('asc');
    const [searchTerm, setSearchTerm] = useState('');

    const handleSelectAll = (event) => {
        if (event.target.checked) {
            setSelected(data.map((row) => row.id));
        } else {
            setSelected([]);
        }
    };

    const handleSelect = (id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = [...selected, id];
        } else {
            newSelected = selected.filter((item) => item !== id);
        }

        setSelected(newSelected);
    };

    const handleSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSearch = (event) => {
        const value = event.target.value;
        setSearchTerm(value);
        if (onSearch) {
            onSearch(value);
        }
    };

    const isSelected = (id) => selected.indexOf(id) !== -1;

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Paper
            elevation={0}
            sx={{
                border: theme => `1px solid ${theme.palette.divider}`,
                borderRadius: 0,
                overflow: 'hidden'
            }}
        >
            {searchable && (
                <Box sx={{ p: 2, borderBottom: theme => `1px solid ${theme.palette.divider}`, display: 'flex', gap: 2 }}>
                    <TextField
                        fullWidth
                        placeholder="Rechercher..."
                        value={searchTerm}
                        onChange={handleSearch}
                        size="small"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 0,
                            }
                        }}
                    />
                </Box>
            )}

            <TableContainer>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            {selectable && (
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        indeterminate={selected.length > 0 && selected.length < data.length}
                                        checked={data.length > 0 && selected.length === data.length}
                                        onChange={handleSelectAll}
                                        size="small"
                                    />
                                </TableCell>
                            )}
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align || 'left'}
                                    style={{ minWidth: column.minWidth }}
                                    sx={{
                                        fontWeight: 800,
                                        fontSize: '0.65rem',
                                        letterSpacing: '0.15em',
                                        textTransform: 'uppercase',
                                        color: 'text.secondary',
                                        py: 2
                                    }}
                                >
                                    {sortable && column.sortable !== false ? (
                                        <TableSortLabel
                                            active={orderBy === column.id}
                                            direction={orderBy === column.id ? order : 'asc'}
                                            onClick={() => handleSort(column.id)}
                                        >
                                            {column.label}
                                        </TableSortLabel>
                                    ) : (
                                        column.label
                                    )}
                                </TableCell>
                            ))}
                            {(onEdit || onDelete || onView) && (
                                <TableCell
                                    align="right"
                                    sx={{
                                        fontWeight: 800,
                                        fontSize: '0.65rem',
                                        letterSpacing: '0.15em',
                                        textTransform: 'uppercase',
                                        color: 'text.secondary',
                                        py: 2
                                    }}
                                >
                                    Actions
                                </TableCell>
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row) => {
                            const isItemSelected = isSelected(row.id);
                            return (
                                <TableRow
                                    hover
                                    onClick={() => onRowClick && onRowClick(row)}
                                    role="checkbox"
                                    aria-checked={isItemSelected}
                                    tabIndex={-1}
                                    key={row.id}
                                    selected={isItemSelected}
                                    sx={{
                                        cursor: onRowClick ? 'pointer' : 'default',
                                        '&:hover': {
                                            backgroundColor: theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02) !important' : 'rgba(0,0,0,0.01) !important'
                                        }
                                    }}
                                >
                                    {selectable && (
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                size="small"
                                                checked={isItemSelected}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleSelect(row.id);
                                                }}
                                            />
                                        </TableCell>
                                    )}
                                    {columns.map((column) => (
                                        <TableCell
                                            key={column.id}
                                            align={column.align || 'left'}
                                            sx={{
                                                fontSize: '0.85rem',
                                                color: 'text.primary',
                                                py: 1.5,
                                                fontWeight: column.bold ? 600 : 400
                                            }}
                                        >
                                            {column.render ? column.render(row[column.id], row) : row[column.id]}
                                        </TableCell>
                                    ))}
                                    {(onEdit || onDelete || onView) && (
                                        <TableCell align="right" sx={{ py: 1 }}>
                                            {onView && (
                                                <Tooltip title="View">
                                                    <IconButton
                                                        size="small"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onView(row);
                                                        }}
                                                        sx={{ borderRadius: 0 }}
                                                    >
                                                        <ViewIcon sx={{ fontSize: '1.2rem' }} />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                            {onEdit && (
                                                <Tooltip title="Edit">
                                                    <IconButton
                                                        size="small"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onEdit(row);
                                                        }}
                                                        sx={{ borderRadius: 0 }}
                                                    >
                                                        <EditIcon sx={{ fontSize: '1.2rem' }} />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                            {onDelete && (
                                                <Tooltip title="Delete">
                                                    <IconButton
                                                        size="small"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onDelete(row);
                                                        }}
                                                        sx={{ borderRadius: 0, color: 'error.main' }}
                                                    >
                                                        <DeleteIcon sx={{ fontSize: '1.2rem' }} />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                        </TableCell>
                                    )}
                                </TableRow>
                            );
                        })}
                        {data.length === 0 && !loading && (
                            <TableRow>
                                <TableCell colSpan={columns.length + (selectable ? 1 : 0) + (onEdit || onDelete || onView ? 1 : 0)} align="center" sx={{ py: 8 }}>
                                    <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                        Aucune donnée trouvée
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {pagination && (
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50, 100]}
                    component="div"
                    count={totalCount || data.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={onPageChange}
                    onRowsPerPageChange={onRowsPerPageChange}
                    sx={{
                        borderTop: theme => `1px solid ${theme.palette.divider}`,
                        textTransform: 'uppercase',
                        '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            letterSpacing: '0.05em'
                        }
                    }}
                />
            )}
        </Paper>
    );
}
