import { createTheme } from '@mui/material/styles';

// --- PALETTES ---
// PURIFIED / SHARP / MATTE
// High contrast, no shiny gradients.

const PRIMARY_LIGHT = {
    main: '#111111',
    light: '#333333',
    dark: '#000000',
    contrastText: '#FFFFFF',
};

const PRIMARY_DARK = {
    main: '#FFFFFF',
    light: '#F0F0F0',
    dark: '#E0E0E0',
    contrastText: '#000000',
};

const SECONDARY = {
    main: '#555555',
    light: '#777777',
    dark: '#333333',
    contrastText: '#FFFFFF',
};

const SUCCESS = {
    main: '#10B981',
    light: '#34D399',
    dark: '#059669',
    contrastText: '#FFFFFF',
};

const ERROR = {
    main: '#EF4444',
    light: '#F87171',
    dark: '#B91C1C',
    contrastText: '#FFFFFF',
};

const GREY = {
    0: '#FFFFFF',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
};

const FONT_FAMILY = '"Inter", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif';

export const getTheme = (mode) => {
    const isDark = mode === 'dark';

    const bgDefault = isDark ? '#0A0A0A' : '#FAFAFA';
    const bgPaper = isDark ? '#141414' : '#FFFFFF';
    const textPrimary = isDark ? '#EDEDED' : '#121212';
    const textSecondary = isDark ? '#A1A1A1' : '#666666';

    const primaryPalette = isDark ? PRIMARY_DARK : PRIMARY_LIGHT;

    return createTheme({
        palette: {
            mode,
            primary: primaryPalette,
            secondary: SECONDARY,
            success: SUCCESS,
            error: ERROR,
            grey: GREY,
            background: {
                default: bgDefault,
                paper: bgPaper,
                neutral: isDark ? '#1F1F1F' : '#F0F0F0',
            },
            text: {
                primary: textPrimary,
                secondary: textSecondary,
            },
            divider: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
        },
        typography: {
            fontFamily: FONT_FAMILY,
            h1: { fontWeight: 800, fontSize: '2.5rem', letterSpacing: '-0.02em' },
            h2: { fontWeight: 700, fontSize: '2rem', letterSpacing: '-0.01em' },
            h3: { fontWeight: 700, fontSize: '1.75rem', letterSpacing: '-0.01em' },
            h4: { fontWeight: 600, fontSize: '1.5rem', letterSpacing: '0em' },
            h5: { fontWeight: 600, fontSize: '1.25rem', letterSpacing: '0.01em' },
            h6: { fontWeight: 600, fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' },
            subtitle1: { fontSize: '1rem', fontWeight: 500 },
            subtitle2: { fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: textSecondary },
            body1: { fontSize: '0.95rem', lineHeight: 1.6 },
            body2: { fontSize: '0.875rem', lineHeight: 1.5 },
            button: { textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' },
        },
        shape: {
            borderRadius: 0, // SHARP
        },
        components: {
            MuiCssBaseline: {
                styleOverrides: {
                    body: {
                        backgroundColor: bgDefault,
                        color: textPrimary,
                        scrollbarWidth: 'thin',
                        '&::-webkit-scrollbar': { width: '6px', height: '6px' },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: isDark ? '#333' : '#CCC',
                            borderRadius: '0px',
                        },
                    },
                },
            },
            MuiPaper: {
                styleOverrides: {
                    root: {
                        backgroundImage: 'none',
                        transition: 'box-shadow 0.3s ease-in-out, transform 0.2s ease-in-out',
                    },
                    elevation1: {
                        boxShadow: isDark ? '0 1px 2px rgba(0,0,0,0.5)' : '0 1px 3px rgba(0,0,0,0.05)',
                        border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                    }
                }
            },
            MuiButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 0,
                        fontWeight: 700,
                        padding: '8px 20px',
                    },
                    contained: {
                        backgroundColor: isDark ? '#FFFFFF' : '#111111',
                        color: isDark ? '#000000' : '#FFFFFF',
                        '&:hover': {
                            backgroundColor: isDark ? '#E0E0E0' : '#333333',
                        }
                    },
                },
            },
            MuiTableCell: {
                styleOverrides: {
                    root: {
                        padding: '16px 24px',
                        borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`,
                        fontFamily: FONT_FAMILY,
                    },
                    head: {
                        backgroundColor: isDark ? '#141414' : '#FAFAFA',
                        color: textSecondary,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        fontSize: '0.75rem',
                        letterSpacing: '0.1em',
                        borderBottom: `2px solid ${isDark ? '#333' : '#E0E0E0'}`,
                    },
                },
            },
        },
    });
};
