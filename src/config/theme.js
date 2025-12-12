import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#F4A582',
      light: '#F8BEA3',
      dark: '#E89164',
    },
    secondary: {
      main: '#6B7A8F',
      light: '#8A98A8',
      dark: '#5C6878',
    },
    background: {
      default: '#FAF8F3',
      middle: '#F5F5F5',
      dark: '#D9D9D9',
      white: '#FFFFFF',
      black: '#000000',
    },
    text: {
      primary: '#2D3436',
      secondary: '#5C5470',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','), //nunito pour le corps , quicksand pour les titres
    h1: {
      fontWeight: 700,
      fontSize: '2rem',
      color: '#2D3436',
    },
    h2: {
      fontWeight: 600,
      fontSize: '1.5rem',
      color: '#2D3436',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.25rem',
      color: '#2D3436',
    },
    body1: {
      fontSize: '0.95rem',
      color: '#2D3436',
    },
    body2: {
      fontSize: '0.875rem',
      color: '#5C5470',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          padding: '10px 24px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 2px 8px rgba(0,0,0,0.06)',
        },
      },
    },
  },
});

export default theme; 