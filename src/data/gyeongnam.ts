// 경상남도 18개 시군 데이터
import { detailedBoundaries } from './gyeongnamBoundaries';
import { supabase } from '@/integrations/supabase/client';

export interface GyeongnamCity {
  id: string;
  name: string;
  nameHanja: string;
  population: number;
  area: number;
  mascot: string;
  mascotEmoji: string;
  mascotImageUrl?: string;
  logoUrl?: string;
  officialSite: string;
  nameOrigin: string;
  lat: number;
  lng: number;
  highlights: string[];
  boundary?: [number, number][];
}

// In-memory cache for cloud edits
let cloudEditsCache: Record<string, Partial<GyeongnamCity>> = {};
let cloudEditsLoaded = false;

export const GYEONGNAM_UPDATED_EVENT = 'geoje-gyeongnam-updated';

// Load edits from Supabase
export async function loadGyeongnamEditsFromCloud(): Promise<void> {
  try {
    const { data, error } = await supabase
      .from('gyeongnam_edits')
      .select('*');
    if (error) throw error;
    if (data) {
      const edits: Record<string, Partial<GyeongnamCity>> = {};
      data.forEach((row: any) => {
        const edit: Partial<GyeongnamCity> = {};
        if (row.logo_url) edit.logoUrl = row.logo_url;
        if (row.mascot_image_url) edit.mascotImageUrl = row.mascot_image_url;
        if (row.name) edit.name = row.name;
        if (row.name_hanja) edit.nameHanja = row.name_hanja;
        if (row.population != null) edit.population = row.population;
        if (row.area != null) edit.area = Number(row.area);
        if (row.mascot) edit.mascot = row.mascot;
        if (row.mascot_emoji) edit.mascotEmoji = row.mascot_emoji;
        if (row.official_site) edit.officialSite = row.official_site;
        if (row.name_origin) edit.nameOrigin = row.name_origin;
        if (row.lat != null) edit.lat = Number(row.lat);
        if (row.lng != null) edit.lng = Number(row.lng);
        if (row.highlights) edit.highlights = row.highlights;
        edits[row.city_id] = edit;
      });
      cloudEditsCache = edits;
      cloudEditsLoaded = true;
    }
  } catch (e) {
    console.error('Failed to load gyeongnam edits from cloud:', e);
    // Fallback to localStorage
    try {
      const saved = localStorage.getItem('geoje-gyeongnam-edits');
      if (saved) cloudEditsCache = JSON.parse(saved);
    } catch {}
    cloudEditsLoaded = true;
  }
}

// Save edit to Supabase (upsert)
export async function saveGyeongnamEdit(id: string, edit: Partial<GyeongnamCity>): Promise<void> {
  // Update local cache immediately
  cloudEditsCache[id] = { ...cloudEditsCache[id], ...edit };

  // Also save to localStorage as fallback
  localStorage.setItem('geoje-gyeongnam-edits', JSON.stringify(cloudEditsCache));

  try {
    const row: any = {
      city_id: id,
      logo_url: edit.logoUrl ?? cloudEditsCache[id]?.logoUrl ?? null,
      mascot_image_url: edit.mascotImageUrl ?? cloudEditsCache[id]?.mascotImageUrl ?? null,
      name: edit.name ?? cloudEditsCache[id]?.name ?? null,
      name_hanja: edit.nameHanja ?? cloudEditsCache[id]?.nameHanja ?? null,
      population: edit.population ?? cloudEditsCache[id]?.population ?? null,
      area: edit.area ?? cloudEditsCache[id]?.area ?? null,
      mascot: edit.mascot ?? cloudEditsCache[id]?.mascot ?? null,
      mascot_emoji: edit.mascotEmoji ?? cloudEditsCache[id]?.mascotEmoji ?? null,
      official_site: edit.officialSite ?? cloudEditsCache[id]?.officialSite ?? null,
      name_origin: edit.nameOrigin ?? cloudEditsCache[id]?.nameOrigin ?? null,
      lat: edit.lat ?? cloudEditsCache[id]?.lat ?? null,
      lng: edit.lng ?? cloudEditsCache[id]?.lng ?? null,
      highlights: edit.highlights ?? cloudEditsCache[id]?.highlights ?? null,
      updated_at: new Date().toISOString(),
    };

    await supabase
      .from('gyeongnam_edits')
      .upsert(row, { onConflict: 'city_id' });
  } catch (e) {
    console.error('Failed to save gyeongnam edit to cloud:', e);
  }

  window.dispatchEvent(new Event(GYEONGNAM_UPDATED_EVENT));
}

