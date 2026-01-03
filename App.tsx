import React, { useState, useEffect, useMemo } from 'react';
import { generatePlan, formatReading } from './utils';
import { ReadingDay, UserProgress } from './types';
import { getDailyReflection } from './geminiService';

const App: React.FC = () => {
  const [year] = useState(2026);
  const plan = useMemo(() => generatePlan(year), [year]);
  const startThreshold = new Date(year, 0, 5);

  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('bible_progress_2026');
    return saved ? JSON.parse(saved) : { completedDays: [] };
  });
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [reflection, setReflection] = useState<string | null>(null);
  const [loadingReflection, setLoadingReflection] = useState(false);

  useEffect(() => {
    localStorage.setItem('bible_progress_2026', JSON.stringify(progress));
  }, [progress]);

  const toggleDay = (id: string) => {
    setProgress(prev => ({
      ...prev,
      completedDays: prev.completedDays.includes(id)
        ? prev.completedDays.filter(d => d !== id)
        : [...prev.completedDays, id]
    }));
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const todayPlan = plan.find(d => d.id === todayStr);

  const monthPlan = useMemo(() => {
    return plan.filter(d => d.date.getMonth() === selectedMonth);
  }, [plan, selectedMonth]);

  const stats = useMemo(() => {
    const totalReadingDays = plan.filter(d => d.isReadingDay).length;
    const completedDaysCount = progress.completedDays.length;
    return {
      total: totalReadingDays,
      completed: completedDaysCount,
      percent: totalReadingDays > 0 ? Math.round((completedDaysCount / totalReadingDays) * 100) : 0
    };
  }, [plan, progress]);

  const handleReflect = async () => {
    if (!todayPlan || !todayPlan.isReadingDay) return;
    setLoadingReflection(true);
    const text = formatReading(todayPlan.readings, todayPlan.isReadingDay, todayPlan.date, startThreshold);
    const result = await getDailyReflection(text);
    setReflection(result);
    setLoadingReflection(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24 md:pb-12 text-slate-900">
      <header className="bg-indigo-900 text-white py-6 px-4 shadow-lg sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-center sm:text-left flex-grow">
            <h1 className="text-2xl sm:text-3xl font-bold font-serif tracking-tight flex items-center justify-center sm:justify-start gap-2">
              성경 일독 탐험 2026
            </h1>
            <p className="text-indigo-200 text-sm mt-0.5">1월 5일 월요일 시작 | 역사부터 신약까지</p>
          </div>
          <div className="bg-indigo-800/40 rounded-2xl p-3 flex items-center gap-3 border border-indigo-700 w-full sm:w-auto">
            <div className="relative w-12 h-12 flex-shrink-0">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path className="text-indigo-700 stroke-current" strokeDasharray="100, 100" strokeWidth="3.5" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="text-amber-400 stroke-current" strokeDasharray={`${stats.percent}, 100`} strokeWidth="3.5" strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">{stats.percent}%</div>
            </div>
            <div className="flex-grow">
              <div className="text-[10px] text-indigo-300 uppercase tracking-widest font-bold">2026 달성도</div>
              <div className="text-base font-bold leading-tight">{stats.completed} / {stats.total} 일</div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 mt-6 space-y-6">
        {todayPlan && (
          <section className="bg-white rounded-2xl p-5 shadow-md border border-indigo-50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <span className="w-1.5 h-5 bg-indigo-500 rounded-full"></span>
                오늘의 읽기 <span className="text-slate-400 font-normal text-sm ml-1 hidden sm:inline">| {todayPlan.date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', weekday: 'short' })}</span>
              </h2>
              {todayPlan.isReadingDay && (
                <button
                  onClick={() => toggleDay(todayPlan.id)}
                  className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 ${
                    progress.completedDays.includes(todayPlan.id)
                      ? 'bg-green-50 text-green-600 border border-green-200'
                      : 'bg-indigo-600 text-white shadow-lg hover:bg-indigo-700'
                  }`}
                >
                  {progress.completedDays.includes(todayPlan.id) ? '✓ 완료함' : '오늘 분량 완료 체크'}
                </button>
              )}
            </div>
            <div className={`rounded-xl p-5 border ${!todayPlan.isReadingDay ? 'bg-slate-50 border-slate-100' : 'bg-indigo-50/40 border-indigo-100/30'}`}>
              <div className={`text-xl sm:text-2xl font-serif font-bold mb-3 ${!todayPlan.isReadingDay ? 'text-slate-400' : 'text-indigo-900'}`}>
                {formatReading(todayPlan.readings, todayPlan.isReadingDay, todayPlan.date, startThreshold)}
              </div>
              {todayPlan.isReadingDay && (
                <div className="space-y-3">
                  {!reflection ? (
                    <button onClick={handleReflect} disabled={loadingReflection} className="text-indigo-600 text-sm font-bold flex items-center gap-2">
                      {loadingReflection ? 'Gemini가 묵상 중...' : 'AI 말씀 묵상 생성하기'}
                    </button>
                  ) : (
                    <div className="bg-white rounded-lg p-4 border border-indigo-100 text-slate-700 text-sm whitespace-pre-wrap leading-relaxed shadow-sm">
                      <div className="text-[10px] text-indigo-400 font-bold mb-2 uppercase flex justify-between border-b border-slate-50 pb-2">
                        <span>AI 묵상 (Gemini)</span>
                        <button onClick={() => setReflection(null)} className="text-slate-300 hover:text-slate-500">닫기</button>
                      </div>
                      <div className="mt-2">
                        {reflection}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        )}

        <section className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-slate-100 space-y-4">
            <h2 className="text-lg font-bold text-slate-800">2026년 상세 스케줄</h2>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4">
              {Array.from({ length: 12 }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedMonth(i)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                    selectedMonth === i ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {i + 1}월
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-3">날짜</th>
                  <th className="px-6 py-3">성경 읽기</th>
                  <th className="px-6 py-3 text-center">완료</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {monthPlan.map(day => (
                  <tr key={day.id} className={`${!day.isReadingDay ? 'bg-slate-50/50' : 'hover:bg-indigo-50/20'} ${progress.completedDays.includes(day.id) ? 'bg-green-50/30' : ''}`}>
                    <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">{day.date.getDate()}일 ({['일','월','화','수','목','금','토'][day.date.getDay()]})</td>
                    <td className={`px-6 py-4 text-sm font-serif ${!day.isReadingDay ? 'text-slate-300 italic' : 'text-slate-800 font-bold'}`}>
                      {formatReading(day.readings, day.isReadingDay, day.date, startThreshold)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {day.isReadingDay && (
                        <input 
                          type="checkbox" 
                          checked={progress.completedDays.includes(day.id)} 
                          onChange={() => toggleDay(day.id)} 
                          className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer" 
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;