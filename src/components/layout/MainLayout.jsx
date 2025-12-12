import { Outlet } from 'react-router-dom';
import { Box, Container, useMediaQuery, useTheme } from '@mui/material';
import Navigation from './Navigation';
import { useLayout } from '../../contexts/LayoutContext';

export default function MainLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { containerMaxWidth, disableGutters } = useLayout();

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Navigation />

      <Box
        component="main"
        sx={{
          // Mobile: padding bottom pour la bottom nav + un peu d'espace
          // Desktop: padding top pour la top nav
          pt: isMobile ? 2 : 10,
          pb: isMobile ? 10 : 2,
          minHeight: '100vh',
        }}
      >
        <Container
          maxWidth={containerMaxWidth}
          disableGutters={disableGutters}
          sx={{
            px: isMobile ? 2 : 3,
          }}
        >
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
}
