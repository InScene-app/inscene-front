import { Box, Typography, Chip, useTheme } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

interface ProfileActivitiesProps {
    activitiesTags: string[];
    isEditing: boolean;
    editJobCodes: string[];
    getJobName: (code: string) => string;
    onRemoveJob: (code: string) => void;
    onOpenJobSelector: () => void;
}

export default function ProfileActivities({
    activitiesTags, isEditing, editJobCodes, getJobName, onRemoveJob, onOpenJobSelector,
}: ProfileActivitiesProps) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    if (activitiesTags.length === 0 && !isEditing) return null;

    return (
        <Box sx={{ pt: 6, pb: 6 }}>
            <Typography sx={{ fontSize: '20px', fontWeight: 600, mb: 2, textAlign: 'center' }}>
                Activités
            </Typography>
            {isEditing ? (
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
                    {editJobCodes.map((code) => (
                        <Chip key={code} label={getJobName(code)} size="small"
                            onDelete={() => onRemoveJob(code)}
                            sx={{
                                fontSize: '15px', fontWeight: 500,
                                backgroundColor: isDark ? 'background.hover' : 'primary.main',
                                color: isDark ? 'text.primary' : '#FFFFFF',
                                '& .MuiChip-deleteIcon': { color: isDark ? 'text.primary' : '#FFFFFF' },
                            }} />
                    ))}
                    <Chip icon={<AddIcon />} label="Ajouter" size="small" onClick={onOpenJobSelector}
                        sx={{
                            fontSize: '15px', fontWeight: 500, backgroundColor: 'background.default', color: 'text.primary',
                            cursor: 'pointer', border: '1px dashed #999',
                        }} />
                </Box>
            ) : (
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
                    {activitiesTags.map((activity, index) => (
                        <Chip key={index} label={activity} size="small"
                            sx={{ fontSize: '15px', fontWeight: 500, backgroundColor: 'background.default', color: 'text.primary', border: 'none' }} />
                    ))}
                </Box>
            )}
        </Box>
    );
}
