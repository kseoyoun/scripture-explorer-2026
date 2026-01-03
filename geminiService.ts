import { GoogleGenAI } from "@google/genai";

export async function getDailyReflection(readingText: string) {
  try {
    // process.env.API_KEY는 vite.config.ts의 define을 통해 주입됩니다.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `다음 성경 읽기 분량에 대한 짧은 묵상과 요약을 작성해줘: "${readingText}".
      형식:
      1. 핵심 내용 요약 (2-3문장)
      2. 오늘의 적용점 (1문장)
      3. 짧은 기도문 (1문장)
      한국어로 따뜻하고 격려하는 말투로 작성해줘.`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "묵상을 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }
}