const defaultGyeongnamCities: GyeongnamCity[] = [
  {
    id: 'changwon', name: '창원시', nameHanja: '昌原市',
    population: 1037000, area: 747.7,
    mascot: '피우미', mascotEmoji: '🌸',
    officialSite: 'https://www.changwon.go.kr',
    nameOrigin: '"창(昌, 번창하다)"과 "원(原, 들판)"이 합쳐진 이름으로, "번창하는 들판"이라는 뜻입니다. 2010년 마산·진해와 통합하여 경남 최대 도시가 되었습니다.',
    lat: 35.2279, lng: 128.6811,
    highlights: ['경상남도청 소재지', '진해 군항제(벚꽃)', '창원 NC파크'],
    boundary: [
      [35.32,128.48],[35.34,128.55],[35.35,128.62],[35.34,128.70],[35.33,128.76],
      [35.28,128.82],[35.22,128.85],[35.17,128.83],[35.12,128.78],[35.10,128.72],
      [35.09,128.65],[35.10,128.58],[35.13,128.52],[35.18,128.48],[35.24,128.46],
    ],
  },
  {
    id: 'jinju', name: '진주시', nameHanja: '晉州市',
    population: 340000, area: 712.6,
    mascot: '하모', mascotEmoji: '🏮',
    officialSite: 'https://www.jinju.go.kr',
    nameOrigin: '"진(晉, 나아가다)"과 "주(州, 고을)"가 합쳐진 이름으로, 삼국시대 "거열성"에서 유래했습니다. 진주대첩과 논개의 이야기가 유명합니다.',
    lat: 35.1796, lng: 128.1076,
    highlights: ['진주성', '진주 남강 유등축제', '논개'],
    boundary: [
      [35.30,127.96],[35.32,128.04],[35.31,128.12],[35.30,128.20],
      [35.24,128.26],[35.18,128.28],[35.12,128.24],[35.08,128.18],
      [35.06,128.10],[35.08,128.02],[35.12,127.96],[35.20,127.93],
    ],
  },
  {
    id: 'tongyeong', name: '통영시', nameHanja: '統營市',
    population: 128000, area: 239.8,
    mascot: '뚱이', mascotEmoji: '⛵',
    officialSite: 'https://www.tongyeong.go.kr',
    nameOrigin: '"통(統, 통솔하다)"과 "영(營, 군영)"이 합쳐져 "삼도수군통제영"에서 유래했습니다. 이순신 장군이 수군을 이끌던 곳입니다.',
    lat: 34.8544, lng: 128.4330,
    highlights: ['한산대첩', '동피랑 벽화마을', '통영 케이블카'],
    boundary: [
      [34.93,128.32],[34.93,128.40],[34.92,128.48],[34.88,128.52],
      [34.83,128.50],[34.78,128.46],[34.76,128.40],[34.78,128.34],
      [34.82,128.30],[34.88,128.30],
    ],
  },
  {
    id: 'sacheon', name: '사천시', nameHanja: '泗川市',
    population: 112000, area: 398.7,
    mascot: '아라', mascotEmoji: '✈️',
    officialSite: 'https://www.sacheon.go.kr',
    nameOrigin: '"사(泗, 물이름)"와 "천(川, 내)"이 합쳐져 "네 갈래의 물줄기"라는 뜻입니다. 항공우주산업의 중심지입니다.',
    lat: 35.0037, lng: 128.0641,
    highlights: ['한국항공우주산업(KAI)', '사천 바다케이블카', '비토섬'],
    boundary: [
      [35.10,127.96],[35.10,128.04],[35.08,128.12],[35.04,128.16],
      [34.98,128.14],[34.93,128.10],[34.90,128.04],[34.92,127.97],
      [34.98,127.94],[35.04,127.94],
    ],
  },
  {
    id: 'gimhae', name: '김해시', nameHanja: '金海市',
    population: 536000, area: 463.4,
    mascot: '토더기', mascotEmoji: '👑',
    officialSite: 'https://www.gimhae.go.kr',
    nameOrigin: '"금(金, 쇠)"과 "해(海, 바다)"가 합쳐진 이름으로, 가야의 시조 수로왕이 금빛 알에서 태어났다는 전설에서 유래했습니다.',
    lat: 35.2285, lng: 128.8894,
    highlights: ['수로왕릉', '봉하마을', '김해 가야테마파크'],
    boundary: [
      [35.32,128.80],[35.32,128.88],[35.30,128.96],[35.26,129.00],
      [35.20,129.02],[35.14,128.98],[35.12,128.92],[35.14,128.84],
      [35.18,128.80],[35.24,128.78],
    ],
  },
  {
    id: 'miryang', name: '밀양시', nameHanja: '密陽市',
    population: 104000, area: 799.0,
    mascot: '굿바비', mascotEmoji: '🎭',
    officialSite: 'https://www.miryang.go.kr',
    nameOrigin: '"밀(密, 빽빽하다)"과 "양(陽, 햇빛)"이 합쳐져 "햇빛이 빽빽한 곳"이라는 뜻입니다. 밀양아리랑으로 유명합니다.',
    lat: 35.5037, lng: 128.7467,
    highlights: ['영남루', '밀양아리랑', '얼음골'],
    boundary: [
      [35.62,128.62],[35.63,128.72],[35.62,128.82],[35.58,128.90],
      [35.52,128.92],[35.44,128.88],[35.40,128.80],[35.38,128.70],
      [35.40,128.62],[35.46,128.58],[35.54,128.58],
    ],
  },
  {
    id: 'geoje', name: '거제시', nameHanja: '巨濟市',
    population: 237000, area: 401.6,
    mascot: '파랑이', mascotEmoji: '🌊',
    officialSite: 'https://www.geoje.go.kr',
    nameOrigin: '"거(巨, 크다)"와 "제(濟, 건너다)"가 합쳐져 "크게 건너다"라는 뜻으로, 큰 섬을 건너야 한다는 의미에서 유래했습니다.',
    lat: 34.8805, lng: 128.6211,
    highlights: ['외도 보타니아', '거제포로수용소', '바람의 언덕'],
    boundary: [
      [34.99,128.54],[35.00,128.62],[34.99,128.70],[34.96,128.76],
      [34.90,128.78],[34.84,128.76],[34.78,128.72],[34.74,128.66],
      [34.74,128.58],[34.78,128.52],[34.84,128.50],[34.92,128.50],
    ],
  },
  {
    id: 'yangsan', name: '양산시', nameHanja: '梁山市',
    population: 367000, area: 485.4,
    mascot: '솔이', mascotEmoji: '🐟',
    officialSite: 'https://www.yangsan.go.kr',
    nameOrigin: '"양(梁, 들보)"과 "산(山, 산)"이 합쳐진 이름으로, 통도사가 있는 영축산 아래 펼쳐진 평야 도시입니다.',
    lat: 35.3350, lng: 129.0373,
    highlights: ['통도사', '양산 물금 황산공원', '에덴밸리'],
    boundary: [
      [35.46,128.96],[35.46,129.04],[35.44,129.12],[35.38,129.16],
      [35.32,129.14],[35.26,129.10],[35.24,129.02],[35.26,128.96],
      [35.30,128.92],[35.38,128.92],
    ],
  },
  {
    id: 'uiryeong', name: '의령군', nameHanja: '宜寧郡',
    population: 26000, area: 482.9,
    mascot: '의병이', mascotEmoji: '⚔️',
    officialSite: 'https://www.uiryeong.go.kr',
    nameOrigin: '"의(宜, 마땅하다)"와 "령(寧, 편안하다)"이 합쳐져 "마땅히 편안한 곳"이라는 뜻입니다. 곽재우 의병장으로 유명합니다.',
    lat: 35.3222, lng: 128.2617,
    highlights: ['곽재우 장군', '정암진 전투', '의령 소바위'],
    boundary: [
      [35.42,128.16],[35.42,128.24],[35.40,128.32],[35.36,128.38],
      [35.30,128.38],[35.24,128.34],[35.22,128.26],[35.22,128.18],
      [35.26,128.14],[35.34,128.14],
    ],
  },
  {
    id: 'haman', name: '함안군', nameHanja: '咸安郡',
    population: 65000, area: 417.1,
    mascot: '함이&아라', mascotEmoji: '🏺',
    officialSite: 'https://www.haman.go.kr',
    nameOrigin: '"함(咸, 모두)"과 "안(安, 편안하다)"이 합쳐져 "모두가 편안한 곳"이라는 뜻입니다. 아라가야의 중심지였습니다.',
    lat: 35.2721, lng: 128.4065,
    highlights: ['말이산 고분군', '함안 연꽃 테마파크', '아라가야'],
    boundary: [
      [35.36,128.32],[35.36,128.40],[35.34,128.48],[35.30,128.52],
      [35.24,128.50],[35.20,128.44],[35.18,128.36],[35.20,128.30],
      [35.26,128.28],[35.32,128.30],
    ],
  },
  {
    id: 'changnyeong', name: '창녕군', nameHanja: '昌寧郡',
    population: 61000, area: 533.4,
    mascot: '따오기', mascotEmoji: '🐦',
    officialSite: 'https://www.cng.go.kr',
    nameOrigin: '"창(昌, 번창하다)"과 "녕(寧, 편안하다)"이 합쳐져 "번창하고 편안한 곳"이라는 뜻입니다. 우포늪이 유명합니다.',
    lat: 35.5417, lng: 128.4914,
    highlights: ['우포늪(람사르 습지)', '창녕 따오기 복원센터', '화왕산'],
    boundary: [
      [35.64,128.38],[35.64,128.48],[35.62,128.56],[35.58,128.62],
      [35.52,128.62],[35.46,128.58],[35.44,128.50],[35.44,128.42],
      [35.48,128.36],[35.54,128.34],[35.60,128.36],
    ],
  },
  {
    id: 'gosung', name: '고성군', nameHanja: '固城郡',
    population: 50000, area: 517.4,
    mascot: '고룡이', mascotEmoji: '🦕',
    officialSite: 'https://www.goseong.go.kr',
    nameOrigin: '"고(固, 굳다)"와 "성(城, 성)"이 합쳐져 "굳건한 성"이라는 뜻입니다. 공룡 화석으로 유명합니다.',
    lat: 34.9727, lng: 128.3220,
    highlights: ['고성 공룡박물관', '당항포 관광지', '상족암'],
    boundary: [
      [35.08,128.22],[35.08,128.30],[35.06,128.38],[35.02,128.44],
      [34.96,128.44],[34.90,128.40],[34.88,128.32],[34.88,128.24],
      [34.92,128.20],[34.98,128.18],[35.04,128.20],
    ],
  },
  {
    id: 'namhae', name: '남해군', nameHanja: '南海郡',
    population: 42000, area: 357.6,
    mascot: '남해보물이', mascotEmoji: '🏝️',
    officialSite: 'https://www.namhae.go.kr',
    nameOrigin: '"남(南, 남쪽)"과 "해(海, 바다)"가 합쳐져 "남쪽 바다"라는 뜻입니다. 한국의 보물섬이라 불립니다.',
    lat: 34.8375, lng: 127.8925,
    highlights: ['독일마을', '보리암', '남해대교'],
    boundary: [
      [34.92,127.82],[34.92,127.90],[34.90,127.98],[34.86,128.02],
      [34.80,128.00],[34.76,127.94],[34.74,127.86],[34.76,127.80],
      [34.82,127.78],[34.88,127.80],
    ],
  },
  {
    id: 'hadong', name: '하동군', nameHanja: '河東郡',
    population: 44000, area: 675.4,
    mascot: '다솔이', mascotEmoji: '🍵',
    officialSite: 'https://www.hadong.go.kr',
    nameOrigin: '"하(河, 강)"와 "동(東, 동쪽)"이 합쳐져 "강의 동쪽"이라는 뜻입니다. 섬진강과 녹차로 유명합니다.',
    lat: 35.0673, lng: 127.7513,
    highlights: ['하동 녹차밭', '섬진강', '쌍계사'],
    boundary: [
      [35.20,127.62],[35.20,127.72],[35.18,127.80],[35.14,127.86],
      [35.08,127.88],[35.02,127.84],[34.96,127.78],[34.96,127.68],
      [35.00,127.62],[35.08,127.58],[35.14,127.58],
    ],
  },
  {
    id: 'sancheong', name: '산청군', nameHanja: '山清郡',
    population: 33000, area: 794.7,
    mascot: '약초도사', mascotEmoji: '⛰️',
    officialSite: 'https://www.sancheong.go.kr',
    nameOrigin: '"산(山, 산)"과 "청(清, 맑다)"이 합쳐져 "산이 맑은 곳"이라는 뜻입니다. 지리산 자락의 청정 고장입니다.',
    lat: 35.4157, lng: 127.8733,
    highlights: ['지리산', '한방약초축제', '남명 조식 유적'],
    boundary: [
      [35.54,127.76],[35.54,127.86],[35.52,127.94],[35.48,128.00],
      [35.42,128.00],[35.36,127.96],[35.32,127.88],[35.32,127.80],
      [35.36,127.74],[35.44,127.72],[35.50,127.74],
    ],
  },
  {
    id: 'hamyang', name: '함양군', nameHanja: '咸陽郡',
    population: 38000, area: 725.5,
    mascot: '함이&양이', mascotEmoji: '🌿',
    officialSite: 'https://www.hamyang.go.kr',
    nameOrigin: '"함(咸, 모두)"과 "양(陽, 햇빛)"이 합쳐져 "모든 곳에 햇빛이 비치는 곳"이라는 뜻입니다.',
    lat: 35.5200, lng: 127.7254,
    highlights: ['상림숲(천년의 숲)', '지리산 천왕봉', '함양 산삼축제'],
    boundary: [
      [35.64,127.60],[35.64,127.70],[35.62,127.78],[35.58,127.84],
      [35.52,127.84],[35.46,127.80],[35.44,127.72],[35.44,127.64],
      [35.48,127.58],[35.54,127.56],[35.60,127.58],
    ],
  },
  {
    id: 'geochang', name: '거창군', nameHanja: '居昌郡',
    population: 60000, area: 804.4,
    mascot: '감악이', mascotEmoji: '🍎',
    officialSite: 'https://www.geochang.go.kr',
    nameOrigin: '"거(居, 살다)"와 "창(昌, 번창하다)"이 합쳐져 "살기 좋고 번창하는 곳"이라는 뜻입니다.',
    lat: 35.6867, lng: 127.9094,
    highlights: ['거창 국제연극제', '수승대', '월성 우주창의과학관'],
    boundary: [
      [35.80,127.80],[35.80,127.90],[35.78,127.98],[35.74,128.04],
      [35.68,128.04],[35.62,128.00],[35.58,127.92],[35.58,127.84],
      [35.62,127.78],[35.70,127.76],[35.76,127.78],
    ],
  },
  {
    id: 'hapcheon', name: '합천군', nameHanja: '陜川郡',
    population: 43000, area: 983.5,
    mascot: '해비&찬슬', mascotEmoji: '📿',
    officialSite: 'https://www.hapcheon.go.kr',
    nameOrigin: '"합(陜, 좁다)"과 "천(川, 내)"이 합쳐져 "좁은 내가 흐르는 곳"이라는 뜻입니다. 해인사와 팔만대장경으로 유명합니다.',
    lat: 35.5659, lng: 128.1659,
    highlights: ['해인사(팔만대장경)', '합천 영상테마파크', '황매산'],
    boundary: [
      [35.70,128.02],[35.70,128.12],[35.68,128.22],[35.64,128.30],
      [35.58,128.32],[35.52,128.28],[35.46,128.20],[35.46,128.10],
      [35.50,128.04],[35.56,128.00],[35.64,128.00],
    ],
  },
];

// Merge with cloud edits and detailed boundaries
export function getGyeongnamCities(): GyeongnamCity[] {
  return defaultGyeongnamCities.map(city => {
    const edit = cloudEditsCache[city.id];
    const boundary = detailedBoundaries[city.id] || city.boundary;
    const merged = edit ? { ...city, ...edit } as GyeongnamCity : city;
    if (!edit?.boundary && boundary) {
      merged.boundary = boundary;
    }
    return merged;
  });
}

export function isGyeongnamEditsLoaded(): boolean {
  return cloudEditsLoaded;
}

// Keep backward compatible export
export const gyeongnamCities = defaultGyeongnamCities;

export function getGyeongnamCity(id: string): GyeongnamCity | undefined {
  return getGyeongnamCities().find(c => c.id === id);
}
