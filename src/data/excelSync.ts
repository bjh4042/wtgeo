// Excel 파일 업로드/다운로드 동기화 모듈
import * as XLSX from 'xlsx';
import { Place, PlaceCategory, PublicSubCategory } from './places';
import { MapContent, ContentCategory, contentCategoryLabels } from './content';

// ─── 장소 매핑 ───
const categoryMap: Record<string, PlaceCategory> = {
  '관광': 'tourism', '자연': 'nature', '문화': 'culture',
  '공공': 'public', '체험': 'experience', '시장': 'market',
};
const reverseCategoryMap: Record<string, string> = {};
Object.entries(categoryMap).forEach(([k, v]) => { reverseCategoryMap[v] = k; });

const subCategoryMap: Record<string, PublicSubCategory> = {
  '시청': 'government', '행정': 'government', '군청': 'government', '구청': 'government',
  '병원': 'hospital', '소방': 'fire', '소방서': 'fire',
  '경찰': 'police', '경찰서': 'police', '우체국': 'post',
  '보건소': 'health', '보건': 'health', '교육': 'education', '박물관': 'education',
  '읍면동': 'district',
};
const reverseSubCategoryMap: Record<string, string> = {};
Object.entries(subCategoryMap).forEach(([k, v]) => { if (!reverseSubCategoryMap[v]) reverseSubCategoryMap[v] = k; });

// ─── 콘텐츠 매핑 ───
const contentCategoryMap: Record<string, ContentCategory> = {
  '장소': 'place', '옛이야기': 'story', '이야기': 'story',
  '지명': 'placename', '지명유래': 'placename',
  '국가유산': 'heritage', '유산': 'heritage',
  '옛날과 오늘날': 'pastpresent', '옛날오늘날': 'pastpresent',
  '자연': 'nature',
};
const reverseContentCategoryMap: Record<string, string> = {};
Object.entries(contentCategoryLabels).forEach(([k, v]) => { reverseContentCategoryMap[k] = v; });

const gradeMap: Record<string, 3 | 4 | 'all'> = {
  '3': 3, '4': 4, 'all': 'all', '전체': 'all', '공통': 'all',
};

// ─── 공통 헤더 매핑 ───
function mapHeaders(headers: string[], aliases: Record<string, string>): Record<number, string> {
  const map: Record<number, string> = {};
  headers.forEach((h, i) => {
    const normalized = h.trim().toLowerCase().replace(/\s/g, '');
    for (const [alias, key] of Object.entries(aliases)) {
      if (normalized === alias.toLowerCase() || normalized.includes(alias.toLowerCase())) {
        map[i] = key;
        break;
      }
    }
  });
  return map;
}

function readRows(buffer: ArrayBuffer): any[][] {
  const wb = XLSX.read(buffer, { type: 'array' });
  const sheet = wb.Sheets[wb.SheetNames[0]];
  return XLSX.utils.sheet_to_json(sheet, { header: 1 });
}

// ═══════════════════════════════════════════
// 장소 (Places)
// ═══════════════════════════════════════════

const placeHeaderAliases: Record<string, string> = {
  '시군': 'city', '지역': 'city',
  '카테고리': 'category', '분류': 'category', '주제': 'category',
  '세부분류': 'subCategory', '세부카테고리': 'subCategory', '소분류': 'subCategory',
  '장소': 'name', '장소명': 'name', '이름': 'name',
  '설명': 'description', '소개': 'description',
  '주소': 'address', '도로명주소': 'address', '도로명': 'address',
  '위도': 'lat', '경도': 'lng', '학년': 'grade',
  '홈페이지': 'referenceUrl', '웹사이트': 'referenceUrl',
  '이미지': 'imageUrl', '이미지url': 'imageUrl', '사진': 'imageUrl',
  '유튜브': 'youtubeUrl', 'youtube': 'youtubeUrl', '영상': 'youtubeUrl',
};

export interface ExcelUploadResult {
  added: number;
  updated: number;
  total: number;
}

/**
 * Excel → Place[] 파싱 (이름 기반 중복 체크용 ID 생성)
 */
export function parseExcelToPlaces(buffer: ArrayBuffer): Place[] {
  const rows = readRows(buffer);
  if (rows.length < 2) return [];
  const headerMap = mapHeaders(rows[0].map(String), placeHeaderAliases);
  const places: Place[] = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length === 0) continue;
    const data: Record<string, string> = {};
    Object.entries(headerMap).forEach(([idx, key]) => {
      data[key] = row[Number(idx)] != null ? String(row[Number(idx)]).trim() : '';
    });

    const name = data.name;
    const lat = parseFloat(data.lat || '');
    const lng = parseFloat(data.lng || '');
    if (!name || isNaN(lat) || isNaN(lng)) continue;

    const category = categoryMap[data.category || ''] || 'tourism';
    const subCategory = data.subCategory ? (subCategoryMap[data.subCategory] || undefined) : undefined;
    const grade = gradeMap[data.grade || 'all'] || 'all';
    const city = data.city || '';
    const id = `excel-${city}-${name}`.replace(/\s/g, '-').toLowerCase();

    places.push({
      id, name, category,
      subCategory: category === 'public' ? subCategory : undefined,
      description: data.description || '',
      address: data.address || '',
      lat, lng, grade,
      referenceUrl: data.referenceUrl || undefined,
      imageUrl: data.imageUrl || undefined,
      youtubeUrl: data.youtubeUrl || undefined,
    });
  }
  return places;
}

/**
 * 중복 체크: 이름이 같은 기존 장소는 덮어쓰기, 새 장소만 추가
 */
