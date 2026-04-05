export type PlaceCategory = 'tourism' | 'nature' | 'culture' | 'public' | 'experience' | 'market';

export interface Place {
  id: string;
  name: string;
  category: PlaceCategory;
  description: string;
  address: string;
  lat: number;
  lng: number;
  grade?: 3 | 4 | 'all';
  imageUrl?: string;
  origin?: string;
  referenceUrl?: string;
  youtubeUrl?: string;
}

export const categoryLabels: Record<PlaceCategory, string> = {
  tourism: '🏖️ 관광 명소',
  nature: '🌿 자연/지리',
  culture: '🏛️ 문화/역사',
  public: '🏢 공공기관',
  experience: '🎒 체험학습',
  market: '🛒 전통시장/먹거리',
};

export const categoryColors: Record<PlaceCategory, string> = {
  tourism: '#FF6B35',
  nature: '#2E7D32',
  culture: '#6A1B9A',
  public: '#1565C0',
  experience: '#E65100',
  market: '#C62828',
};

export const categoryIcons: Record<PlaceCategory, string> = {
  tourism: '🏖️',
  nature: '🌿',
  culture: '🏛️',
  public: '🏢',
  experience: '🎒',
  market: '🛒',
};

export function getRoadViewUrl(lat: number, lng: number): string {
  return `https://map.kakao.com/link/roadview/${lat},${lng}`;
}

export function getDirectionUrl(lat: number, lng: number, name: string): string {
  return `https://map.kakao.com/link/to/${encodeURIComponent(name)},${lat},${lng}`;
}

export function getDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function getEstimatedTime(distanceKm: number): string {
  const minutes = Math.round(distanceKm / 40 * 60);
  if (minutes < 60) return `약 ${minutes}분`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `약 ${hours}시간 ${mins}분` : `약 ${hours}시간`;
}

