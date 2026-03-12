import { useState, useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { UserFile } from '../../types/user';

interface ImageWithSize {
    file: UserFile;
    width: number;
    height: number;
    ratio: number; // width / height
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

        // Try trio (maxPerRow >= 3, 3+ images available, not a very wide image)
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

        // Try pair
        if (img2) {
            const pairRatioSum = img.ratio + img2.ratio;
            const pairHeight = (containerWidth - gap) / pairRatioSum;
            const pairFitsWell = pairHeight >= 140 && pairHeight <= maxRowHeight;

            let useSolo = false;
            if (isWide && lastRowCount !== 1) {
                useSolo = true;
            } else if (isPortrait) {
                useSolo = false;
            } else if (lastRowCount === 1) {
                useSolo = false; // force pair after solo for variety
            } else if (!pairFitsWell && soloHeight <= maxRowHeight) {
                useSolo = true;
            }

            if (!useSolo) {
                rows.push({ images: [img, img2], height: Math.min(pairHeight, maxRowHeight) });
                lastRowCount = 2;
                i += 2;
                continue;
            }
        }

        // Solo
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
}

export default function JustifiedPhotoGrid({ pictures, gap = 4, maxRowHeight = 250, maxPerRow = 2 }: JustifiedPhotoGridProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [imagesWithSize, setImagesWithSize] = useState<ImageWithSize[]>([]);
    const [containerWidth, setContainerWidth] = useState(0);

    // Load image dimensions
    useEffect(() => {
        let cancelled = false;

        const loadAll = async () => {
            const results = await Promise.all(
                pictures.map(
                    (file) =>
                        new Promise<ImageWithSize>((resolve) => {
                            if (!file.url) {
                                resolve({ file, width: 1, height: 1, ratio: 1 });
                                return;
                            }
                            const img = new Image();
                            img.onload = () => {
                                resolve({
                                    file,
                                    width: img.naturalWidth,
                                    height: img.naturalHeight,
                                    ratio: img.naturalWidth / img.naturalHeight,
                                });
                            };
                            img.onerror = () => {
                                resolve({ file, width: 1, height: 1, ratio: 1 });
                            };
                            img.src = file.url!;
                        })
                )
            );
            if (!cancelled) setImagesWithSize(results);
        };

        loadAll();
        return () => { cancelled = true; };
    }, [pictures]);

    // Observe container width
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                setContainerWidth(entry.contentRect.width);
            }
        });
        observer.observe(el);
        setContainerWidth(el.clientWidth);

        return () => observer.disconnect();
    }, []);

    if (imagesWithSize.length === 0 || containerWidth === 0) {
        return <Box ref={containerRef} />;
    }

    const rows = buildRows(imagesWithSize, containerWidth, gap, maxRowHeight, maxPerRow);

    return (
        <Box ref={containerRef} sx={{ display: 'flex', flexDirection: 'column', gap: `${gap}px` }}>
            {rows.map((row, rowIdx) => (
                <Box key={rowIdx} sx={{ display: 'flex', gap: `${gap}px`, height: row.height }}>
                    {row.images.map((img) => (
                        <Box
                            key={img.file.id}
                            component="img"
                            src={img.file.url || undefined}
                            alt={img.file.filename}
                            sx={{
                                height: row.height,
                                width: img.ratio * row.height,
                                objectFit: 'cover',
                                borderRadius: 1,
                                flexShrink: 0,
                            }}
                        />
                    ))}
                </Box>
            ))}
        </Box>
    );
}
