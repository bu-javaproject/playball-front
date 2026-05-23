import { apiClient, unwrapApiResponse } from '@/shared/api/client';

import {
  cancelMockMatch,
  createMockCompliments,
  getMockMatchDetail,
  getMockMatchHistory,
  getMockMatchParticipants,
  getMockMemberProfile,
  getMockMyMatches,
  leaveMockMatch,
} from './myMatchesMockApi';
import type {
  ComplimentBulkRequest,
  ComplimentBulkResult,
  MatchDetail,
  MatchHistoryResponse,
  MatchParticipant,
  MatchParticipantsResponse,
  MatchStatus,
  MyMatchRole,
  MyMatchesResponse,
  PublicMemberProfile,
} from '../types/myMatch';

export const shouldUseMyMatchesMock = import.meta.env.VITE_USE_MOCK_MY_MATCHES !== 'false';

export interface MyMatchesParams {
  role?: MyMatchRole;
  status?: string;
  page?: number;
  size?: number;
}

export interface MyMatchHistoryParams {
  page?: number;
  size?: number;
}

type BackendMatchStatus = 'OPEN' | 'CLOSED' | 'COMPLETED' | 'DELETED' | string;

type BackendMyProfile = {
  memberId: number;
};

type BackendJoinedMember = {
  memberId: number;
  nickname: string;
  profileImage: string | null;
  gender?: PublicMemberProfile['gender'];
  age?: number;
  skillLevel?: PublicMemberProfile['skillLevel'];
  preferredPosition?: string | null;
};

type BackendMatch = {
  id?: number;
  matchId?: number;
  title: string;
  sportType: MatchDetail['sportType'];
  matchDate: string;
  locationName?: string | null;
  latitude?: number;
  longitude?: number;
  address?: string | null;
  maxPlayers: number;
  currentPlayers: number;
  gender?: PublicMemberProfile['gender'] | null;
  ageRange?: number | null;
  skillLevel?: PublicMemberProfile['skillLevel'] | null;
  entryFee?: number | null;
  description?: string | null;
  status: BackendMatchStatus;
  createdAt?: string;
  updatedAt?: string;
  creatorId?: number;
  hostId?: number;
  creatorNickname?: string;
  hostNickname?: string;
  hostName?: string;
};

type BackendMatchDetailResponse =
  | BackendMatch
  | {
      match: BackendMatch;
      joinedMembers?: BackendJoinedMember[];
    };

type BackendMyMatchesResponse =
  | BackendMatch[]
  | {
      content?: BackendMatch[];
      totalElements?: number;
      hasNext?: boolean;
    };

function normalizeStatus(status: BackendMatchStatus): MatchStatus {
  if (status === 'OPEN') return 'OPEN';
  if (status === 'CLOSED') return 'CLOSED';
  if (status === 'COMPLETED') return 'COMPLETED';
  if (status === 'DELETED') return 'DELETED';
  if (status === 'FULL') return 'CLOSED';
  if (status === 'CANCELLED') return 'DELETED';
  return 'OPEN';
}

function getMatchId(match: BackendMatch) {
  return match.matchId ?? match.id ?? 0;
}

function getCreatorId(match: BackendMatch) {
  return match.hostId ?? match.creatorId ?? 0;
}

function getCreatorName(match: BackendMatch) {
  return match.hostName ?? match.hostNickname ?? match.creatorNickname ?? '주최자';
}

function getLocationName(match: BackendMatch) {
  return match.locationName ?? match.address ?? '장소 미정';
}

function getBackendMyMatches(data: BackendMyMatchesResponse) {
  if (Array.isArray(data)) {
    return {
      content: data,
      totalElements: data.length,
      hasNext: false,
    };
  }

  return {
    content: data.content ?? [],
    totalElements: data.totalElements ?? data.content?.length ?? 0,
    hasNext: data.hasNext ?? false,
  };
}

function getBackendDetail(data: BackendMatchDetailResponse) {
  if ('match' in data) {
    return {
      match: data.match,
      joinedMembers: data.joinedMembers ?? [],
    };
  }

  return { match: data, joinedMembers: [] };
}

function isCreator(match: BackendMatch, myMemberId?: number) {
  return Boolean(myMemberId && getCreatorId(match) === myMemberId);
}

function toSummary(match: BackendMatch, myMemberId?: number) {
  return {
    matchId: getMatchId(match),
    title: match.title,
    sportType: match.sportType,
    matchDate: match.matchDate,
    locationName: getLocationName(match),
    maxPlayers: match.maxPlayers,
    currentPlayers: match.currentPlayers,
    status: normalizeStatus(match.status),
    isCreator: isCreator(match, myMemberId),
    rating: 0,
    playerPreview: [],
  };
}

