import { Box } from '@mui/material';
import ProfileSetup from '../components/profile/ProfileSetup';

export default function ProfileSetupPage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#F2F6FC',
      }}
    >
      <ProfileSetup />
    </Box>
  );
}
