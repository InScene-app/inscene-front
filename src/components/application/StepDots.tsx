import { Box } from '@mui/material';

interface StepDotsProps {
  totalSteps: number;
  currentStep: number;
}

export default function StepDots({ totalSteps, currentStep }: StepDotsProps) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}>
      {Array.from({ length: totalSteps }).map((_, i) => {
        const isActive = i + 1 === currentStep;
        const isCompleted = i + 1 < currentStep;
        return (
          <Box
            key={i}
            sx={{
              width: isActive ? '32px' : '8px',
              height: '8px',
              borderRadius: '4px',
              backgroundColor: isActive || isCompleted ? 'primary.main' : 'background.border',
              transition: 'all 0.3s ease',
            }}
          />
        );
      })}
    </Box>
  );
}
