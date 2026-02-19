import { useRef } from 'react';
import { Box, Typography, Stack, Tabs, Tab } from '@mui/material';
import JustifiedPhotoGrid from './JustifiedPhotoGrid';
import FileItem from './FileItem';
import UploadSquare from './UploadSquare';
import { UserFile } from '../../types/user';

interface ProfileMediaProps {
    pictures: UserFile[];
    videos: UserFile[];
    otherFiles: UserFile[];
    isEditing: boolean;
    activeTab: number;
    onTabChange: (newValue: number) => void;
    onPhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onVideoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ProfileMedia({
    pictures, videos, otherFiles, isEditing, activeTab, onTabChange,
    onPhotoUpload, onVideoUpload, onFileUpload,
}: ProfileMediaProps) {
    const photoInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const hasMedia = pictures.length > 0 || videos.length > 0 || otherFiles.length > 0 || isEditing;
    if (!hasMedia) return null;

    return (
        <>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                <Tabs value={activeTab} onChange={(_, v) => onTabChange(v)} variant="fullWidth"
                    aria-label="onglets de contenu"
                    sx={{ '& .MuiTab-root': { textTransform: 'none', fontSize: '16px', fontWeight: 500, flex: 1 } }}>
                    <Tab label={`Photos${pictures.length > 0 ? ` (${pictures.length})` : ''}`} />
                    <Tab label={`Vidéos${videos.length > 0 ? ` (${videos.length})` : ''}`} />
                    <Tab label={`Fichiers${otherFiles.length > 0 ? ` (${otherFiles.length})` : ''}`} />
                </Tabs>
            </Box>

            <Box sx={{ py: 3 }}>
                {activeTab === 0 && (
                    <>
                        {pictures.length > 0 ? (
                            <JustifiedPhotoGrid pictures={pictures} />
                        ) : (
                            <Typography sx={{ textAlign: 'center', color: 'text.secondary', mb: 2 }}>Aucune photo</Typography>
                        )}
                        {isEditing && (
                            <>
                                <input ref={photoInputRef} type="file" accept="image/*" hidden onChange={onPhotoUpload} />
                                <UploadSquare onClick={() => photoInputRef.current?.click()} />
                            </>
                        )}
                    </>
                )}
                {activeTab === 1 && (
                    <>
                        {videos.length > 0 ? (
                            <Stack spacing={2}>
                                {videos.map((vid) => (
                                    <Box key={vid.id} sx={{ borderRadius: 2, overflow: 'hidden', bgcolor: '#000' }}>
                                        {vid.url ? (
                                            <video src={vid.url} controls style={{ width: '100%', display: 'block' }} />
                                        ) : (
                                            <Box sx={{ p: 3, textAlign: 'center' }}>
                                                <Typography sx={{ color: '#fff' }}>{vid.filename}</Typography>
                                            </Box>
                                        )}
                                    </Box>
                                ))}
                            </Stack>
                        ) : (
                            <Typography sx={{ textAlign: 'center', color: 'text.secondary', mb: 2 }}>Aucune vidéo</Typography>
                        )}
                        {isEditing && (
                            <>
                                <input ref={videoInputRef} type="file" accept="video/*" hidden onChange={onVideoUpload} />
                                <UploadSquare onClick={() => videoInputRef.current?.click()} />
                            </>
                        )}
                    </>
                )}
                {activeTab === 2 && (
                    <>
                        {otherFiles.length > 0 ? (
                            <Stack spacing={1}>
                                {otherFiles.map((file) => (
                                    <FileItem key={file.id} file={file} />
                                ))}
                            </Stack>
                        ) : (
                            <Typography sx={{ textAlign: 'center', color: 'text.secondary', mb: 2 }}>Aucun fichier</Typography>
                        )}
                        {isEditing && (
                            <>
                                <input ref={fileInputRef} type="file" hidden onChange={onFileUpload} />
                                <UploadSquare onClick={() => fileInputRef.current?.click()} />
                            </>
                        )}
                    </>
                )}
            </Box>
        </>
    );
}
