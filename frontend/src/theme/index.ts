import { createTheme, alpha, type PaletteMode } from '@mui/material/styles';

// Paleta de cores - Visual moderno e profissional
const primaryMain = '#1e3a5f'; // Azul escuro profissional
const primaryLight = '#4a6fa5';
const primaryDark = '#0d2137';
const secondaryMain = '#2e7d32'; // Verde para sucesso/ações
const successMain = '#2e7d32';
const warningMain = '#ed6c02';
const errorMain = '#d32f2f';
const infoMain = '#0288d1';

// Função para criar tema com base no modo
export const createAppTheme = (mode: PaletteMode) => {
  const isLight = mode === 'light';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: primaryMain,
        light: primaryLight,
        dark: primaryDark,
        contrastText: '#ffffff',
      },
      secondary: {
        main: secondaryMain,
        light: '#60ad5e',
        dark: '#005005',
        contrastText: '#ffffff',
      },
      success: {
        main: successMain,
        light: '#60ad5e',
        dark: '#005005',
      },
      warning: {
        main: warningMain,
        light: '#ff9800',
        dark: '#c77700',
      },
      error: {
        main: errorMain,
        light: '#ef5350',
        dark: '#c62828',
      },
      info: {
        main: infoMain,
        light: '#03a9f4',
        dark: '#01579b',
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
        primary: isLight ? '#1a1a2e' : '#f1f3f5',
        secondary: isLight ? '#5a5a7a' : '#adb5bd',
      },
      divider: isLight ? 'rgba(0, 0, 0, 0.08)' : '#2d2d2d',
    },
    typography: {
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      h1: {
        fontSize: '2.5rem',
        fontWeight: 700,
        lineHeight: 1.2,
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 700,
        lineHeight: 1.3,
      },
      h3: {
        fontSize: '1.75rem',
        fontWeight: 600,
        lineHeight: 1.3,
      },
      h4: {
        fontSize: '1.5rem',
        fontWeight: 600,
        lineHeight: 1.4,
      },
      h5: {
        fontSize: '1.25rem',
        fontWeight: 600,
        lineHeight: 1.4,
      },
      h6: {
        fontSize: '1rem',
        fontWeight: 600,
        lineHeight: 1.5,
      },
      subtitle1: {
        fontSize: '1rem',
        fontWeight: 500,
        lineHeight: 1.5,
      },
      subtitle2: {
        fontSize: '0.875rem',
        fontWeight: 500,
        lineHeight: 1.5,
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.5,
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.5,
      },
      caption: {
        fontSize: '0.75rem',
      },
      button: {
        textTransform: 'none',
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 8,
    },
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
          root: {
            borderRadius: 8,
            padding: '8px 20px',
            fontWeight: 600,
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            },
          },
          contained: {
            '&:hover': {
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: isLight 
              ? '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)' 
              : '0 1px 3px rgba(0,0,0,0.3)',
            border: `1px solid ${isLight ? 'rgba(0,0,0,0.05)' : '#2d2d2d'}`,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
          elevation1: {
            boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
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
          root: {
            fontWeight: 500,
            borderRadius: 6,
          },
          sizeSmall: {
            height: 24,
            fontSize: '0.75rem',
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: `1px solid ${isLight ? '#e9ecef' : '#2d2d2d'}`,
            padding: '12px 16px',
          },
          head: {
            fontWeight: 600,
            backgroundColor: isLight ? '#f8fafc' : '#2d2d2d',
            color: isLight ? '#495057' : '#e9ecef',
            fontSize: '0.8125rem',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            border: 'none',
            boxShadow: '2px 0 8px rgba(0,0,0,0.05)',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: isLight ? '#ffffff' : '#1e1e1e',
            color: isLight ? '#1a1a2e' : '#f1f3f5',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
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
              backgroundColor: primaryMain,
              color: '#ffffff',
              '&:hover': { 
                backgroundColor: primaryDark,
              },
              '& .MuiListItemIcon-root': {
                color: '#ffffff',
              },
            },
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 500,
            minHeight: 48,
          },
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
          standardInfo: { 
            backgroundColor: alpha(infoMain, 0.1), 
            color: isLight ? '#01579b' : '#03a9f4',
          },
          standardSuccess: { 
            backgroundColor: alpha(successMain, 0.1), 
            color: isLight ? '#005005' : '#60ad5e',
          },
          standardWarning: { 
            backgroundColor: alpha(warningMain, 0.1), 
            color: isLight ? '#c77700' : '#ff9800',
          },
          standardError: { 
            backgroundColor: alpha(errorMain, 0.1), 
            color: isLight ? '#c62828' : '#ef5350',
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
