import { ApiError } from '@/shared/api/errors';

import { mockMatches } from '../data/mockMatches';
import type {
  LocalMatch,
  LocalMatchSearchParams,
  LocalMatchSearchResult,
  MatchCreateRequest,
  MatchJoinRequest,
  MatchJoinResult,
} from '../types/match';

let mockLocalMatches: LocalMatch[] = [...mockMatches];
let nextMatchId = Math.max(...mockLocalMatches.map((match) => match.matchId)) + 1;
let nextParticipantId = 100;

function wait(ms = 250) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function getDistanceKm(from: { latitude: number; longitude: number }, to: { latitude: number; longitude: number }) {
  const earthRadiusKm = 6371;
  const latDelta = ((to.latitude - from.latitude) * Math.PI) / 180;
  const lngDelta = ((to.longitude - from.longitude) * Math.PI) / 180;
  const fromLat = (from.latitude * Math.PI) / 180;
  const toLat = (to.latitude * Math.PI) / 180;

  const a =
    Math.sin(latDelta / 2) * Math.sin(latDelta / 2) +
    Math.cos(fromLat) * Math.cos(toLat) * Math.sin(lngDelta / 2) * Math.sin(lngDelta / 2);

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function applyFilters(matches: LocalMatch[], params: LocalMatchSearchParams) {
  const radius = params.radius ?? 5;

  return matches
    .filter((match) => match.status !== 'CANCELLED')
    .map((match) => ({
      ...match,
      distance: Number(
        getDistanceKm(params, { latitude: match.latitude, longitude: match.longitude }).toFixed(1),
      ),
    }))
    .filter((match) => match.distance === undefined || match.distance <= radius)
    .filter((match) => !params.sportType || match.sportType === params.sportType)
    .sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0));
}

export async function getMockLocalMatches(params: LocalMatchSearchParams): Promise<LocalMatchSearchResult> {
  await wait();

  const page = params.page ?? 0;
  const size = params.size ?? 20;
  const filteredMatches = applyFilters(mockLocalMatches, params);
  const start = page * size;

  return {
    totalCount: filteredMatches.length,
    matches: filteredMatches.slice(start, start + size),
  };
}

export async function getMockMatchDetail(matchId: number): Promise<LocalMatch> {
  await wait(150);

  const match = mockLocalMatches.find((item) => item.matchId === matchId);

  if (!match) {
    throw new ApiError('존재하지 않는 경기입니다', 404, null);
  }

  return match;
}

export async function createMockMatch(payload: MatchCreateRequest): Promise<LocalMatch> {
  await wait(300);

  const createdMatch: LocalMatch = {
    matchId: nextMatchId,
    title: payload.title,
    sportType: payload.sportType,
    matchDate: payload.matchDate,
    locationName: payload.locationName ?? payload.address ?? '선택한 위치',
    latitude: payload.latitude,
    longitude: payload.longitude,
    maxPlayers: payload.maxPlayers,
    currentPlayers: 1,
    skillLevel: payload.skillLevel ?? 'BEGINNER',
    entryFee: payload.entryFee ?? 0,
    status: 'OPEN',
    address: payload.address,
    description: payload.description,
    creatorId: 1,
    creatorNickname: '나',
    rating: 0,
    createdAt: new Date().toISOString(),
  };

  nextMatchId += 1;
  mockLocalMatches = [...mockLocalMatches, createdMatch];

  return createdMatch;
}

export async function joinMockMatch(matchId: number, payload: MatchJoinRequest = {}): Promise<MatchJoinResult> {
  void payload;
  await wait(250);

  const match = mockLocalMatches.find((item) => item.matchId === matchId);

  if (!match) {
    throw new ApiError('존재하지 않는 경기입니다', 404, null);
  }

  if (match.currentPlayers >= match.maxPlayers || match.status !== 'OPEN') {
    throw new ApiError('경기 인원이 꽉 찼습니다', 409, null);
  }

  mockLocalMatches = mockLocalMatches.map((item) =>
    item.matchId === matchId
      ? {
          ...item,
          currentPlayers: item.currentPlayers + 1,
          status: item.currentPlayers + 1 >= item.maxPlayers ? 'CLOSED' : item.status,
        }
      : item,
  );

  nextParticipantId += 1;

  return {
    participantId: nextParticipantId,
    matchId: match.matchId,
    matchTitle: match.title,
    matchDate: match.matchDate,
    locationName: match.locationName,
    status: 'APPROVED',
  };
}

export async function leaveMockMatch(matchId: number): Promise<null> {
  await wait(250);

  const match = mockLocalMatches.find((item) => item.matchId === matchId);

  if (!match) {
    throw new ApiError('존재하지 않는 경기입니다', 404, null);
  }

  mockLocalMatches = mockLocalMatches.map((item) =>
    item.matchId === matchId
      ? {
          ...item,
          currentPlayers: Math.max(0, item.currentPlayers - 1),
          status: item.status === 'CLOSED' ? 'OPEN' : item.status,
        }
      : item,
  );

  return null;
}

export async function cancelMockMatch(matchId: number): Promise<null> {
  await wait(250);

  const match = mockLocalMatches.find((item) => item.matchId === matchId);

  if (!match) {
    throw new ApiError('존재하지 않는 경기입니다', 404, null);
  }

  mockLocalMatches = mockLocalMatches.filter((item) => item.matchId !== matchId);

  return null;
}



