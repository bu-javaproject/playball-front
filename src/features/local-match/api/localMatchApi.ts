import { apiClient, unwrapApiResponse } from '@/shared/api/client';

import {
  createMockMatch,
  getMockLocalMatches,
  getMockMatchDetail,
  joinMockMatch,
} from './localMatchMockApi';
import type {
  LocalMatch,
  LocalMatchSearchParams,
  LocalMatchSearchResult,
  MatchCreateRequest,
  MatchJoinRequest,
  MatchJoinResult,
} from '../types/match';

export const shouldUseLocalMatchMock = import.meta.env.VITE_USE_MOCK_LOCAL_MATCH !== 'false';

export function getLocalMatches(params: LocalMatchSearchParams) {
  if (shouldUseLocalMatchMock) {
    return getMockLocalMatches(params);
  }

  return unwrapApiResponse<LocalMatchSearchResult>(apiClient.get('/api/matching/local', { params }));
}

export function getMatchDetail(matchId: number) {
  if (shouldUseLocalMatchMock) {
    return getMockMatchDetail(matchId);
  }

  return unwrapApiResponse<LocalMatch>(apiClient.get(`/api/matches/${matchId}`));
}

export function createMatch(payload: MatchCreateRequest) {
  if (shouldUseLocalMatchMock) {
    return createMockMatch(payload);
  }

  return unwrapApiResponse<LocalMatch>(apiClient.post('/api/matches', payload));
}

export function joinMatch(matchId: number, payload: MatchJoinRequest = {}) {
  if (shouldUseLocalMatchMock) {
    return joinMockMatch(matchId, payload);
  }

  return unwrapApiResponse<MatchJoinResult>(apiClient.post(`/api/matches/${matchId}/join`, payload));
}
