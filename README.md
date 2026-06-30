# 거제 탐험대 (wtgeo)

거제시 초등학생을 위한 지역 탐험 학습 웹앱입니다. Vite + React + TypeScript + Tailwind + shadcn-ui 기반이며, 백엔드는 Lovable Cloud(Supabase), 지도는 Kakao Maps JavaScript SDK 를 사용합니다.

배포 주소: https://wtgeo.lovable.app

---

## 로컬에서 실행하기

### 1. 사전 준비

- Node.js 18 이상 (권장: 20 LTS)
- npm / pnpm / bun 중 하나 (아래 예시는 npm 기준)

### 2. 저장소 클론 & 의존성 설치

```bash
git clone <YOUR_GIT_URL>
cd <PROJECT_DIR>
npm install
```

### 3. 환경변수 설정

`.env.example` 파일을 복사해서 `.env` 를 만든 뒤 값을 채워주세요.

```bash
cp .env.example .env
```

| 변수 | 설명 |
| --- | --- |
| `VITE_SUPABASE_URL` | Lovable Cloud(Supabase) 프로젝트 URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase anon(publishable) 키 |
| `VITE_SUPABASE_PROJECT_ID` | Supabase 프로젝트 ref |
| `VITE_KAKAO_API_KEY` | Kakao Developers JavaScript 키 |

> Supabase 값은 Lovable 프로젝트 설정에서 자동으로 주입됩니다. 직접 로컬에서 받아 쓰는 경우 Lovable Cloud 백엔드 패널의 값을 그대로 사용하세요.

#### Kakao Maps 도메인 등록 (중요)

Kakao Maps SDK 는 등록된 도메인에서만 동작합니다. 로컬에서 지도를 띄우려면 Kakao Developers 콘솔에서:

1. [내 애플리케이션] → 사용할 앱 선택
2. [플랫폼] → [Web 플랫폼 등록]
3. 사이트 도메인에 `http://localhost:8080` 추가

`VITE_KAKAO_API_KEY` 를 비워두면 배포 도메인 전용 기본 키로 동작하여 로컬에서는 지도가 보이지 않을 수 있습니다.

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 http://localhost:8080 으로 접속합니다. (포트는 `vite.config.ts` 에서 변경 가능)

### 5. 기타 명령

```bash
npm run build       # 프로덕션 빌드 (dist/)
npm run preview     # 빌드 결과 로컬 미리보기
npm run lint        # ESLint
npm run test        # Vitest 1회 실행
npm run test:watch  # Vitest watch 모드
```

---

## 디렉터리 구조 요약

```
src/
  components/        UI 컴포넌트 (지도, 카드, 어드민 등)
  data/              데이터 매니저, 정적 데이터, 클라우드 동기화 로직
  hooks/             커스텀 훅
  integrations/
    supabase/        Supabase 클라이언트 (자동 생성, 직접 수정 금지)
  pages/             라우트 페이지
  lib/, test/        유틸 / 테스트
public/              정적 자산
supabase/            edge functions, config
```

---

## 트러블슈팅

- **지도가 빈 화면**: Kakao Developers 콘솔에 `http://localhost:8080` 도메인을 등록했는지, `VITE_KAKAO_API_KEY` 가 본인 키로 설정되었는지 확인하세요.
- **`supabase` 관련 오류**: `.env` 의 `VITE_SUPABASE_*` 값이 올바른지, Lovable Cloud 프로젝트가 활성화되어 있는지 확인하세요.
- **포트 충돌**: `vite.config.ts` 의 `server.port` 를 변경하고 Kakao 도메인도 동일하게 등록하세요.
