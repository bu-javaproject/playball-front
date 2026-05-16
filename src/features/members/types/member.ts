export type Gender = 'M' | 'F';
export type SkillLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export interface MemberStats {
  participationCount: number;
  hostCount: number;
  attendanceRate: number;
}

export interface MyProfile {
  memberId: number;
  nickname: string;
  profileImage: string | null;
  gender?: Gender;
  age?: number;
  address?: string;
  grade?: string;
  memberSince?: string;
  favoriteSports: string[];
  skillLevel?: SkillLevel;
  preferredPosition?: string;
  recommendCount?: number;
  stats?: MemberStats;
  createdAt?: string;
}

export interface ProfileEditRequest {
  nickname?: string;
  profileImage?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  favoriteSports?: string[];
  skillLevel?: SkillLevel;
  preferredPosition?: string;
}
