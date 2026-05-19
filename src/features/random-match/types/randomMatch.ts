export type SportType = 'SOCCER' | 'BASKETBALL' | 'RUNNING' | 'BADMINTON';
export type Gender = 'M' | 'F';
export type RandomMatchStatus = 'FORM' | 'SEARCHING' | 'FOUND' | 'SUCCESS' | 'FAIL';
export type RandomSkillLevel = 1 | 2 | 3 | 4 | 5;

export interface RandomMatchRequest {
  latitude: number;
  longitude: number;
  radius?: number;
  address: string;
  date: string;
  sportType: SportType;
  preferredPosition: string;
  gender: Gender;
  ageRange: number;
  skillLevel: RandomSkillLevel;
  maxFee: number;
}

export interface RandomMatchedGame {
  matchId: number;
  title: string;
  sportType: SportType;
  matchDate: string;
  locationName: string;
  latitude?: number;
  longitude?: number;
  entryFee?: number;
  maxPlayers: number;
  currentPlayers: number;
  distance: number;
  creatorNickname?: string;
}

export type RandomMatchResponse = RandomMatchedGame;

export interface RandomMatchAcceptResult {
  matchId: number;
  currentPlayers: number;
  maxPlayers: number;
  status: 'PENDING' | 'JOINED' | 'APPROVED';
}
