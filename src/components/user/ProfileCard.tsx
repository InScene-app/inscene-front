import { useNavigate } from 'react-router-dom';
import { Box, Typography, Avatar, Chip, IconButton } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';

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
                bgcolor: '#F2F6FC',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': { transform: 'translateY(-1px)', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' },
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
                                    backgroundColor: '#E3ECF7',
                                    color: '#333',
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
                        color: isSaved ? 'primary.main' : 'text.secondary',
                        flexShrink: 0,
                        '&:hover': { backgroundColor: 'transparent', color: 'primary.main' },
                    }}
                >
                    {isSaved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                </IconButton>
            )}
        </Box>
    );
}
