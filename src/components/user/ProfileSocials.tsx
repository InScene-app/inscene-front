import { useState } from 'react';
import { Box, Chip, Stack, Select, MenuItem, TextField, IconButton, SelectChangeEvent } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';
import SocialIcon from './SocialIcon';
import { SocialNetwork } from '../../types/user';

const SOCIAL_NETWORKS = [
    { name: 'TWITTER' as const, label: 'Twitter', icon: TwitterIcon },
    { name: 'INSTAGRAM' as const, label: 'Instagram', icon: InstagramIcon },
    { name: 'LINKEDIN' as const, label: 'LinkedIn', icon: LinkedInIcon },
    { name: 'TIKTOK' as const, label: 'TikTok', icon: YouTubeIcon },
    { name: 'YOUTUBE' as const, label: 'YouTube', icon: YouTubeIcon },
];

interface ProfileSocialsProps {
    isEditing: boolean;
    socialNetworks?: SocialNetwork[];
    editSocials: { name: SocialNetwork['name']; url: string }[];
    onAddSocial: (name: SocialNetwork['name'], url: string) => void;
    onRemoveSocial: (index: number) => void;
}

export default function ProfileSocials({ isEditing, socialNetworks, editSocials, onAddSocial, onRemoveSocial }: ProfileSocialsProps) {
    const [newSocialName, setNewSocialName] = useState<SocialNetwork['name']>('INSTAGRAM');
    const [newSocialUrl, setNewSocialUrl] = useState('');

    const handleAdd = () => {
        if (!newSocialUrl.trim()) return;
        onAddSocial(newSocialName, newSocialUrl.trim());
        setNewSocialUrl('');
    };

    if (isEditing) {
        return (
            <Box sx={{ mb: 3, px: 2 }}>
                {editSocials.length > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                        {editSocials.map((social, index) => {
                            const net = SOCIAL_NETWORKS.find(s => s.name === social.name);
                            const Icon = net?.icon || TwitterIcon;
                            return (
                                <Chip
                                    key={index}
                                    icon={<Icon sx={{ fontSize: 18 }} />}
                                    label={net?.label || social.name}
                                    size="small"
                                    onDelete={() => onRemoveSocial(index)}
                                    sx={{ fontSize: '13px', fontWeight: 500, '& .MuiChip-icon': { color: 'inherit' } }}
                                />
                            );
                        })}
                    </Box>
                )}
                <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
                    <Select
                        size="small"
                        value={newSocialName}
                        onChange={(e: SelectChangeEvent) => setNewSocialName(e.target.value as SocialNetwork['name'])}
                        sx={{ minWidth: 130, borderRadius: '14px', '& .MuiOutlinedInput-notchedOutline': { borderRadius: '14px' } }}
                    >
                        {SOCIAL_NETWORKS.map(s => (
                            <MenuItem key={s.name} value={s.name}>{s.label}</MenuItem>
                        ))}
                    </Select>
                    <TextField
                        size="small" placeholder="URL du profil" value={newSocialUrl}
                        onChange={(e) => setNewSocialUrl(e.target.value)}
                        sx={{ flex: 1, maxWidth: 220, '& .MuiOutlinedInput-root': { borderRadius: '14px' } }}
                    />
                    <IconButton onClick={handleAdd} disabled={!newSocialUrl.trim()}
                        sx={{
                            bgcolor: 'primary.main', color: '#fff', width: 36, height: 36,
                            '&:hover': { bgcolor: 'primary.dark' }, '&.Mui-disabled': { bgcolor: '#E0E0E0', color: '#999' },
                        }}>
                        <AddIcon sx={{ fontSize: 20 }} />
                    </IconButton>
                </Stack>
            </Box>
        );
    }

    if (!socialNetworks || socialNetworks.length === 0) return null;

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mb: 3, flexWrap: 'wrap' }}>
            {socialNetworks.map((social) => (
                <SocialIcon key={social.id} socialNetwork={social} />
            ))}
        </Box>
    );
}
