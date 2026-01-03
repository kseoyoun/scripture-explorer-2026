
import { BIBLE_BOOKS, PHASE_CONFIG } from './constants';
import { ReadingDay, ReadingPhase } from './types';

export const generatePlan = (year: number): ReadingDay[] => {
  const plan: ReadingDay[] = [];
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);
  const readingStartThreshold = new Date(year, 0, 5); // 2026-01-05

  // Group books by category
  const categorizedBooks = {
    History: BIBLE_BOOKS.filter(b => b.category === 'History'),
    Law: BIBLE_BOOKS.filter(b => b.category === 'Law'),
    WisdomProphets: BIBLE_BOOKS.filter(b => b.category === 'WisdomProphets'),
    NewTestament: BIBLE_BOOKS.filter(b => b.category === 'NewTestament'),
  };

  // Tracking cursors for each category
  const cursors: Record<string, { bookIdx: number; chapIdx: number }> = {
    History: { bookIdx: 0, chapIdx: 1 },
    Law: { bookIdx: 0, chapIdx: 1 },
    WisdomProphets: { bookIdx: 0, chapIdx: 1 },
    NewTestament: { bookIdx: 0, chapIdx: 1 },
  };

  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const month = currentDate.getMonth();
    const dayOfWeek = currentDate.getDay(); // 0 is Sunday
    const isReadingDay = dayOfWeek !== 0; // Monday-Saturday
    const dateStr = currentDate.toISOString().split('T')[0];

    // Determine category based on month
    const phase = PHASE_CONFIG.find(p => p.months.includes(month));
    const category = phase?.category || 'History';
    
    // Plan starts assigning only from Jan 5th
    const hasStarted = currentDate >= readingStartThreshold;

    const dayReading: ReadingDay = {
      date: new Date(currentDate),
      isReadingDay: isReadingDay && hasStarted,
      readings: [],
      id: dateStr,
    };

    if (isReadingDay && hasStarted) {
      let chaptersToAssign = 4;
      const books = categorizedBooks[category as keyof typeof categorizedBooks];
      const cursor = cursors[category];

      while (chaptersToAssign > 0 && cursor.bookIdx < books.length) {
        const currentBook = books[cursor.bookIdx];
        const remainingInBook = currentBook.chapters - (cursor.chapIdx - 1);
        const take = Math.min(chaptersToAssign, remainingInBook);

        const assignedChapters = Array.from({ length: take }, (_, i) => cursor.chapIdx + i);
        
        // Find existing reading entry for this book or create new
        const existing = dayReading.readings.find(r => r.book === currentBook.name);
        if (existing) {
          existing.chapters.push(...assignedChapters);
        } else {
          dayReading.readings.push({ book: currentBook.name, chapters: assignedChapters });
        }

        chaptersToAssign -= take;
        cursor.chapIdx += take;

        if (cursor.chapIdx > currentBook.chapters) {
          cursor.bookIdx++;
          cursor.chapIdx = 1;
        }
      }
    }

    plan.push(dayReading);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return plan;
};

export const formatReading = (readings: { book: string; chapters: number[] }[], isReadingDay: boolean, date: Date, threshold: Date) => {
  if (date < threshold) return '시작 대기 중';
  if (!isReadingDay && date.getDay() === 0) return '쉼 (주일)';
  if (readings.length === 0) return '완독 축하합니다!';
  return readings.map(r => {
    const start = r.chapters[0];
    const end = r.chapters[r.chapters.length - 1];
    return `${r.book} ${start}${start === end ? '' : `-${end}`}장`;
  }).join(', ');
};
