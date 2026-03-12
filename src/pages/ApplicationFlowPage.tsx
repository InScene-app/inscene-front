import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { getAnnouncementById } from '../api/announcementService';
import { getUserById } from '../api/userService';
import { Announcement } from '../types/announcement';
import { User } from '../types/user';
import { parseJwt } from '../utils/jwt';
import ApplicationFlow from '../components/application/ApplicationFlow';

export default function ApplicationFlowPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
      return;
    }

    const payload = parseJwt(token);
    const userId = payload?.sub as number | undefined;
    if (!userId || !id) {
      navigate('/login');
      return;
    }

    const load = async () => {
      try {
        const [ann, user] = await Promise.all([
          getAnnouncementById(parseInt(id)),
          getUserById(userId),
        ]);
        setAnnouncement(ann);
        setCurrentUser(user);
      } catch {
        navigate(`/announcement/${id}`);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id, navigate]);

  if (loading) {
    return (
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100dvh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress sx={{ color: 'primary.main' }} />
      </Box>
    );
  }

  if (!announcement || !currentUser) return null;

  return (
    <ApplicationFlow
      announcement={announcement}
      currentUser={currentUser}
      onBack={() => navigate(`/announcement/${id}`)}
    />
  );
}
