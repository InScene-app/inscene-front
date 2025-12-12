import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from './config/theme';
import { LayoutProvider } from './contexts/LayoutContext';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <LayoutProvider>
        <CssBaseline />
        <RouterProvider router={router} />
      </LayoutProvider>
    </ThemeProvider>
  );
}
