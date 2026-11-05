export type Game = {
  slug: string;
  title: string;
  author: string;
  authorClass: string;
  discipline: string;
  grades: string[];
  tags: string[];
  description: string;
  instructions: string;
  duration: number;
  version: string;
  entry: string;
  entryUrl: string;
  coverUrl: string;
  featured: boolean;
  order: number;
  createdAt: string;
};

export type GameResult = {
  score: number;
  maxScore: number;
  timeMs?: number;
  detail?: Record<string, unknown>;
};