function toDetail(match: BackendMatch, joinedMembers: BackendJoinedMember[] = []): MatchDetail {
  return {
    matchId: getMatchId(match),
    creatorId: getCreatorId(match),
    creatorNickname: getCreatorName(match),
    title: match.title,
    sportType: match.sportType,
    matchDate: match.matchDate,
    locationName: getLocationName(match),
    latitude: match.latitude ?? 0,
    longitude: match.longitude ?? 0,
    address: match.address ?? undefined,
    maxPlayers: match.maxPlayers,
    currentPlayers: match.currentPlayers,
    skillLevel: match.skillLevel ?? undefined,
    entryFee: match.entryFee ?? 0,
    description: match.description ?? undefined,
    status: normalizeStatus(match.status),
    participants: joinedMembers.map((member) => ({
      memberId: member.memberId,
      nickname: member.nickname,
      profileImage: member.profileImage,
    })),
    rating: 0,
    createdAt: match.createdAt,
  };
}

function toParticipant(member: BackendJoinedMember): MatchParticipant {
  return {
    participantId: member.memberId,
    memberId: member.memberId,
    nickname: member.nickname,
    profileImage: member.profileImage,
    status: 'APPROVED',
  };
}

async function fetchMyProfileFromApi() {
  return unwrapApiResponse<BackendMyProfile>(apiClient.get('/api/members/me'));
}

async function fetchMyMatchesFromApi() {
  const data = await unwrapApiResponse<BackendMyMatchesResponse>(apiClient.get('/api/members/me/matches'));
  return getBackendMyMatches(data);
}

async function fetchMatchDetailFromApi(matchId: number) {
  const data = await unwrapApiResponse<BackendMatchDetailResponse>(apiClient.get(`/api/matches/${matchId}`));
  return getBackendDetail(data);
}

function isPastMatch(match: Pick<BackendMatch, 'matchDate'>) {
  const time = new Date(match.matchDate).getTime();
  return Number.isNaN(time) ? false : time < Date.now();
}

export async function getMyMatches(params: MyMatchesParams = {}): Promise<MyMatchesResponse> {
  void params;

  if (shouldUseMyMatchesMock) {
    return getMockMyMatches();
  }

  const [data, profile] = await Promise.all([fetchMyMatchesFromApi(), fetchMyProfileFromApi()]);
  const content = data.content
    .filter((match) => normalizeStatus(match.status) !== 'DELETED')
    .filter((match) => !isPastMatch(match))
    .map((match) => toSummary(match, profile.memberId));

  return {
    content,
    totalElements: content.length,
    hasNext: false,
  };
}

export async function getMyMatchHistory(params: MyMatchHistoryParams = {}): Promise<MatchHistoryResponse> {
  void params;

  if (shouldUseMyMatchesMock) {
    return getMockMatchHistory();
  }

  const [data, profile] = await Promise.all([fetchMyMatchesFromApi(), fetchMyProfileFromApi()]);
  const content = data.content
    .filter((match) => normalizeStatus(match.status) !== 'DELETED')
    .filter(isPastMatch)
    .map((match) => ({
      matchId: getMatchId(match),
      title: match.title,
      sportType: match.sportType,
      matchDate: match.matchDate,
      locationName: getLocationName(match),
      result: normalizeStatus(match.status),
      myRole: isCreator(match, profile.memberId) ? ('CREATOR' as const) : ('PLAYER' as const),
      rated: false,
    }));

  return {
    content,
    totalElements: content.length,
    totalPages: 1,
    hasNext: false,
  };
}

export async function getMatchParticipants(matchId: number): Promise<MatchParticipantsResponse> {
  if (shouldUseMyMatchesMock) {
    return getMockMatchParticipants(matchId);
  }

  const detail = await fetchMatchDetailFromApi(matchId);

  return {
    matchId: getMatchId(detail.match),
    title: detail.match.title,
    matchDate: detail.match.matchDate,
    maxPlayers: detail.match.maxPlayers,
    currentPlayers: detail.match.currentPlayers,
    participants: detail.joinedMembers.map(toParticipant),
    waitingList: [],
  };
}

export async function getMatchDetail(matchId: number): Promise<MatchDetail> {
  if (shouldUseMyMatchesMock) {
    return getMockMatchDetail(matchId);
  }

  const detail = await fetchMatchDetailFromApi(matchId);
  return toDetail(detail.match, detail.joinedMembers);
}

export function getMemberProfile(memberId: number) {
  if (shouldUseMyMatchesMock) {
    return getMockMemberProfile(memberId);
  }

  return unwrapApiResponse<PublicMemberProfile>(apiClient.get(`/api/members/${memberId}`));
}

export function createMatchCompliments(matchId: number, payload: ComplimentBulkRequest) {
  if (shouldUseMyMatchesMock) {
    return createMockCompliments(payload);
  }

  return unwrapApiResponse<ComplimentBulkResult>(apiClient.post(`/api/matches/${matchId}/compliments`, payload));
}

export function cancelMatch(matchId: number) {
  if (shouldUseMyMatchesMock) {
    return cancelMockMatch();
  }

  return unwrapApiResponse<null>(apiClient.delete(`/api/matches/${matchId}`));
}

export function leaveMatch(matchId: number) {
  if (shouldUseMyMatchesMock) {
    return leaveMockMatch();
  }

  return unwrapApiResponse<null>(apiClient.delete(`/api/matches/${matchId}/join`));
}
