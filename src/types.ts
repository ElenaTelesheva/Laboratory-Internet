export type MatchStatus = 'finished' | 'live' | 'scheduled' | 'postponed';

export interface Team {
  id: string;
  name: string;
  city: string;
}

export interface Score {
  home: number;
  away: number;
}

export interface Match {
  id: string;
  startsAt: string | null;
  status: MatchStatus;
  minute?: number;
  home: Team;
  away: Team;
  score: Score | null;
}

export interface MatchesResponse {
  round: number;
  matches: Match[];
}