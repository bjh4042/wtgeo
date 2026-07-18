## 개요
거제·경남 탐색 서비스를 초등 3·4학년이 더 쉽게 쓸 수 있도록 **기존 디자인과 기능은 유지하면서** UI 정돈, 접근성, 상태 표시, 퀴즈 오류를 개선합니다. 대규모 리팩터링은 하지 않고, 컴포넌트 단위로 최소 침습적 수정만 합니다.

---

## 작업 범위 (15개 요청 항목 매핑)

### A. 헤더/네비게이션 정돈 (1, 2, 3)
- `AppHeader.tsx`: 상단 버튼 글자 `text-[10px]` → `text-xs`, 아이콘+텍스트, 높이 40~44px, 간격 확대. 자주 쓰는 3개(장소 찾기·탐색 메뉴·내 코스)는 항상 노출, 나머지(경로/지명유래/경남/퀴즈/안내/출처)는 "더보기" 드롭다운으로 묶기.
- `ExplorerPage.tsx` 하단 신규 컴포넌트 `ExplorerMobileNav.tsx` 추가: 모바일 전용(≤md) `지도 / 찾아보기 / 내 코스 / 더보기` 4탭. 학년 표시는 헤더 우측 배지(`3학년 · 거제시` / `4학년 · 경상남도`)로 이동.
- 헤더 아래 얇은 브레드크럼 배지 라인: `거제시 > 공공기관` 형태 (선택 카테고리/장소 반영). 한 줄 넘김 방지 `truncate` + 가로 스크롤.

### B. 검색·필터·지도 연동 (4, 5)
- `PlaceSearchBar.tsx`: 결과 없음 문구 초등생 톤으로 통일, 초기화 X 버튼 유지 확인, 카테고리명·설명 키워드까지 매칭 확장(기존 데이터 필드만 활용).
- 지도↔목록 선택 상태 동기화 점검: 이미 대부분 연결되어 있어 강조 스타일(선택된 카드 ring, 마커 강조)만 통일. 상태 초기화 방지 확인.

### C. 상세카드·팝업 통일 (6, 7)
- `ContentCard.tsx` / `PlaceCard.tsx`: 정보 위계 정리(이름 → 카테고리 → 한줄설명 → 이미지 → 상세 → 지도/로드뷰 → 출처 → 내 코스). 긴 설명은 "더 알아보기" 토글.
- 팝업 공통 규칙: 닫기 버튼 우상단 `aria-label="닫기"`, ESC로 닫기, 배경 스크롤 잠금, 모바일 거의 전체화면. `QuizPopup / SourcesPopup / GyeongnamExplorer / RouteExplorer / PlaceNameOrigins / FavoriteCourse / NoticePopup` 순회 점검.

### D. 경남 시·군 카드·통계 기준일 (8, 9)
- `GyeongnamExplorer.tsx`: 카드에 한줄 설명 슬롯 추가 — **`gyeongnam.ts`에 이미 있는 설명의 첫 문장만 잘라 표시**(임의 문구 생성 X). 이미지 비율 통일(`aspect-video`), 전체 카드 `<button>`화.
- 인구/면적 영역에 `기준: <데이터에 있는 값>` 표시. 데이터에 없으면 표시 생략(경고 문구 학생 화면에 노출 X).

### E. 퀴즈 오류 수정 (10)
- `QuizPopup.tsx`:
  - **타이머 자동제출 클로저 버그 수정**: `answersRef = useRef(answers)` 도입, `finishQuizWithAnswers`가 최신 답안 참조.
  - 결과 문구 학년별 분기: 3학년 "거제 박사/탐험가", 4학년 "경상남도 박사/탐험가".
  - 등급 정답 수 기준으로 단순화: S 9–10 / A 7–8 / B 5–6 / 다시 도전 0–4. 소요시간은 정보 배지로만 표시.

### F. 접근성·색상·빈상태 (11, 12, 13)
- 아이콘 전용 버튼 전수 점검 → `aria-label` 부여, `<div onClick>` → `<button>`.
- 이미지 `alt` 보강(장식용은 `alt=""`).
- 공통 `EmptyState.tsx` 소형 컴포넌트 신설(검색결과 없음/내 코스 비어있음/불러오기 실패 + 다시 시도). 기존 위치에 대체 삽입.
- 강조색 남용된 부분만 회색/토큰으로 정리(전면 리디자인 X).

### G. 보안/환경변수 (14)
- `.gitignore`에 `.env`, `.env.local`, `.env.*.local` 존재 확인 후 없으면 추가.
- `.env` 추적 상태 점검 (수동 제거는 사용자 안내). 코드에 하드코딩된 키 없음 재확인. Kakao 키 미설정 시 사용자 친화 오류 메시지.

### H. 상태 구조 소폭 정리 (15)
- `ExplorerPage.tsx`의 모달 boolean들을 `activeModal: ActiveModal | null` 하나로 통합. 컴포넌트 분할은 이번 범위에서 **제외**(위험 대비 이득 낮음).

---

## 파일별 예상 변경
```
수정
  src/components/AppHeader.tsx           헤더 정돈, 학년 배지, 더보기 드롭다운
  src/components/ExplorerPage.tsx        activeModal 통합, 브레드크럼, 모바일 네비 마운트
  src/components/QuizPopup.tsx           클로저 버그, 학년별 문구, 등급 기준
  src/components/GyeongnamExplorer.tsx   카드 한줄설명·비율·기준일 표시
  src/components/ContentCard.tsx         정보 위계, 더 알아보기 토글
  src/components/PlaceCard.tsx           동일 규칙
  src/components/PlaceSearchBar.tsx      매칭 확장, 빈 상태 문구
  src/components/NoticePopup.tsx / SourcesPopup.tsx / RouteExplorer.tsx /
  src/components/PlaceNameOrigins.tsx / FavoriteCourse.tsx
                                         ESC·스크롤 잠금·aria-label 통일
  .gitignore                             누락 시 env 항목 추가
신규
  src/components/ExplorerMobileNav.tsx   모바일 하단 4탭
  src/components/EmptyState.tsx          공통 빈/오류 상태
  src/components/Breadcrumb.tsx          현재 탐색 위치 배지 라인
  src/hooks/useModal.ts (선택)           ESC + body scroll lock 공통화
```

---

## 검수
- `tsgo` 타입체크, 빌드 통과 확인.
- Playwright로 데스크톱(1280) + 모바일(390) 두 뷰포트에서 헤더/모달/퀴즈 타이머(짧게 조정 후 원복 대신 답안 변경 → 즉시 검증 스크립트) 스크린샷.
- 콘솔 에러 0 확인.

---

## 유지/제외
- 색상 팔레트, 지도 중심 레이아웃, 카드 스타일, 관리자 패널 구조는 그대로.
- 미션/진도/랭킹/계정/포인트 기능 도입하지 않음.
- ExplorerPage 대규모 분할, 관리자 신기능 없음.

승인해 주시면 위 순서(A → H)로 파일별 병렬 수정하고, 마지막에 변경 파일·수정 이유·확인 필요 사항을 정리해 보고드리겠습니다.