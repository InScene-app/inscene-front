import { createTheme, PaletteOptions } from '@mui/material/styles';
import type { PaletteMode, ThemeOptions } from '@mui/material';

const lightPalette: PaletteOptions = {
  mode: 'light',
  primary: {
    main: '#EB6640',     // orange principal — boutons, icônes actives, textes accent
    light: '#F8BEA3',   // tinte claire — hover de boutons outlined
    dark: '#E67E50',    // orange foncé — hover sur éléments orange
  },
  secondary: {
    main: '#225182',    // bleu principal — onboarding, sélection
    light: '#C7DCF0',  // bleu clair — chips inactives
    dark: '#1A3F66',   // bleu foncé — hover secondary
  },
  background: {
    default: '#F2F6FC',  // fond des pages (CssBaseline applique au body)
    paper: '#FFFFFF',    // fond des surfaces (Card, Paper — MUI applique auto)
    subtle: '#E5E7E8',  // fond onboarding / profile setup
    tag: '#F5F5F5',     // fond des tags des offres
    border: '#D9D9D9',  // bordures et séparateurs
    hover: '#E3ECF7',   // hover sur surfaces
    urgent: '#EB6640',  // fond du tag urgent
  },
  text: {
    primary: '#000000',
    secondary: '#5C5470',
  },
  error: {
    main: '#D32F2F',
  },
  divider: '#D9D9D9',
};

const darkPalette: PaletteOptions = {
  mode: 'dark',
  primary: {
    main: '#F2F6FC',   // icônes actives navbar, boutons — bleu très clair
    light: '#FFFFFF',
    dark: '#C7DCF0',   // hover sur primary
  },
  secondary: {
    main: '#225182',   // bleu principal
    light: '#3980BE',  // bleu moyen
    dark: '#1A3F66',   // bleu foncé
  },
  background: {
    default: '#225182',  // fond des pages
    paper: '#14253A',    // fond des cards / surfaces
    subtle: '#14253A',   // fond onboarding (idem default)
    tag: '#14253A',      // fond des tags (idem default)
    border: '#95BDE2',   // bordures et séparateurs
    hover: '#1A3F66',    // hover sur surfaces — plus sombre que paper
    urgent: '#401011',   // fond du tag urgent
  },
  text: {
    primary: '#C7DCF0',   // texte principal
    secondary: '#94B4CC', // texte secondaire — proche de C7DCF0 mais atténué
  },
  error: {
    main: '#D32F2F',
  },
  divider: '#95BDE2',
};

const sharedConfig: ThemeOptions = {
  typography: {
    fontFamily: 'Nunito, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
    h1: { fontFamily: 'Quicksand, sans-serif' },
    h2: { fontFamily: 'Quicksand, sans-serif' },
    h3: { fontFamily: 'Quicksand, sans-serif' },
    h4: { fontFamily: 'Quicksand, sans-serif' },
    body1: { fontFamily: 'Nunito, sans-serif' },
    button: { fontFamily: 'Nunito, sans-serif', textTransform: 'none' },
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
};

export const getTheme = (mode: PaletteMode = 'light') =>
  createTheme({
    palette: mode === 'dark' ? darkPalette : lightPalette,
    ...sharedConfig,
  });

export default getTheme('light');
