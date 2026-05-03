import { apiClient, unwrapApiResponse } from '@/shared/api/client';
import type { KakaoLoginRequest, KakaoLoginResult } from '../types/auth';

export function loginWithKakao(payload: KakaoLoginRequest) {
  return unwrapApiResponse<KakaoLoginResult>(apiClient.post('/api/auth/kakao', payload));
}

export function logout() {
  return unwrapApiResponse<null>(apiClient.post('/api/auth/logout'));
}
