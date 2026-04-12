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
  boundary?: [number, number][] | [number, number][][];
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
    id: 'gyeongnam', name: '경상남도', nameHanja: '慶尙南道',
    population: 3205787, area: 10540.29,
    mascot: '벼리', mascotEmoji: '🌟',
    officialSite: 'https://www.gyeongnam.go.kr',
    nameOrigin: '경상남도는 경상도의 남쪽 지역을 뜻해요. 경상도라는 이름은 경주(慶州)와 상주(尙州)의 첫 글자를 합친 것이랍니다. 신라의 수도 경주와 상주가 이 지역의 중심이었기 때문이에요. 경상남도는 남해 바다와 지리산, 낙동강이 어우러진 아름다운 곳으로, 가야 문명의 발상지이자 임진왜란 때 이순신 장군과 의병들이 활약한 역사가 깊은 땅이에요. 도청소재지는 창원시에 있답니다.',
    lat: 35.2354, lng: 128.6922,
    highlights: ['도청소재지: 창원시', '18개 시·군', '가야문명 발상지', '한려해상국립공원', '지리산국립공원'],
    boundary: [],
  },
  {
    id: 'changwon', name: '창원시', nameHanja: '昌原市',
    population: 1005300, area: 748.06,
    mascot: '피우미', mascotEmoji: '🌸',
    officialSite: 'https://www.changwon.go.kr',
    nameOrigin: '옛날부터 이곳은 땅이 넓고 기름져서 사람들이 모여 살기에 아주 좋았답니다. \'창대하게 일어나는 벌판\'이라는 이름의 뜻처럼, 아주 작은 마을들이 하나둘씩 모여 힘을 합치기 시작했어요. 그렇게 시간이 흘러 지금은 경상남도에서 가장 크고 활기찬 도시가 되었지요. 마치 넓은 벌판에 새싹이 돋아나 큰 숲을 이루는 것처럼, 창원이라는 이름 안에는 우리 친구들처럼 무럭무럭 성장하길 바라는 마음이 가득 담겨 있답니다.',
    lat: 35.2279, lng: 128.6811,
    highlights: ['진해 군항제(벚꽃)', '용지호수 공원', '창원 복합문화센터', '마산 어시장', '창원 가로수길'],
    boundary: [
      [35.32,128.48],[35.34,128.55],[35.35,128.62],[35.34,128.70],[35.33,128.76],
      [35.28,128.82],[35.22,128.85],[35.17,128.83],[35.12,128.78],[35.10,128.72],
      [35.09,128.65],[35.10,128.58],[35.13,128.52],[35.18,128.48],[35.24,128.46],
    ],
  },
  {
    id: 'jinju', name: '진주시', nameHanja: '晉州市',
    population: 341200, area: 712.95,
    mascot: '하모, 아요', mascotEmoji: '🏮',
    officialSite: 'https://www.jinju.go.kr',
    nameOrigin: '아름다운 남강이 흐르는 이곳은 옛날부터 나루터가 아주 유명했어요. \'나루터가 있는 큰 고을\'이라는 이름의 뜻처럼, 강을 따라 배들이 오가며 많은 물건과 소중한 이야기들이 모여들었답니다. 남강의 물결이 반짝이는 것처럼 진주라는 이름은 보석처럼 빛나는 역사를 품고 있어요. 친구들이 강가에서 등불을 띄우며 소원을 빌듯, 진주는 오래전부터 사람들의 꿈과 희망이 모여들던 따뜻하고 큰 동네였답니다.',
    lat: 35.1796, lng: 128.1076,
    highlights: ['진주성(사적)', '남강유등축제', '국립진주박물관', '진양호 전망대', '경상남도 수목원'],
    boundary: [
      [35.30,127.96],[35.32,128.04],[35.31,128.12],[35.30,128.20],
      [35.24,128.26],[35.18,128.28],[35.12,128.24],[35.08,128.18],
      [35.06,128.10],[35.08,128.02],[35.12,127.96],[35.20,127.93],
    ],
  },
  {
    id: 'tongyeong', name: '통영시', nameHanja: '統營市',
    population: 120400, area: 239.85,
    mascot: '동백이', mascotEmoji: '⛵',
    officialSite: 'https://www.tongyeong.go.kr',
    nameOrigin: '바다를 지키는 용감한 군대인 \'통제영\'이 있던 곳이라서 통영이라는 이름을 갖게 되었어요. 조선시대에 이순신 장군님 같은 훌륭한 분들이 이곳에서 바다를 지휘하셨지요. \'바다를 다스리는 지휘본부\'라는 뜻처럼, 통영은 푸른 바다의 대장님 같은 도시랍니다. 예쁜 벽화마을과 맛있는 음식이 가득한 지금의 통영도, 옛날 우리 바다를 든든하게 지켜주던 용감한 기운을 그대로 이어받아 반짝이고 있어요.',
    lat: 34.8544, lng: 128.4330,
    highlights: ['통영 세병관(국보)', '동피랑 벽화마을', '이순신공원', '통영 케이블카', '소매물도'],
    boundary: [
      [34.93,128.32],[34.93,128.40],[34.92,128.48],[34.88,128.52],
      [34.83,128.50],[34.78,128.46],[34.76,128.40],[34.78,128.34],
      [34.82,128.30],[34.88,128.30],
    ],
  },
  {
    id: 'sacheon', name: '사천시', nameHanja: '泗川市',
    population: 109000, area: 398.68,
    mascot: '또록이, 또아', mascotEmoji: '✈️',
    officialSite: 'https://www.sacheon.go.kr',
    nameOrigin: '사천이라는 이름은 \'네 개의 냇물이 합쳐져 바다로 흐른다\'는 의미와 \'사수라는 강이 흐르는 곳\'이라는 뜻을 함께 가지고 있어요. 맑은 물이 굽이굽이 흘러 바다와 만나는 곳이라 옛날부터 물길이 아주 중요했답니다. 지금은 물길뿐만 아니라 하늘길도 열려 있어요! 우주항공의 중심지가 된 사천은, 옛날 냇물이 바다로 나아갔던 것처럼 이제는 푸른 하늘과 우주를 향해 힘차게 나아가는 꿈을 꾸는 도시랍니다.',
    lat: 35.0037, lng: 128.0641,
    highlights: ['사천 바다케이블카', '항공우주박물관', '다솔사(국가민속문화유산)', '사천 무지개 해안도로', '선진리성'],
    boundary: [
      [35.10,127.96],[35.10,128.04],[35.08,128.12],[35.04,128.16],
      [34.98,128.14],[34.93,128.10],[34.90,128.04],[34.92,127.97],
      [34.98,127.94],[35.04,127.94],
    ],
  },
  {
    id: 'gimhae', name: '김해시', nameHanja: '金海市',
    population: 531900, area: 463.45,
    mascot: '토더기', mascotEmoji: '👑',
    officialSite: 'https://www.gimhae.go.kr',
    nameOrigin: '옛날 가야 시대, 이 땅은 철이 아주 많이 나서 \'철의 왕국\'이라 불렸어요. \'철이 많이 나는 바닷가 고을\'이라는 이름처럼, 바다를 통해 다른 나라와 물건을 주고받으며 아주 부유하게 살았답니다. 수로왕과 허황옥 왕비의 전설이 깃든 이곳은 바다처럼 넓은 마음으로 전 세계 사람들과 친구가 되었던 곳이에요. 김해라는 이름 속에는 단단한 철처럼 튼튼하고, 바다처럼 넓은 꿈을 가진 가야 사람들의 용기가 담겨 있답니다.',
    lat: 35.2285, lng: 128.8894,
    highlights: ['수로왕릉(사적)', '대성동 고분군(유네스코)', '김해 가야테마파크', '국립김해박물관', '봉황동 유적'],
    boundary: [
      [35.32,128.80],[35.32,128.88],[35.30,128.96],[35.26,129.00],
      [35.20,129.02],[35.14,128.98],[35.12,128.92],[35.14,128.84],
      [35.18,128.80],[35.24,128.78],
    ],
  },
  {
    id: 'miryang', name: '밀양시', nameHanja: '密陽市',
    population: 100900, area: 799.03,
    mascot: '굿바비', mascotEmoji: '🎭',
    officialSite: 'https://www.miryang.go.kr',
    nameOrigin: '햇살이 유난히 밝게 비치는 이곳의 옛 이름은 \'미리벌\'이었어요. \'햇볕이 잘 드는 벌판\'이라는 뜻의 예쁜 순우리말 이름이지요. 얼마나 볕이 잘 들었는지, 이곳에서 자란 곡식들은 아주 맛있고 사람들의 웃음소리도 끊이지 않았답니다. 지금의 밀양이라는 이름도 그 따뜻한 햇살을 그대로 품고 있어요. 마치 우리 친구들의 환한 미소처럼, 세상에서 가장 따뜻하고 밝은 기운이 가득한 동네라는 뜻이 담겨 있답니다.',
    lat: 35.5037, lng: 128.7467,
    highlights: ['밀양 영남루(국보)', '표충사(지방유형문화유산)', '밀양 얼음골(명승)', '만어사', '위양지'],
    boundary: [
      [35.62,128.62],[35.63,128.72],[35.62,128.82],[35.58,128.90],
      [35.52,128.92],[35.44,128.88],[35.40,128.80],[35.38,128.70],
      [35.40,128.62],[35.46,128.58],[35.54,128.58],
    ],
  },
  {
    id: 'geoje', name: '거제시', nameHanja: '巨濟市',
    population: 233400, area: 403.86,
    mascot: '몽꾸', mascotEmoji: '🌊',
    officialSite: 'https://www.geoje.go.kr',
    nameOrigin: '바다 한가운데 떠 있는 커다란 섬인 이곳은 이름에 아주 특별한 약속이 숨겨져 있어요. \'크게 구제한다\'는 뜻의 이름처럼, 전쟁이나 어려운 일이 생겼을 때 수많은 사람을 품어주고 살려낸 따뜻한 곳이랍니다. 마치 엄마의 품처럼 넓고 깊은 바다가 우리를 감싸주는 것 같지요? 거제라는 이름 속에는 어려움에 처한 이웃을 도와주고 함께 살아가려는 착한 마음이 파도처럼 넘실거리고 있답니다.',
    lat: 34.8805, lng: 128.6211,
    highlights: ['거제 포로수용소 유적공원(기록유산)', '바람의 언덕', '외도 보타니아', '매미성', '흑진주 몽돌해변'],
    boundary: [
      [34.99,128.54],[35.00,128.62],[34.99,128.70],[34.96,128.76],
      [34.90,128.78],[34.84,128.76],[34.78,128.72],[34.74,128.66],
      [34.74,128.58],[34.78,128.52],[34.84,128.50],[34.92,128.50],
    ],
  },
  {
    id: 'yangsan', name: '양산시', nameHanja: '梁山市',
    population: 355800, area: 485.64,
    mascot: '양이와 산이', mascotEmoji: '🐟',
    officialSite: 'https://www.yangsan.go.kr',
    nameOrigin: '양산이라는 이름은 \'집의 들보(중심 기둥)처럼 든든한 산\'이라는 뜻을 가지고 있어요. 마을 뒤를 감싸 안은 산들이 마치 든든한 울타리처럼 사람들을 지켜주었답니다. 산의 정기를 받아 마음이 밝고 환한 사람들이 모여 살았다고 해서 \'밝은 산\'이라고 부르기도 했지요. 든든한 기둥처럼 나라의 중심이 되고, 밝은 햇살처럼 주변을 환하게 비추는 멋진 인재들이 많이 나오길 바라는 마음이 담긴 이름이랍니다.',
    lat: 35.3350, lng: 129.0373,
    highlights: ['양산 통도사(유네스코)', '내원사 계곡', '양산타워', '임경대', '법기수원지'],
    boundary: [
      [35.46,128.96],[35.46,129.04],[35.44,129.12],[35.38,129.16],
      [35.32,129.14],[35.26,129.10],[35.24,129.02],[35.26,128.96],
      [35.30,128.92],[35.38,128.92],
    ],
  },
  {
    id: 'uiryeong', name: '의령군', nameHanja: '宜寧郡',
    population: 25500, area: 482.91,
    mascot: '홍의장군', mascotEmoji: '⚔️',
    officialSite: 'https://www.uiryeong.go.kr',
    nameOrigin: '옛날부터 이곳은 사람들이 \'마땅히 편안하게 살 수 있는 곳\'으로 불렸어요. 산과 강이 잘 어우러져 마음이 평온해지는 동네였지요. 하지만 나라에 어려운 일이 생겼을 때는 홍의장군 곽재우 장군님과 의병들이 일어났던 용기 있는 고을이기도 해요. 평소에는 다정하고 편안하지만, 친구를 도와줄 때는 누구보다 용감해지는 우리 친구들처럼 의령은 따뜻함과 용맹함을 모두 가진 멋진 지명을 가지고 있답니다.',
    lat: 35.3222, lng: 128.2617,
    highlights: ['의병박물관', '충익사', '정암 솥바위', '일붕사', '한우산 도깨비숲'],
    boundary: [
      [35.42,128.16],[35.42,128.24],[35.40,128.32],[35.36,128.38],
      [35.30,128.38],[35.24,128.34],[35.22,128.26],[35.22,128.18],
      [35.26,128.14],[35.34,128.14],
    ],
  },
  {
    id: 'haman', name: '함안군', nameHanja: '咸安郡',
    population: 60400, area: 416.71,
    mascot: '함토리', mascotEmoji: '🏺',
    officialSite: 'https://www.haman.go.kr',
    nameOrigin: '함안은 \'모든 사람이 다 함께 편안하게 잘 산다\'는 아주 예쁜 뜻을 가지고 있어요. 아주 먼 옛날 아라가야라는 나라가 있던 시절부터, 사람들은 이 비옥한 땅에서 서로 돕고 나누며 행복하게 살았답니다. 말이산 고분군에 잠든 왕들의 이야기가 전해지는 것처럼, 함안은 평화로운 역사가 흐르는 곳이에요. 친구들이 교실에서 모두 사이좋게 지내길 바라는 마음처럼, 함안이라는 이름에는 평화와 행복의 약속이 들어있답니다.',
    lat: 35.2721, lng: 128.4065,
    highlights: ['말이산 고분군(유네스코)', '무진정', '함안 연꽃테마파크', '입곡군립공원', '고려동 유적지'],
    boundary: [
      [35.36,128.32],[35.36,128.40],[35.34,128.48],[35.30,128.52],
      [35.24,128.50],[35.20,128.44],[35.18,128.36],[35.20,128.30],
      [35.26,128.28],[35.32,128.30],
    ],
  },
  {
    id: 'changnyeong', name: '창녕군', nameHanja: '昌寧郡',
    population: 57500, area: 532.81,
    mascot: '화왕동자, 우포따오기', mascotEmoji: '🐦',
    officialSite: 'https://www.cng.go.kr',
    nameOrigin: '창녕은 \'창성하고 편안한 고을\'이라는 뜻이에요. 생명이 살아 숨 쉬는 우포늪처럼, 이곳은 아주 오래전부터 동식물과 사람들이 어우러져 풍요롭게 살았답니다. 따오기가 날아다니고 신비로운 늪이 있는 창녕은 마치 자연이 준 커다란 선물 상자 같아요. 번영하고 편안하라는 이름의 뜻처럼, 창녕은 자연의 생명력을 가득 품고 우리 친구들에게 맑은 공기와 건강한 미래를 선물해 주는 아주 소중한 동네랍니다.',
    lat: 35.5417, lng: 128.4914,
    highlights: ['창녕 우포늪(천연기념물)', '화왕산 억새군락', '창녕 교동과 송현동 고분군(유네스코)', '관룡사', '부곡온천'],
    boundary: [
      [35.64,128.38],[35.64,128.48],[35.62,128.56],[35.58,128.62],
      [35.52,128.62],[35.46,128.58],[35.44,128.50],[35.44,128.42],
      [35.48,128.36],[35.54,128.34],[35.60,128.36],
    ],
  },
  {
    id: 'gosung', name: '고성군', nameHanja: '固城郡',
    population: 48900, area: 517.89,
    mascot: '고니, 시니, 오니, 지니', mascotEmoji: '🦕',
    officialSite: 'https://www.goseong.go.kr',
    nameOrigin: '고성이라는 이름은 \'굳건한 성이 있는 고을\'이라는 뜻이에요. 아주 옛날 공룡들이 살았던 때부터, 이곳은 바닷가에 위치해 성처럼 튼튼하게 사람들을 지켜주었답니다. 공룡 발자국이 바위에 새겨진 것처럼, 고성은 긴 시간 동안 변치 않는 든든함을 가지고 있어요. \'온고지신\'이라는 마스코트 이름처럼 옛것을 배우고 새로운 것을 익혀서, 성처럼 튼튼하고 멋진 미래를 만들어가려는 꿈이 담긴 고장이랍니다.',
    lat: 34.9727, lng: 128.3220,
    highlights: ['고성 상족암군립공원(천연기념물)', '송학동 고분군(유네스코)', '당항포 관광지', '고성 Dinosaur 박물관', '문수암'],
    boundary: [
      [35.08,128.22],[35.08,128.30],[35.06,128.38],[35.02,128.44],
      [34.96,128.44],[34.90,128.40],[34.88,128.32],[34.88,128.24],
      [34.92,128.20],[34.98,128.18],[35.04,128.20],
    ],
  },
  {
    id: 'namhae', name: '남해군', nameHanja: '南海郡',
    population: 40800, area: 357.51,
    mascot: '해랑이', mascotEmoji: '🏝️',
    officialSite: 'https://www.namhae.go.kr',
    nameOrigin: '남해는 말 그대로 \'남쪽 바다에 있는 아름다운 섬\'이라는 뜻이에요. 에메랄드빛 바다와 초록색 다랭이논이 어우러진 보물섬 같은 곳이지요. 섬이라서 외로울 것 같지만, 바다를 통해 전 세계로 나아가는 넓은 길을 가진 곳이기도 해요. 남해라는 이름 속에는 시원한 바닷바람처럼 자유롭고, 넘실거리는 파도처럼 큰 꿈을 꾸는 사람들의 활기가 담겨 있답니다. 보물을 찾는 탐험가처럼 남해의 매력을 느껴보세요!',
    lat: 34.8375, lng: 127.8925,
    highlights: ['남해 가천 다랭이마을(명승)', '보리암', '독일마을', '남해 충렬사(사적)', '상주 은모래비치'],
    boundary: [
      [34.92,127.82],[34.92,127.90],[34.90,127.98],[34.86,128.02],
      [34.80,128.00],[34.76,127.94],[34.74,127.86],[34.76,127.80],
      [34.82,127.78],[34.88,127.80],
    ],
  },
  {
    id: 'hadong', name: '하동군', nameHanja: '河東郡',
    population: 41500, area: 675.24,
    mascot: '다사돌', mascotEmoji: '🍵',
    officialSite: 'https://www.hadong.go.kr',
    nameOrigin: '하동은 \'강의 동쪽 동네\'라는 뜻이에요. 여기서 강은 아주 맑기로 유명한 섬진강이랍니다. 지리산의 맑은 정기가 강물로 흘러드는 이곳은 산과 강이 만나는 아주 신비로운 곳이지요. 청학동 이야기가 전해지는 것처럼 하동은 맑고 깨끗한 마음을 가진 사람들이 모여 사는 곳이에요. 흐르는 강물처럼 멈추지 않고 발전하면서도, 숲처럼 포근하게 우리를 안아주는 하동의 이름은 자연 그 자체를 닮았답니다.',
    lat: 35.0673, lng: 127.7513,
    highlights: ['하동 쌍계사(지방유형문화유산)', '화개장터', '평사리 최참판댁', '삼성궁', '하동 야생차박물관'],
    boundary: [
      [35.20,127.62],[35.20,127.72],[35.18,127.80],[35.14,127.86],
      [35.08,127.88],[35.02,127.84],[34.96,127.78],[34.96,127.68],
      [35.00,127.62],[35.08,127.58],[35.14,127.58],
    ],
  },
  {
    id: 'sancheong', name: '산청군', nameHanja: '山清郡',
    population: 33800, area: 794.73,
    mascot: '산너머친구들', mascotEmoji: '⛰️',
    officialSite: 'https://www.sancheong.go.kr',
    nameOrigin: '산청이라는 이름은 \'산과 물이 아주 맑은 고을\'이라는 뜻이에요. 지리산의 높은 봉우리가 병풍처럼 둘러싸여 있고, 맑은 물이 끊임없이 흐른답니다. 공기가 너무 깨끗해서 옛날부터 몸을 낫게 해주는 약초들이 많이 자랐지요. 허준 선생님의 정성이 담긴 동의보감촌 이야기처럼, 산청은 자연의 깨끗한 힘으로 사람들의 마음과 몸을 치료해 주는 \'치유의 숲\' 같은 동네라는 따뜻한 의미를 담고 있답니다.',
    lat: 35.4157, lng: 127.8733,
    highlights: ['지리산 천왕봉', '동의보감촌', '산청 남사예담마을', '대원사 계곡', '정취암'],
    boundary: [
      [35.54,127.76],[35.54,127.86],[35.52,127.94],[35.48,128.00],
      [35.42,128.00],[35.36,127.96],[35.32,127.88],[35.32,127.80],
      [35.36,127.74],[35.44,127.72],[35.50,127.74],
    ],
  },
  {
    id: 'hamyang', name: '함양군', nameHanja: '咸陽郡',
    population: 37000, area: 725.56,
    mascot: '우리두리', mascotEmoji: '🌿',
    officialSite: 'https://www.hamyang.go.kr',
    nameOrigin: '함양은 \'모두가 밝은 햇살을 듬뿍 받는 곳\'이라는 뜻을 가지고 있어요. 높은 산으로 둘러싸여 있어도 해가 뜨면 온 마을이 환하게 빛난답니다. 옛 선비들이 이곳의 경치를 보며 글을 읽었던 것처럼 함양은 지혜롭고 밝은 기운이 가득해요. 상림 숲이 사람들에게 시원한 그늘을 주듯, 함양이라는 이름은 세상을 환하게 비추고 모든 이에게 따뜻한 사랑을 나누어주려는 밝은 마음을 의미한답니다.',
    lat: 35.5200, lng: 127.7254,
    highlights: ['함양 상림(천연기념물)', '남계서원(유네스코)', '서암정사', '지리산 조망공원(오도재)', '함양 대봉산 휴랜드'],
    boundary: [
      [35.64,127.60],[35.64,127.70],[35.62,127.78],[35.58,127.84],
      [35.52,127.84],[35.46,127.80],[35.44,127.72],[35.44,127.64],
      [35.48,127.58],[35.54,127.56],[35.60,127.58],
    ],
  },
  {
    id: 'geochang', name: '거창군', nameHanja: '居昌郡',
    population: 59800, area: 804.14,
    mascot: '거복이, 사각이', mascotEmoji: '🍎',
    officialSite: 'https://www.geochang.go.kr',
    nameOrigin: '거창은 \'크고 넓으며 밝은 벌판\'이라는 뜻이에요. 높은 산들 사이에 이렇게 넓고 좋은 벌판이 숨겨져 있어 사람들은 이곳을 축복받은 땅이라고 불렀답니다. 사과가 빨갛게 익어가는 것처럼 거창의 들판은 항상 풍요로움으로 가득해요. 이름의 뜻처럼 크게 성공하고 넓은 마음을 가지라는 조상님들의 소망이 담겨 있지요. 우리 친구들이 거창한 꿈을 꾸고 그 꿈을 넓은 세상에 펼칠 수 있게 도와주는 든든한 고장이랍니다.',
    lat: 35.6867, lng: 127.9094,
    highlights: ['거창 수승대(명승)', '우두산 Y자형 출렁다리', '거창 창포원', '가조 온천', '금원산 자연휴양림'],
    boundary: [
      [35.80,127.80],[35.80,127.90],[35.78,127.98],[35.74,128.04],
      [35.68,128.04],[35.62,128.00],[35.58,127.92],[35.58,127.84],
      [35.62,127.78],[35.70,127.76],[35.76,127.78],
    ],
  },
  {
    id: 'hapcheon', name: '합천군', nameHanja: '陜川郡',
    population: 41000, area: 983.47,
    mascot: '별쿵', mascotEmoji: '📿',
    officialSite: 'https://www.hapcheon.go.kr',
    nameOrigin: '합천은 \'여러 개의 물줄기가 하나로 합쳐지는 곳\'이라는 뜻이에요. 황강의 맑은 물이 굽이굽이 돌아 하나가 되는 것처럼, 이곳 사람들도 마음을 하나로 모으는 것을 아주 중요하게 생각했답니다. 팔만대장경을 소중히 지켜낸 해인사 스님들의 마음처럼, 합천은 작지만 소중한 것들이 모여 큰 힘을 발휘하는 신비로운 곳이에요. 흩어진 조각들이 모여 예쁜 퍼즐이 되듯, 합천이라는 이름에는 화합의 힘이 숨어있답니다.',
    lat: 35.5659, lng: 128.1659,
    highlights: ['합천 해인사(유네스코)', '황매산 철쭉군락지', '합천 영상테마파크', '정양늪 생태공원', '오도산 자연휴양림'],
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
