import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, IconButton, useMediaQuery, useTheme } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShareIcon from '@mui/icons-material/Share';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';

interface DetailLayoutProps {
  children: ReactNode;
  isSaved?: boolean;
  onToggleSave?: () => void;
  onShare?: () => void;
}

export default function DetailLayout({ children, isSaved = false, onToggleSave, onShare }: DetailLayoutProps) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleBack = () => {
    navigate(-1); // Retour à la page précédente
  };

  const handleShare = () => {
    if (onShare) {
      onShare();
    } else {
      // Partage par défaut avec l'API Web Share si disponible
      if (navigator.share) {
        navigator.share({
          title: document.title,
          url: window.location.href,
        }).catch(() => {
          // Utilisateur a annulé ou erreur
        });
      }
    }
  };

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      {/* Header fixe */}
      <Box
        sx={{
          position: 'fixed',
          top: isMobile ? 0 : '64px', // Desktop: en dessous de la navbar
          left: 0,
          right: 0,
          height: '60px',
          backgroundColor: 'background.default',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: isMobile ? 2 : 3,
          zIndex: 1000,
          borderBottom: '1px solid',
          borderColor: 'background.middle',
        }}
      >
        {/* Bouton retour */}
        <IconButton
          onClick={handleBack}
          sx={{
            color: 'text.primary',
          }}
        >
          <ArrowBackIcon sx={{ fontSize: '24px' }} />
        </IconButton>

        {/* Boutons droite */}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <IconButton
            onClick={handleShare}
            sx={{
              color: 'text.secondary',
              '&:hover': {
                backgroundColor: 'transparent',
                color: 'primary.main',
              },
            }}
          >
            <ShareIcon sx={{ fontSize: '24px' }} />
          </IconButton>

          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave?.();
            }}
            sx={{
              color: isSaved ? 'primary.main' : 'text.secondary',
              backgroundColor: 'transparent',
              '&:hover': {
                backgroundColor: 'transparent',
                color: 'primary.main',
              },
            }}
          >
            {isSaved ? <BookmarkIcon sx={{ fontSize: '24px' }} /> : <BookmarkBorderIcon sx={{ fontSize: '24px' }} />}
          </IconButton>
        </Box>
      </Box>

      {/* Contenu scrollable */}
      <Box
        sx={{
          pt: isMobile ? '60px' : '124px', // Mobile: 60px, Desktop: 64px navbar + 60px header
          pb: isMobile ? '80px' : 3, // Padding bottom pour la navbar mobile
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
