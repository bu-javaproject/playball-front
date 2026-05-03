export interface AuthMember {
  memberId: number;
  nickname: string | null;
  profileImage: string | null;
  role: 'USER' | 'ADMIN';
}

export interface KakaoLoginRequest {
  authorizationCode: string;
  redirectUri?: string;
}

export interface KakaoLoginResult {
  accessToken: string;
  refreshToken: string;
  tokenType: 'Bearer';
  isNewUser: boolean;
  member: AuthMember;
}
