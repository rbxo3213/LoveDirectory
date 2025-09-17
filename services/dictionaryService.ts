import { WordEntry, StatsData, Dictionary } from '../types';

const STORAGE_KEY = 'love_dialect_dictionaries';

// Helper function to get all dictionaries from localStorage
const getAllDictionaries = (): Record<string, Dictionary> => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : {};
};

// Helper function to save all dictionaries to localStorage
const saveAllDictionaries = (dictionaries: Record<string, Dictionary>) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(dictionaries));
};

export const createDictionary = async (secretCode: string, name: string): Promise<void> => {
  const dictionaries = getAllDictionaries();
  if (dictionaries[secretCode]) {
    throw new Error('Dictionary code already exists.');
  }
  dictionaries[secretCode] = { name, words: [], createdAt: Date.now() };
  saveAllDictionaries(dictionaries);
};

export const getDictionary = async (secretCode: string): Promise<Dictionary | null> => {
    const dictionaries = getAllDictionaries();
    return dictionaries[secretCode] || null;
}

export const getWords = async (secretCode: string): Promise<WordEntry[]> => {
  const dictionaries = getAllDictionaries();
  return dictionaries[secretCode]?.words || [];
};

export const addWord = async (secretCode: string, word: string, meaning: string): Promise<WordEntry> => {
  const dictionaries = getAllDictionaries();
  const dictionary = dictionaries[secretCode];
  if (!dictionary) {
    throw new Error('Dictionary not found.');
  }

  const newWord: WordEntry = {
    id: Date.now().toString(),
    word,
    meaning,
  };

  dictionary.words.push(newWord);
  saveAllDictionaries(dictionaries);
  return newWord;
};

export const updateWord = async (secretCode: string, id: string, updatedData: { word: string; meaning: string }): Promise<WordEntry> => {
  const dictionaries = getAllDictionaries();
  const dictionary = dictionaries[secretCode];
  if (!dictionary) {
    throw new Error('Dictionary not found.');
  }
  
  const wordIndex = dictionary.words.findIndex(w => w.id === id);
  if (wordIndex === -1) {
    throw new Error('Word not found');
  }

  const updatedWord = { ...dictionary.words[wordIndex], ...updatedData };
  dictionary.words[wordIndex] = updatedWord;
  saveAllDictionaries(dictionaries);
  return updatedWord;
};

export const deleteWord = async (secretCode: string, id: string): Promise<void> => {
  const dictionaries = getAllDictionaries();
  const dictionary = dictionaries[secretCode];
  if (!dictionary) return;
  
  dictionary.words = dictionary.words.filter(w => w.id !== id);
  saveAllDictionaries(dictionaries);
};

export const updateDictionaryName = async (secretCode: string, newName: string): Promise<void> => {
    const dictionaries = getAllDictionaries();
    const dictionary = dictionaries[secretCode];
    if (!dictionary) {
        throw new Error('Dictionary not found.');
    }
    dictionary.name = newName;
    saveAllDictionaries(dictionaries);
}

export const deleteDictionary = async (secretCode: string): Promise<void> => {
    const dictionaries = getAllDictionaries();
    if (!dictionaries[secretCode]) {
        return; // Dictionary doesn't exist
    }
    delete dictionaries[secretCode];
    saveAllDictionaries(dictionaries);
}

// This is a simplified simulation of data aggregation and analysis.
export const getStats = async (): Promise<StatsData[]> => {
  const dictionaries = getAllDictionaries();
  const stats: Record<string, number> = {
    '애칭 (Nicknames)': 0,
    '음식 관련 (Food-related)': 0,
    '귀여운 행동 (Cute Actions)': 0,
    '우리만의 장소 (Our Places)': 0,
    '기타 (Others)': 0,
  };

  const nicknameKeywords = ['자기', '여보', '공주', '왕자', '이쁜이', '귀요미', '사랑', '허니', '달링'];
  const foodKeywords = ['만두', '찹쌀', '모찌', '떡', '빵', '쿠키', '디저트', '딸기'];
  const actionKeywords = ['뽀뽀', '포옹', '쓰담', '안아주기', '둥가', '궁디팡팡'];
  const placeKeywords = ['아지트', '공원', '카페', '맛집', '우리집', '너네집'];

  Object.values(dictionaries).flatMap(dict => dict.words).forEach(entry => {
    const combinedText = `${entry.word.toLowerCase()} ${entry.meaning.toLowerCase()}`;
    if (nicknameKeywords.some(kw => combinedText.includes(kw))) {
      stats['애칭 (Nicknames)']++;
    } else if (foodKeywords.some(kw => combinedText.includes(kw))) {
      stats['음식 관련 (Food-related)']++;
    } else if (actionKeywords.some(kw => combinedText.includes(kw))) {
      stats['귀여운 행동 (Cute Actions)']++;
    } else if (placeKeywords.some(kw => combinedText.includes(kw))) {
      stats['우리만의 장소 (Our Places)']++;
    } else {
      stats['기타 (Others)']++;
    }
  });

  return Object.entries(stats)
    .map(([name, frequency]) => ({ name, frequency }))
    .filter(item => item.frequency > 0)
    .sort((a, b) => b.frequency - a.frequency);
};