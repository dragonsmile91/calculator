# 복리계산기 웹앱 태스크 리스트

## 관련 파일

- `src/App.js` - 메인 애플리케이션 컴포넌트
- `src/components/Calculator.js` - 복리계산기 메인 컴포넌트
- `src/components/Calculator.test.js` - Calculator 컴포넌트 단위 테스트
- `src/components/InputForm.js` - 입력 폼 컴포넌트
- `src/components/InputForm.test.js` - InputForm 컴포넌트 단위 테스트
- `src/components/ResultDisplay.js` - 결과 표시 컴포넌트
- `src/components/ResultDisplay.test.js` - ResultDisplay 컴포넌트 단위 테스트
- `src/components/CompoundGraph.js` - 복리 그래프 컴포넌트
- `src/components/CompoundGraph.test.js` - CompoundGraph 컴포넌트 단위 테스트
- `src/utils/calculations.js` - 복리 계산 유틸리티 함수
- `src/utils/calculations.test.js` - 계산 함수 단위 테스트
- `src/utils/validation.js` - 입력 검증 유틸리티 함수
- `src/utils/validation.test.js` - 검증 함수 단위 테스트
- `public/index.html` - 메인 HTML 파일
- `src/index.css` - 전역 스타일
- `src/App.css` - App 컴포넌트 스타일
- `package.json` - 프로젝트 의존성 및 스크립트
- `README.md` - 프로젝트 설명서

### 참고사항

- 단위 테스트는 일반적으로 테스트하는 코드 파일과 같은 디렉토리에 배치됩니다 (예: `MyComponent.tsx`와 `MyComponent.test.tsx`가 같은 디렉토리에).
- `npm test`를 사용하여 테스트를 실행합니다. 경로 없이 실행하면 Jest 설정에서 찾은 모든 테스트를 실행합니다.

## 태스크

- [x] 1.0 React 프로젝트 설정 및 기본 구조 생성
  - [x] 1.1 Create React App을 사용하여 새 프로젝트 생성
  - [x] 1.2 필요한 의존성 설치 (react-chartjs-2, chart.js)
  - [x] 1.3 프로젝트 폴더 구조 설정 (src/components, src/utils)
  - [x] 1.4 기본 App.js 컴포넌트 생성
  - [x] 1.5 전역 스타일 설정 (index.css)

- [x] 2.0 복리 계산 로직 및 유틸리티 함수 구현
  - [x] 2.1 복리 계산 공식 구현 (calculations.js)
  - [x] 2.2 연별 성장 데이터 생성 함수 구현
  - [x] 2.3 수익률 계산 함수 구현
  - [x] 2.4 계산 함수 단위 테스트 작성

- [x] 3.0 입력 폼 컴포넌트 개발
  - [x] 3.1 InputForm 컴포넌트 기본 구조 생성
  - [x] 3.2 원금, 이율, 기간 입력 필드 구현
  - [x] 3.3 입력 필드 스타일링 (미니멀 디자인)
  - [x] 3.4 입력 값 상태 관리 구현
  - [x] 3.5 InputForm 컴포넌트 단위 테스트 작성

- [x] 4.0 결과 표시 컴포넌트 개발
  - [x] 4.1 ResultDisplay 컴포넌트 기본 구조 생성
  - [x] 4.2 최종 금액, 총 이자, 수익률 표시 구현
  - [x] 4.3 결과 데이터 포맷팅 (천 단위 구분, 소수점 처리)
  - [x] 4.4 결과 표시 스타일링
  - [x] 4.5 ResultDisplay 컴포넌트 단위 테스트 작성

- [x] 5.0 복리 그래프 컴포넌트 개발
  - [x] 5.1 CompoundGraph 컴포넌트 기본 구조 생성
  - [x] 5.2 Chart.js 설정 및 라인 차트 구현
  - [x] 5.3 연별 성장 데이터 그래프 표시
  - [x] 5.4 그래프 축 라벨 및 제목 설정
  - [x] 5.5 반응형 그래프 크기 조정
  - [x] 5.6 CompoundGraph 컴포넌트 단위 테스트 작성

- [x] 6.0 메인 계산기 컴포넌트 통합
  - [x] 6.1 Calculator 컴포넌트 기본 구조 생성
  - [x] 6.2 InputForm, ResultDisplay, CompoundGraph 컴포넌트 통합
  - [x] 6.3 계산 로직과 UI 컴포넌트 연결
  - [x] 6.4 상태 관리 및 데이터 흐름 구현
  - [x] 6.5 Calculator 컴포넌트 단위 테스트 작성

- [x] 7.0 반응형 디자인 및 스타일링
  - [x] 7.1 모바일 우선 반응형 레이아웃 구현
  - [x] 7.2 데스크톱, 태블릿, 모바일 브레이크포인트 설정
  - [x] 7.3 미니멀 디자인 스타일 적용
  - [x] 7.4 색상 구성 및 타이포그래피 설정
  - [x] 7.5 컴포넌트 간 일관된 스타일링

- [x] 8.0 입력 검증 및 오류 처리
  - [x] 8.1 입력 검증 유틸리티 함수 구현 (validation.js)
  - [x] 8.2 음수 입력 방지 로직 구현
  - [x] 8.3 필수 필드 검증 구현
  - [x] 8.4 사용자 친화적 오류 메시지 표시
  - [x] 8.5 검증 함수 단위 테스트 작성

- [x] 9.0 테스트 작성 및 품질 보장
  - [x] 9.1 모든 컴포넌트 단위 테스트 완성
  - [x] 9.2 계산 로직 통합 테스트 작성
  - [x] 9.3 사용자 인터랙션 테스트 작성
  - [x] 9.4 테스트 커버리지 확인 및 개선
  - [x] 9.5 전체 테스트 스위트 실행 및 통과 확인

- [ ] 10.0 배포 준비 및 최적화
  - [ ] 10.1 프로덕션 빌드 최적화
  - [ ] 10.2 SEO 메타 태그 및 타이틀 설정
  - [ ] 10.3 Google AdSense 통합 공간 준비
  - [ ] 10.4 성능 최적화 (번들 크기, 로딩 속도)
  - [ ] 10.5 배포 플랫폼 설정 (GitHub Pages 또는 Netlify)
  - [ ] 10.6 README.md 문서 작성 