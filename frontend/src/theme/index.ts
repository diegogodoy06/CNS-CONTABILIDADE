import { createTheme, alpha, type PaletteMode } from '@mui/material/styles';

// Paleta de cores
const primaryMain = '#0066CC';
const successMain = '#28a745';
const warningMain = '#ffc107';
const errorMain = '#dc3545';
const infoMain = '#17a2b8';

// Função para criar tema com base no modo
export const createAppTheme = (mode: PaletteMode) => {
  const isLight = mode === 'light';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: primaryMain,
        light: '#3399ff',
        dark: '#004d99',
        contrastText: '#ffffff',
      },
      secondary: {
        main: isLight ? '#6c757d' : '#adb5bd',
        light: isLight ? '#868e96' : '#ced4da',
        dark: isLight ? '#495057' : '#868e96',
        contrastText: '#ffffff',
      },
      success: {
        main: successMain,
        light: '#48c774',
        dark: '#1e7e34',
      },
      warning: {
        main: warningMain,
        light: '#ffdd57',
        dark: '#d39e00',
      },
      error: {
        main: errorMain,
        light: '#f14668',
        dark: '#bd2130',
      },
      info: {
        main: infoMain,
        light: '#3ec5d5',
        dark: '#117a8b',
      },
      grey: {
        50: '#f8f9fa',
        100: '#f1f3f5',
        200: '#e9ecef',
        300: '#dee2e6',
        400: '#ced4da',
        500: '#adb5bd',
        600: '#6c757d',
        700: '#495057',
        800: '#343a40',
        900: '#212529',
      },
      background: {
        default: isLight ? '#f5f7fa' : '#121212',
        paper: isLight ? '#ffffff' : '#1e1e1e',
      },
      text: {
        primary: isLight ? '#212529' : '#f1f3f5',
        secondary: isLight ? '#6c757d' : '#adb5bd',
      },
      divider: isLight ? '#e9ecef' : '#2d2d2d',
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: { fontSize: '2rem', fontWeight: 700 },
      h2: { fontSize: '1.75rem', fontWeight: 700 },
      h3: { fontSize: '1.5rem', fontWeight: 600 },
      h4: { fontSize: '1.25rem', fontWeight: 600 },
      h5: { fontSize: '1.125rem', fontWeight: 600 },
      h6: { fontSize: '1rem', fontWeight: 600 },
      subtitle1: { fontSize: '1rem', fontWeight: 500 },
      subtitle2: { fontSize: '0.875rem', fontWeight: 500 },
      body1: { fontSize: '0.9375rem' },
      body2: { fontSize: '0.875rem' },
      caption: { fontSize: '0.75rem' },
      button: { textTransform: 'none', fontWeight: 600 },
    },
    shape: { borderRadius: 8 },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            scrollbarWidth: 'thin',
            '&::-webkit-scrollbar': { width: '8px', height: '8px' },
            '&::-webkit-scrollbar-track': { background: isLight ? '#f1f3f5' : '#2d2d2d' },
            '&::-webkit-scrollbar-thumb': { background: isLight ? '#ced4da' : '#555', borderRadius: '4px' },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: { borderRadius: 6, padding: '8px 16px', fontWeight: 600 },
          contained: { boxShadow: 'none', '&:hover': { boxShadow: '0 2px 4px rgba(0,0,0,0.1)' } },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: isLight ? '0 1px 3px rgba(0,0,0,0.08)' : '0 1px 3px rgba(0,0,0,0.3)',
            border: `1px solid ${isLight ? '#e9ecef' : '#2d2d2d'}`,
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
              '& fieldset': { borderColor: isLight ? '#dee2e6' : '#444' },
              '&:hover fieldset': { borderColor: isLight ? '#adb5bd' : '#666' },
              '&.Mui-focused fieldset': { borderColor: primaryMain, borderWidth: 2 },
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { fontWeight: 500, borderRadius: 6 },
          sizeSmall: { height: 24, fontSize: '0.75rem' },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: { borderBottom: `1px solid ${isLight ? '#e9ecef' : '#2d2d2d'}`, padding: '12px 16px' },
          head: {
            fontWeight: 600,
            backgroundColor: isLight ? '#f8f9fa' : '#2d2d2d',
            color: isLight ? '#495057' : '#e9ecef',
            fontSize: '0.8125rem',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            border: 'none',
            borderRight: `1px solid ${isLight ? '#e9ecef' : '#2d2d2d'}`,
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            margin: '2px 8px',
            padding: '10px 12px',
            '&.Mui-selected': {
              backgroundColor: alpha(primaryMain, 0.15),
              '&:hover': { backgroundColor: alpha(primaryMain, 0.2) },
            },
          },
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: { borderRadius: 8 },
          standardInfo: { backgroundColor: alpha(infoMain, 0.1), color: isLight ? '#117a8b' : '#3ec5d5' },
          standardSuccess: { backgroundColor: alpha(successMain, 0.1), color: isLight ? '#1e7e34' : '#48c774' },
          standardWarning: { backgroundColor: alpha(warningMain, 0.1), color: isLight ? '#856404' : '#ffdd57' },
          standardError: { backgroundColor: alpha(errorMain, 0.1), color: isLight ? '#bd2130' : '#f14668' },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: isLight ? '#ffffff' : '#1e1e1e',
            color: isLight ? '#212529' : '#f1f3f5',
          },
        },
      },
    },
  });
};

// Tema padrão (light mode)
export const theme = createAppTheme('light');
export const darkTheme = createAppTheme('dark');

export default theme;
