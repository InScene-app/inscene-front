import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#FF8C5F',
      light: '#F8BEA3',
      extraLight: '#FFF1EB',
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
    fontFamily: 'Nunito, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',

    h1: {
      fontFamily: 'Quicksand, sans-serif',
    },
    h2: {
      fontFamily: 'Quicksand, sans-serif',
    },
    h3: {
      fontFamily: 'Quicksand, sans-serif',
    },
    h4: {
      fontFamily: 'Quicksand, sans-serif',
    },

    body1: {
      fontFamily: 'Nunito, sans-serif',
    },

    button: {
      fontFamily: 'Nunito, sans-serif',
      textTransform: 'none',
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