export function deduplicatePlaces(newPlaces: Place[], existingPlaces: Place[]): { toSave: Place[]; added: number; updated: number } {
  const existingByName = new Map<string, Place>();
  existingPlaces.forEach(p => existingByName.set(p.name, p));

  let added = 0, updated = 0;
  const toSave: Place[] = [];

  for (const np of newPlaces) {
    const existing = existingByName.get(np.name);
    if (existing) {
      // 기존 ID 유지하면서 데이터 덮어쓰기
      toSave.push({ ...np, id: existing.id });
      updated++;
    } else {
      toSave.push(np);
      added++;
    }
  }
  return { toSave, added, updated };
}

/** Place[] → Excel 다운로드 */
export function exportPlacesToExcel(places: Place[], filename = '거제탐험대_장소데이터.xlsx') {
  const headers = ['시군', '카테고리', '세부분류', '장소명', '설명', '도로명주소', '위도', '경도', '학년', '홈페이지', '이미지URL', '유튜브'];
  const data = places.map(p => {
    const city = p.address?.match(/경상남도\s+(\S+)/)?.[1] || '';
    return [city, reverseCategoryMap[p.category] || p.category, p.subCategory ? (reverseSubCategoryMap[p.subCategory] || p.subCategory) : '', p.name, p.description, p.address, p.lat, p.lng, p.grade === 'all' ? '전체' : String(p.grade || '전체'), p.referenceUrl || '', p.imageUrl || '', p.youtubeUrl || ''];
  });
  const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
  ws['!cols'] = [{ wch: 10 }, { wch: 8 }, { wch: 10 }, { wch: 20 }, { wch: 30 }, { wch: 35 }, { wch: 12 }, { wch: 12 }, { wch: 6 }, { wch: 25 }, { wch: 25 }, { wch: 25 }];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, '장소데이터');
  XLSX.writeFile(wb, filename);
}

// ═══════════════════════════════════════════
// 콘텐츠 (Content)
// ═══════════════════════════════════════════

const contentHeaderAliases: Record<string, string> = {
  '카테고리': 'contentType', '분류': 'contentType', '유형': 'contentType',
  '이름': 'name', '콘텐츠명': 'name', '제목': 'name',
  '설명': 'description', '소개': 'description', '내용': 'description',
  '위도': 'lat', '경도': 'lng', '학년': 'grade',
  '아이콘': 'icon', '이모지': 'icon',
  '이미지': 'imageUrl', '이미지url': 'imageUrl', '사진': 'imageUrl',
  '출처': 'source', '자료출처': 'source',
  '홈페이지': 'referenceUrl', '웹사이트': 'referenceUrl', '참고링크': 'referenceUrl',
  '유튜브': 'youtubeUrl', 'youtube': 'youtubeUrl', '영상': 'youtubeUrl',
};

/** Excel → MapContent[] 파싱 */
export function parseExcelToContent(buffer: ArrayBuffer): MapContent[] {
  const rows = readRows(buffer);
  if (rows.length < 2) return [];
  const headerMap = mapHeaders(rows[0].map(String), contentHeaderAliases);
  const contents: MapContent[] = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length === 0) continue;
    const data: Record<string, string> = {};
    Object.entries(headerMap).forEach(([idx, key]) => {
      data[key] = row[Number(idx)] != null ? String(row[Number(idx)]).trim() : '';
    });

    const name = data.name;
    const lat = parseFloat(data.lat || '');
    const lng = parseFloat(data.lng || '');
    if (!name || isNaN(lat) || isNaN(lng)) continue;

    const contentType = contentCategoryMap[data.contentType || ''] || 'story';
    const grade = gradeMap[data.grade || 'all'] || 'all';
    const id = `excel-content-${name}`.replace(/\s/g, '-').toLowerCase();

    contents.push({
      id, name, contentType,
      description: data.description || '',
      lat, lng, grade,
      icon: data.icon || '📍',
      imageUrl: data.imageUrl || undefined,
      source: data.source || undefined,
      referenceUrl: data.referenceUrl || undefined,
      youtubeUrl: data.youtubeUrl || undefined,
    });
  }
  return contents;
}

/** 콘텐츠 중복 체크 */
export function deduplicateContent(newContent: MapContent[], existingContent: MapContent[]): { toSave: MapContent[]; added: number; updated: number } {
  const existingByName = new Map<string, MapContent>();
  existingContent.forEach(c => existingByName.set(c.name, c));

  let added = 0, updated = 0;
  const toSave: MapContent[] = [];

  for (const nc of newContent) {
    const existing = existingByName.get(nc.name);
    if (existing) {
      toSave.push({ ...nc, id: existing.id });
      updated++;
    } else {
      toSave.push(nc);
      added++;
    }
  }
  return { toSave, added, updated };
}

/** MapContent[] → Excel 다운로드 */
export function exportContentToExcel(contents: MapContent[], filename = '거제탐험대_콘텐츠데이터.xlsx') {
  const headers = ['카테고리', '이름', '설명', '위도', '경도', '학년', '아이콘', '출처', '홈페이지', '이미지URL', '유튜브'];
  const data = contents.map(c => [
    reverseContentCategoryMap[c.contentType] || c.contentType,
    c.name, c.description, c.lat, c.lng,
    c.grade === 'all' ? '전체' : String(c.grade || '전체'),
    c.icon || '📍', c.source || '', c.referenceUrl || '', c.imageUrl || '', c.youtubeUrl || '',
  ]);
  const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
  ws['!cols'] = [{ wch: 12 }, { wch: 20 }, { wch: 35 }, { wch: 12 }, { wch: 12 }, { wch: 6 }, { wch: 6 }, { wch: 20 }, { wch: 25 }, { wch: 25 }, { wch: 25 }];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, '콘텐츠데이터');
  XLSX.writeFile(wb, filename);
}
