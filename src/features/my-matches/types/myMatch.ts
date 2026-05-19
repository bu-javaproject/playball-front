import type { Gender, SkillLevel } from '@/features/members/types/member';

export type SportType = 'SOCCER' | 'BASKETBALL' | 'RUNNING' | 'BADMINTON';
export type MatchStatus = 'OPEN' | 'CLOSED' | 'DELETED' | 'FULL' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type MyMatchRole = 'CREATOR' | 'PARTICIPANT';
export type ParticipantStatus = 'JOINED' | 'PENDING';
export type ComplimentTag = 'MANNERS' | 'SKILL' | 'PUNCTUAL' | 'PASSIONATE' | 'MOOD_MAKER';

export interface MatchPlayerPreview {
  nickname: string;
  profileImage: string | null;
}

export interface MyMatchSummary {
  matchId: number;
  title: string;
  sportType: SportType;
  matchDate: string;
  locationName: string;
  maxPlayers: number;
  currentPlayers: number;
  status: MatchStatus;
  isCreator?: boolean;
  rating?: number;
  playerPreview?: MatchPlayerPreview[];
}

export interface MyMatchesResponse {
  content: MyMatchSummary[];
  totalElements?: number;
  hasNext: boolean;
}

export interface MatchHistoryItem {
  matchId: number;
  title: string;
  sportType: SportType;
  matchDate: string;
  locationName: string;
  result: MatchStatus;
  myRole: 'PLAYER' | 'CREATOR';
  rated: boolean;
}

export interface MatchHistoryResponse {
  content: MatchHistoryItem[];
  totalElements?: number;
  totalPages?: number;
  hasNext: boolean;
}

export interface MatchParticipant {
  participantId: number;
  memberId: number;
  nickname: string;
  profileImage: string | null;
  status: ParticipantStatus;
}

export interface MatchParticipantsResponse {
  matchId: number;
  title: string;
  matchDate: string;
  maxPlayers: number;
  currentPlayers: number;
  participants: MatchParticipant[];
  waitingList: MatchParticipant[];
}

export interface MatchDetailParticipant {
  memberId: number;
  nickname: string;
  profileImage: string | null;
}

export interface MatchDetail {
  matchId: number;
  creatorId: number;
  creatorNickname: string;
  title: string;
  sportType: SportType;
  matchDate: string;
  locationName: string;
  latitude: number;
  longitude: number;
  address?: string;
  distance?: number;
  maxPlayers: number;
  currentPlayers: number;
  skillLevel?: SkillLevel;
  entryFee: number;
  description?: string;
  status: MatchStatus;
  participants?: MatchDetailParticipant[];
  rating?: number;
  createdAt?: string;
}

export interface PublicMemberProfile {
  memberId: number;
  nickname: string;
  profileImage: string | null;
  gender?: Gender;
  age?: number;
  address?: string;
  favoriteSports?: SportType[];
  skillLevel?: SkillLevel;
  recommendCount?: number;
}

export interface ComplimentSubmitItem {
  rateeId: number;
  tags: ComplimentTag[];
  comment?: string | null;
}

export interface ComplimentBulkRequest {
  compliments: ComplimentSubmitItem[];
}

export interface ComplimentBulkResult {
  created: number;
}
