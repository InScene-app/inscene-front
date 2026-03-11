import { IconButton } from '@mui/material';
import { SocialNetwork } from '../../types/user';

// Import Material Icons pour les réseaux sociaux
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { SvgIconComponent } from '@mui/icons-material';

interface SocialIconProps {
    socialNetwork: SocialNetwork;
}

const socialIconMap: Record<SocialNetwork['name'], { icon: SvgIconComponent; color: string }> = {
    TWITTER: { icon: TwitterIcon, color: '#1DA1F2' },
    INSTAGRAM: { icon: InstagramIcon, color: '#E4405F' },
    LINKEDIN: { icon: LinkedInIcon, color: '#0077B5' },
    TIKTOK: { icon: YouTubeIcon, color: '#000000' }, // TikTok pas d'icône MUI, on utilise YouTube
    YOUTUBE: { icon: YouTubeIcon, color: '#FF0000' },
};

export default function SocialIcon({ socialNetwork }: SocialIconProps) {
    const { icon: Icon } = socialIconMap[socialNetwork.name] || { icon: TwitterIcon, color: '#000000' };
    const url = socialNetwork.url.startsWith('http://') || socialNetwork.url.startsWith('https://')
        ? socialNetwork.url
        : `https://${socialNetwork.url}`;

    return (
        <IconButton
            component="a"
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
                color: 'text.primary',
                '&:hover': {
                    backgroundColor: 'background.hover',
                },
            }}
        >
            <Icon />
        </IconButton>
    );
}
