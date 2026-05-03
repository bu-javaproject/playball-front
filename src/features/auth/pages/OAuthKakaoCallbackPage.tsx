import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/app/providers/AuthContext';

import { loginWithKakao } from '../api/authApi';

export function OAuthKakaoCallbackPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const authorizationCode = params.get('code');

    if (!authorizationCode) {
      navigate('/', { replace: true });
      return;
    }

    loginWithKakao({ authorizationCode, redirectUri: `${window.location.origin}/oauth/kakao` })
      .then((result) => {
        login({ accessToken: result.accessToken, refreshToken: result.refreshToken });
        navigate(result.isNewUser ? '/signup/complete' : '/', { replace: true });
      })
      .catch(() => {
        navigate('/', { replace: true });
      });
  }, [login, navigate]);

  return <div className="flex min-h-screen items-center justify-center font-bold">카카오 로그인을 처리하고 있습니다.</div>;
}
