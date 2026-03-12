import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  InputBase,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

// Filtre CSS : convertit du noir vers #EB6640 (primary.main orange, light mode)
const ORANGE_FILTER = 'brightness(0) saturate(100%) invert(49%) sepia(79%) saturate(602%) hue-rotate(330deg) brightness(108%)';
// Filtre CSS : convertit du noir vers #225182 (secondary.main bleu, dark mode)
const BLUE_FILTER = 'brightness(0) saturate(100%) invert(27%) sepia(100%) saturate(350%) hue-rotate(173deg) brightness(106%)';
const DARK_INACTIVE_FILTER = 'invert(1)'; // noir → blanc en dark mode

const HomeIcon = ({ active = false }: { active?: boolean }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  return (
    <Box
      component="img"
      src={active && !isDark ? '/logo/logo_color.svg' : '/logo/logo_black.svg'}
      alt="Home"
      sx={{
        width: 50,
        height: 50,
        filter: isDark ? (active ? BLUE_FILTER : DARK_INACTIVE_FILTER) : 'none',
      }}
    />
  );
};

const menuItems = [
  { label: 'Saved', iconSrc: '/icons/Sauvergardes.svg', path: '/saved' },
  { label: 'Notifications', iconSrc: '/icons/Notif.svg', path: '/notifications' },
  { label: 'Home', iconSrc: null, path: '/' },
  { label: 'Messages', iconSrc: '/icons/Message.svg', path: '/messages' },
  { label: 'Account', iconSrc: '/icons/Profil.svg', path: '/account' },
];

const desktopRightItems = [
  { label: 'Saved', icon: '/icons/Sauvergardes.svg', path: '/saved' },
  { label: 'Messages', icon: '/icons/Message.svg', path: '/messages' },
  { label: 'Notifications', icon: '/icons/Notif.svg', path: '/notifications' },
  { label: 'Account', icon: '/icons/Profil.svg', path: '/account' },
];

export default function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [searchParams] = useSearchParams();
  const [navSearch, setNavSearch] = useState(searchParams.get('q') || '');
  const navDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync input when URL params change (e.g. back button, or navigating away and back)
  useEffect(() => {
    setNavSearch(searchParams.get('q') || '');
  }, [searchParams]);

  const handleNavSearch = (value: string) => {
    setNavSearch(value);
    if (navDebounceRef.current) clearTimeout(navDebounceRef.current);
    navDebounceRef.current = setTimeout(() => {
      navigate(`/?q=${encodeURIComponent(value)}`, { replace: location.pathname === '/' });
    }, 400);
  };

  const submitNavSearch = () => {
    if (navDebounceRef.current) clearTimeout(navDebounceRef.current);
    navigate(`/?q=${encodeURIComponent(navSearch)}`, { replace: location.pathname === '/' });
  };

  const currentIndex = menuItems.findIndex((item) => item.path === location.pathname);

  if (isMobile) {
    // Mobile: Bottom Navigation - Style "pill" flottant
    return (
      <Box
        sx={{
          position: 'fixed',
          bottom: 12,
          left: 12,
          right: 12,
          borderRadius: '100px',
          backgroundColor: 'background.paper',
          border: '1px solid',
          borderColor: 'background.border',
          zIndex: 1000,
          py: '10px',
          px: '20px',
          boxShadow: '0px 3px 6px 0px #5352681A',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {menuItems.map((item, index) => {
          const isActive = currentIndex === index;
          const iconFilter = isActive
            ? (theme.palette.mode === 'dark' ? BLUE_FILTER : ORANGE_FILTER)
            : theme.palette.mode === 'dark' ? DARK_INACTIVE_FILTER : 'none';
          return (
            <IconButton
              key={item.label}
              onClick={() => navigate(item.path)}
              sx={{
                padding: item.label === 'Home' ? 0 : 1,
                transition: 'opacity 0.2s ease',
              }}
            >
              {item.label === 'Home' ? (
                <HomeIcon active={isActive} />
              ) : (
                <Box
                  component="img"
                  src={item.iconSrc!}
                  alt={item.label}
                  sx={{ width: 24, height: 24, filter: iconFilter, transition: 'filter 0.2s ease' }}
                />
              )}
            </IconButton>
          );
        })}
      </Box>
    );
  }

  // Desktop: Top Navigation
  const isHome = location.pathname === '/';
  const isDark = theme.palette.mode === 'dark';
  const logoSrc = isHome && !isDark ? '/logo/logo_color.svg' : '/logo/logo_black.svg';
  const logoFilter = isDark ? (isHome ? BLUE_FILTER : DARK_INACTIVE_FILTER) : 'none';

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor: 'background.paper',
        backgroundImage: 'none',
        borderBottom: isDark ? '1px solid' : 'none',
        borderColor: 'background.border',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: 3 }}>
        {/* Gauche : logo + barre de recherche */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            component="img"
            src={logoSrc}
            alt="InScène"
            onClick={() => navigate('/')}
            sx={{
              width: 50,
              height: 50,
              cursor: 'pointer',
              filter: logoFilter,
            }}
          />
          <Box
            sx={{
              width: 320,
              display: 'flex',
              alignItems: 'center',
              bgcolor: 'background.paper',
              borderRadius: '50px',
              px: 2,
              py: 0.75,
              boxShadow: '0px 2px 12px rgba(0,0,0,0.12)',
            }}
          >
            <SearchIcon sx={{ fontSize: 18, color: 'text.secondary', mr: 1, flexShrink: 0 }} />
            <InputBase
              placeholder="Rechercher..."
              value={navSearch}
              onChange={(e) => handleNavSearch(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') submitNavSearch(); }}
              sx={{ flex: 1, fontSize: '14px' }}
            />
          </Box>
        </Box>

        {/* Droite : icônes */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {desktopRightItems.map((item) => {
            const isActive = location.pathname === item.path;
            const iconFilter = isActive
              ? (theme.palette.mode === 'dark' ? BLUE_FILTER : ORANGE_FILTER)
              : theme.palette.mode === 'dark' ? DARK_INACTIVE_FILTER : 'none';
            return (
              <IconButton
                key={item.label}
                onClick={() => navigate(item.path)}
                sx={{
                  transition: 'opacity 0.2s ease',
                  '&:hover': { opacity: 0.75 },
                }}
              >
                <Box
                  component="img"
                  src={item.icon}
                  alt={item.label}
                  sx={{ width: 24, height: 24, filter: iconFilter, transition: 'filter 0.2s ease' }}
                />
              </IconButton>
            );
          })}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
