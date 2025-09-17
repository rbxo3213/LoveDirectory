export interface WordEntry {
  id: string;
  word: string;
  meaning: string;
}

export interface Dictionary {
  name: string;
  words: WordEntry[];
  createdAt: number; // Added creation timestamp
}

export interface StatsData {
  name:string;
  frequency: number;
}

export interface User {
  id: string;
  username: string;
  passwordHash: string; // In a real app, this would be a hash.
  dictionaryCode?: string;
  kakaoId?: string; // Added for Kakao login
}