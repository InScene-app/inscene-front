import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Box, Avatar, CircularProgress, Stack } from '@mui/material';
import DetailLayout from '../components/layout/DetailLayout';
import { getUserById } from '../api/userService';
import { User } from '../types/user';
import { formatRelativeDate } from '../utils/dateFormat';

export default function UserProfile() {
    const { id } = useParams<{ id: string }>();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            if (!id) return;

            try {
                setLoading(true);
                const data = await getUserById(parseInt(id));
                setUser(data);
                setError(null);
            } catch (err) {
                console.error('Erreur lors du chargement du profil:', err);
                setError('Impossible de charger le profil');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [id]);

    if (loading) {
        return (
            <DetailLayout>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                    <CircularProgress />
                </Box>
            </DetailLayout>
        );
    }

    if (error || !user) {
        return (
            <DetailLayout>
                <Box sx={{ p: 3 }}>
                    <Typography variant="h5">{error || 'Profil non trouvé'}</Typography>
                </Box>
            </DetailLayout>
        );
    }

    const displayDate = formatRelativeDate(user.createdAt);

    return (
        <DetailLayout>
            <Box sx={{ p: 2.5 }}>
                {/* Avatar et nom */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                    <Avatar
                        src={user.avatarUrl || undefined}
                        alt={user.name}
                        sx={{
                            width: 120,
                            height: 120,
                            objectFit: 'cover',
                            mb: 2,
                        }}
                    />
                    <Typography sx={{ fontSize: '24px', fontWeight: 700, mb: 1 }}>
                        {user.name || 'Utilisateur'}
                    </Typography>
                    <Typography sx={{ fontSize: '14px', color: 'text.secondary' }}>
                        {user.email}
                    </Typography>
                </Box>

                {/* Date d'inscription */}
                <Stack
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    sx={{ mb: 3 }}
                >
                    <Typography sx={{ fontSize: '14px', fontWeight: 500, color: 'text.secondary' }}>
                        Membre depuis {displayDate}
                    </Typography>
                </Stack>

                {/* Description */}
                {user.description && (
                    <Box sx={{ mb: 3 }}>
                        <Typography sx={{ fontSize: '18px', fontWeight: 600, mb: 1.5 }}>
                            À propos
                        </Typography>
                        <Typography sx={{ fontSize: '15px', lineHeight: 1.6, color: 'text.secondary' }}>
                            {user.description}
                        </Typography>
                    </Box>
                )}
            </Box>
        </DetailLayout>
    );
}
