import { useRef } from 'react';
import { Box, Avatar, Typography, Stack, TextField } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

interface ProfileHeaderProps {
    displayName: string;
    username: string;
    avatarUrl?: string;
    locationText: string | null;
    isEditing: boolean;
    editFirstName: string;
    editLastName: string;
    editLocation: string;
    onEditFirstName: (v: string) => void;
    onEditLastName: (v: string) => void;
    onEditLocation: (v: string) => void;
    onAvatarUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ProfileHeader({
    displayName, username, avatarUrl, locationText,
    isEditing, editFirstName, editLastName, editLocation,
    onEditFirstName, onEditLastName, onEditLocation, onAvatarUpload,
}: ProfileHeaderProps) {
    const avatarInputRef = useRef<HTMLInputElement>(null);

    return (
        <>
            {/* Avatar */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <Box sx={{ position: 'relative', width: 120, height: 120 }}>
                    <Avatar
                        src={avatarUrl || undefined}
                        alt={displayName}
                        sx={{ width: 120, height: 120, objectFit: 'cover' }}
                    />
                    {isEditing && (
                        <>
                            <input ref={avatarInputRef} type="file" accept="image/*" hidden onChange={onAvatarUpload} />
                            <Box
                                onClick={() => avatarInputRef.current?.click()}
                                sx={{
                                    position: 'absolute', inset: 0, borderRadius: '50%',
                                    bgcolor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: 'pointer', transition: 'background-color 0.2s',
                                    '&:hover': { bgcolor: 'rgba(0,0,0,0.55)' },
                                }}
                            >
                                <CameraAltIcon sx={{ color: '#fff', fontSize: 32 }} />
                            </Box>
                        </>
                    )}
                </Box>
            </Box>

            {/* Nom / Prénom */}
            {isEditing ? (
                <Stack direction="row" spacing={1} sx={{ justifyContent: 'center', mb: 0.5, px: 2 }}>
                    <TextField
                        size="small" placeholder="Prénom" value={editFirstName}
                        onChange={(e) => onEditFirstName(e.target.value)}
                        sx={{
                            maxWidth: 160,
                            '& .MuiOutlinedInput-root': { borderRadius: '14px' },
                            '& .MuiInputBase-input': { textAlign: 'center', fontWeight: 700, fontSize: '18px' },
                        }}
                    />
                    <TextField
                        size="small" placeholder="Nom" value={editLastName}
                        onChange={(e) => onEditLastName(e.target.value)}
                        sx={{
                            maxWidth: 160,
                            '& .MuiOutlinedInput-root': { borderRadius: '14px' },
                            '& .MuiInputBase-input': { textAlign: 'center', fontWeight: 700, fontSize: '18px' },
                        }}
                    />
                </Stack>
            ) : (
                <Typography sx={{ fontSize: '24px', fontWeight: 700, textAlign: 'center', mb: 0.5 }}>
                    {displayName}
                </Typography>
            )}

            {/* Username */}
            <Typography sx={{ fontSize: '16px', fontWeight: 400, color: 'text.secondary', textAlign: 'center', mb: 2 }}>
                {username}
            </Typography>

            {/* Location */}
            {isEditing ? (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 3, px: 2 }}>
                    <LocationOnIcon sx={{ fontSize: '20px', color: 'text.secondary' }} />
                    <TextField
                        size="small" placeholder="Localisation" value={editLocation}
                        onChange={(e) => onEditLocation(e.target.value)}
                        sx={{ flex: 1, maxWidth: 300, '& .MuiOutlinedInput-root': { borderRadius: '20px' } }}
                    />
                </Box>
            ) : locationText ? (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 3 }}>
                    <LocationOnIcon sx={{ fontSize: '20px', color: 'text.secondary' }} />
                    <Typography sx={{ fontSize: '15px', color: 'text.secondary' }}>{locationText}</Typography>
                </Box>
            ) : null}
        </>
    );
}
