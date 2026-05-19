export type SportType = 'SOCCER' | 'BASKETBALL' | 'RUNNING' | 'BADMINTON';

export type SkillLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export type MatchStatus = 'OPEN' | 'CLOSED' | 'DELETED' | 'FULL' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface LocalMatch {
  matchId: number;
  title: string;
  sportType: SportType;
  matchDate: string;
  locationName: string;
  latitude: number;
  longitude: number;
  maxPlayers: number;
  currentPlayers: number;
  skillLevel: SkillLevel;
  entryFee: number;
  distance?: number;
  status: MatchStatus;
  address?: string;
  description?: string;
  creatorId?: number;
  creatorNickname?: string;
  rating?: number;
  createdAt?: string;
  participants?: MatchParticipantPreview[];
}

export interface MatchParticipantPreview {
  memberId: number;
  nickname: string;
  profileImage: string | null;
}

export interface MapCenter {
  latitude: number;
  longitude: number;
}

export interface LocalMatchFilters {
  sportType?: SportType;
}

export interface LocalMatchSearchParams extends MapCenter, LocalMatchFilters {
  radius?: number;
  page?: number;
  size?: number;
}

export interface LocalMatchSearchResult {
  totalCount: number;
  matches: LocalMatch[];
}

export interface MatchCreateRequest {
  title: string;
  sportType: SportType;
  matchDate: string;
  locationName?: string;
  latitude: number;
  longitude: number;
  address?: string;
  maxPlayers: number;
  skillLevel?: SkillLevel;
  entryFee?: number;
  description?: string;
}

export interface MatchJoinRequest {
  position?: string;
}

export interface MatchJoinResult {
  participantId: number;
  matchId: number;
  matchTitle: string;
  matchDate: string;
  locationName: string;
  status: 'APPROVED';
}
