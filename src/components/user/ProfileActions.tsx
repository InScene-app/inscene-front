import { Stack, Button, CircularProgress } from '@mui/material';
import PrimaryButton from '../common/PrimaryButton';

interface ProfileActionsProps {
    isFollowing: boolean;
    followLoading: boolean;
    onToggleFollow: () => void;
    websiteUrl?: string;
}

export default function ProfileActions({ isFollowing, followLoading, onToggleFollow, websiteUrl }: ProfileActionsProps) {
    return (
        <Stack direction="row" spacing={1.5} sx={{ mb: 3 }}>
            {isFollowing ? (
                <Button fullWidth variant="outlined" onClick={onToggleFollow} disabled={followLoading}
                    sx={{
                        textTransform: 'none', borderRadius: '50px', borderColor: 'primary.main',
                        color: 'primary.main', fontWeight: 500, padding: '8px 13px',
                        '&:hover': { borderColor: '#d32f2f', color: '#d32f2f', backgroundColor: '#fce4ec' },
                    }}>
                    {followLoading ? <CircularProgress size={20} /> : 'Suivi'}
                </Button>
            ) : (
                <PrimaryButton fullWidth onClick={onToggleFollow} disabled={followLoading}
                    sx={{ padding: '8px 13px', borderRadius: '50px' }}>
                    {followLoading ? <CircularProgress size={20} color="inherit" /> : 'Suivre'}
                </PrimaryButton>
            )}
            <Button fullWidth variant="outlined" sx={{
                textTransform: 'none', borderRadius: '50px', borderColor: 'primary.main',
                color: 'primary.main', fontWeight: 500, padding: '8px 13px',
                '&:hover': { borderColor: 'primary.dark', backgroundColor: 'primary.light' },
            }}>
                Contacter
            </Button>
            {websiteUrl && (
                <Button fullWidth variant="outlined" component="a" href={websiteUrl}
                    target="_blank" rel="noopener noreferrer" sx={{
                        textTransform: 'none', borderRadius: '50px', borderColor: 'primary.main',
                        color: 'primary.main', fontWeight: 500, padding: '8px 13px',
                        '&:hover': { borderColor: 'primary.dark', backgroundColor: 'primary.light' },
                    }}>
                    Portfolio
                </Button>
            )}
        </Stack>
    );
}
