import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, IconButton, useMediaQuery, useTheme } from '@mui/material';

// CSS filter pour convertir un SVG noir en #EB6640 (primary.main orange, light mode)
const ORANGE_FILTER = 'brightness(0) saturate(100%) invert(49%) sepia(79%) saturate(602%) hue-rotate(330deg) brightness(108%)';
// CSS filter pour convertir un SVG noir en #225182 (secondary.main bleu, dark mode)
const BLUE_FILTER = 'brightness(0) saturate(100%) invert(27%) sepia(100%) saturate(350%) hue-rotate(173deg) brightness(106%)';
// CSS filter pour convertir un SVG noir en blanc (dark mode inactif)
const WHITE_FILTER = 'invert(1)';

interface DetailLayoutProps {
  children: ReactNode;
  isSaved?: boolean;
  onToggleSave?: () => void;
  onShare?: () => void;
  isOwner?: boolean;
  isEditing?: boolean;
  onToggleEdit?: () => void;
}

export default function DetailLayout({ children, isSaved = false, onToggleSave, onShare, isOwner = false, isEditing = false, onToggleEdit }: DetailLayoutProps) {
  const navigate = useNavigate();

  const handleSettings = () => {
    navigate('/settings');
  };
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isDark = theme.palette.mode === 'dark';
  const defaultFilter = isDark ? WHITE_FILTER : undefined;
  const activeFilter = isDark ? BLUE_FILTER : ORANGE_FILTER;

  const handleBack = () => {
    navigate(-1);
  };

  const handleShare = () => {
    if (onShare) {
      onShare();
    } else {
      if (navigator.share) {
        navigator.share({
          title: document.title,
          url: window.location.href,
        }).catch(() => {});
      }
    }
  };

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      {/* Header fixe */}
      <Box
        sx={{
          position: 'fixed',
          top: isMobile ? 0 : '64px',
          left: 0,
          right: 0,
          height: '60px',
          backgroundColor: 'background.paper',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: isMobile ? 2 : 3,
          zIndex: 1000,
          borderColor: 'background.tag',
        }}
      >
        {/* Bouton retour */}
        <IconButton onClick={handleBack} sx={{ '&:hover': { backgroundColor: 'transparent' } }}>
          <img src="/icons/back.svg" alt="Retour" style={{ width: 20, height: 20, filter: defaultFilter }} />
        </IconButton>

        {/* Boutons droite */}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {isOwner && (
            <IconButton
              onClick={(e) => { e.stopPropagation(); onToggleEdit?.(); }}
              sx={{ '&:hover': { backgroundColor: 'transparent' } }}
            >
              <img src="/icons/edit.svg" alt="Modifier" style={{ width: 22, height: 22, filter: isEditing ? activeFilter : defaultFilter }} />
            </IconButton>
          )}

          <IconButton onClick={handleShare} sx={{ '&:hover': { backgroundColor: 'transparent' } }}>
            <img src="/icons/share.svg" alt="Partager" style={{ width: 22, height: 22, filter: defaultFilter }} />
          </IconButton>

          {isOwner ? (
            <IconButton onClick={handleSettings} sx={{ '&:hover': { backgroundColor: 'transparent' } }}>
              <img src="/icons/settings.svg" alt="Paramètres" style={{ width: 22, height: 22, filter: defaultFilter }} />
            </IconButton>
          ) : (
            <IconButton
              onClick={(e) => { e.stopPropagation(); onToggleSave?.(); }}
              sx={{ '&:hover': { backgroundColor: 'transparent' } }}
            >
              <img
                src={isSaved ? '/icons/Sauvergardes.svg' : '/icons/Sauvergardes_empty.svg'}
                alt={isSaved ? 'Sauvegardé' : 'Sauvegarder'}
                style={{ width: 22, height: 22, filter: isSaved ? activeFilter : defaultFilter }}
              />
            </IconButton>
          )}
        </Box>
      </Box>

      {/* Contenu scrollable */}
      <Box
        sx={{
          pt: isMobile ? '60px' : '124px',
          pb: isMobile ? '80px' : 3,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
