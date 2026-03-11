import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { CssBaseline } from '@mui/material';
import { LayoutProvider } from './contexts/LayoutContext';
import { ThemeModeProvider } from './contexts/ThemeContext';

export default function App() {
  return (
    <ThemeModeProvider>
      <LayoutProvider>
        <CssBaseline />
        <RouterProvider router={router} />
      </LayoutProvider>
    </ThemeModeProvider>
  );
}
