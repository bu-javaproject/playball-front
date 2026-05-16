import { Navigate, createBrowserRouter } from 'react-router-dom';

import { OAuthKakaoCallbackPage } from '@/features/auth/pages/OAuthKakaoCallbackPage';
import FriendsPage from '@/pages/FriendsPage';
import HomePage from '@/pages/HomePage';
import LocalMatchPage from '@/pages/LocalMatchPage';
import MatchingPage from '@/pages/MatchingPage';
import MatchCreatePage from '@/pages/MatchCreatePage';
import MatchDetailPage from '@/pages/MatchDetailPage';
import MatchEditPage from '@/pages/MatchEditPage';
import MyMatchesPage from '@/pages/MyMatchesPage';
import NotFoundPage from '@/pages/NotFoundPage';
import ProfilePage from '@/pages/ProfilePage';
import RandomMatchPage from '@/pages/RandomMatchPage';
import SignupCompletePage from '@/pages/SignupCompletePage';

import { AppLayout } from './layouts/AppLayout';
import { MapLayout } from './layouts/MapLayout';

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/oauth/kakao', element: <OAuthKakaoCallbackPage /> },
      { path: '/oauth/kakao/callback', element: <OAuthKakaoCallbackPage /> },
      { path: '/signup/complete', element: <SignupCompletePage /> },
      { path: '/matching', element: <MatchingPage /> },
      { path: '/random-match', element: <RandomMatchPage /> },
      { path: '/matches/new', element: <MatchCreatePage /> },
      { path: '/matches/my', element: <MyMatchesPage /> },
      { path: '/matches/:matchId', element: <MatchDetailPage /> },
      { path: '/matches/:matchId/edit', element: <MatchEditPage /> },
      { path: '/profile', element: <ProfilePage /> },
      { path: '/friends', element: <FriendsPage /> },
    ],
  },
  {
    element: <MapLayout />,
    children: [
      { path: '/local-match', element: <LocalMatchPage /> },
      { path: '/LocalMatch', element: <Navigate to="/local-match" replace /> },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]);
