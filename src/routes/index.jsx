import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';

// Pages
import Home from '../pages/Home';
import Saved from '../pages/Saved';
import Notifications from '../pages/Notifications';
import Messages from '../pages/Messages';
import Account from '../pages/Account';

export const router = createBrowserRouter([
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
    ],
  },
]);
