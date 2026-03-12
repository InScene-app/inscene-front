import { useEffect, useRef } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

export default function RootLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const hasRedirected = useRef(false);

    useEffect(() => {
        const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding') === 'true';

        if (!hasSeenOnboarding && !hasRedirected.current && location.pathname !== '/onboarding') {
            hasRedirected.current = true;
            navigate('/onboarding', { replace: true });
        }
    }, [navigate, location.pathname]);

    return <Outlet />;
}
