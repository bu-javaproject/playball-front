import { apiClient, unwrapApiResponse } from '@/shared/api/client';
import type { KakaoLoginRequest, KakaoLoginResult } from '../types/auth';

export function loginWithKakao(payload: KakaoLoginRequest) {
  return unwrapApiResponse<KakaoLoginResult>(
    apiClient.post('/api/auth/kakao', {
      authorizationCode: payload.authorizationCode,
      redirectUri: payload.redirectUri,
    }),
  );
}

export function logout() {
  return unwrapApiResponse<null>(apiClient.post('/api/auth/logout'));
}
