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
}

export const categoryLabels: Record<PlaceCategory, string> = {
  tourism: '🏖️ 관광 명소',
  nature: '🌿 자연/지리',
  culture: '🏛️ 문화/역사',
  public: '🏢 관공서',
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

export const places: Place[] = [
  // 관광 명소
  {
    id: 't1', name: '바람의 언덕', category: 'tourism',
    description: '거제 남부면 도장포마을에 위치한 아름다운 언덕으로, 탁 트인 바다 전망과 바람개비가 유명합니다.',
    address: '경상남도 거제시 남부면 갈곶리', lat: 34.7416, lng: 128.6625, grade: 'all',
  },
  {
    id: 't2', name: '외도 보타니아', category: 'tourism',
    description: '거제도 남쪽에 위치한 해상식물공원으로, 아열대 식물과 아름다운 정원이 조성되어 있습니다.',
    address: '경상남도 거제시 일운면 외도길 17', lat: 34.7695, lng: 128.7114, grade: 'all',
  },
  {
    id: 't3', name: '해금강', category: 'tourism',
    description: '거제도 남동쪽 바다에 솟아있는 바위섬으로, 기암절벽과 해식동굴이 장관을 이룹니다.',
    address: '경상남도 거제시 남부면 갈곶리', lat: 34.7378, lng: 128.6732, grade: 'all',
  },
  {
    id: 't4', name: '학동흑진주몽돌해변', category: 'tourism',
    description: '검은 몽돌(자갈)이 깔린 아름다운 해변으로, 파도가 몽돌을 굴리는 소리가 특별합니다.',
    address: '경상남도 거제시 동부면 학동리', lat: 34.7747, lng: 128.6415, grade: 'all',
  },
  {
    id: 't5', name: '신선대', category: 'tourism',
    description: '신선이 놀았다는 전설이 있는 바위 전망대로, 탁 트인 남해 전경을 감상할 수 있습니다.',
    address: '경상남도 거제시 남부면 갈곶리', lat: 34.7382, lng: 128.6628, grade: 'all',
  },
  {
    id: 't6', name: '거제 맹종죽 테마파크', category: 'tourism',
    description: '울창한 대나무숲 속을 산책할 수 있는 테마파크로, 사계절 푸른 맹종죽이 아름답습니다.',
    address: '경상남도 거제시 하청면 유계리', lat: 34.9677, lng: 128.6505, grade: 'all',
  },
  {
    id: 't7', name: '거제 씨월드', category: 'tourism',
    description: '다양한 해양생물을 관찰하고 체험할 수 있는 해양테마파크입니다.',
    address: '경상남도 거제시 일운면 지세포해안로 15', lat: 34.8359, lng: 128.7015, grade: 'all',
  },
  {
    id: 't8', name: '여차홍포해안', category: 'tourism',
    description: '여차~홍포 구간의 해안 절경으로, 기암괴석과 푸른 바다가 어우러진 비경을 자랑합니다.',
    address: '경상남도 거제시 남부면 여차리', lat: 34.7038, lng: 128.6101, grade: 'all',
  },

  // 자연/지리
  {
    id: 'n1', name: '계룡산', category: 'nature',
    description: '거제시의 최고봉(566m)으로, 산세가 닭의 볏을 닮아 계룡산이라 불립니다.',
    address: '경상남도 거제시 동부면', lat: 34.8710, lng: 128.6076, grade: 3,
  },
  {
    id: 'n2', name: '노자산', category: 'nature',
    description: '거제도에서 두 번째로 높은 산(565m)으로, 정상에서 거제도 전경을 조망할 수 있습니다.',
    address: '경상남도 거제시 연초면', lat: 34.7845, lng: 128.6162, grade: 3,
  },
  {
    id: 'n3', name: '구조라해수욕장', category: 'nature',
    description: '고운 모래사장과 잔잔한 파도가 특징인 해수욕장으로, 가족 단위 여행객에게 인기가 많습니다.',
    address: '경상남도 거제시 일운면 구조라리', lat: 34.8070, lng: 128.6929, grade: 'all',
  },
  {
    id: 'n4', name: '와현해수욕장', category: 'nature',
    description: '맑은 물과 고운 모래가 아름다운 해수욕장으로, 거제도 동쪽에 위치하고 있습니다.',
    address: '경상남도 거제시 일운면 와현리', lat: 34.8127, lng: 128.7086, grade: 'all',
  },
  {
    id: 'n5', name: '칠천도', category: 'nature',
    description: '거제도 북서쪽에 위치한 섬으로, 칠천량해전의 역사적 장소입니다. 칠천대교로 연결되어 있습니다.',
    address: '경상남도 거제시 하청면 칠천도', lat: 34.9885, lng: 128.6358, grade: 4,
  },
  {
    id: 'n6', name: '내도', category: 'nature',
    description: '외도 근처에 위치한 작은 섬으로, 자연 그대로의 모습을 간직하고 있습니다.',
    address: '경상남도 거제시 일운면 와현리', lat: 34.7854, lng: 128.7141, grade: 'all',
  },

  // 문화/역사
  {
    id: 'c1', name: '거제포로수용소 유적공원', category: 'culture',
    description: '한국전쟁 당시 포로를 수용했던 곳으로, 전쟁의 역사를 배울 수 있는 유적공원입니다.',
    address: '경상남도 거제시 계룡로 61', lat: 34.8764, lng: 128.6254, grade: 4,
  },
  {
    id: 'c2', name: '옥포대첩기념공원', category: 'culture',
    description: '임진왜란 최초의 해전 승리인 옥포해전을 기념하는 공원입니다.',
    address: '경상남도 거제시 옥포2동', lat: 34.9021, lng: 128.7144, grade: 4,
  },
  {
    id: 'c3', name: '거제박물관', category: 'culture',
    description: '거제도의 역사와 문화유산을 전시하는 박물관입니다.',
    address: '경상남도 거제시 거제대로 3658', lat: 34.8940, lng: 128.6862, grade: 'all',
  },
  {
    id: 'c4', name: '거제향교', category: 'culture',
    description: '조선시대 유교 교육기관으로, 거제 지역의 대표적인 전통 교육시설입니다.',
    address: '경상남도 거제시 거제면 서정리', lat: 34.8526, lng: 128.5898, grade: 3,
  },
  {
    id: 'c5', name: '거제 둔덕기성', category: 'culture',
    description: '고려시대에 축성된 성곽으로, 사적 제509호로 지정되어 있습니다.',
    address: '경상남도 거제시 둔덕면 산방리', lat: 34.8688, lng: 128.4985, grade: 3,
  },

  // 관공서
  {
    id: 'p1', name: '거제시청', category: 'public',
    description: '거제시의 행정을 담당하는 시청입니다.',
    address: '경상남도 거제시 계룡로 125', lat: 34.8805, lng: 128.6211, grade: 4,
  },
  {
    id: 'p2', name: '거제경찰서', category: 'public',
    description: '거제시 일대의 치안을 담당하는 경찰서입니다.',
    address: '경상남도 거제시 진목1길 2', lat: 34.8987, lng: 128.6866, grade: 4,
  },
  {
    id: 'p3', name: '거제소방서', category: 'public',
    description: '거제시의 화재 예방과 구조·구급 업무를 담당하는 소방서입니다.',
    address: '경상남도 거제시 계룡로 89', lat: 34.8961, lng: 128.6862, grade: 4,
  },
  {
    id: 'p4', name: '거제시보건소', category: 'public',
    description: '거제시민의 건강을 위한 보건의료서비스를 제공하는 기관입니다.',
    address: '경상남도 거제시 중곡1로 18', lat: 34.8919, lng: 128.6367, grade: 4,
  },
  {
    id: 'p5', name: '거제교육지원청', category: 'public',
    description: '거제시 관내 초·중등학교의 교육행정을 담당하는 기관입니다.',
    address: '경상남도 거제시 계룡로 71', lat: 34.8799, lng: 128.6266, grade: 4,
  },
  {
    id: 'p6', name: '거제시립도서관', category: 'public',
    description: '거제시민을 위한 공공도서관으로, 다양한 도서와 문화프로그램을 제공합니다.',
    address: '경상남도 거제시 거제대로 3728', lat: 34.8699, lng: 128.7312, grade: 'all',
  },
  {
    id: 'p7', name: '거제우체국', category: 'public',
    description: '거제시 중심의 우편·금융 서비스를 제공하는 우체국입니다.',
    address: '경상남도 거제시 중곡로 58', lat: 34.8843, lng: 128.6231, grade: 4,
  },

  // 체험학습
  {
    id: 'e1', name: '거제자연휴양림', category: 'experience',
    description: '자연 속에서 숲 체험, 산책, 야영 등 다양한 자연 체험활동을 할 수 있는 휴양림입니다.',
    address: '경상남도 거제시 동부면 부춘리', lat: 34.7857, lng: 128.6259, grade: 'all',
  },
  {
    id: 'e2', name: '거제어촌민속전시관', category: 'experience',
    description: '거제도의 어촌 문화와 어업 역사를 배울 수 있는 전시관입니다.',
    address: '경상남도 거제시 일운면 지세포리', lat: 34.8336, lng: 128.7018, grade: 3,
  },
  {
    id: 'e3', name: '거제해양레저체험', category: 'experience',
    description: '카약, 요트, 투명카누 등 다양한 해양 레저를 직접 체험할 수 있는 곳입니다.',
    address: '경상남도 거제시 일운면 구조라리', lat: 34.8070, lng: 128.6929, grade: 'all',
  },
  {
    id: 'e4', name: '거제도 짚라인', category: 'experience',
    description: '거제도의 아름다운 경치를 감상하며 짚라인을 타는 스릴 넘치는 체험시설입니다.',
    address: '경상남도 거제시 남부면 저구리', lat: 34.7416, lng: 128.6625, grade: 'all',
  },
  {
    id: 'e5', name: '조선해양문화관', category: 'experience',
    description: '거제도의 조선산업 역사와 해양문화를 체험할 수 있는 문화관입니다.',
    address: '경상남도 거제시 장목면 유호리', lat: 34.8349, lng: 128.7016, grade: 4,
  },
  {
    id: 'e6', name: '거제 동백숲길', category: 'experience',
    description: '겨울부터 봄까지 동백꽃이 만발하는 아름다운 숲길로, 자연관찰 학습에 좋습니다.',
    address: '경상남도 거제시 장목면 대금리', lat: 34.7379, lng: 128.6728, grade: 3,
  },

  // 전통시장/먹거리
  {
    id: 'm1', name: '고현시장', category: 'market',
    description: '거제 최대 규모의 전통시장으로, 신선한 해산물과 다양한 먹거리를 즐길 수 있습니다.',
    address: '경상남도 거제시 고현동', lat: 34.8854, lng: 128.6240, grade: 'all',
  },
  {
    id: 'm2', name: '옥포시장', category: 'market',
    description: '옥포 지역의 전통시장으로, 지역 특산물과 길거리 음식이 유명합니다.',
    address: '경상남도 거제시 옥포동', lat: 34.8940, lng: 128.6892, grade: 'all',
  },
  {
    id: 'm3', name: '거제 수산물시장', category: 'market',
    description: '싱싱한 회와 해산물을 저렴하게 즐길 수 있는 수산물 전문 시장입니다.',
    address: '경상남도 거제시 고현동', lat: 34.8899, lng: 128.6093, grade: 'all',
  },
  {
    id: 'm4', name: '장승포시장', category: 'market',
    description: '장승포 지역의 전통시장으로, 어묵, 떡, 건어물 등 다양한 특산품을 판매합니다.',
    address: '경상남도 거제시 장승포동', lat: 34.8678, lng: 128.7296, grade: 'all',
  },
];

export function getPlacesByGrade(grade: 3 | 4): Place[] {
  return places.filter(p => p.grade === grade || p.grade === 'all');
}

export function getPlacesByCategory(category: PlaceCategory, grade?: 3 | 4): Place[] {
  const filtered = grade ? getPlacesByGrade(grade) : places;
  return filtered.filter(p => p.category === category);
}