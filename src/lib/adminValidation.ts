/**
 * 관리자 입력 검증 유틸 (최소 검증)
 * - 좌표: 숫자 형식과 위/경도 범위만 확인한다. 지역 제한은 두지 않는다.
 * - URL: http/https만 허용하고 javascript:, data: 등 실행형 URL을 차단한다.
 */

export interface CoordResult {
  ok: boolean;
  lat: number;
  lng: number;
  error?: string;
}

export function parseCoords(latInput: unknown, lngInput: unknown): CoordResult {
  const lat = parseFloat(String(latInput ?? '').trim());
  const lng = parseFloat(String(lngInput ?? '').trim());
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return { ok: false, lat: NaN, lng: NaN, error: '위도·경도를 숫자로 입력해주세요.' };
  }
  if (lat < -90 || lat > 90) {
    return { ok: false, lat, lng, error: '위도는 -90 ~ 90 사이여야 합니다.' };
  }
  if (lng < -180 || lng > 180) {
    return { ok: false, lat, lng, error: '경도는 -180 ~ 180 사이여야 합니다.' };
  }
  return { ok: true, lat, lng };
}

/** 링크로 저장해도 안전한 URL만 통과시킨다. 안전하지 않으면 undefined. */
export function safeUrl(value?: string | null): string | undefined {
  const v = (value ?? '').trim();
  if (!v) return undefined;
  if (/^https?:\/\//i.test(v)) return v;
  return undefined;
}

/** 저장 전 공통 문자열 정리 — 이름/주소처럼 한 줄 값에만 사용한다. */
export function trimText(value?: string | null): string {
  return (value ?? '').trim();
}

export function isBlank(value?: string | null): boolean {
  return trimText(value).length === 0;
}

/** 관리자 입력 최대 길이 (DB 손상 방지용 상한) */
export const MAX_NAME_LEN = 100;
export const MAX_ADDRESS_LEN = 200;
export const MAX_TEXT_LEN = 5000;

export function tooLong(value: string | undefined, max: number): boolean {
  return (value ?? '').length > max;
}
