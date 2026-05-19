import type {
  ComplimentBulkRequest,
  ComplimentBulkResult,
  MatchDetail,
  MatchHistoryResponse,
  MatchParticipantsResponse,
  MyMatchesResponse,
  PublicMemberProfile,
} from '../types/myMatch';

const now = new Date();
const tomorrow = new Date(now);
tomorrow.setDate(now.getDate() + 1);
tomorrow.setHours(19, 0, 0, 0);

const nextGame = new Date(now);
nextGame.setDate(now.getDate() + 2);
nextGame.setHours(20, 0, 0, 0);

const lastMonth = new Date(now);
lastMonth.setMonth(now.getMonth() - 1);
lastMonth.setHours(18, 30, 0, 0);

const twoMonthsAgo = new Date(now);
twoMonthsAgo.setMonth(now.getMonth() - 2);
twoMonthsAgo.setHours(20, 0, 0, 0);

export async function getMockMyMatches(): Promise<MyMatchesResponse> {
  return {
    content: [
      {
        matchId: 101,
        title: '백석대 풋살 저녁 매치',
        sportType: 'SOCCER',
        matchDate: tomorrow.toISOString(),
        locationName: '백석대 풋살장',
        maxPlayers: 10,
        currentPlayers: 7,
        status: 'OPEN',
        isCreator: true,
        rating: 4,
        playerPreview: [
          { nickname: '박', profileImage: null },
          { nickname: '이', profileImage: null },
          { nickname: '손', profileImage: null },
        ],
      },
      {
        matchId: 102,
        title: '천안 중앙공원 농구',
        sportType: 'BASKETBALL',
        matchDate: nextGame.toISOString(),
        locationName: '천안 중앙공원',
        maxPlayers: 6,
        currentPlayers: 5,
        status: 'FULL',
        isCreator: false,
        rating: 0,
        playerPreview: [
          { nickname: '김', profileImage: null },
          { nickname: '정', profileImage: null },
        ],
      },
    ],
    totalElements: 2,
    hasNext: false,
  };
}

export async function getMockMatchHistory(): Promise<MatchHistoryResponse> {
  return {
    content: [
      {
        matchId: 91,
        title: '한강 풋살 경기',
        sportType: 'SOCCER',
        matchDate: lastMonth.toISOString(),
        locationName: '한강 풋살장',
        result: 'COMPLETED',
        myRole: 'PLAYER',
        rated: false,
      },
      {
        matchId: 88,
        title: '강남 3대3 농구',
        sportType: 'BASKETBALL',
        matchDate: twoMonthsAgo.toISOString(),
        locationName: '강남 실내체육관',
        result: 'COMPLETED',
        myRole: 'PLAYER',
        rated: true,
      },
    ],
    totalElements: 2,
    totalPages: 1,
    hasNext: false,
  };
}

export async function getMockMatchParticipants(matchId: number): Promise<MatchParticipantsResponse> {
  const title = matchId === 102 ? '천안 중앙공원 농구' : matchId === 91 ? '한강 풋살 경기' : '백석대 풋살 저녁 매치';

  return {
    matchId,
    title,
    matchDate: matchId === 91 || matchId === 88 ? lastMonth.toISOString() : tomorrow.toISOString(),
    maxPlayers: matchId === 102 ? 6 : 10,
    currentPlayers: matchId === 102 ? 5 : 7,
    participants: [
      { participantId: 1, memberId: 201, nickname: '박지성', profileImage: null, status: 'APPROVED' },
      { participantId: 2, memberId: 202, nickname: '이강인', profileImage: null, status: 'APPROVED' },
      { participantId: 3, memberId: 203, nickname: '손흥민', profileImage: null, status: 'APPROVED' },
      { participantId: 4, memberId: 204, nickname: '황희찬', profileImage: null, status: 'APPROVED' },
    ],
    waitingList:
      matchId === 101
        ? [
            { participantId: 8, memberId: 208, nickname: '김민재', profileImage: null, status: 'PENDING' },
            { participantId: 9, memberId: 209, nickname: '정우영', profileImage: null, status: 'PENDING' },
          ]
        : [],
  };
}

export async function getMockMatchDetail(matchId: number): Promise<MatchDetail> {
  const participants = await getMockMatchParticipants(matchId);
  const isBasketball = matchId === 102 || matchId === 88;

  return {
    matchId,
    creatorId: 1,
    creatorNickname: matchId === 102 ? '김철수' : '홍길동',
    title: participants.title,
    sportType: isBasketball ? 'BASKETBALL' : 'SOCCER',
    matchDate: participants.matchDate,
    locationName: isBasketball ? '천안 중앙공원' : '백석대 풋살장',
    latitude: 36.8151,
    longitude: 127.1139,
    address: isBasketball ? '충남 천안시 동남구 중앙공원' : '충남 천안시 동남구 백석대학로 1',
    maxPlayers: participants.maxPlayers,
    currentPlayers: participants.currentPlayers,
    skillLevel: 'INTERMEDIATE',
    entryFee: isBasketball ? 3000 : 0,
    description: isBasketball ? '가볍게 뛰는 3대3 경기입니다. 물은 각자 준비해주세요.' : '초보 환영, 풋살화 지참. 늦지 않게 와주세요.',
    status: matchId === 91 || matchId === 88 ? 'COMPLETED' : matchId === 102 ? 'FULL' : 'OPEN',
    participants: participants.participants.map((participant) => ({
      memberId: participant.memberId,
      nickname: participant.nickname,
      profileImage: participant.profileImage,
    })),
    rating: 0,
    createdAt: now.toISOString(),
  };
}

export async function getMockMemberProfile(memberId: number): Promise<PublicMemberProfile> {
  const names: Record<number, string> = {
    201: '박지성',
    202: '이강인',
    203: '손흥민',
    204: '황희찬',
    208: '김민재',
    209: '정우영',
  };

  return {
    memberId,
    nickname: names[memberId] ?? '플레이어',
    profileImage: null,
    gender: 'M',
    age: 27,
    address: '천안',
    favoriteSports: ['SOCCER'],
    skillLevel: 'INTERMEDIATE',
    recommendCount: 14,
  };
}

export async function createMockCompliments(payload: ComplimentBulkRequest): Promise<ComplimentBulkResult> {
  return { created: payload.compliments.length };
}

export async function cancelMockMatch(): Promise<null> {
  return null;
}

export async function leaveMockMatch(): Promise<null> {
  return null;
}
