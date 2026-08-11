---
name: image-storage
description: 관리자 업로드 이미지는 비공개 Supabase Storage(app-images)에 저장하고, 조회는 app-image 엣지 함수 프록시 URL로만 한다. base64/공개버킷/서명URL 저장 금지.
type: feature
---
관리자 모드(장소·콘텐츠·옛날사진·경남 시군 마스코트/로고·AdminMapEditor) 업로드 이미지 규칙:

- 저장소: `app-images` 버킷 (**비공개 유지** — 보안 스캔 조치. 절대 public으로 되돌리지 말 것)
- 업로드: `src/lib/uploadImage.ts` → `adminApi.uploadImage()` → `admin-action` 엣지 함수(service_role)
- 조회 URL: `${SUPABASE_URL}/functions/v1/app-image?path=<folder>/<file>` (읽기 전용 공개 프록시, 만료 없음)
- 정규화: `src/lib/imageUrl.ts`의 `getAppImageUrl()`이 레거시 `/object/public/app-images/...` 및 만료된 서명 URL을 프록시 URL로 변환. DB에서 읽어오는 모든 이미지 필드에 적용(`dataManager.ts`, `gyeongnam.ts`).
- 금지: base64 DataURL, 공개 버킷, DB에 서명 URL 저장(만료됨)
- 폴더: `places`, `content`, `content-old`, `city-logos`, `city-mascots`
