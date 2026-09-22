import type { IconName } from '../icons';
import type { Mode } from '../theme';

export type ValueKey = 'Loyalität' | 'Ehrgeiz' | 'Direktheit' | 'Humor';

export type Profile = {
  name: string;
  city: string;
  age: number;
  privacy: string;
  radius: string;
  want: string[];
  teach: string[];
  values: Record<ValueKey, number>;
};

export type NearbyStatus = 'live' | 'rebump' | 'weak';

export type Nearby = {
  id: string;
  name: string;
  age: number;
  dist: string;
  why: string;
  score: number;
  mutual: string;
  status: NearbyStatus;
};

/** A compatibility dimension inside a match. `v: null` means still locked. */
export type Level = { name: string; v: number | null };

export type Connection = {
  id: string;
  name: string;
  age: number;
  score: number;
  bond: number;
  trend: number[];
  tags: string[];
  blocked: boolean;
  reported: boolean;
  levels: Level[];
  lastBump: string;
  teach?: string;
};

export type Activity = {
  id: string;
  icon: IconName;
  title: string;
  host: string;
  via: string;
  time: string;
  spots: number;
  joined: boolean;
  reward: string;
  people: string[];
  type: Mode;
};

export type Idea = {
  id: string;
  icon: IconName;
  title: string;
  stage: string;
  pitch: string;
  needs: string[];
  signals: number;
  funding: number;
  private: boolean;
};

export type BizMatch = {
  id: string;
  icon: IconName;
  name: string;
  age: number;
  score: number;
  role: string;
  why: string;
  skills: string[];
  levels: Level[];
  trend: number[];
};

export type FeedItem = {
  id: string;
  title: string;
  sub: string;
  meta: string;
  tone: 'good' | 'neutral';
  mode: Mode | 'both';
};

export type BumpRecord = {
  id: string;
  mode: Mode;
  person: string;
  score: number;
  at: string;
};

export type Flag = { id: string; person: string; reason: string; at: string };

export type DB = {
  mode: Mode;
  profile: Profile;
  nearby: Nearby[];
  connections: Connection[];
  activities: Activity[];
  ideas: Idea[];
  bizMatches: BizMatch[];
  feed: FeedItem[];
  answers: Record<string, string>;
  mysteryOpen: boolean;
  answered: number;
  bumps: BumpRecord[];
  flags: Flag[];
};
