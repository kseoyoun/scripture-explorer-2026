# Scripture Explorer 2026

2026년 성경 일독 탐험 애플리케이션입니다. 역사서부터 신약까지 흐름을 따라 매일 4장씩, 주 6일 읽는 스케줄을 제공합니다.

## ✨ 주요 기능
- **2026년 맞춤형 스케줄**: 1월 5일 월요일부터 시작되는 체계적인 읽기 계획
- **AI 말씀 묵상**: Google Gemini API를 활용한 일일 성경 요약 및 기도문 제공
- **진행도 추적**: 로컬 스토리지를 활용한 개인별 읽기 완료 체크 및 진행률 시각화
- **반응형 디자인**: 모바일과 데스크톱 모두 최적화된 UI

## 🚀 GitHub 배포 방법 (GitHub Pages)

이 프로젝트는 Vite나 Webpack 같은 빌드 도구를 사용하거나, 단순 정적 호스팅으로 배포할 수 있습니다.

1. **저장소 생성**: GitHub에서 새 Repository를 만듭니다.
2. **파일 업로드**: 모든 소스 파일(`index.html`, `index.tsx`, `App.tsx` 등)을 업로드합니다.
3. **배포 설정**:
   - Repository의 `Settings` > `Pages`로 이동합니다.
   - `Build and deployment` 섹션에서 `Source`를 `Deploy from a branch`로 선택합니다.
   - `Main` 브랜치를 선택하고 저장합니다.
4. **주의사항**: 브라우저에서 `.tsx` 파일을 직접 실행하려면 Babel이나 Vite 환경 설정이 필요합니다. 간단한 배포를 위해 `Vite` 프로젝트로 전환하는 것을 권장합니다.

## 🛠 기술 스택
- React 19
- Tailwind CSS
- Google Gemini API (@google/genai)
- TypeScript
