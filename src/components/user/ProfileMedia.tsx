import { useRef, useState } from 'react';
import { Box, Typography, Stack, Tabs, Tab, Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
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
    onDeleteFile?: (fileId: number) => Promise<void>;
    maxPerRow?: number;
    maxRowHeight?: number;
}

export default function ProfileMedia({
    pictures, videos, otherFiles, isEditing, activeTab, onTabChange,
    onPhotoUpload, onVideoUpload, onFileUpload, onDeleteFile, maxPerRow, maxRowHeight,
}: ProfileMediaProps) {
    const photoInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Video hover/long-press delete
    const [showVideoDeleteId, setShowVideoDeleteId] = useState<number | null>(null);
    const [confirmVideoDeleteId, setConfirmVideoDeleteId] = useState<number | null>(null);
    const [deletingVideo, setDeletingVideo] = useState(false);
    const videoHoverTimer = useRef<number | undefined>(undefined);
    const videoTouchTimer = useRef<number | undefined>(undefined);

    const startVideoHover = (id: number) => {
        if (!isEditing || !onDeleteFile) return;
        videoHoverTimer.current = setTimeout(() => setShowVideoDeleteId(id), 1000);
    };
    const clearVideoHover = () => { clearTimeout(videoHoverTimer.current); setShowVideoDeleteId(null); };
    const startVideoTouch = (id: number) => {
        if (!isEditing || !onDeleteFile) return;
        videoTouchTimer.current = setTimeout(() => setShowVideoDeleteId(id), 600);
    };
    const clearVideoTouch = () => clearTimeout(videoTouchTimer.current);

    const handleConfirmVideoDelete = async () => {
        if (!confirmVideoDeleteId || !onDeleteFile) return;
        setDeletingVideo(true);
        try { await onDeleteFile(confirmVideoDeleteId); }
        finally { setDeletingVideo(false); setConfirmVideoDeleteId(null); setShowVideoDeleteId(null); }
    };

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
                {/* ── Photos ── */}
                {activeTab === 0 && (
                    <>
                        <input ref={photoInputRef} type="file" accept="image/*" hidden onChange={onPhotoUpload} />
                        {pictures.length > 0 ? (
                            <JustifiedPhotoGrid
                                pictures={pictures}
                                maxPerRow={maxPerRow}
                                maxRowHeight={maxRowHeight}
                                isEditing={isEditing}
                                onUploadClick={isEditing ? () => photoInputRef.current?.click() : undefined}
                                onDeleteFile={isEditing ? onDeleteFile : undefined}
                            />
                        ) : (
                            <>
                                <Typography sx={{ textAlign: 'center', color: 'text.secondary', mb: 2, fontStyle: 'italic' }}>
                                    Pas encore de photos
                                </Typography>
                                {isEditing && <UploadSquare onClick={() => photoInputRef.current?.click()} />}
                            </>
                        )}
                    </>
                )}

                {/* ── Vidéos ── */}
                {activeTab === 1 && (
                    <>
                        <input ref={videoInputRef} type="file" accept="video/*" hidden onChange={onVideoUpload} />
                        {videos.length > 0 ? (
                            <Stack spacing={2}>
                                {videos.map((vid) => (
                                    <Box
                                        key={vid.id}
                                        sx={{ position: 'relative', borderRadius: 2, overflow: 'hidden', bgcolor: '#000' }}
                                        onMouseEnter={() => startVideoHover(vid.id)}
                                        onMouseLeave={clearVideoHover}
                                        onTouchStart={() => startVideoTouch(vid.id)}
                                        onTouchEnd={clearVideoTouch}
                                        onTouchMove={clearVideoTouch}
                                    >
                                        {vid.url ? (
                                            <video src={vid.url} controls style={{ width: '100%', display: 'block' }} />
                                        ) : (
                                            <Box sx={{ p: 3, textAlign: 'center' }}>
                                                <Typography sx={{ color: '#fff' }}>{vid.filename}</Typography>
                                            </Box>
                                        )}
                                        {isEditing && showVideoDeleteId === vid.id && (
                                            <Box
                                                onClick={() => { setConfirmVideoDeleteId(vid.id); setShowVideoDeleteId(null); }}
                                                sx={{
                                                    position: 'absolute', top: 8, right: 8,
                                                    width: 28, height: 28, borderRadius: '50%',
                                                    bgcolor: 'rgba(0,0,0,0.65)', display: 'flex',
                                                    alignItems: 'center', justifyContent: 'center',
                                                    cursor: 'pointer', '&:hover': { bgcolor: 'rgba(0,0,0,0.85)' },
                                                }}
                                            >
                                                <CloseIcon sx={{ fontSize: 14, color: '#fff' }} />
                                            </Box>
                                        )}
                                    </Box>
                                ))}
                            </Stack>
                        ) : (
                            <Typography sx={{ textAlign: 'center', color: 'text.secondary', mb: 2, fontStyle: 'italic' }}>
                                Pas encore de vidéos
                            </Typography>
                        )}
                        {isEditing && <UploadSquare onClick={() => videoInputRef.current?.click()} />}
                    </>
                )}

                {/* ── Fichiers ── */}
                {activeTab === 2 && (
                    <>
                        <input ref={fileInputRef} type="file" hidden onChange={onFileUpload} />
                        {otherFiles.length > 0 ? (
                            <Stack spacing={1}>
                                {otherFiles.map((file) => (
                                    <Box key={file.id} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Box sx={{ flex: 1, minWidth: 0 }}>
                                            <FileItem file={file} />
                                        </Box>
                                        {isEditing && onDeleteFile && (
                                            <IconButton
                                                size="small"
                                                onClick={() => onDeleteFile(file.id)}
                                                sx={{ flexShrink: 0, color: 'text.secondary', '&:hover': { color: 'error.main', bgcolor: 'transparent' } }}
                                            >
                                                <CloseIcon sx={{ fontSize: 16 }} />
                                            </IconButton>
                                        )}
                                    </Box>
                                ))}
                            </Stack>
                        ) : (
                            <Typography sx={{ textAlign: 'center', color: 'text.secondary', mb: 2, fontStyle: 'italic' }}>
                                Pas encore de fichiers
                            </Typography>
                        )}
                        {isEditing && <UploadSquare onClick={() => fileInputRef.current?.click()} />}
                    </>
                )}
            </Box>

            {/* Dialog suppression vidéo */}
            <Dialog
                open={confirmVideoDeleteId !== null}
                onClose={() => !deletingVideo && setConfirmVideoDeleteId(null)}
                PaperProps={{ sx: { borderRadius: '20px', p: 1, minWidth: 280 } }}
            >
                <DialogTitle sx={{ fontWeight: 700, fontSize: '18px', pb: 1 }}>Supprimer cette vidéo ?</DialogTitle>
                <DialogContent sx={{ pt: '4px !important' }}>
                    <Typography sx={{ color: 'text.secondary', fontSize: '14px' }}>Cette action est irréversible.</Typography>
                </DialogContent>
                <DialogActions sx={{ pb: 2, px: 2, gap: 1 }}>
                    <Button onClick={() => setConfirmVideoDeleteId(null)} disabled={deletingVideo} sx={{ borderRadius: '50px', textTransform: 'none', color: 'text.secondary' }}>
                        Annuler
                    </Button>
                    <Button onClick={handleConfirmVideoDelete} disabled={deletingVideo} variant="contained" color="error" sx={{ borderRadius: '50px', textTransform: 'none' }}>
                        {deletingVideo ? 'Suppression...' : 'Supprimer'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
