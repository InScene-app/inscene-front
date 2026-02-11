import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Box, Avatar, CircularProgress, Stack, Button, Divider, Chip, Tabs, Tab } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DetailLayout from '../components/layout/DetailLayout';
import PrimaryButton from '../components/common/PrimaryButton';
import SocialIcon from '../components/user/SocialIcon';
import { getUserById } from '../api/userService';
import { User } from '../types/user';
import { parseJwt } from '../utils/jwt';

interface UserProfileProps {
    userId?: number;
}

export default function UserProfile({ userId: propUserId }: UserProfileProps = {}) {
    const { id } = useParams<{ id: string }>();

    // Priorité : prop > URL param > JWT token
    const resolvedId = propUserId ?? (id ? parseInt(id) : null);
    const tokenId = (() => {
        if (resolvedId) return resolvedId;
        const token = localStorage.getItem('access_token');
        const payload = token ? parseJwt(token) : null;
        return payload?.sub as number | undefined;
    })();
    const finalId = resolvedId ?? tokenId;

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        const fetchUser = async () => {
            if (!finalId) return;

            try {
                setLoading(true);
                const data = await getUserById(finalId);
                console.log('User data:', data);
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
    }, [finalId]);

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

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

    // Déterminer le nom d'affichage (capitalize)
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    const displayName = firstName && lastName
        ? `${firstName.charAt(0).toUpperCase() + firstName.slice(1)} ${lastName.charAt(0).toUpperCase() + lastName.slice(1)}`
        : user.enterpriseName || user.email?.split('@')[0] || 'Utilisateur';

    // Générer le nom d'utilisateur
    const username = firstName && lastName
        ? `@${firstName.toLowerCase()}_${lastName.toLowerCase()}`
        : `@${user.email?.split('@')[0] || 'user'}`;

    // Localisation
    const locationText = user.location && user.location.length > 0
        ? user.location.join(', ')
        : null;

    // Activities (convertir string en array si nécessaire)
    const activitiesArray = user.activities
        ? typeof user.activities === 'string'
            ? user.activities.split(',').map(a => a.trim())
            : []
        : [];

    return (
        <DetailLayout>
            <Box>
                {/* Avatar */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    <Avatar
                        src={user.avatarUrl || undefined}
                        alt={displayName}
                        sx={{
                            width: 120,
                            height: 120,
                            objectFit: 'cover',
                        }}
                    />
                </Box>

                {/* Nom Prénom en capitalize */}
                <Typography sx={{ fontSize: '24px', fontWeight: 700, textAlign: 'center', mb: 0.5 }}>
                    {displayName}
                </Typography>

                {/* Nom d'utilisateur */}
                <Typography sx={{ fontSize: '16px', fontWeight: 400, color: 'text.secondary', textAlign: 'center', mb: 2 }}>
                    {username}
                </Typography>

                {/* Icône Location + Ville */}
                {locationText && (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 3 }}>
                        <LocationOnIcon sx={{ fontSize: '20px', color: 'text.secondary' }} />
                        <Typography sx={{ fontSize: '15px', color: 'text.secondary' }}>
                            {locationText}
                        </Typography>
                    </Box>
                )}

                {/* 3 Boutons d'action */}
                <Stack direction="row" spacing={1.5} sx={{ mb: 3 }}>
                    <PrimaryButton fullWidth sx={{ padding: '8px 13px', borderRadius: '50px' }}>
                        Suivre
                    </PrimaryButton>
                    <Button
                        fullWidth
                        variant="outlined"
                        sx={{
                            textTransform: 'none',
                            borderRadius: '50px',
                            borderColor: 'primary.main',
                            color: 'primary.main',
                            fontWeight: 500,
                            padding: '8px 13px',
                            '&:hover': {
                                borderColor: 'primary.dark',
                                backgroundColor: 'primary.light',
                            },
                        }}
                    >
                        Contacter
                    </Button>
                    {user.websiteUrl && (
                        <Button
                            fullWidth
                            variant="outlined"
                            component="a"
                            href={user.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                                textTransform: 'none',
                                borderRadius: '50px',
                                borderColor: 'primary.main',
                                color: 'primary.main',
                                fontWeight: 500,
                                padding: '8px 13px',
                                '&:hover': {
                                    borderColor: 'primary.dark',
                                    backgroundColor: 'primary.light',
                                },
                            }}
                        >
                            Portfolio
                        </Button>
                    )}
                </Stack>

                {/* Conteneur Social Links */}
                {user.socialNetworks && user.socialNetworks.length > 0 && (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: 1,
                            mb: 3,
                            flexWrap: 'wrap',
                        }}
                    >
                        {user.socialNetworks.map((social) => (
                            <SocialIcon key={social.id} socialNetwork={social} />
                        ))}
                    </Box>
                )}

                {/* Divider horizontal */}
                <Divider />

                {/* Section Activités */}
                <Box sx={{ pt: 6, pb: 6 }}>
                    {/* Titre "Activités" */}
                    <Typography sx={{ fontSize: '20px', fontWeight: 600, mb: 2, textAlign: 'center' }}>
                        Activités
                    </Typography>

                    {/* Tags d'activités */}
                    {activitiesArray.length > 0 && (
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
                            {activitiesArray.map((activity, index) => (
                                <Chip
                                    key={index}
                                    label={activity}
                                    size="small"
                                    sx={{
                                        fontSize: '15px',
                                        fontWeight: 500,
                                        backgroundColor: '#F2F6FC',
                                        color: '#000000',
                                        border: 'none',
                                    }}
                                />
                            ))}
                        </Box>
                    )}
                </Box>

                {/* Onglets horizontaux */}
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                    <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        variant="fullWidth"
                        aria-label="onglets de contenu"
                        sx={{
                            '& .MuiTab-root': {
                                textTransform: 'none',
                                fontSize: '16px',
                                fontWeight: 500,
                                flex: 1,
                            },
                        }}
                    >
                        <Tab label="Photos" />
                        <Tab label="Vidéos" />
                        <Tab label="Fichiers" />
                    </Tabs>
                </Box>

                {/* Contenu des onglets */}
                <Box sx={{ py: 3 }}>
                    {activeTab === 0 && (
                        <Typography sx={{ textAlign: 'center', color: 'text.secondary' }}>
                            Aucun contenu pour l'instant
                        </Typography>
                    )}
                    {activeTab === 1 && (
                        <Typography sx={{ textAlign: 'center', color: 'text.secondary' }}>
                            Aucun contenu pour l'instant
                        </Typography>
                    )}
                    {activeTab === 2 && (
                        <Typography sx={{ textAlign: 'center', color: 'text.secondary' }}>
                            Aucun contenu pour l'instant
                        </Typography>
                    )}
                </Box>

                {/* Section Présentation */}
                {user.description && (
                    <Box sx={{ pt: 6, pb: 6 }}>
                        {/* Titre "Présentation" */}
                        <Typography sx={{ fontSize: '20px', fontWeight: 600, mb: 2, textAlign: 'center' }}>
                            Présentation
                        </Typography>

                        {/* Texte description */}
                        <Typography sx={{ fontSize: '15px', fontWeight: 400, color: '#000000', textAlign: 'left' }}>
                            {user.description}
                        </Typography>
                    </Box>
                )}

                {/* DEBUG INFO - Afficher toutes les données brutes */}
                <Box sx={{ mt: 4, p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                    <Typography sx={{ fontSize: '14px', fontWeight: 600, mb: 1 }}>
                        Debug - Toutes les données reçues:
                    </Typography>
                    <pre style={{ fontSize: '12px', overflow: 'auto', maxHeight: '300px' }}>
                        {JSON.stringify(user, null, 2)}
                    </pre>
                </Box>
            </Box>
        </DetailLayout>
    );
}
