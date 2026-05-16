import { apiClient, unwrapApiResponse } from '@/shared/api/client';

import {
  createMockCompliments,
  cancelMockMatch,
  getMockMatchHistory,
  getMockMatchDetail,
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
  MatchParticipantsResponse,
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

export function getMyMatches(params: MyMatchesParams = {}) {
  if (shouldUseMyMatchesMock) {
    return getMockMyMatches();
  }

  return unwrapApiResponse<MyMatchesResponse>(apiClient.get('/api/matches/my', { params }));
}

export function getMyMatchHistory(params: MyMatchHistoryParams = {}) {
  if (shouldUseMyMatchesMock) {
    return getMockMatchHistory();
  }

  return unwrapApiResponse<MatchHistoryResponse>(apiClient.get('/api/members/me/history', { params }));
}

export function getMatchParticipants(matchId: number) {
  if (shouldUseMyMatchesMock) {
    return getMockMatchParticipants(matchId);
  }

  return unwrapApiResponse<MatchParticipantsResponse>(apiClient.get(`/api/matches/${matchId}/participants`));
}

export function getMatchDetail(matchId: number) {
  if (shouldUseMyMatchesMock) {
    return getMockMatchDetail(matchId);
  }

  return unwrapApiResponse<MatchDetail>(apiClient.get(`/api/matches/${matchId}`));
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

  return unwrapApiResponse<null>(apiClient.delete(`/api/matches/${matchId}/leave`));
}
