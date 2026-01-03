
export interface BibleBook {
  name: string;
  chapters: number;
  category: 'History' | 'Law' | 'WisdomProphets' | 'NewTestament';
}

export interface ReadingDay {
  date: Date;
  isReadingDay: boolean;
  readings: {
    book: string;
    chapters: number[];
  }[];
  id: string; // YYYY-MM-DD
}

export interface UserProgress {
  completedDays: string[]; // List of IDs
}

export enum ReadingPhase {
  HISTORY = '역사서 탐험',
  LAW = '기원과 율법',
  WISDOM = '지혜와 예언',
  NEW_TESTAMENT = '신약 완성'
}
