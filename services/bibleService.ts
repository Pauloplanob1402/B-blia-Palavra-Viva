import { ChapterContent, Verse } from '../types';
import { storageService } from './storageService';

// Utilizing bible-api.com which is free, public domain friendly, and has Almeida translation.
const API_BASE = 'https://bible-api.com';

export const bibleService = {
  fetchChapter: async (book: string, chapter: number): Promise<ChapterContent | null> => {
    const cacheKey = `${book}-${chapter}`;
    const cached = storageService.getCachedChapter(cacheKey);
    if (cached) return cached;

    try {
      // API expects names like "João 3" or "Gênesis 1"
      // We need to ensure the book name is URL safe but readable by the API.
      // The API handles Portuguese names well.
      const response = await fetch(`${API_BASE}/${book}+${chapter}?translation=almeida`);
      if (!response.ok) throw new Error('Network error');
      
      const data = await response.json();
      
      const formattedData: ChapterContent = {
        reference: data.reference,
        text: data.text,
        translation_id: data.translation_id,
        verses: data.verses.map((v: any) => ({
          book_id: data.reference.split(' ')[0], // Rough approximation
          book_name: data.reference.split(' ')[0], // Rough approximation
          chapter: data.verses[0].chapter, // Use chapter from first verse
          verse: v.verse,
          text: v.text.trim()
        }))
      };

      storageService.cacheChapter(cacheKey, formattedData);
      return formattedData;
    } catch (error) {
      console.error("Failed to fetch chapter", error);
      return null;
    }
  },

  // Simulating search because the API doesn't support full text search easily without backend
  // In a real app, this would hit a search endpoint.
  searchVerses: async (query: string): Promise<Verse[]> => {
    // This is a placeholder. For a client-only app, we can't search the whole bible efficiently 
    // without downloading 5MB+ of JSON. 
    // We will return an empty list or mock data to demonstrate UI.
    return []; 
  }
};
