import { Box } from '@mui/material';
import { usePageLayout } from '../hooks/usePageLayout';
import ProfileSetup from '../components/profile/ProfileSetup';
import UserProfile from './UserProfile';
import { parseJwt } from '../utils/jwt';

export default function Account() {
  usePageLayout();

  const profileCompleted = localStorage.getItem('profileCompleted') === 'true';
  const token = localStorage.getItem('access_token');
  const payload = token ? parseJwt(token) : null;
  const userId = payload?.sub as number | undefined;

  // Profil complété et user connecté → afficher son profil
  if (profileCompleted && userId) {
    return <UserProfile />;
  }

  // Sinon → ProfileSetup (step 1 si jamais commencé)
  return (
    <Box>
      <ProfileSetup />
    </Box>
  );
}
