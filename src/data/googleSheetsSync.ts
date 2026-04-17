// Google Sheets 공개 CSV 동기화 모듈
import { Place, PlaceCategory, PublicSubCategory } from './places';

export const SHEETS_SYNC_EVENT = 'geoje-sheets-sync';

// 카테고리 한글→영문 매핑
const categoryMap: Record<string, PlaceCategory> = {
  '관광': 'tourism',
  '자연': 'nature',
  '문화': 'culture',
  '공공': 'public',
  '체험': 'experience',
  '시장': 'market',
};

const subCategoryMap: Record<string, PublicSubCategory> = {
  '시청': 'government', '행정': 'government', '군청': 'government', '구청': 'government',
  '병원': 'hospital',
  '소방': 'fire', '소방서': 'fire',
  '경찰': 'police', '경찰서': 'police',
  '우체국': 'post',
  '보건소': 'health', '보건': 'health',
  '교육': 'education', '박물관': 'education',
  '읍면동': 'government',
};

const gradeMap: Record<string, 3 | 4 | 'all'> = {
  '3': 3, '4': 4, 'all': 'all', '전체': 'all', '공통': 'all',
};

/**
 * Google Sheets 공개 URL → CSV fetch URL 변환
 * 지원 형식:
 *   https://docs.google.com/spreadsheets/d/{ID}/edit...
 *   https://docs.google.com/spreadsheets/d/{ID}/pub...
 *   직접 CSV URL
 */
