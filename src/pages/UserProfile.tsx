import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, CircularProgress, Typography, Stack, Button, Divider, TextField } from '@mui/material';
import DetailLayout from '../components/layout/DetailLayout';
import PrimaryButton from '../components/common/PrimaryButton';
import ProfileHeader from '../components/user/ProfileHeader';
import ProfileActions from '../components/user/ProfileActions';
import ProfileSocials from '../components/user/ProfileSocials';
import ProfileActivities from '../components/user/ProfileActivities';
import ProfileMedia from '../components/user/ProfileMedia';
import ProfileDiplomas from '../components/user/ProfileDiplomas';
import JobSelectorDialog from '../components/user/JobSelectorDialog';
import { getUserById, updateIndividual, uploadUserMedia, getCategories, Category, followUser, unfollowUser, getFollowingIds } from '../api/userService';
import { User, SocialNetwork } from '../types/user';
import { parseJwt } from '../utils/jwt';
import { useFavorites } from '../hooks/useFavorites';

interface UserProfileProps {
    userId?: number;
}

export default function UserProfile({ userId: propUserId }: UserProfileProps = {}) {
    const { id } = useParams<{ id: string }>();

    const resolvedId = propUserId ?? (id ? parseInt(id) : null);
    const tokenId = (() => {
        if (resolvedId) return resolvedId;
        const token = localStorage.getItem('access_token');
        const payload = token ? parseJwt(token) : null;
        return payload?.sub as number | undefined;
    })();
    const finalId = resolvedId ?? tokenId;

    const currentUserId = (() => {
        const token = localStorage.getItem('access_token');
        const payload = token ? parseJwt(token) : null;
        return payload?.sub as number | undefined;
    })();
    const isOwner = !!currentUserId && currentUserId === finalId;

    const { isUserSaved, toggleSaveUser } = useFavorites();

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState(0);

    // Edit mode
    const [isEditing, setIsEditing] = useState(false);
    const [editFirstName, setEditFirstName] = useState('');
    const [editLastName, setEditLastName] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [editLocation, setEditLocation] = useState('');
    const [editJobCodes, setEditJobCodes] = useState<string[]>([]);
    const [editSocials, setEditSocials] = useState<{ name: SocialNetwork['name']; url: string }[]>([]);
    const [saving, setSaving] = useState(false);

    // Follow
    const [isFollowing, setIsFollowing] = useState(false);
    const [followLoading, setFollowLoading] = useState(false);

    // Job selector
    const [categories, setCategories] = useState<Category[]>([]);
    const [jobDialogOpen, setJobDialogOpen] = useState(false);

    const fetchUser = async () => {
        if (!finalId) return;
        try {
            setLoading(true);
            const data = await getUserById(finalId);
            setUser(data);
            setError(null);
        } catch {
            setError('Impossible de charger le profil');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUser(); }, [finalId]);

    useEffect(() => {
        if (!currentUserId || !finalId || isOwner) return;
        getFollowingIds(currentUserId).then(ids => setIsFollowing(ids.includes(finalId))).catch(() => {});
    }, [currentUserId, finalId, isOwner]);

    const handleToggleFollow = async () => {
        if (!currentUserId || !finalId || followLoading) return;
        setFollowLoading(true);
        try {
            if (isFollowing) { await unfollowUser(currentUserId, finalId); setIsFollowing(false); }
            else { await followUser(currentUserId, finalId); setIsFollowing(true); }
        } catch { /* ignore */ } finally { setFollowLoading(false); }
    };

    const handleToggleEdit = () => {
        if (!isEditing && user) {
            setEditFirstName(user.firstName || '');
            setEditLastName(user.lastName || '');
            setEditDescription(user.description || '');
            setEditLocation(user.location?.join(', ') || '');
            setEditJobCodes((user.jobs || []).map(j => j.code));
            setEditSocials((user.socialNetworks || []).map(s => ({ name: s.name, url: s.url })));
            setIsEditing(true);
        } else {
            setIsEditing(false);
        }
    };

    const handleSave = async () => {
        if (!finalId) return;
        setSaving(true);
        try {
            await updateIndividual(finalId, {
                firstName: editFirstName, lastName: editLastName,
                description: editDescription,
                location: editLocation ? [editLocation] : [],
                jobCodes: editJobCodes, socialNetworks: editSocials,
            });
            await fetchUser();
            setIsEditing(false);
        } catch { /* ignore */ } finally { setSaving(false); }
    };

    // Upload handlers
    const makeUploadHandler = (category: string) => async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !finalId) return;
        try { await uploadUserMedia(finalId, file, category); await fetchUser(); } catch { /* ignore */ }
        e.target.value = '';
    };

    // Job selector
    const openJobSelector = async () => {
        if (categories.length === 0) {
            try { setCategories(await getCategories()); } catch { /* ignore */ }
        }
        setJobDialogOpen(true);
    };

    const handleToggleJob = (code: string) => {
        setEditJobCodes(prev => prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]);
    };

    const getJobName = (code: string): string => {
        for (const cat of categories) {
            const job = cat.jobs.find(j => j.code === code);
            if (job) return job.name;
        }
        return user?.jobs?.find(j => j.code === code)?.name || code;
    };

    // Loading / Error
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

    // Derived data
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    const displayName = firstName && lastName
        ? `${firstName.charAt(0).toUpperCase() + firstName.slice(1)} ${lastName.charAt(0).toUpperCase() + lastName.slice(1)}`
        : user.enterpriseName || user.email?.split('@')[0] || 'Utilisateur';

    const username = firstName && lastName
        ? `@${firstName.toLowerCase()}_${lastName.toLowerCase()}`
        : `@${user.email?.split('@')[0] || 'user'}`;

    const locationText = user.location?.length ? user.location.join(', ') : null;

    const activitiesTags = user.type === 'individual'
        ? (user.jobs || []).map(j => j.name)
        : user.activities ? user.activities.split(',').map(a => a.trim()) : [];

    const pictures = user.pictures || [];
    const videos = user.videos || [];
    const otherFiles = (user.files || []).filter(f => f.category !== 'Picture' && f.category !== 'Video' && f.category !== 'Diploma');
    const diplomas = (user.files || []).filter(f => f.category === 'Diploma');

    return (
        <DetailLayout
            isOwner={isOwner}
            isEditing={isEditing}
            onToggleEdit={handleToggleEdit}
            isSaved={finalId ? isUserSaved(finalId) : false}
            onToggleSave={finalId ? () => toggleSaveUser(finalId) : undefined}
        >
            <Box>
                <ProfileHeader
                    displayName={displayName} username={username}
                    avatarUrl={user.avatarUrl} locationText={locationText}
                    isEditing={isEditing}
                    editFirstName={editFirstName} editLastName={editLastName} editLocation={editLocation}
                    onEditFirstName={setEditFirstName} onEditLastName={setEditLastName} onEditLocation={setEditLocation}
                    onAvatarUpload={makeUploadHandler('Avatar')}
                />

                {!isOwner && (
                    <ProfileActions
                        isFollowing={isFollowing} followLoading={followLoading}
                        onToggleFollow={handleToggleFollow} websiteUrl={user.websiteUrl}
                    />
                )}

                <ProfileSocials
                    isEditing={isEditing}
                    socialNetworks={user.socialNetworks}
                    editSocials={editSocials}
                    onAddSocial={(name, url) => setEditSocials(prev => [...prev, { name, url }])}
                    onRemoveSocial={(i) => setEditSocials(prev => prev.filter((_, idx) => idx !== i))}
                />

                <Divider />

                <ProfileActivities
                    activitiesTags={activitiesTags} isEditing={isEditing}
                    editJobCodes={editJobCodes} getJobName={getJobName}
                    onRemoveJob={(code) => setEditJobCodes(prev => prev.filter(c => c !== code))}
                    onOpenJobSelector={openJobSelector}
                />

                <ProfileMedia
                    pictures={pictures} videos={videos} otherFiles={otherFiles}
                    isEditing={isEditing} activeTab={activeTab}
                    onTabChange={setActiveTab}
                    onPhotoUpload={makeUploadHandler('Picture')}
                    onVideoUpload={makeUploadHandler('Video')}
                    onFileUpload={makeUploadHandler('Portfolio')}
                />

                {/* Présentation */}
                {(user.description || isEditing) && (
                    <Box sx={{ pt: 6, pb: 6 }}>
                        <Typography sx={{ fontSize: '20px', fontWeight: 600, mb: 2, textAlign: 'center' }}>
                            Présentation
                        </Typography>
                        {isEditing ? (
                            <TextField multiline minRows={3} fullWidth value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)} placeholder="Décrivez-vous..."
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                        ) : (
                            <Typography sx={{ fontSize: '15px', fontWeight: 400, color: '#000000', textAlign: 'left' }}>
                                {user.description}
                            </Typography>
                        )}
                    </Box>
                )}

                <ProfileDiplomas
                    diplomas={diplomas} isEditing={isEditing}
                    onDiplomaUpload={makeUploadHandler('Diploma')}
                />

                {/* Boutons Enregistrer / Annuler */}
                {isEditing && (
                    <Stack direction="row" spacing={1.5} sx={{ px: 2, pb: 4 }}>
                        <Button fullWidth variant="outlined" onClick={() => setIsEditing(false)}
                            sx={{
                                textTransform: 'none', borderRadius: '50px', borderColor: 'text.secondary',
                                color: 'text.secondary', fontWeight: 500, padding: '10px 13px',
                            }}>
                            Annuler
                        </Button>
                        <PrimaryButton fullWidth onClick={handleSave} disabled={saving}
                            sx={{ padding: '10px 13px', borderRadius: '50px' }}>
                            {saving ? <CircularProgress size={20} color="inherit" /> : 'Enregistrer'}
                        </PrimaryButton>
                    </Stack>
                )}
            </Box>

            <JobSelectorDialog
                open={jobDialogOpen} onClose={() => setJobDialogOpen(false)}
                categories={categories} editJobCodes={editJobCodes} onToggleJob={handleToggleJob}
            />
        </DetailLayout>
    );
}
