---
name: image-storage
description: 관리자 모드 업로드 이미지는 Supabase Storage(app-images 공개 버킷)에 저장하여 영구 공개 URL을 사용. base64/DataURL 사용 금지.
type: feature
---
관리자 모드(장소·콘텐츠·옛날사진·경남 시군 마스코트/로고·AdminMapEditor)에서 이미지 파일을 업로드하면, base64 DataURL이 아닌 Supabase Storage `app-images` 버킷에 업로드하고 public URL을 DB에 저장한다.

- 헬퍼: `src/lib/uploadImage.ts` → `uploadImageToStorage(file, folder)`
- 버킷: `app-images` (public, 누구나 read/insert/update/delete)
- 폴더 구분: `places`, `content`, `content-old`, `city-logos`, `city-mascots`
- 효과: 새로고침/다른 브라우저/다른 사용자에게도 이미지가 영구적으로 보임. DB row 크기도 작게 유지됨.
