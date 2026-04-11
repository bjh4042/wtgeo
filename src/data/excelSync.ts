// Excel 파일 업로드/다운로드 동기화 모듈
import * as XLSX from 'xlsx';
import { Place, PlaceCategory, PublicSubCategory } from './places';

// 카테고리 한글→영문 매핑
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

const gradeMap: Record<string, 3 | 4 | 'all'> = {
  '3': 3, '4': 4, 'all': 'all', '전체': 'all', '공통': 'all',
};

// 헤더 별칭
const headerAliases: Record<string, string> = {
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

interface RowData {
  city?: string; category?: string; subCategory?: string; name?: string;
  description?: string; address?: string; lat?: number; lng?: number;
  grade?: string; referenceUrl?: string; imageUrl?: string; youtubeUrl?: string;
}

function mapHeaders(headers: string[]): Record<number, string> {
  const map: Record<number, string> = {};
  headers.forEach((h, i) => {
    const normalized = h.trim().toLowerCase().replace(/\s/g, '');
    for (const [alias, key] of Object.entries(headerAliases)) {
      if (normalized === alias.toLowerCase() || normalized.includes(alias.toLowerCase())) {
        map[i] = key;
        break;
      }
    }
  });
  return map;
}

/**
 * Excel 파일(ArrayBuffer) → Place[] 파싱
 */
export function parseExcelToPlaces(buffer: ArrayBuffer): Place[] {
  const workbook = XLSX.read(buffer, { type: 'array' });
  const places: Place[] = [];

  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    if (rows.length < 2) continue;

    const headerMap = mapHeaders(rows[0].map(String));

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (!row || row.length === 0) continue;

      const data: RowData = {};
      Object.entries(headerMap).forEach(([idx, key]) => {
        (data as any)[key] = row[Number(idx)] != null ? String(row[Number(idx)]).trim() : '';
      });

      const name = data.name;
      const lat = parseFloat(String(data.lat || ''));
      const lng = parseFloat(String(data.lng || ''));
      if (!name || isNaN(lat) || isNaN(lng)) continue;

      const category = categoryMap[data.category || ''] || 'tourism';
      const subCategory = data.subCategory ? (subCategoryMap[data.subCategory] || undefined) : undefined;
      const rawGrade = data.grade || 'all';
      const grade = gradeMap[rawGrade] || 'all';
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
  }
  return places;
}

/**
 * Place[] → Excel 파일 다운로드
 */
export function exportPlacesToExcel(places: Place[], filename = '거제탐험대_장소데이터.xlsx') {
  const headers = ['시군', '카테고리', '세부분류', '장소명', '설명', '도로명주소', '위도', '경도', '학년', '홈페이지', '이미지URL', '유튜브'];

  const data = places.map(p => {
    const city = p.address?.match(/경상남도\s+(\S+)/)?.[1] || '';
    const cat = reverseCategoryMap[p.category] || p.category;
    const subCat = p.subCategory ? (reverseSubCategoryMap[p.subCategory] || p.subCategory) : '';
    const grade = p.grade === 'all' ? '전체' : String(p.grade || '전체');
    return [city, cat, subCat, p.name, p.description, p.address, p.lat, p.lng, grade, p.referenceUrl || '', p.imageUrl || '', p.youtubeUrl || ''];
  });

  const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);

  // 열 너비 설정
  ws['!cols'] = [
    { wch: 10 }, { wch: 8 }, { wch: 10 }, { wch: 20 }, { wch: 30 },
    { wch: 35 }, { wch: 12 }, { wch: 12 }, { wch: 6 }, { wch: 25 }, { wch: 25 }, { wch: 25 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, '장소데이터');
  XLSX.writeFile(wb, filename);
}
