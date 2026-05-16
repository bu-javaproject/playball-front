import type { MyProfile, ProfileEditRequest } from '../types/member';

export let mockMyProfile: MyProfile = {
  memberId: 1,
  nickname: '홍길동',
  profileImage: null,
  gender: 'M',
  age: 22,
  address: '신부동',
  grade: '중급',
  memberSince: '3개월',
  favoriteSports: ['SOCCER', 'BASKETBALL', 'RUNNING'],
  skillLevel: 'INTERMEDIATE',
  preferredPosition: 'ST',
  recommendCount: 56,
  stats: {
    participationCount: 34,
    hostCount: 5,
    attendanceRate: 93,
  },
  createdAt: '2026-01-26T10:00:00',
};

export async function getMockMyProfile() {
  await new Promise((resolve) => {
    window.setTimeout(resolve, 250);
  });

  return mockMyProfile;
}

export async function updateMockMyProfile(payload: ProfileEditRequest) {
  await new Promise((resolve) => {
    window.setTimeout(resolve, 250);
  });

  mockMyProfile = {
    ...mockMyProfile,
    ...payload,
    profileImage: payload.profileImage ?? mockMyProfile.profileImage,
    favoriteSports: payload.favoriteSports ?? mockMyProfile.favoriteSports,
  };

  return mockMyProfile;
}
