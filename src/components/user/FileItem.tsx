import { Box, Typography } from '@mui/material';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import { UserFile } from '../../types/user';

interface FileItemProps {
    file: UserFile;
}

export default function FileItem({ file }: FileItemProps) {
    const sizeLabel = file.size >= 1000000
        ? `${(file.size / 1000000).toFixed(1)} Mo`
        : `${Math.round(file.size / 1000)} Ko`;

    return (
        <Box
            component={file.url ? 'a' : 'div'}
            href={file.url || undefined}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
                display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, borderRadius: 2,
                bgcolor: '#F2F6FC', textDecoration: 'none', color: 'inherit',
                '&:hover': file.url ? { bgcolor: '#E3ECF7' } : {},
            }}
        >
            <InsertDriveFileOutlinedIcon sx={{ color: 'primary.main', fontSize: 28 }} />
            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontSize: '14px', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {file.filename}
                </Typography>
                <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
                    {file.extension.toUpperCase()} - {sizeLabel}
                </Typography>
            </Box>
        </Box>
    );
}
