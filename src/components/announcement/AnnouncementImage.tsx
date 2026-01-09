import { CardMedia } from '@mui/material';

interface AnnouncementImageProps {
  imageUrl: string | null;
  title?: string;
}

export default function AnnouncementImage({ imageUrl, title }: AnnouncementImageProps) {
  if (!imageUrl) return null;

  return (
    <CardMedia
      component="img"
      image={imageUrl}
      alt={title || 'Announcement image'}
      sx={{
        height: 200,
        objectFit: 'cover',
        borderRadius: '12px 12px 0 0',
      }}
    />
  );
}
