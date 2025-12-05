
export interface Book {
  abbrev: string;
  name: string;
  chapters: number;
  testament: 'VT' | 'NT';
}

export interface Verse {
  book_id: string;
  book_name: string;
  chapter: number;
  verse: number;
  text: string;
}

export interface ChapterContent {
  reference: string;
  verses: Verse[];
  text: string;
  translation_id: string;
}

export interface Favorite {
  id: string;
  verse: Verse;
  timestamp: number;
}

export interface HistoryItem {
  bookAbbrev: string;
  bookName: string;
  chapter: number;
  timestamp: number;
}

export interface AppSettings {
  fontSize: number; // 1 to 5 scale
  theme: 'light' | 'dark' | 'sepia';
  fontFamily: 'serif' | 'sans';
}

export interface EmotionalVerse {
  id: string;
  text: string;
  reference: string;
  emotion: 'ansiedade' | 'tristeza' | 'gratidao' | 'raiva' | 'cansaco' | 'esperanca' | 'medo' | 'amor';
  reflection: string; // Reflexão humana/conversacional
}

export interface DailyReading {
  dateKey?: string; // Format "MM-DD" e.g. "0-1" for Jan 1st
  verse: string;
  reference: string;
  message: string;
}

export interface UserReflection {
  id: string;
  verseId: string;
  text: string;
  timestamp: number;
}

export enum ViewState {
  HOME = 'HOME',
  BOOKS = 'BOOKS',
  CHAPTERS = 'CHAPTERS',
  READER = 'READER',
  SEARCH = 'SEARCH',
  FAVORITES = 'FAVORITES',
  SETTINGS = 'SETTINGS',
  EMOTIONAL_READING = 'EMOTIONAL_READING',
  ABOUT = 'ABOUT',
  DAILY_MESSAGE = 'DAILY_MESSAGE',
  PLAN_B = 'PLAN_B'
}
