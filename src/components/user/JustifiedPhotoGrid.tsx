import { useState, useEffect, useRef } from 'react';
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { UserFile } from '../../types/user';

const UPLOAD_ID = -999;

interface ImageWithSize {
    file: UserFile;
    width: number;
    height: number;
    ratio: number;
}

interface Row {
    images: ImageWithSize[];
    height: number;
}

function buildRows(images: ImageWithSize[], containerWidth: number, gap: number, maxRowHeight: number, maxPerRow: number = 2): Row[] {
    const rows: Row[] = [];
    let i = 0;
    let lastRowCount = 2;

    while (i < images.length) {
        const img = images[i];
        const img2 = i + 1 < images.length ? images[i + 1] : null;
        const img3 = i + 2 < images.length ? images[i + 2] : null;

        const soloHeight = containerWidth / img.ratio;
        const isWide = img.ratio > 1.8;
        const isPortrait = img.ratio < 0.9;

        if (maxPerRow >= 3 && img2 && img3 && !isWide) {
            const trioRatioSum = img.ratio + img2.ratio + img3.ratio;
            const trioHeight = (containerWidth - 2 * gap) / trioRatioSum;
            if (trioHeight >= 100 && trioHeight <= maxRowHeight) {
                rows.push({ images: [img, img2, img3], height: trioHeight });
                lastRowCount = 3;
                i += 3;
                continue;
            }
        }

        if (img2) {
            const pairRatioSum = img.ratio + img2.ratio;
            const pairHeight = (containerWidth - gap) / pairRatioSum;
            const pairFitsWell = pairHeight >= 140 && pairHeight <= maxRowHeight;

            let useSolo = false;
            if (isWide && lastRowCount !== 1) useSolo = true;
            else if (isPortrait) useSolo = false;
            else if (lastRowCount === 1) useSolo = false;
            else if (!pairFitsWell && soloHeight <= maxRowHeight) useSolo = true;

            if (!useSolo) {
                rows.push({ images: [img, img2], height: Math.min(pairHeight, maxRowHeight) });
                lastRowCount = 2;
                i += 2;
                continue;
            }
        }

        rows.push({ images: [img], height: Math.min(soloHeight, maxRowHeight) });
        lastRowCount = 1;
        i++;
    }

    return rows;
}

interface JustifiedPhotoGridProps {
    pictures: UserFile[];
    gap?: number;
    maxRowHeight?: number;
    maxPerRow?: number;
    isEditing?: boolean;
    onUploadClick?: () => void;
    onDeleteFile?: (fileId: number) => Promise<void>;
}