export function toSheetCsvUrl(rawUrl: string): string {
  const trimmed = rawUrl.trim();
  // 이미 csv export URL이면 그대로
  if (trimmed.includes('/export?') && trimmed.includes('format=csv')) return trimmed;
  if (trimmed.includes('tqx=out:csv')) return trimmed;

  // /d/{ID}/ 패턴 추출
  const match = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
  if (match) {
    const sheetId = match[1];
    // gid 추출 시도
    const gidMatch = trimmed.match(/gid=(\d+)/);
    const gid = gidMatch ? gidMatch[1] : '0';
    return `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
  }
  return trimmed; // 그대로 반환
}

/**
 * CSV 문자열 파싱 (쉼표 구분, 따옴표 지원)
 */
function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') {
        current += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ',') {
        result.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }
  }
  result.push(current.trim());
  return result;
}

/**
 * 스프레드시트 열 매핑 (기본 열 순서):
 * 시군 | 카테고리 | 세부카테고리 | 장소명 | 설명 | 도로명주소 | 위도 | 경도 | 학년 | 홈페이지 | 이미지URL | 유튜브
 *
 * 첫 행이 헤더 → 헤더명으로 자동 매핑, 없으면 위 순서로 폴백
 */
interface ColumnMap {
  city: number;
  category: number;
  subCategory: number;
  name: number;
  description: number;
  address: number;
  lat: number;
  lng: number;
  grade: number;
  referenceUrl: number;
  imageUrl: number;
  youtubeUrl: number;
}

const headerAliases: Record<string, keyof ColumnMap> = {
  '시군': 'city', '지역': 'city',
  '카테고리': 'category', '분류': 'category', '주제': 'category',
  '세부분류': 'subCategory', '세부카테고리': 'subCategory', '소분류': 'subCategory',
  '장소': 'name', '장소명': 'name', '이름': 'name',
  '설명': 'description', '소개': 'description',
  '주소': 'address', '도로명주소': 'address', '도로명': 'address',
  '위도': 'lat',
  '경도': 'lng',
  '학년': 'grade',
  '홈페이지': 'referenceUrl', '웹사이트': 'referenceUrl', 'url': 'referenceUrl',
  '이미지': 'imageUrl', '이미지url': 'imageUrl', '사진': 'imageUrl',
  '유튜브': 'youtubeUrl', 'youtube': 'youtubeUrl', '영상': 'youtubeUrl',
};

function detectColumns(headerRow: string[]): ColumnMap {
  const map: Partial<ColumnMap> = {};
  headerRow.forEach((h, i) => {
    const normalized = h.toLowerCase().replace(/\s/g, '');
    for (const [alias, key] of Object.entries(headerAliases)) {
      if (normalized === alias.toLowerCase() || normalized.includes(alias.toLowerCase())) {
        map[key] = i;
        break;
      }
    }
  });
  // 기본 폴백
  const defaults: ColumnMap = {
    city: 0, category: 1, subCategory: 2, name: 3, description: 4,
    address: 5, lat: 6, lng: 7, grade: 8, referenceUrl: 9, imageUrl: 10, youtubeUrl: 11,
  };
  return { ...defaults, ...map };
}

/**
 * CSV 텍스트 → Place[] 변환
 */
export function parseCsvToPlaces(csv: string): Place[] {
  const lines = csv.split(/\r?\n/).filter(l => l.trim());
  if (lines.length < 2) return [];

  const headerRow = parseCsvLine(lines[0]);
  const cols = detectColumns(headerRow);

  const places: Place[] = [];
  for (let i = 1; i < lines.length; i++) {
    const fields = parseCsvLine(lines[i]);
    const name = fields[cols.name];
    const lat = parseFloat(fields[cols.lat]);
    const lng = parseFloat(fields[cols.lng]);
    if (!name || isNaN(lat) || isNaN(lng)) continue;

    const rawCategory = fields[cols.category] || '';
    const category = categoryMap[rawCategory] || 'tourism';

    const rawSubCat = fields[cols.subCategory] || '';
    const subCategory = subCategoryMap[rawSubCat] || undefined;

    const rawGrade = fields[cols.grade] || 'all';
    const grade = gradeMap[rawGrade] || 'all';

    const city = fields[cols.city] || '';
    const id = `sheet-${city}-${name}`.replace(/\s/g, '-').toLowerCase();

    places.push({
      id,
      name,
      category,
      subCategory: category === 'public' ? subCategory : undefined,
      description: fields[cols.description] || '',
      address: fields[cols.address] || '',
      lat,
      lng,
      grade,
      referenceUrl: fields[cols.referenceUrl] || undefined,
      imageUrl: fields[cols.imageUrl] || undefined,
      youtubeUrl: fields[cols.youtubeUrl] || undefined,
    });
  }
  return places;
}

/**
 * 스프레드시트에서 데이터 가져오기
 */
export async function fetchPlacesFromSheet(sheetUrl: string): Promise<Place[]> {
  const csvUrl = toSheetCsvUrl(sheetUrl);
  const response = await fetch(csvUrl);
  if (!response.ok) throw new Error(`시트 로드 실패: ${response.status}`);
  const csv = await response.text();
  return parseCsvToPlaces(csv);
}

// 캐시
let sheetPlacesCache: Place[] = [];
let lastFetchTime = 0;
const CACHE_DURATION = 60_000; // 1분

export async function getSheetPlaces(sheetUrl: string | null): Promise<Place[]> {
  if (!sheetUrl) return [];
  const now = Date.now();
  if (sheetPlacesCache.length > 0 && now - lastFetchTime < CACHE_DURATION) {
    return sheetPlacesCache;
  }
  try {
    sheetPlacesCache = await fetchPlacesFromSheet(sheetUrl);
    lastFetchTime = now;
    return sheetPlacesCache;
  } catch (e) {
    console.error('Google Sheets 동기화 실패:', e);
    return sheetPlacesCache; // 이전 캐시 반환
  }
}

export function clearSheetCache() {
  sheetPlacesCache = [];
  lastFetchTime = 0;
}

/**
 * 현재 places 데이터를 스프레드시트 형식의 CSV로 내보내기
 */
export function exportPlacesToCsv(places: Place[]): string {
  const reverseCat: Record<string, string> = {};
  Object.entries(categoryMap).forEach(([k, v]) => { reverseCat[v] = k; });
  const reverseSubCat: Record<string, string> = {};
  Object.entries(subCategoryMap).forEach(([k, v]) => { reverseSubCat[v] = k; });

  const header = '시군,카테고리,세부분류,장소명,설명,도로명주소,위도,경도,학년,홈페이지,이미지URL,유튜브';
  const rows = places.map(p => {
    const city = p.address?.match(/경상남도\s+(\S+)/)?.[1] || '';
    const cat = reverseCat[p.category] || p.category;
    const subCat = p.subCategory ? (reverseSubCat[p.subCategory] || p.subCategory) : '';
    const grade = p.grade === 'all' ? '전체' : String(p.grade || '전체');
    const escape = (s: string) => s.includes(',') || s.includes('"') ? `"${s.replace(/"/g, '""')}"` : s;
    return [city, cat, subCat, p.name, escape(p.description), escape(p.address), p.lat, p.lng, grade, p.referenceUrl || '', p.imageUrl || '', p.youtubeUrl || ''].join(',');
  });
  return [header, ...rows].join('\n');
}