// 좌표: Nominatim(OpenStreetMap) 기반 검증 완료
export const places: Place[] = [
  // ===== 관광 명소 =====
  {
    id: 't1', name: '바람의 언덕', category: 'tourism',
    description: '거제 남부면 도장포마을에 위치한 아름다운 언덕으로, 탁 트인 바다 전망과 바람개비가 유명합니다.',
    address: '경상남도 거제시 남부면 갈곶리 산14-47', lat: 34.7416, lng: 128.6625, grade: 'all',
    origin: '바다에서 불어오는 바람이 유난히 강하게 부는 언덕이라 하여 "바람의 언덕"이라 불리게 되었습니다.',
    referenceUrl: 'https://tour.geoje.go.kr',
  },
  {
    id: 't2', name: '외도 보타니아', category: 'tourism',
    description: '거제도 남쪽에 위치한 해상식물공원으로, 아열대 식물과 아름다운 정원이 조성되어 있습니다.',
    address: '경상남도 거제시 일운면 외도길 17', lat: 34.7693, lng: 128.7119, grade: 'all',
    origin: '1969년 태풍을 피해 이 섬에 머문 이창호·최호숙 부부가 30년에 걸쳐 가꾼 해상식물공원입니다.',
    referenceUrl: 'https://www.oedobotania.com',
  },
  {
    id: 't3', name: '해금강', category: 'tourism',
    description: '거제도 남동쪽 바다에 솟아있는 바위섬으로, 기암절벽과 해식동굴이 장관을 이룹니다. 명승 제2호.',
    address: '경상남도 거제시 남부면 갈곶리 산1', lat: 34.7327, lng: 128.6840, grade: 'all',
    origin: '바다의 금강산이라는 뜻으로, 그 경치가 금강산에 비견될 만큼 아름다워 "해금강"이라 이름 붙었습니다.',
    referenceUrl: 'https://tour.geoje.go.kr',
  },
  {
    id: 't4', name: '학동흑진주몽돌해변', category: 'tourism',
    description: '검은 몽돌(자갈)이 깔린 아름다운 해변으로, 파도가 몽돌을 굴리는 소리가 특별합니다.',
    address: '경상남도 거제시 동부면 학동리 276-5', lat: 34.7733, lng: 128.6406, grade: 'all',
    origin: '흑진주처럼 검고 윤기나는 몽돌이 해변에 깔려 있어 "흑진주몽돌해변"이라 불립니다.',
    referenceUrl: 'https://tour.geoje.go.kr',
  },
  {
    id: 't5', name: '신선대', category: 'tourism',
    description: '신선이 놀았다는 전설이 있는 바위 전망대로, 탁 트인 남해 전경을 감상할 수 있습니다.',
    address: '경상남도 거제시 남부면 갈곶리 산21-23', lat: 34.7382, lng: 128.6628, grade: 'all',
    origin: '옛날 신선들이 이곳의 경치에 반해 내려와 놀았다는 전설에서 유래되었습니다.',
    referenceUrl: 'https://tour.geoje.go.kr',
  },
  {
    id: 't6', name: '거제 맹종죽 테마파크', category: 'tourism',
    description: '울창한 대나무숲 속을 산책할 수 있는 테마파크로, 사계절 푸른 맹종죽이 아름답습니다.',
    address: '경상남도 거제시 하청면 거제북로 700', lat: 34.9676, lng: 128.6505, grade: 'all',
    origin: '맹종죽(孟宗竹)은 효자 맹종이 겨울에 어머니를 위해 죽순을 구했다는 고사에서 이름이 유래되었습니다.',
    referenceUrl: 'https://tour.geoje.go.kr',
  },
  {
    id: 't7', name: '거제 씨월드', category: 'tourism',
    description: '다양한 해양생물을 관찰하고 체험할 수 있는 해양테마파크입니다.',
    address: '경상남도 거제시 일운면 지세포해안로 15', lat: 34.8359, lng: 128.7016, grade: 'all',
    referenceUrl: 'https://tour.geoje.go.kr',
  },
  {
    id: 't8', name: '여차홍포해안', category: 'tourism',
    description: '여차~홍포 구간의 해안 절경으로, 기암괴석과 푸른 바다가 어우러진 비경을 자랑합니다.',
    address: '경상남도 거제시 남부면 다포리 산38-145', lat: 34.7136, lng: 128.6272, grade: 'all',
    origin: '여차(汝次)는 "너의 차례"라는 뜻으로, 이 마을에 도착하면 쉬어갈 차례라는 의미에서 유래되었습니다.',
    referenceUrl: 'https://tour.geoje.go.kr',
  },
  {
    id: 't9', name: '거제 해맞이 공원(양지암)', category: 'tourism',
    description: '일출 명소로 유명한 공원으로, 동해 방향으로 아름다운 해맞이를 감상할 수 있습니다.',
    address: '경상남도 거제시 능포동 산61-3', lat: 34.8804, lng: 128.7384, grade: 'all',
    referenceUrl: 'https://tour.geoje.go.kr',
  },
  {
    id: 't15', name: '매미성', category: 'tourism',
    description: '2003년 태풍 매미로 경작지를 잃은 백순삼 씨가 20년에 걸쳐 혼자 쌓아올린 성벽으로, 거제 9경 중 하나입니다. 바다와 성벽이 어우러진 독특한 경관이 유명합니다.',
    address: '경상남도 거제시 장목면 복항길 29', lat: 34.968629, lng: 128.705212, grade: 'all',
    origin: '2003년 태풍 매미로 인해 바닷가 경작지를 잃은 주민이 자연재해로부터 땅을 지키기 위해 돌을 하나하나 쌓아 만든 성입니다.',
    referenceUrl: 'https://tour.geoje.go.kr',
  },

  // ===== 자연/지리 =====
  {
    id: 'n1', name: '계룡산', category: 'nature',
    description: '거제시의 최고봉(566m)으로, 산세가 닭의 볏을 닮아 계룡산이라 불립니다.',
    address: '경상남도 거제시 거제면 옥산리', lat: 34.8711, lng: 128.6076, grade: 3,
    origin: '산의 능선이 닭의 볏(鷄)과 용(龍)의 형상을 닮았다 하여 "계룡산"이라 불립니다.',
  },
  {
    id: 'n2', name: '노자산', category: 'nature',
    description: '거제도에서 두 번째로 높은 산(565m)으로, 정상에서 거제도 전경을 조망할 수 있습니다.',
    address: '경상남도 거제시 동부면 구천리', lat: 34.7845, lng: 128.6162, grade: 3,
    origin: '노자(老子)가 이 산에서 수행했다는 전설에서 이름이 유래되었습니다.',
  },
  {
    id: 'n3', name: '구조라해수욕장', category: 'nature',
    description: '고운 모래사장과 잔잔한 파도가 특징인 해수욕장으로, 가족 단위 여행객에게 인기가 많습니다.',
    address: '경상남도 거제시 일운면 구조라리 500-1', lat: 34.8081, lng: 128.6917, grade: 'all',
    origin: '"구조라"는 아홉(九)개의 낚시(釣) 바위가 나란히(羅) 있다는 뜻에서 유래되었습니다.',
    referenceUrl: 'https://tour.geoje.go.kr',
  },
  {
    id: 'n4', name: '와현해수욕장', category: 'nature',
    description: '맑은 물과 고운 모래가 아름다운 해수욕장으로, 거제도 동쪽에 위치하고 있습니다.',
    address: '경상남도 거제시 일운면 와현리 619-1', lat: 34.8050, lng: 128.7050, grade: 'all',
    origin: '마을 뒤의 산이 누워(臥) 있는 고개(峴) 같다 하여 "와현"이라 불리게 되었습니다.',
    referenceUrl: 'https://tour.geoje.go.kr',
  },
  {
    id: 'n5', name: '칠천도', category: 'nature',
    description: '거제도 북서쪽에 위치한 섬으로, 칠천량해전의 역사적 장소입니다. 칠천대교로 연결되어 있습니다.',
    address: '경상남도 거제시 하청면 칠천도', lat: 34.9840, lng: 128.6250, grade: 4,
    origin: '옛날 이 섬의 논에서 천(千) 석의 쌀이 일곱(七) 번 수확되었다 하여 "칠천도"라 불립니다.',
  },
  {
    id: 'n6', name: '내도', category: 'nature',
    description: '외도 근처에 위치한 작은 섬으로, 자연 그대로의 모습을 간직하고 있습니다.',
    address: '경상남도 거제시 일운면 와현리 (내도길)', lat: 34.7855, lng: 128.7136, grade: 'all',
  },
  {
    id: 'n7', name: '대금산', category: 'nature',
    description: '거제도 북쪽에 위치한 산(437m)으로, 정상에서 다도해의 아름다운 전경을 감상할 수 있습니다.',
    address: '경상남도 거제시 장목면 대금리', lat: 34.9516, lng: 128.7000, grade: 3,
    origin: '산에서 금(金)이 많이 났다 하여 "대금산(大金山)"이라 불리게 되었습니다.',
  },
  {
    id: 'n8', name: '공곶이', category: 'nature',
    description: '수선화와 동백이 아름다운 해안 정원으로, 숲길 산책과 바다 풍경을 동시에 즐길 수 있습니다.',
    address: '경상남도 거제시 일운면 와현리 87', lat: 34.7949, lng: 128.7138, grade: 'all',
    origin: '곶(串)은 바다로 뻗은 땅을 뜻하며, 활(弓) 모양으로 생긴 곶이라 "공곶이"라 합니다.',
    referenceUrl: 'https://tour.geoje.go.kr',
  },
  {
    id: 'n9', name: '거제식물원(정글돔)', category: 'nature',
    description: '독특한 유리 온실 "정글돔"이 유명한 시립 식물원으로, 열대·아열대 식물과 다양한 테마정원을 감상할 수 있습니다. 정글타워에서 거제 전경도 볼 수 있습니다.',
    address: '경상남도 거제시 거제면 거제남서로 3595', lat: 34.857475, lng: 128.578544, grade: 'all',
    referenceUrl: 'https://www.geoje.go.kr/gbg/index.do',
  },

  // ===== 문화/역사 =====
  {
    id: 'c1', name: '거제포로수용소 유적공원', category: 'culture',
    description: '한국전쟁 당시 17만여 명의 포로를 수용했던 곳으로, 전쟁의 아픔과 평화의 소중함을 배울 수 있는 역사 교육 현장입니다.',
    address: '경상남도 거제시 계룡로 61', lat: 34.8775, lng: 128.6233, grade: 'all',
    origin: '1950년 한국전쟁 당시 유엔군이 인민군과 중공군 포로를 수용하기 위해 설치한 수용소입니다.',
    referenceUrl: 'https://www.pow.or.kr',
  },
  {
    id: 'c2', name: '옥포대첩기념공원', category: 'culture',
    description: '1592년 임진왜란 최초의 해전 승리인 옥포해전을 기념하는 공원으로, 이순신 장군의 업적을 기리고 있습니다.',
    address: '경상남도 거제시 팔랑포2길 87', lat: 34.9021, lng: 128.7141, grade: 'all',
    origin: '1592년 5월 7일 이순신 장군이 옥포만에서 왜선 26척을 격파한 첫 승전을 기념합니다.',
    referenceUrl: 'https://tour.geoje.go.kr',
  },
  {
    id: 'c3', name: '거제박물관', category: 'culture',
    description: '거제도의 선사시대부터 현대까지의 역사와 문화유산을 전시하는 박물관입니다.',
    address: '경상남도 거제시 거제대로 3791', lat: 34.8940, lng: 128.6862, grade: 'all',
    referenceUrl: 'https://tour.geoje.go.kr',
  },
  {
    id: 'c4', name: '거제향교', category: 'culture',
    description: '조선 태조 7년(1398)에 창건된 유교 교육기관으로, 거제 지역의 대표적인 전통 교육시설입니다.',
    address: '경상남도 거제시 기성로7길 10', lat: 34.8525, lng: 128.5896, grade: 3,
    origin: '조선시대 지방의 인재를 양성하기 위해 세운 국립 교육기관으로, 공자를 모시는 사당도 함께 있습니다.',
    referenceUrl: 'https://www.heritage.go.kr',
  },
  {
    id: 'c5', name: '거제 둔덕기성', category: 'culture',
    description: '고려시대에 축성된 성곽으로, 사적 제509호로 지정되어 있습니다. 고려 의종이 유배되었던 곳입니다.',
    address: '경상남도 거제시 둔덕면 거림리 산95', lat: 34.8682, lng: 128.4984, grade: 3,
    origin: '고려 18대 왕 의종이 정변으로 폐위된 후 이곳에 유배되어 지내다 세상을 떠난 역사적 장소입니다.',
    referenceUrl: 'https://www.heritage.go.kr',
  },
  {
    id: 'c9', name: '거제 기성관', category: 'culture',
    description: '조선시대 거제현의 관아 건물로, 관리들이 업무를 보던 곳입니다. 경상남도 유형문화재 제81호입니다.',
    address: '경상남도 거제시 거제면 동상리 546', lat: 34.8511, lng: 128.5913, grade: 3,
    origin: '거제(巨濟)의 옛 이름 "기성(岐城)"에서 따온 이름으로, 거제현의 중심 관아였습니다.',
    referenceUrl: 'https://www.heritage.go.kr',
  },
  {
    id: 'c10', name: '칠천량해전공원', category: 'culture',
    description: '1597년 정유재란 때 조선 수군이 대패한 칠천량해전을 기억하는 공원입니다.',
    address: '경상남도 거제시 하청면 칠천로 265-39', lat: 34.9772, lng: 128.6280, grade: 'all',
    origin: '칠천량(漆川梁)은 칠천도와 거제도 사이의 좁은 바다를 가리키며, 1597년 원균이 이끈 조선 수군이 일본에 대패한 곳입니다.',
    referenceUrl: 'https://tour.geoje.go.kr',
  },

  // ===== 4학년 경남 문화/역사 =====
  {
    id: 'c6', name: '한산도 이충무공유적', category: 'culture',
    description: '이순신 장군이 삼도수군통제영을 설치하고 한산대첩을 이끌었던 역사적 장소입니다.',
    address: '경상남도 통영시 한산면 두억리', lat: 34.7876, lng: 128.4792, grade: 4,
    origin: '1592년 이순신 장군이 학익진 전법으로 왜선 73척을 격파한 한산대첩이 벌어진 곳입니다.',
  },
  {
    id: 'c7', name: '합천 해인사', category: 'culture',
    description: '유네스코 세계문화유산 팔만대장경을 보관하고 있는 한국 3대 사찰 중 하나입니다.',
    address: '경상남도 합천군 가야면 치인리', lat: 35.8019, lng: 128.1015, grade: 4,
    origin: '해인(海印)은 화엄경의 "해인삼매"에서 따온 이름으로, 802년 순응·이정 두 스님이 창건했습니다.',
  },
  {
    id: 'c8', name: '진주성', category: 'culture',
    description: '임진왜란 진주대첩의 격전지로, 논개의 의로운 이야기가 전해지는 역사적 장소입니다.',
    address: '경상남도 진주시 본성동', lat: 35.1888, lng: 128.0776, grade: 4,
    origin: '삼국시대부터 축성된 성으로, 1592년 김시민 장군이 3800명으로 2만 왜군을 물리친 진주대첩이 유명합니다.',
  },
  {
    id: 'c11', name: '김해 수로왕릉', category: 'culture',
    description: '가야의 시조 수로왕의 무덤으로 전해지는 사적으로, 가야의 역사를 배울 수 있습니다.',
    address: '경상남도 김해시 서상동', lat: 35.2328, lng: 128.8721, grade: 4,
    origin: '서기 42년 구지봉에서 알(卵)에서 태어났다는 수로왕이 가락국을 건국한 전설이 전해집니다.',
  },
  {
    id: 'c12', name: '밀양 영남루', category: 'culture',
    description: '조선시대 3대 누각 중 하나로, 밀양강가 절벽 위에 지어진 아름다운 건축물입니다.',
    address: '경상남도 밀양시 내일동', lat: 35.4916, lng: 128.7551, grade: 4,
    origin: '고려 공민왕 때 지어진 누각으로, "영남(嶺南)에서 가장 아름다운 누각"이라는 의미입니다.',
  },

  // ===== 4학년 경남 관광 =====
  {
    id: 't10', name: '남해 독일마을', category: 'tourism',
    description: '1960~70년대 독일에서 일한 한국인 광부·간호사들이 귀국 후 정착한 마을로, 독일식 건물이 특징입니다.',
    address: '경상남도 남해군 삼동면 물건리', lat: 34.7992, lng: 128.0401, grade: 4,
    origin: '파독(派獨) 광부와 간호사들의 향수를 달래기 위해 독일풍 주택단지를 조성한 마을입니다.',
  },
  {
    id: 't11', name: '통영 동피랑벽화마을', category: 'tourism',
    description: '알록달록한 벽화로 유명한 통영의 언덕마을로, 바다 전망이 아름답습니다.',
    address: '경상남도 통영시 동호동', lat: 34.8457, lng: 128.4277, grade: 4,
    origin: '동피랑은 "동쪽 벼랑"의 경상도 방언으로, 철거 위기에 처한 마을을 벽화로 살려낸 이야기가 유명합니다.',
  },
  {
    id: 't12', name: '통영 케이블카', category: 'tourism',
    description: '한려수도의 아름다운 풍경을 한눈에 볼 수 있는 국내 최장 해상 케이블카입니다.',
    address: '경상남도 통영시 도남동', lat: 34.8265, lng: 128.4261, grade: 4,
  },
  {
    id: 't13', name: '남해 보리암', category: 'tourism',
    description: '남해 금산 정상 근처에 위치한 사찰로, 한국 3대 기도처 중 하나로 유명합니다.',
    address: '경상남도 남해군 상주면 상주리', lat: 34.7522, lng: 127.9830, grade: 4,
    origin: '신라 원효대사가 창건했다고 전해지며, 보리(菩提, 깨달음)를 구하는 암자라는 뜻입니다.',
  },
  {
    id: 't14', name: '산청 지리산', category: 'tourism',
    description: '한반도 남부의 최고봉 천왕봉(1,915m)이 있는 국립공원으로, 경남의 대표 명산입니다.',
    address: '경상남도 산청군 시천면', lat: 35.3312, lng: 127.6530, grade: 4,
    origin: '어리석은(智) 사람도 머물면 지혜로운(理) 사람이 된다는 뜻의 "지리산(智異山)"입니다.',
  },

  // ===== 공공기관 (3학년: 거제시) =====
  {
    id: 'p1', name: '거제시청', category: 'public',
    description: '거제시의 행정을 총괄하는 시청입니다. 시장과 공무원들이 시민을 위한 다양한 정책을 만들고 실행합니다.',
    address: '경상남도 거제시 계룡로 125', lat: 34.8805, lng: 128.6213, grade: 'all',
    origin: '1989년 거제군에서 거제시로 승격되면서 현재의 거제시청이 설립되었습니다.',
    referenceUrl: 'https://www.geoje.go.kr',
  },
  {
    id: 'p2', name: '거제경찰서', category: 'public',
    description: '거제시 일대의 치안을 담당하는 경찰서로, 시민의 안전을 지키는 기관입니다.',
    address: '경상남도 거제시 옥포대첩로 71', lat: 34.8976, lng: 128.6867, grade: 'all',
  },
  {
    id: 'p3', name: '거제소방서', category: 'public',
    description: '거제시의 화재 예방, 진압, 구조·구급 업무를 담당하는 소방서입니다. 119에 신고하면 출동합니다.',
    address: '경상남도 거제시 진목로 1 (옥포동)', lat: 34.8962, lng: 128.6862, grade: 'all',
  },
  {
    id: 'p4', name: '거제시보건소', category: 'public',
    description: '거제시민의 건강을 위한 예방접종, 건강검진 등 보건의료서비스를 제공하는 기관입니다.',
    address: '경상남도 거제시 수양로 506 (양정동)', lat: 34.891920, lng: 128.636757, grade: 'all',
  },
  {
    id: 'p5', name: '거제교육지원청', category: 'public',
    description: '거제시 관내 초·중·고등학교의 교육행정을 담당하는 기관으로, 학교와 선생님들을 지원합니다.',
    address: '경상남도 거제시 거제중앙로 1809 (고현동)', lat: 34.8798, lng: 128.6266, grade: 'all',
    referenceUrl: 'https://geoje.gne.go.kr',
  },
  {
    id: 'p6', name: '거제시립도서관(장평)', category: 'public',
    description: '거제시민을 위한 공공도서관으로, 다양한 도서 대출과 독서·문화 프로그램을 운영합니다.',
    address: '경상남도 거제시 장평3로 10 (장평동)', lat: 34.8894, lng: 128.6094, grade: 'all',
  },
  {
    id: 'p7', name: '거제우체국', category: 'public',
    description: '편지, 택배 등 우편 서비스와 금융 서비스를 제공하는 우체국입니다.',
    address: '경상남도 거제시 거제중앙로17길 19 (고현동)', lat: 34.8841, lng: 128.6231, grade: 'all',
  },
  {
    id: 'p8', name: '거제시의회', category: 'public',
    description: '거제시 주민이 뽑은 시의원들이 모여 시의 중요한 일을 의논하고 결정하는 기관입니다.',
    address: '경상남도 거제시 계룡로 125', lat: 34.8805, lng: 128.6213, grade: 'all',
  },
  {
    id: 'p9', name: '거제세무서(통영세무서 거제지서)', category: 'public',
    description: '거제시 관내 세금(국세) 관련 업무를 처리하는 국세청 소속 기관입니다.',
    address: '경상남도 거제시 계룡로11길 9 (고현동)', lat: 34.8800, lng: 128.6210, grade: 'all',
  },
  {
    id: 'p15', name: '거제시 평생학습센터', category: 'public',
    description: '거제 시민들이 다양한 교육과 문화 프로그램에 참여할 수 있는 평생교육 기관입니다.',
    address: '경상남도 거제시 계룡로 125', lat: 34.8805, lng: 128.6213, grade: 3,
  },

  // ===== 면사무소 =====
  {
    id: 'p-geojemyeon', name: '거제면사무소', category: 'public',
    description: '거제면 지역 주민의 행정 업무를 담당하는 면사무소입니다.',
    address: '경상남도 거제시 거제면 서상길 1', lat: 34.851002, lng: 128.590419, grade: 3,
  },
  {
    id: 'p-dundeokmyeon', name: '둔덕면사무소', category: 'public',
    description: '둔덕면 지역 주민의 행정 업무를 담당하는 면사무소입니다.',
    address: '경상남도 거제시 둔덕면 둔덕로 1', lat: 34.8700, lng: 128.5000, grade: 3,
  },
  {
    id: 'p-sadeungmyeon', name: '사등면사무소', category: 'public',
    description: '사등면 지역 주민의 행정 업무를 담당하는 면사무소입니다.',
    address: '경상남도 거제시 사등면 사등로 51', lat: 34.9180, lng: 128.5600, grade: 3,
  },
  {
    id: 'p-yeonchomyeon', name: '연초면사무소', category: 'public',
    description: '연초면 지역 주민의 행정 업무를 담당하는 면사무소입니다.',
    address: '경상남도 거제시 연초면 연초로 30', lat: 34.9220, lng: 128.6500, grade: 3,
  },
  {
    id: 'p-hacheongmyeon', name: '하청면사무소', category: 'public',
    description: '하청면 지역 주민의 행정 업무를 담당하는 면사무소입니다.',
    address: '경상남도 거제시 하청면 하청로 1', lat: 34.9570, lng: 128.6550, grade: 3,
  },
  {
    id: 'p-jangmokmyeon', name: '장목면사무소', category: 'public',
    description: '장목면 지역 주민의 행정 업무를 담당하는 면사무소입니다.',
    address: '경상남도 거제시 장목면 장목로 1', lat: 35.0100, lng: 128.7200, grade: 3,
  },
  {
    id: 'p-ilunmyeon', name: '일운면사무소', category: 'public',
    description: '일운면 지역 주민의 행정 업무를 담당하는 면사무소입니다.',
    address: '경상남도 거제시 일운면 지세포해안로 80', lat: 34.8290, lng: 128.7060, grade: 3,
  },
  {
    id: 'p-dongbumyeon', name: '동부면사무소', category: 'public',
    description: '동부면 지역 주민의 행정 업무를 담당하는 면사무소입니다.',
    address: '경상남도 거제시 동부면 거제중앙로 285', lat: 34.7850, lng: 128.6300, grade: 3,
  },
  {
    id: 'p-nambumyeon', name: '남부면사무소', category: 'public',
    description: '남부면 지역 주민의 행정 업무를 담당하는 면사무소입니다.',
    address: '경상남도 거제시 남부면 남부로 1', lat: 34.7420, lng: 128.6500, grade: 3,
  },

  // ===== 동주민센터 =====
  {
    id: 'p-gohyeon', name: '고현동주민센터', category: 'public',
    description: '고현동 주민의 행정 민원 업무를 처리하는 동주민센터입니다.',
    address: '경상남도 거제시 거제중앙로 1801 (고현동)', lat: 34.8854, lng: 128.6240, grade: 3,
  },
  {
    id: 'p-sangmun', name: '상문동주민센터', category: 'public',
    description: '상문동 주민의 행정 민원 업무를 처리하는 동주민센터입니다.',
    address: '경상남도 거제시 거제중앙로 1567 (상문동)', lat: 34.8640, lng: 128.6700, grade: 3,
  },
  {
    id: 'p-okpo1', name: '옥포1동주민센터', category: 'public',
    description: '옥포1동 주민의 행정 민원 업무를 처리하는 동주민센터입니다.',
    address: '경상남도 거제시 옥포로 120 (옥포동)', lat: 34.8942, lng: 128.6899, grade: 3,
  },
  {
    id: 'p-okpo2', name: '옥포2동주민센터', category: 'public',
    description: '옥포2동 주민의 행정 민원 업무를 처리하는 동주민센터입니다.',
    address: '경상남도 거제시 진목로 3 (옥포동)', lat: 34.8960, lng: 128.6860, grade: 3,
  },
  {
    id: 'p-jangseungpo', name: '장승포동주민센터', category: 'public',
    description: '장승포동 주민의 행정 민원 업무를 처리하는 동주민센터입니다.',
    address: '경상남도 거제시 장승포로 38 (장승포동)', lat: 34.8678, lng: 128.7289, grade: 3,
  },
  {
    id: 'p-neungpo', name: '능포동주민센터', category: 'public',
    description: '능포동 주민의 행정 민원 업무를 처리하는 동주민센터입니다.',
    address: '경상남도 거제시 능포로 53 (능포동)', lat: 34.8804, lng: 128.7384, grade: 3,
  },
  {
    id: 'p-aju', name: '아주동주민센터', category: 'public',
    description: '아주동 주민의 행정 민원 업무를 처리하는 동주민센터입니다.',
    address: '경상남도 거제시 아주로 30 (아주동)', lat: 34.8686, lng: 128.6838, grade: 3,
  },
  {
    id: 'p-jangpyeong', name: '장평동주민센터', category: 'public',
    description: '장평동 주민의 행정 민원 업무를 처리하는 동주민센터입니다.',
    address: '경상남도 거제시 장평3로 10 (장평동)', lat: 34.8890, lng: 128.6090, grade: 3,
  },
  {
    id: 'p-suyang', name: '수양동주민센터', category: 'public',
    description: '수양동 주민의 행정 민원 업무를 처리하는 동주민센터입니다.',
    address: '경상남도 거제시 수양로 506 (수양동)', lat: 34.8720, lng: 128.6180, grade: 3,
  },

  // ===== 파출소 =====
  {
    id: 'p-police-gohyeon', name: '고현파출소', category: 'public',
    description: '고현 지역의 치안을 담당하는 파출소입니다.',
    address: '경상남도 거제시 거제중앙로 1801', lat: 34.8850, lng: 128.6245, grade: 3,
  },
  {
    id: 'p-police-okpo', name: '옥포파출소', category: 'public',
    description: '옥포 지역의 치안을 담당하는 파출소입니다.',
    address: '경상남도 거제시 옥포대첩로 71', lat: 34.8970, lng: 128.6870, grade: 3,
  },
  {
    id: 'p-police-jangseungpo', name: '장승포파출소', category: 'public',
    description: '장승포 지역의 치안을 담당하는 파출소입니다.',
    address: '경상남도 거제시 장승포로 50', lat: 34.8680, lng: 128.7290, grade: 3,
  },
  {
    id: 'p-police-sadeung', name: '사등파출소', category: 'public',
    description: '사등면 지역의 치안을 담당하는 파출소입니다.',
    address: '경상남도 거제시 사등면 사등로 55', lat: 34.9180, lng: 128.5600, grade: 3,
  },
  {
    id: 'p-police-hacheong', name: '하청파출소', category: 'public',
    description: '하청면 지역의 치안을 담당하는 파출소입니다.',
    address: '경상남도 거제시 하청면 하청로 5', lat: 34.9575, lng: 128.6555, grade: 3,
  },

  // ===== 우체국 =====
  {
    id: 'p-post-okpo', name: '옥포우체국', category: 'public',
    description: '옥포 지역의 우편, 택배 등 우정서비스를 제공하는 우체국입니다.',
    address: '경상남도 거제시 옥포로 125', lat: 34.8940, lng: 128.6900, grade: 3,
  },
  {
    id: 'p-post-jangseungpo', name: '장승포우체국', category: 'public',
    description: '장승포 지역의 우편 서비스를 제공하는 우체국입니다.',
    address: '경상남도 거제시 장승포로 40', lat: 34.8680, lng: 128.7290, grade: 3,
  },
  {
    id: 'p-post-geojemyeon', name: '거제우체국(거제면)', category: 'public',
    description: '거제면 지역의 우편 서비스를 제공하는 우체국입니다.',
    address: '경상남도 거제시 거제면 서상길 5', lat: 34.8515, lng: 128.5908, grade: 3,
  },

  // ===== 소방서/119안전센터 =====
  {
    id: 'p-fire-gohyeon', name: '고현119안전센터', category: 'public',
    description: '고현 지역의 화재 진압, 구조, 구급 업무를 담당하는 119안전센터입니다.',
    address: '경상남도 거제시 계룡로 130', lat: 34.8810, lng: 128.6215, grade: 3,
  },
  {
    id: 'p-fire-jangseungpo', name: '장승포119안전센터', category: 'public',
    description: '장승포 지역의 화재 진압, 구조, 구급 업무를 담당하는 119안전센터입니다.',
    address: '경상남도 거제시 장승포로 55', lat: 34.8680, lng: 128.7295, grade: 3,
  },

  // ===== 공공기관 (4학년: 경상남도) =====
  {
    id: 'p10', name: '경상남도청', category: 'public',
    description: '경상남도의 행정을 총괄하는 도청으로, 도지사와 공무원들이 도민을 위한 정책을 수행합니다.',
    address: '경상남도 창원시 의창구 사림동 1', lat: 35.2379, lng: 128.6919, grade: 4,
    origin: '1896년 경상남도가 설치된 이후 진주, 부산을 거쳐 2010년 창원으로 도청이 이전되었습니다.',
  },
  {
    id: 'p11', name: '경상남도교육청', category: 'public',
    description: '경상남도 전체의 초·중·고 교육행정을 총괄하는 기관입니다.',
    address: '경상남도 창원시 성산구 용호동', lat: 35.2346, lng: 128.6880, grade: 4,
  },
  {
    id: 'p12', name: '경상남도의회', category: 'public',
    description: '경상남도민이 뽑은 도의원들이 모여 도의 중요한 일을 의논하고 결정하는 지방의회입니다.',
    address: '경상남도 창원시 의창구 사림동', lat: 35.2365, lng: 128.6944, grade: 4,
  },
  {
    id: 'p13', name: '경남경찰청', category: 'public',
    description: '경상남도 전체의 치안을 총괄하는 경찰청입니다.',
    address: '경상남도 창원시 의창구 사림동', lat: 35.2374, lng: 128.6936, grade: 4,
  },
  {
    id: 'p14', name: '창원지방법원', category: 'public',
    description: '경상남도 관할의 재판 업무를 담당하는 법원으로, 법에 따라 공정하게 판결합니다.',
    address: '경상남도 창원시 성산구 사파동', lat: 35.2243, lng: 128.7010, grade: 4,
  },

  // ===== 체험학습 =====
  {
    id: 'e1', name: '거제자연휴양림', category: 'experience',
    description: '자연 속에서 숲 체험, 산책, 야영 등 다양한 자연 체험활동을 할 수 있는 휴양림입니다.',
    address: '경상남도 거제시 동부면 노자산길 315', lat: 34.7900, lng: 128.6200, grade: 'all',
    referenceUrl: 'https://tour.geoje.go.kr',
  },
  {
    id: 'e2', name: '거제어촌민속전시관', category: 'experience',
    description: '거제도의 어촌 문화와 어업 역사를 배우고, 전통 어구를 직접 볼 수 있는 전시관입니다.',
    address: '경상남도 거제시 일운면 지세포해안로 41', lat: 34.8337, lng: 128.7019, grade: 3,
    origin: '거제도는 예로부터 풍부한 어장을 가진 섬으로, 어촌 문화가 깊이 뿌리내린 곳입니다.',
    referenceUrl: 'https://tour.geoje.go.kr',
  },
  {
    id: 'e3', name: '거제해양레저체험(요트학교)', category: 'experience',
    description: '카약, 요트, 투명카누 등 다양한 해양 레저를 직접 체험할 수 있는 곳입니다.',
    address: '경상남도 거제시 일운면 지세포해안로 41', lat: 34.8337, lng: 128.7019, grade: 'all',
    referenceUrl: 'https://tour.geoje.go.kr',
  },
  {
    id: 'e4', name: '거제도 짚라인(덕포 씨라인)', category: 'experience',
    description: '거제도의 아름다운 바다 경치를 감상하며 짚라인을 타는 스릴 넘치는 체험시설입니다.',
    address: '경상남도 거제시 옥포대첩로 422-2', lat: 34.9136, lng: 128.7148, grade: 'all',
    referenceUrl: 'https://tour.geoje.go.kr',
  },
  {
    id: 'e5', name: '거제 해양생태체험관(조선해양문화관)', category: 'experience',
    description: '거제도의 조선산업 역사와 해양문화를 체험할 수 있는 문화관으로, 배 만들기 체험도 가능합니다.',
    address: '경상남도 거제시 일운면 지세포해안로 41', lat: 34.8337, lng: 128.7019, grade: 'all',
    origin: '거제도는 한화오션, 삼성중공업 등 세계적 조선소가 있는 "조선의 메카"입니다.',
    referenceUrl: 'https://tour.geoje.go.kr',
  },
  {
    id: 'e6', name: '거제 동백숲길(지심도)', category: 'experience',
    description: '겨울부터 봄까지 동백꽃이 만발하는 아름다운 숲길로, 자연관찰 학습에 좋습니다.',
    address: '경상남도 거제시 일운면 옥림리', lat: 34.8050, lng: 128.7300, grade: 3,
    referenceUrl: 'https://tour.geoje.go.kr',
  },
  {
    id: 'e7', name: '김해 가야테마파크', category: 'experience',
    description: '가야 문화를 체험할 수 있는 테마파크로, 역사 학습과 놀이를 함께 즐길 수 있습니다.',
    address: '경상남도 김해시 어방동', lat: 35.2507, lng: 128.8930, grade: 4,
  },
  {
    id: 'e8', name: '거제파노라마 케이블카', category: 'experience',
    description: '거제의 산과 바다를 한눈에 내려다볼 수 있는 케이블카로, 2022년 개장하였습니다. 노자산 정상까지 이동하며 한려수도의 절경을 감상할 수 있습니다.',
    address: '경상남도 거제시 동부면 거제중앙로 288', lat: 34.784672, lng: 128.633014, grade: 'all',
    referenceUrl: 'https://tour.geoje.go.kr',
  },

  // ===== 전통시장/먹거리 =====
  {
    id: 'm1', name: '고현시장', category: 'market',
    description: '거제 최대 규모의 전통시장으로, 신선한 해산물, 과일, 반찬 등 다양한 먹거리를 즐길 수 있습니다.',
    address: '경상남도 거제시 거제중앙로 1883-2', lat: 34.8864, lng: 128.6226, grade: 'all',
    origin: '거제의 행정중심지 고현에 자연스럽게 형성된 전통시장으로, 5일장 전통을 이어가고 있습니다.',
  },
  {
    id: 'm2', name: '옥포시장', category: 'market',
    description: '옥포 지역의 전통시장으로, 지역 특산물과 길거리 음식이 유명합니다.',
    address: '경상남도 거제시 옥포로 202', lat: 34.8942, lng: 128.6899, grade: 'all',
  },
  {
    id: 'm4', name: '장승포시장', category: 'market',
    description: '장승포 지역의 전통시장으로, 어묵, 떡, 건어물 등 다양한 특산품을 판매합니다.',
    address: '경상남도 거제시 장승포로 38', lat: 34.8679, lng: 128.7289, grade: 'all',
    origin: '장승포(長承浦)는 "긴 포구"라는 뜻으로, 옛날부터 배가 드나들던 항구 마을입니다.',
  },
];

export function getPlacesByGrade(grade: 3 | 4): Place[] {
  return places.filter(p => p.grade === grade || p.grade === 'all');
}

export function getPlacesByCategory(category: PlaceCategory, grade?: 3 | 4): Place[] {
  const filtered = grade ? getPlacesByGrade(grade) : places;
  return filtered.filter(p => p.category === category);
}
