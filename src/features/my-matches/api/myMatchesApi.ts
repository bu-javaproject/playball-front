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
  MatchDetailParticipant,
  MatchHistoryResponse,
  MatchParticipantsResponse,
  MatchStatus,
  MyMatchRole,
  MyMatchesResponse,
  MyMatchSummary,
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

interface BackendMatchSummary {
  matchId: number;
  title: string;
  sportType: MyMatchSummary['sportType'];
  matchDate: string;
  locationName: string;
  maxPlayers: number;
  currentPlayers: number;
  status: MatchStatus;
}

interface BackendMatchDetail {
  match: Omit<MatchDetail, 'creatorId' | 'creatorNickname' | 'participants'> & {
    gender?: string;
    ageRange?: number;
  };
  joinedMembers: Array<MatchDetailParticipant & {
    gender?: string;
    age?: number;
    skillLevel?: string;
    preferredPosition?: string;
  }>;
}

function toPagedMatches(matches: BackendMatchSummary[]): MyMatchesResponse {
  return {
    content: matches.map((match) => ({
      ...match,
      isCreator: false,
      playerPreview: [],
    })),
    totalElements: matches.length,
    hasNext: false,
  };
}

function toMatchDetail(response: BackendMatchDetail): MatchDetail {
  return {
    ...response.match,
    creatorId: 0,
    creatorNickname: '주최자',
    participants: response.joinedMembers,
  };
}

function toParticipants(response: BackendMatchDetail): MatchParticipantsResponse {
  return {
    matchId: response.match.matchId,
    title: response.match.title,
    matchDate: response.match.matchDate,
    maxPlayers: response.match.maxPlayers,
    currentPlayers: response.match.currentPlayers,
    participants: response.joinedMembers.map((member, index) => ({
      participantId: member.memberId ?? index,
      memberId: member.memberId,
      nickname: member.nickname,
      profileImage: member.profileImage,
      status: 'JOINED',
    })),
    waitingList: [],
  };
}

export function getMyMatches(_params: MyMatchesParams = {}) {
  if (shouldUseMyMatchesMock) {
    return getMockMyMatches();
  }

  return unwrapApiResponse<BackendMatchSummary[]>(apiClient.get('/api/members/me/matches')).then(toPagedMatches);
}

export function getMyMatchHistory(_params: MyMatchHistoryParams = {}) {
  if (shouldUseMyMatchesMock) {
    return getMockMatchHistory();
  }

  return unwrapApiResponse<BackendMatchSummary[]>(apiClient.get('/api/members/me/matches')).then((matches) => {
    const finishedMatches = matches.filter((match) => ['COMPLETED', 'CANCELLED', 'CLOSED'].includes(match.status));

    return {
      content: finishedMatches.map((match) => ({
        matchId: match.matchId,
        title: match.title,
        sportType: match.sportType,
        matchDate: match.matchDate,
        locationName: match.locationName,
        result: match.status,
        myRole: 'PLAYER',
        rated: false,
      })),
      totalElements: finishedMatches.length,
      totalPages: 1,
      hasNext: false,
    } satisfies MatchHistoryResponse;
  });
}

export function getMatchParticipants(matchId: number) {
  if (shouldUseMyMatchesMock) {
    return getMockMatchParticipants(matchId);
  }

  return unwrapApiResponse<BackendMatchDetail>(apiClient.get(`/api/matches/${matchId}`)).then(toParticipants);
}

export function getMatchDetail(matchId: number) {
  if (shouldUseMyMatchesMock) {
    return getMockMatchDetail(matchId);
  }

  return unwrapApiResponse<BackendMatchDetail>(apiClient.get(`/api/matches/${matchId}`)).then(toMatchDetail);
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
