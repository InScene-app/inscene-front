import { useRef } from 'react';
import { Box, Typography, Stack } from '@mui/material';
import FileItem from './FileItem';
import UploadSquare from './UploadSquare';
import { UserFile } from '../../types/user';

interface ProfileDiplomasProps {
    diplomas: UserFile[];
    isEditing: boolean;
    onDiplomaUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ProfileDiplomas({ diplomas, isEditing, onDiplomaUpload }: ProfileDiplomasProps) {
    const diplomaInputRef = useRef<HTMLInputElement>(null);

    if (diplomas.length === 0 && !isEditing) return null;

    return (
        <Box sx={{ pt: 3, pb: 6 }}>
            <Typography sx={{ fontSize: '20px', fontWeight: 600, mb: 2, textAlign: 'center' }}>
                Diplômes et reconnaissances
            </Typography>
            {diplomas.length > 0 && (
                <Stack spacing={1}>
                    {diplomas.map((file) => (
                        <FileItem key={file.id} file={file} />
                    ))}
                </Stack>
            )}
            {isEditing && (
                <>
                    <input ref={diplomaInputRef} type="file" hidden onChange={onDiplomaUpload} />
                    <UploadSquare onClick={() => diplomaInputRef.current?.click()} />
                </>
            )}
        </Box>
    );
}
