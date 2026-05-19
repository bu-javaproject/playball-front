import { apiClient, unwrapApiResponse } from '@/shared/api/client';

import { getMockMyProfile, updateMockMyProfile } from './memberMockApi';
import type { MyProfile, ProfileEditRequest } from '../types/member';

export const shouldUseMemberMock = import.meta.env.VITE_USE_MOCK_MEMBER === 'true';

export function getMyProfile() {
  if (shouldUseMemberMock) {
    return getMockMyProfile();
  }

  return unwrapApiResponse<MyProfile>(apiClient.get('/api/members/me'));
}

export function updateMyProfile(payload: ProfileEditRequest) {
  if (shouldUseMemberMock) {
    return updateMockMyProfile(payload);
  }

  return unwrapApiResponse<MyProfile>(apiClient.patch('/api/members/me', payload));
}
