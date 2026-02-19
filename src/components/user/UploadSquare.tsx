import { Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

interface UploadSquareProps {
    onClick: () => void;
}

export default function UploadSquare({ onClick }: UploadSquareProps) {
    return (
        <Box
            onClick={onClick}
            sx={{
                mt: 2,
                width: 100,
                height: 100,
                border: '2px dashed #999',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                mx: 'auto',
                '&:hover': { borderColor: 'primary.main', bgcolor: '#F2F6FC' },
            }}
        >
            <AddIcon sx={{ fontSize: 32, color: '#999' }} />
        </Box>
    );
}
