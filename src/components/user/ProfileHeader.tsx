import { useRef, useState, useEffect } from 'react';
import { Box, Avatar, Typography, Stack, TextField, InputAdornment } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import SearchIcon from '@mui/icons-material/Search';

interface City { nom: string; code: string; codesPostaux?: string[]; }

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
    isDesktop?: boolean;
    children?: React.ReactNode;
}

export default function ProfileHeader({
    displayName, username, avatarUrl, locationText,
    isEditing, editFirstName, editLastName, editLocation,
    onEditFirstName, onEditLastName, onEditLocation, onAvatarUpload,
    isDesktop, children,
}: ProfileHeaderProps) {
    const avatarInputRef = useRef<HTMLInputElement>(null);
    const cityDebounce = useRef<ReturnType<typeof setTimeout>>(undefined);
    const [citySuggestions, setCitySuggestions] = useState<City[]>([]);
    const [citySelected, setCitySelected] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        if (!editLocation || editLocation.length < 2 || citySelected || !isFocused) {
            setCitySuggestions([]);
            return;
        }
        clearTimeout(cityDebounce.current);
        cityDebounce.current = setTimeout(() => {
            fetch(`https://geo.api.gouv.fr/communes?nom=${encodeURIComponent(editLocation)}&fields=nom,code,codesPostaux&limit=5`)
                .then(r => r.json())
                .then((cities: City[]) => setCitySuggestions(cities))
                .catch(() => setCitySuggestions([]));
        }, 300);
    }, [editLocation, citySelected]);

    const avatarBox = (size: number) => (
        <Box sx={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
            <Avatar
                src={avatarUrl || undefined}
                alt={displayName}
                sx={{ width: size, height: size, objectFit: 'cover' }}
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
                        <CameraAltIcon sx={{ color: '#fff', fontSize: size * 0.27 }} />
                    </Box>
                </>
            )}
        </Box>
    );

    const locationField = (
        isEditing ? (
            <Box sx={{ position: 'relative', mb: isDesktop ? 0 : 3 }}>
                <TextField
                    size="small" placeholder="Rechercher une ville..." value={editLocation}
                    onChange={(e) => { onEditLocation(e.target.value); setCitySelected(false); }}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LocationOnIcon sx={{ fontSize: '18px', color: 'text.secondary' }} />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <SearchIcon sx={{ fontSize: '18px', color: 'text.secondary' }} />
                                </InputAdornment>
                            ),
                        },
                    }}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setTimeout(() => setIsFocused(false), 150)}
                    sx={{ width: '100%', '& .MuiOutlinedInput-root': { borderRadius: '20px' } }}
                />
                {citySuggestions.length > 0 && !citySelected && isFocused && (
                    <Box sx={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: 'background.paper', borderRadius: '16px', mt: '4px', overflow: 'hidden', zIndex: 100, border: '1px solid', borderColor: 'background.border', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
                        {citySuggestions.map((city) => (
                            <Box key={city.code} onClick={() => { onEditLocation(city.nom); setCitySelected(true); setCitySuggestions([]); }}
                                sx={{ px: 2, py: '10px', cursor: 'pointer', '&:hover': { backgroundColor: 'background.hover' } }}>
                                <Typography sx={{ fontSize: '14px', color: 'text.primary' }}>
                                    {city.nom}{city.codesPostaux?.[0] && ` (${city.codesPostaux[0]})`}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                )}
            </Box>
        ) : locationText ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: isDesktop ? 0 : 3, justifyContent: 'center' }}>
                <LocationOnIcon sx={{ fontSize: '18px', color: 'text.secondary' }} />
                <Typography sx={{ fontSize: '14px', color: 'text.secondary' }}>{locationText}</Typography>
            </Box>
        ) : null
    );

    if (isDesktop) {
        return (
            <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', mb: 2 }}>
                {avatarBox(200)}
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {/* Nom / Prénom */}
                    {isEditing ? (
                        <Stack direction="row" spacing={1} sx={{ mb: 0.5 }}>
                            <TextField
                                size="small" placeholder="Prénom" value={editFirstName}
                                onChange={(e) => onEditFirstName(e.target.value)}
                                sx={{
                                    maxWidth: 160,
                                    '& .MuiOutlinedInput-root': { borderRadius: '14px' },
                                    '& .MuiInputBase-input': { fontWeight: 700, fontSize: '18px', textAlign: 'center' },
                                }}
                            />
                            <TextField
                                size="small" placeholder="Nom" value={editLastName}
                                onChange={(e) => onEditLastName(e.target.value)}
                                sx={{
                                    maxWidth: 160,
                                    '& .MuiOutlinedInput-root': { borderRadius: '14px' },
                                    '& .MuiInputBase-input': { fontWeight: 700, fontSize: '18px', textAlign: 'center' },
                                }}
                            />
                        </Stack>
                    ) : (
                        <Typography sx={{ fontSize: '22px', fontWeight: 700, mb: 0.25, textAlign: 'center' }}>
                            {displayName}
                        </Typography>
                    )}
                    {/* Username */}
                    <Typography sx={{ fontSize: '15px', fontWeight: 400, color: 'text.secondary', mb: 1, textAlign: 'center' }}>
                        {username}
                    </Typography>
                    {/* Location */}
                    {locationField}
                    {/* Actions + Socials */}
                    {children}
                </Box>
            </Box>
        );
    }

    return (
        <>
            {/* Avatar */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                {avatarBox(120)}
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
            <Box sx={{ px: 2 }}>{locationField}</Box>
        </>
    );
}
