export type SportType = 'SOCCER' | 'BASKETBALL' | 'RUNNING' | 'BADMINTON';
export type Gender = 'M' | 'F';
export type RandomMatchStatus = 'FORM' | 'SEARCHING' | 'FOUND' | 'SUCCESS' | 'FAIL';
export type RandomSkillLevel = 1 | 2 | 3 | 4 | 5;

export type RandomMatchRequest = {
  latitude: number;
  longitude: number;
  address: string;
  date: string;
  sportType: SportType;
  preferredPosition: string;
  gender: Gender;
  ageRange: number;
  skillLevel: RandomSkillLevel;
  maxFee: number;
};

export type RandomMatchedGame = {
  matchId: number;
  title: string;
  sportType: SportType;
  matchDate: string;
  locationName: string;
  latitude: number;
  longitude: number;
  maxPlayers: number;
  currentPlayers: number;
  distance: number;
  creatorNickname: string;
};

export type RandomMatchResponse = {
  matched: boolean;
  match: RandomMatchedGame | null;
};

export type RandomMatchAcceptResult = {
  matchId: number;
  matchTitle: string;
  status: 'PENDING' | 'JOINED';
};
