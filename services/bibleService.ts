// This service handles all interactions with the api.bible service.
// You will need to get a free API key from https://scripture.api.bible/
// and set it as the BIBLE_API_KEY environment variable.

const API_KEY = process.env.BIBLE_API_KEY;
const API_URL = 'https://api.scripture.api.bible/v1';

const headers = {
    'api-key': API_KEY,
};

interface BibleVersion {
  id: string;
  name: string;
  abbreviation: string;
  language: {
      name: string;
  };
}

interface Book {
    id: string;
    name: string;
    abbreviation: string;
}

interface Chapter {
    id: string;
    number: string;
    // FIX: Add missing bookId to match API response and BibleScreen's type.
    bookId: string;
}

interface ChapterContent {
    content: string; // The content is returned as an HTML string
}

/**
 * Fetches all available Bible versions from the API.
 */
export const getBibleVersions = async (): Promise<BibleVersion[]> => {
    if (!API_KEY) throw new Error("Bible API key is not set.");
    try {
        const response = await fetch(`${API_URL}/bibles`, { headers });
        if (!response.ok) throw new Error('Failed to fetch Bible versions');
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error("Error fetching Bible versions:", error);
        return [];
    }
};

/**
 * Fetches all books for a specific Bible version.
 * @param bibleId The ID of the Bible version (e.g., 'de4e12af7f28f599-01').
 */
export const getBooks = async (bibleId: string): Promise<Book[]> => {
    if (!API_KEY) throw new Error("Bible API key is not set.");
    try {
        const response = await fetch(`${API_URL}/bibles/${bibleId}/books`, { headers });
        if (!response.ok) throw new Error(`Failed to fetch books for bible ${bibleId}`);
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error(`Error fetching books for bible ${bibleId}:`, error);
        return [];
    }
};

/**
 * Fetches all chapters for a specific book in a Bible version.
 * @param bibleId The ID of the Bible version.
 * @param bookId The ID of the book (e.g., 'GEN').
 */
export const getChapters = async (bibleId: string, bookId: string): Promise<Chapter[]> => {
    if (!API_KEY) throw new Error("Bible API key is not set.");
    try {
        const response = await fetch(`${API_URL}/bibles/${bibleId}/books/${bookId}/chapters`, { headers });
        if (!response.ok) throw new Error(`Failed to fetch chapters for book ${bookId}`);
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error(`Error fetching chapters for book ${bookId}:`, error);
        return [];
    }
};

/**
 * Fetches the content of a specific chapter.
 * @param bibleId The ID of the Bible version.
 * @param chapterId The ID of the chapter (e.g., 'GEN.1').
 */
export const getChapterContent = async (bibleId: string, chapterId: string): Promise<ChapterContent | null> => {
    if (!API_KEY) throw new Error("Bible API key is not set.");
    try {
        // We request 'p' tags for paragraphs and verse numbers.
        const response = await fetch(`${API_URL}/bibles/${bibleId}/chapters/${chapterId}?content-type=html&include-notes=false&include-titles=true&include-chapter-numbers=false&include-verse-numbers=true&include-verse-spans=true`, { headers });
        if (!response.ok) throw new Error(`Failed to fetch content for chapter ${chapterId}`);
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error(`Error fetching content for chapter ${chapterId}:`, error);
        return null;
    }
};