export default function JustifiedPhotoGrid({
    pictures, gap = 4, maxRowHeight = 250, maxPerRow = 2,
    isEditing, onUploadClick, onDeleteFile,
}: JustifiedPhotoGridProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [imagesWithSize, setImagesWithSize] = useState<ImageWithSize[]>([]);
    const [containerWidth, setContainerWidth] = useState(0);
    const [showDeleteId, setShowDeleteId] = useState<number | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
    const [deleting, setDeleting] = useState(false);
    const hoverTimer = useRef<number | undefined>(undefined);
    const touchTimer = useRef<number | undefined>(undefined);

    useEffect(() => {
        let cancelled = false;
        const loadAll = async () => {
            const results = await Promise.all(
                pictures.map(file => new Promise<ImageWithSize>((resolve) => {
                    if (!file.url) { resolve({ file, width: 1, height: 1, ratio: 1 }); return; }
                    const img = new Image();
                    img.onload = () => resolve({ file, width: img.naturalWidth, height: img.naturalHeight, ratio: img.naturalWidth / img.naturalHeight });
                    img.onerror = () => resolve({ file, width: 1, height: 1, ratio: 1 });
                    img.src = file.url!;
                }))
            );
            if (!cancelled) setImagesWithSize(results);
        };
        loadAll();
        return () => { cancelled = true; };
    }, [pictures]);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) setContainerWidth(entry.contentRect.width);
        });
        observer.observe(el);
        setContainerWidth(el.clientWidth);
        return () => observer.disconnect();
    }, []);

    const showGrid = imagesWithSize.length > 0 || (isEditing && !!onUploadClick);
    if (!showGrid || containerWidth === 0) return <Box ref={containerRef} />;

    // Ajouter le slot upload à la fin de la grille
    const allImages: ImageWithSize[] = isEditing && onUploadClick
        ? [...imagesWithSize, { file: { id: UPLOAD_ID } as UserFile, width: 1, height: 1, ratio: 1 }]
        : imagesWithSize;

    const rows = buildRows(allImages, containerWidth, gap, maxRowHeight, maxPerRow);

    const startHoverTimer = (id: number) => {
        if (!isEditing || !onDeleteFile) return;
        hoverTimer.current = setTimeout(() => setShowDeleteId(id), 1000);
    };
    const clearHoverTimer = () => { clearTimeout(hoverTimer.current); setShowDeleteId(null); };
    const startTouchTimer = (id: number) => {
        if (!isEditing || !onDeleteFile) return;
        touchTimer.current = setTimeout(() => setShowDeleteId(id), 600);
    };
    const clearTouchTimer = () => clearTimeout(touchTimer.current);

    const handleConfirmDelete = async () => {
        if (!confirmDeleteId || !onDeleteFile) return;
        setDeleting(true);
        try { await onDeleteFile(confirmDeleteId); }
        finally { setDeleting(false); setConfirmDeleteId(null); setShowDeleteId(null); }
    };

    return (
        <Box ref={containerRef} sx={{ display: 'flex', flexDirection: 'column', gap: `${gap}px` }}>
            {rows.map((row, rowIdx) => (
                <Box key={rowIdx} sx={{ display: 'flex', gap: `${gap}px`, height: row.height }}>
                    {row.images.map((img) => {
                        const w = img.ratio * row.height;

                        if (img.file.id === UPLOAD_ID) {
                            return (
                                <Box
                                    key="upload"
                                    onClick={onUploadClick}
                                    sx={{
                                        height: row.height, width: w, flexShrink: 0,
                                        border: '2px dashed', borderColor: 'background.border',
                                        borderRadius: 1, display: 'flex', alignItems: 'center',
                                        justifyContent: 'center', cursor: 'pointer',
                                        transition: 'border-color 0.2s',
                                        '&:hover': { borderColor: 'primary.main', '& .upload-icon': { color: 'primary.main' } },
                                    }}
                                >
                                    <AddIcon className="upload-icon" sx={{ fontSize: 32, color: 'background.border', transition: 'color 0.2s' }} />
                                </Box>
                            );
                        }

                        const showX = showDeleteId === img.file.id && isEditing;
                        return (
                            <Box
                                key={img.file.id}
                                sx={{ position: 'relative', height: row.height, width: w, flexShrink: 0, borderRadius: 1, overflow: 'hidden', cursor: isEditing ? 'default' : 'pointer' }}
                                onMouseEnter={() => startHoverTimer(img.file.id)}
                                onMouseLeave={clearHoverTimer}
                                onTouchStart={() => startTouchTimer(img.file.id)}
                                onTouchEnd={clearTouchTimer}
                                onTouchMove={clearTouchTimer}
                            >
                                <Box
                                    component="img"
                                    src={img.file.url || undefined}
                                    alt={img.file.filename}
                                    sx={{ height: '100%', width: '100%', objectFit: 'cover', display: 'block' }}
                                />
                                {showX && (
                                    <Box
                                        onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(img.file.id); setShowDeleteId(null); }}
                                        sx={{
                                            position: 'absolute', top: 6, right: 6,
                                            width: 26, height: 26, borderRadius: '50%',
                                            bgcolor: 'rgba(0,0,0,0.65)', display: 'flex',
                                            alignItems: 'center', justifyContent: 'center',
                                            cursor: 'pointer', transition: 'background-color 0.15s',
                                            '&:hover': { bgcolor: 'rgba(0,0,0,0.85)' },
                                        }}
                                    >
                                        <CloseIcon sx={{ fontSize: 14, color: '#fff' }} />
                                    </Box>
                                )}
                            </Box>
                        );
                    })}
                </Box>
            ))}

            <Dialog
                open={confirmDeleteId !== null}
                onClose={() => !deleting && setConfirmDeleteId(null)}
                PaperProps={{ sx: { borderRadius: '20px', p: 1, minWidth: 280 } }}
            >
                <DialogTitle sx={{ fontWeight: 700, fontSize: '18px', pb: 1 }}>Supprimer cette photo ?</DialogTitle>
                <DialogContent sx={{ pt: '4px !important' }}>
                    <Typography sx={{ color: 'text.secondary', fontSize: '14px' }}>
                        Cette action est irréversible.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ pb: 2, px: 2, gap: 1 }}>
                    <Button
                        onClick={() => setConfirmDeleteId(null)}
                        disabled={deleting}
                        sx={{ borderRadius: '50px', textTransform: 'none', color: 'text.secondary' }}
                    >
                        Annuler
                    </Button>
                    <Button
                        onClick={handleConfirmDelete}
                        disabled={deleting}
                        variant="contained"
                        color="error"
                        sx={{ borderRadius: '50px', textTransform: 'none' }}
                    >
                        {deleting ? 'Suppression...' : 'Supprimer'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
