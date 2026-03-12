import { useNavigate } from 'react-router-dom';
import { Box, Typography, Avatar, Chip, IconButton, useTheme } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';

// CSS filter pour convertir le SVG noir en #EB6640 (primary.main orange, light mode)
const ORANGE_FILTER = 'brightness(0) saturate(100%) invert(49%) sepia(79%) saturate(602%) hue-rotate(330deg) brightness(108%)';

interface ProfileCardProps {
    user: {
        id: number;
        firstName?: string;
        lastName?: string;
        enterpriseName?: string;
        email?: string;
        avatarUrl?: string;
        location?: string[];
        description?: string;
        jobs?: { id: number; code: string; name: string }[];
        type?: string;
    };
    isSaved?: boolean;
    onToggleSave?: (userId: number) => void;
}

export default function ProfileCard({ user, isSaved = false, onToggleSave }: ProfileCardProps) {
    const navigate = useNavigate();
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const saveIconFilter = isSaved ? (isDark ? 'invert(1)' : ORANGE_FILTER) : (isDark ? 'invert(1)' : undefined);

    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    const displayName = firstName && lastName
        ? `${firstName.charAt(0).toUpperCase() + firstName.slice(1)} ${lastName.charAt(0).toUpperCase() + lastName.slice(1)}`
        : user.enterpriseName || user.email?.split('@')[0] || 'Utilisateur';

    const locationText = user.location && user.location.length > 0
        ? user.location.join(', ')
        : null;

    const jobs = (user.jobs || []).slice(0, 3);

    const handleClick = () => {
        window.scrollTo(0, 0);
        navigate(`/profile/${user.id}`);
    };

    return (
        <Box
            onClick={handleClick}
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: 2,
                borderRadius: '20px',
                bgcolor: 'background.default',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': { transform: 'translateY(-2px)' },
            }}
        >
            <Avatar
                src={user.avatarUrl || undefined}
                alt={displayName}
                sx={{ width: 56, height: 56, flexShrink: 0 }}
            />

            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontSize: '16px', fontWeight: 700, mb: 0.25 }}>
                    {displayName}
                </Typography>

                {locationText && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3, mb: 0.5 }}>
                        <LocationOnIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                        <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>
                            {locationText}
                        </Typography>
                    </Box>
                )}

                {jobs.length > 0 && (
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {jobs.map((job) => (
                            <Chip
                                key={job.id}
                                label={job.name}
                                size="small"
                                sx={{
                                    fontSize: '11px',
                                    height: 22,
                                    backgroundColor: 'background.hover',
                                    color: 'text.primary',
                                }}
                            />
                        ))}
                    </Box>
                )}
            </Box>

            {onToggleSave && (
                <IconButton
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleSave(user.id);
                    }}
                    sx={{
                        flexShrink: 0,
                        '&:hover': { backgroundColor: 'transparent' },
                    }}
                >
                    <img
                        src={isSaved ? '/icons/Sauvergardes.svg' : '/icons/Sauvergardes_empty.svg'}
                        alt={isSaved ? 'Sauvegardé' : 'Sauvegarder'}
                        style={{ width: 18, height: 18, filter: saveIconFilter }}
                    />
                </IconButton>
            )}
        </Box>
    );
}
