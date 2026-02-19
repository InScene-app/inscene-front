import { useState, useEffect } from 'react';
import { Typography, Box, Stack, CircularProgress, Button } from '@mui/material';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { usePageLayout } from '../hooks/usePageLayout';
import AnnouncementCard from '../components/announcement/AnnouncementCard';
import ProfileCard from '../components/user/ProfileCard';
import { getFavoriteAnnouncements, getFavoriteUsers } from '../api/favoriteService';
import { transformAnnouncementResponse } from '../api/announcementService';
import { Announcement } from '../types/announcement';
import { useFavorites } from '../hooks/useFavorites';

const PREVIEW_COUNT = 3;

export default function Saved() {
    usePageLayout();
    const { isSaved, toggleSave, isUserSaved, toggleSaveUser } = useFavorites();
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [savedUsers, setSavedUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAllAnnouncements, setShowAllAnnouncements] = useState(false);
    const [showAllUsers, setShowAllUsers] = useState(false);

    const isLoggedIn = !!localStorage.getItem('access_token');

    useEffect(() => {
        if (!isLoggedIn) {
            setLoading(false);
            return;
        }

        Promise.all([
            getFavoriteAnnouncements().catch(() => []),
            getFavoriteUsers().catch(() => []),
        ]).then(([annData, userData]) => {
            setAnnouncements(annData.map(transformAnnouncementResponse));
            setSavedUsers(userData);
        }).finally(() => setLoading(false));
    }, [isLoggedIn]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!isLoggedIn) {
        return (
            <Box sx={{ mt: 4 }}>
                <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
                    Sauvegardés
                </Typography>
                <Typography color="text.secondary">
                    Connecte-toi pour sauvegarder des annonces et des profils
                </Typography>
            </Box>
        );
    }

    const hasNothing = announcements.length === 0 && savedUsers.length === 0;

    const visibleAnnouncements = showAllAnnouncements ? announcements : announcements.slice(0, PREVIEW_COUNT);
    const visibleUsers = showAllUsers ? savedUsers : savedUsers.slice(0, PREVIEW_COUNT);

    return (
        <Box>
            <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 700 }}>
                Sauvegardés
            </Typography>

            {hasNothing ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8, gap: 2 }}>
                    <BookmarkIcon sx={{ fontSize: 64, color: 'text.disabled' }} />
                    <Typography color="text.secondary" sx={{ textAlign: 'center' }}>
                        Aucun élément sauvegardé
                    </Typography>
                    <Typography color="text.secondary" sx={{ fontSize: '14px', textAlign: 'center' }}>
                        Appuie sur l'icône signet pour sauvegarder une annonce ou un profil
                    </Typography>
                </Box>
            ) : (
                <Stack spacing={4}>
                    {/* Section Annonces */}
                    {announcements.length > 0 && (
                        <Box>
                            <Typography sx={{ fontSize: '20px', fontWeight: 600, mb: 2 }}>
                                Annonces
                            </Typography>
                            <Stack spacing="35px">
                                {visibleAnnouncements.map((announcement) => (
                                    <AnnouncementCard
                                        key={announcement.id}
                                        announcement={announcement}
                                        isSaved={isSaved(announcement.id)}
                                        onToggleSave={toggleSave}
                                    />
                                ))}
                            </Stack>
                            {announcements.length > PREVIEW_COUNT && !showAllAnnouncements && (
                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                    <Button
                                        onClick={() => setShowAllAnnouncements(true)}
                                        sx={{
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            borderRadius: '50px',
                                            px: 3,
                                        }}
                                    >
                                        Voir tout ({announcements.length})
                                    </Button>
                                </Box>
                            )}
                        </Box>
                    )}

                    {/* Section Profils */}
                    {savedUsers.length > 0 && (
                        <Box>
                            <Typography sx={{ fontSize: '20px', fontWeight: 600, mb: 2 }}>
                                Profils
                            </Typography>
                            <Stack spacing={1.5}>
                                {visibleUsers.map((user) => (
                                    <ProfileCard
                                        key={user.id}
                                        user={user}
                                        isSaved={isUserSaved(user.id)}
                                        onToggleSave={toggleSaveUser}
                                    />
                                ))}
                            </Stack>
                            {savedUsers.length > PREVIEW_COUNT && !showAllUsers && (
                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                    <Button
                                        onClick={() => setShowAllUsers(true)}
                                        sx={{
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            borderRadius: '50px',
                                            px: 3,
                                        }}
                                    >
                                        Voir tout ({savedUsers.length})
                                    </Button>
                                </Box>
                            )}
                        </Box>
                    )}
                </Stack>
            )}
        </Box>
    );
}
