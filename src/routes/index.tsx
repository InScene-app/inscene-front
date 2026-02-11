import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import RootLayout from '../components/RootLayout';

// Pages
import Home from '../pages/Home';
import Saved from '../pages/Saved';
import Notifications from '../pages/Notifications';
import Messages from '../pages/Messages';
import Account from '../pages/Account';
import Login from '../pages/Login';
import AnnouncementDetail from '../pages/AnnouncementDetail';
import UserProfile from '../pages/UserProfile';
import Onboarding from '../pages/Onboarding';
import ProfileSetupPage from '../pages/ProfileSetupPage';

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: '/onboarding',
        element: <Onboarding />,
      },
      {
        path: '/profile-setup',
        element: <ProfileSetupPage />,
      },
      {
        path: '/',
        element: <MainLayout />,
        children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'saved',
        element: <Saved />,
      },
      {
        path: 'notifications',
        element: <Notifications />,
      },
      {
        path: 'messages',
        element: <Messages />,
      },
      {
        path: 'account',
        element: <Account />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'announcement/:id',
        element: <AnnouncementDetail />,
      },
      {
        path: 'profile/:id',
        element: <UserProfile />,
      },
        ],
      },
    ],
  },
]);
