import { useNavigate, useLocation } from 'react-router-dom';
import {
  BottomNavigation,
  BottomNavigationAction,
  AppBar,
  Toolbar,
  Box,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MessageIcon from '@mui/icons-material/Message';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const HomeIcon = () => (
  <Box
    component="img"
    src="/logo/logo_black.svg"
    alt="Home"
    sx={{
      width: 50,
      height: 50,
    }}
  />
);

const menuItems = [
  { label: 'Saved', icon: <BookmarkIcon />, path: '/saved' },
  { label: 'Notifications', icon: <NotificationsIcon />, path: '/notifications' },
  { label: 'Home', icon: <HomeIcon />, path: '/' },
  { label: 'Messages', icon: <MessageIcon />, path: '/messages' },
  { label: 'Account', icon: <AccountCircleIcon />, path: '/account' },
];

export default function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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
          backgroundColor: 'background.dark',
          zIndex: 1000,
          py: '10px',
          px: '20px',
          // boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.15)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {menuItems.map((item, index) => (
          <IconButton
            key={item.label}
            onClick={() => navigate(item.path)}
            sx={{
              color: currentIndex === index ? 'primary.dark' : 'background.black',
              transition: 'color 0.2s ease',
              padding: item.label === 'Home' ? 0 : 1,
              '& .MuiSvgIcon-root': {
                fontSize: '24px',
              },
            }}
          >
            {item.icon}
          </IconButton>
        ))}
      </Box>
    );
  }

  // Desktop: Top Navigation - Navbar classique
  return (
    <AppBar
      position="fixed"
      elevation={1}
      sx={{
        backgroundColor: 'background.dark',
      }}
    >
      <Toolbar
        sx={{
          justifyContent: 'center',
          gap: 2,
        }}
      >
        {menuItems.map((item) => (
          <Box
            key={item.label}
            sx={{
              position: 'relative',
            }}
          >
            <IconButton
              onClick={() => navigate(item.path)}
              sx={{
                color: location.pathname === item.path ? 'primary.dark' : 'background.black',
                transition: 'all 0.2s ease',
                '&:hover': {
                  color: 'primary.dark',
                  '& + .nav-label': {
                    opacity: 1,
                    visibility: 'visible',
                  },
                },
              }}
            >
              {item.icon}
            </IconButton>
            <Box
              className="nav-label"
              sx={{
                position: 'absolute',
                top: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                mt: 0.5,
                fontSize: '0.75rem',
                fontWeight: 500,
                color: 'text.primary',
                backgroundColor: 'background.white',
                px: 1.5,
                py: 0.5,
                borderRadius: '8px',
                whiteSpace: 'nowrap',
                opacity: 0,
                visibility: 'hidden',
                transition: 'all 0.2s ease',
                boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
                pointerEvents: 'none',
              }}
            >
              {item.label}
            </Box>
          </Box>
        ))}
      </Toolbar>
    </AppBar>
  );
}
