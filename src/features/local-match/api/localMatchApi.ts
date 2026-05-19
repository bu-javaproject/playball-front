import { apiClient, unwrapApiResponse } from '@/shared/api/client';

import {
  cancelMockMatch,
  createMockMatch,
  getMockLocalMatches,
  getMockMatchDetail,
  joinMockMatch,
  leaveMockMatch,
} from './localMatchMockApi';
import type {
  LocalMatch,
  LocalMatchSearchParams,
  LocalMatchSearchResult,
  MatchCreateRequest,
  MatchJoinRequest,
  MatchJoinResult,
  MatchParticipantPreview,
  MatchStatus,
  SkillLevel,
  SportType,
} from '../types/match';

export const shouldUseLocalMatchMock = import.meta.env.VITE_USE_MOCK_LOCAL_MATCH !== 'false';

type BackendMatchStatus = 'OPEN' | 'CLOSED' | 'DELETED' | string;

type BackendJoinedMember = {
  memberId: number;
  nickname: string;
  profileImage: string | null;
};

type BackendMatch = {
  id?: number;
  matchId?: number;
  hostId?: number;
  creatorId?: number;
  hostNickname?: string;
  creatorNickname?: string;
  title: string;
  sportType: SportType;
  matchDate: string;
  locationName?: string | null;
  latitude?: number;
  longitude?: number;
  address?: string | null;
  maxPlayers: number;
  currentPlayers: number;
  skillLevel?: SkillLevel | null;
  entryFee?: number | null;
  description?: string | null;
  distance?: number;
  status: BackendMatchStatus;
  createdAt?: string;
  updatedAt?: string;
};

type BackendMatchListResponse = BackendMatch[] | {
  content?: BackendMatch[];
  matches?: BackendMatch[];
  totalElements?: number;
  totalCount?: number;
};

type BackendMatchDetailResponse = BackendMatch | {
  match: BackendMatch;
  joinedMembers?: BackendJoinedMember[];
};

type BackendJoinResult = {
  matchId: number;
  currentPlayers: number;
  maxPlayers: number;
  status: BackendMatchStatus;
};

function normalizeStatus(status: BackendMatchStatus): MatchStatus {
  if (status === 'CLOSED') return 'CLOSED';
  if (status === 'DELETED') return 'DELETED';
  if (status === 'OPEN') return 'OPEN';
  if (status === 'FULL') return 'CLOSED';
  if (status === 'CANCELLED') return 'DELETED';
  return 'OPEN';
}

function toParticipantPreview(member: BackendJoinedMember): MatchParticipantPreview {
  return {
    memberId: member.memberId,
    nickname: member.nickname,
    profileImage: member.profileImage,
  };
}

function toLocalMatch(match: BackendMatch, joinedMembers: BackendJoinedMember[] = []): LocalMatch {
  return {
    matchId: match.matchId ?? match.id ?? 0,
    title: match.title,
    sportType: match.sportType,
    matchDate: match.matchDate,
    locationName: match.locationName ?? match.address ?? '선택한 위치',
    latitude: match.latitude ?? 0,
    longitude: match.longitude ?? 0,
    maxPlayers: match.maxPlayers,
    currentPlayers: match.currentPlayers,
    skillLevel: match.skillLevel ?? 'BEGINNER',
    entryFee: match.entryFee ?? 0,
    distance: match.distance,
    status: normalizeStatus(match.status),
    address: match.address ?? undefined,
    description: match.description ?? undefined,
    creatorId: match.creatorId ?? match.hostId,
    creatorNickname: match.creatorNickname ?? match.hostNickname,
    createdAt: match.createdAt,
    participants: joinedMembers.map(toParticipantPreview),
  };
}

function getBackendList(data: BackendMatchListResponse) {
  if (Array.isArray(data)) {
    return { totalCount: data.length, matches: data };
  }

  const matches = data.matches ?? data.content ?? [];
  return {
    totalCount: data.totalCount ?? data.totalElements ?? matches.length,
    matches,
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

function toBackendSearchParams(params: LocalMatchSearchParams) {
  return {
    latitude: params.latitude,
    longitude: params.longitude,
    radius: params.radius,
    sportType: params.sportType,
    page: params.page,
    size: params.size,
  };
}

export async function getLocalMatches(params: LocalMatchSearchParams): Promise<LocalMatchSearchResult> {
  if (shouldUseLocalMatchMock) {
    return getMockLocalMatches(params);
  }

  const data = await unwrapApiResponse<BackendMatchListResponse>(apiClient.get('/api/matches', { params: toBackendSearchParams(params) }));
  const list = getBackendList(data);
  const matches = list.matches.map((match) => toLocalMatch(match)).filter((match) => match.status !== 'DELETED');

  return {
    totalCount: matches.length,
    matches,
  };
}

export async function getMatchDetail(matchId: number): Promise<LocalMatch> {
  if (shouldUseLocalMatchMock) {
    return getMockMatchDetail(matchId);
  }

  const data = await unwrapApiResponse<BackendMatchDetailResponse>(apiClient.get(`/api/matches/${matchId}`));
  const detail = getBackendDetail(data);

  return toLocalMatch(detail.match, detail.joinedMembers);
}

export async function createMatch(payload: MatchCreateRequest): Promise<LocalMatch> {
  if (shouldUseLocalMatchMock) {
    return createMockMatch(payload);
  }

  const data = await unwrapApiResponse<BackendMatch>(apiClient.post('/api/matches', payload));
  return toLocalMatch(data);
}

export async function joinMatch(matchId: number, payload: MatchJoinRequest = {}): Promise<MatchJoinResult> {
  if (shouldUseLocalMatchMock) {
    return joinMockMatch(matchId, payload);
  }

  const data = await unwrapApiResponse<BackendJoinResult>(apiClient.post(`/api/matches/${matchId}/join`, payload));

  return {
    participantId: 0,
    matchId: data.matchId ?? matchId,
    matchTitle: '',
    matchDate: '',
    locationName: '',
    status: 'APPROVED',
  };
}

export function leaveMatch(matchId: number) {
  if (shouldUseLocalMatchMock) {
    return leaveMockMatch(matchId);
  }

  return unwrapApiResponse<null>(apiClient.delete(`/api/matches/${matchId}/join`));
}

export function cancelMatch(matchId: number) {
  if (shouldUseLocalMatchMock) {
    return cancelMockMatch(matchId);
  }

  return unwrapApiResponse<null>(apiClient.delete(`/api/matches/${matchId}`));
}
