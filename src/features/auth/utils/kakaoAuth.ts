const KAKAO_AUTHORIZE_URL = 'https://kauth.kakao.com/oauth/authorize';

export function getKakaoRedirectUri() {
  return import.meta.env.VITE_KAKAO_REDIRECT_URI ?? `${window.location.origin}/oauth/kakao/callback`;
}

export function getKakaoAuthorizeUrl() {
  const restApiKey = import.meta.env.VITE_KAKAO_REST_API_KEY;

  if (!restApiKey) {
    throw new Error('VITE_KAKAO_REST_API_KEY 환경변수가 필요합니다.');
  }

  const params = new URLSearchParams({
    client_id: restApiKey,
    redirect_uri: getKakaoRedirectUri(),
    response_type: 'code',
  });

  return `${KAKAO_AUTHORIZE_URL}?${params.toString()}`;
}
