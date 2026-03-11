import { useEffect, useRef } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

export default function RootLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const isDevMode = import.meta.env.VITE_DEV_MODE === 'true';
    const hasRedirected = useRef(false);

    useEffect(() => {
        const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding') === 'true';
        
        // En mode dev : toujours rediriger pour tester facilement
        // En mode prod : rediriger seulement si pas encore vu
        const shouldRedirect = isDevMode || !hasSeenOnboarding;
        
        if (shouldRedirect && !hasRedirected.current && location.pathname !== '/onboarding') {
            hasRedirected.current = true;
            navigate('/onboarding', { replace: true });
        }
    }, [isDevMode, navigate, location.pathname]);

    return <Outlet />;
}
