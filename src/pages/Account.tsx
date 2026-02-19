import { Box, Typography, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { usePageLayout } from '../hooks/usePageLayout';
import ProfileSetup from '../components/profile/ProfileSetup';
import UserProfile from './UserProfile';
import PrimaryButton from '../components/common/PrimaryButton';
import { parseJwt } from '../utils/jwt';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function Account() {
  usePageLayout();
  const navigate = useNavigate();

  const token = localStorage.getItem('access_token');
  const payload = token ? parseJwt(token) : null;
  const userId = payload?.sub as number | undefined;
  const profileCompleted = localStorage.getItem('profileCompleted') === 'true';

  // Pas connecté → écran connexion / inscription
  if (!userId) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '70vh',
          px: 3,
          textAlign: 'center',
        }}
      >
        <AccountCircleIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
        <Typography sx={{ fontSize: '22px', fontWeight: 700, mb: 1 }}>
          Rejoins InScene
        </Typography>
        <Typography sx={{ fontSize: '15px', color: 'text.secondary', mb: 4, maxWidth: 320 }}>
          Connecte-toi pour accéder à ton profil, tes messages et bien plus encore.
        </Typography>
        <Stack spacing={1.5} sx={{ width: '100%', maxWidth: 300 }}>
          <PrimaryButton
            fullWidth
            onClick={() => navigate('/login')}
            sx={{ borderRadius: '50px', padding: '12px' }}
          >
            Se connecter
          </PrimaryButton>
          <PrimaryButton
            fullWidth
            onClick={() => navigate('/profile-setup')}
            sx={{
              borderRadius: '50px',
              padding: '12px',
              backgroundColor: 'transparent',
              color: 'primary.main',
              border: '2px solid',
              borderColor: 'primary.main',
              '&:hover': {
                backgroundColor: 'primary.light',
              },
            }}
          >
            Créer un compte
          </PrimaryButton>
        </Stack>
      </Box>
    );
  }

  // Connecté + profil complété → afficher son profil
  if (profileCompleted) {
    return <UserProfile />;
  }

  // Connecté mais profil pas complété → ProfileSetup
  return (
    <Box>
      <ProfileSetup />
    </Box>
  );
}
