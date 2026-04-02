// 경상남도 18개 시군 데이터
export interface GyeongnamCity {
  id: string;
  name: string;
  nameHanja: string;
  population: number; // 2024년 기준 추정
  area: number; // km²
  mascot: string;
  mascotEmoji: string;
  nameOrigin: string;
  lat: number;
  lng: number;
  highlights: string[];
}

export const gyeongnamCities: GyeongnamCity[] = [
  {
    id: 'changwon', name: '창원시', nameHanja: '昌原市',
    population: 1037000, area: 747.7,
    mascot: '피우미', mascotEmoji: '🌸',
    nameOrigin: '"창(昌, 번창하다)"과 "원(原, 들판)"이 합쳐진 이름으로, "번창하는 들판"이라는 뜻입니다. 2010년 마산·진해와 통합하여 경남 최대 도시가 되었습니다.',
    lat: 35.2279, lng: 128.6811,
    highlights: ['경상남도청 소재지', '진해 군항제(벚꽃)', '창원 NC파크'],
  },
  {
    id: 'jinju', name: '진주시', nameHanja: '晉州市',
    population: 340000, area: 712.6,
    mascot: '진주남강유등', mascotEmoji: '🏮',
    nameOrigin: '"진(晉, 나아가다)"과 "주(州, 고을)"가 합쳐진 이름으로, 삼국시대 "거열성"에서 유래했습니다. 진주대첩과 논개의 이야기가 유명합니다.',
    lat: 35.1796, lng: 128.1076,
    highlights: ['진주성', '진주 남강 유등축제', '논개'],
  },
  {
    id: 'tongyeong', name: '통영시', nameHanja: '統營市',
    population: 128000, area: 239.8,
    mascot: '통통이', mascotEmoji: '⛵',
    nameOrigin: '"통(統, 통솔하다)"과 "영(營, 군영)"이 합쳐져 "삼도수군통제영"에서 유래했습니다. 이순신 장군이 수군을 이끌던 곳입니다.',
    lat: 34.8544, lng: 128.4330,
    highlights: ['한산대첩', '동피랑 벽화마을', '통영 케이블카'],
  },
  {
    id: 'sacheon', name: '사천시', nameHanja: '泗川市',
    population: 112000, area: 398.7,
    mascot: '아라', mascotEmoji: '✈️',
    nameOrigin: '"사(泗, 물이름)"와 "천(川, 내)"이 합쳐져 "네 갈래의 물줄기"라는 뜻입니다. 항공우주산업의 중심지입니다.',
    lat: 35.0037, lng: 128.0641,
    highlights: ['한국항공우주산업(KAI)', '사천 바다케이블카', '비토섬'],
  },
  {
    id: 'gimhae', name: '김해시', nameHanja: '金海市',
    population: 536000, area: 463.4,
    mascot: '가야누리', mascotEmoji: '👑',
    nameOrigin: '"금(金, 쇠)"과 "해(海, 바다)"가 합쳐진 이름으로, 가야의 시조 수로왕이 금빛 알에서 태어났다는 전설에서 유래했습니다.',
    lat: 35.2285, lng: 128.8894,
    highlights: ['수로왕릉', '봉하마을', '김해 가야테마파크'],
  },
  {
    id: 'miryang', name: '밀양시', nameHanja: '密陽市',
    population: 104000, area: 799.0,
    mascot: '아리랑이', mascotEmoji: '🎭',
    nameOrigin: '"밀(密, 빽빽하다)"과 "양(陽, 햇빛)"이 합쳐져 "햇빛이 빽빽한 곳"이라는 뜻입니다. 밀양아리랑으로 유명합니다.',
    lat: 35.5037, lng: 128.7467,
    highlights: ['영남루', '밀양아리랑', '얼음골'],
  },
  {
    id: 'geoje', name: '거제시', nameHanja: '巨濟市',
    population: 237000, area: 401.6,
    mascot: '파랑이', mascotEmoji: '🌊',
    nameOrigin: '"거(巨, 크다)"와 "제(濟, 건너다)"가 합쳐져 "크게 건너다"라는 뜻으로, 큰 섬을 건너야 한다는 의미에서 유래했습니다.',
    lat: 34.8805, lng: 128.6211,
    highlights: ['외도 보타니아', '거제포로수용소', '바람의 언덕'],
  },
  {
    id: 'yangsan', name: '양산시', nameHanja: '梁山市',
    population: 367000, area: 485.4,
    mascot: '어리', mascotEmoji: '🐟',
    nameOrigin: '"양(梁, 들보)"과 "산(山, 산)"이 합쳐진 이름으로, 통도사가 있는 영축산 아래 펼쳐진 평야 도시입니다.',
    lat: 35.3350, lng: 129.0373,
    highlights: ['통도사', '양산 물금 황산공원', '에덴밸리'],
  },
  {
    id: 'uiryeong', name: '의령군', nameHanja: '宜寧郡',
    population: 26000, area: 482.9,
    mascot: '의병이', mascotEmoji: '⚔️',
    nameOrigin: '"의(宜, 마땅하다)"와 "령(寧, 편안하다)"이 합쳐져 "마땅히 편안한 곳"이라는 뜻입니다. 곽재우 의병장으로 유명합니다.',
    lat: 35.3222, lng: 128.2617,
    highlights: ['곽재우 장군', '정암진 전투', '의령 소바위'],
  },
  {
    id: 'haman', name: '함안군', nameHanja: '咸安郡',
    population: 65000, area: 417.1,
    mascot: '아라가야', mascotEmoji: '🏺',
    nameOrigin: '"함(咸, 모두)"과 "안(安, 편안하다)"이 합쳐져 "모두가 편안한 곳"이라는 뜻입니다. 아라가야의 중심지였습니다.',
    lat: 35.2721, lng: 128.4065,
    highlights: ['말이산 고분군', '함안 연꽃 테마파크', '아라가야'],
  },
  {
    id: 'changnyeong', name: '창녕군', nameHanja: '昌寧郡',
    population: 61000, area: 533.4,
    mascot: '따오기', mascotEmoji: '🐦',
    nameOrigin: '"창(昌, 번창하다)"과 "녕(寧, 편안하다)"이 합쳐져 "번창하고 편안한 곳"이라는 뜻입니다. 우포늪이 유명합니다.',
    lat: 35.5417, lng: 128.4914,
    highlights: ['우포늪(람사르 습지)', '창녕 따오기 복원센터', '화왕산'],
  },
  {
    id: 'gosung', name: '고성군', nameHanja: '固城郡',
    population: 50000, area: 517.4,
    mascot: '고룡이', mascotEmoji: '🦕',
    nameOrigin: '"고(固, 굳다)"와 "성(城, 성)"이 합쳐져 "굳건한 성"이라는 뜻입니다. 공룡 화석으로 유명합니다.',
    lat: 34.9727, lng: 128.3220,
    highlights: ['고성 공룡박물관', '당항포 관광지', '상족암'],
  },
  {
    id: 'namhae', name: '남해군', nameHanja: '南海郡',
    population: 42000, area: 357.6,
    mascot: '남해보물이', mascotEmoji: '🏝️',
    nameOrigin: '"남(南, 남쪽)"과 "해(海, 바다)"가 합쳐져 "남쪽 바다"라는 뜻입니다. 한국의 보물섬이라 불립니다.',
    lat: 34.8375, lng: 127.8925,
    highlights: ['독일마을', '보리암', '남해대교'],
  },
  {
    id: 'hadong', name: '하동군', nameHanja: '河東郡',
    population: 44000, area: 675.4,
    mascot: '다솔이', mascotEmoji: '🍵',
    nameOrigin: '"하(河, 강)"와 "동(東, 동쪽)"이 합쳐져 "강의 동쪽"이라는 뜻입니다. 섬진강과 녹차로 유명합니다.',
    lat: 35.0673, lng: 127.7513,
    highlights: ['하동 녹차밭', '섬진강', '쌍계사'],
  },
  {
    id: 'sancheong', name: '산청군', nameHanja: '山清郡',
    population: 33000, area: 794.7,
    mascot: '지리산이', mascotEmoji: '⛰️',
    nameOrigin: '"산(山, 산)"과 "청(清, 맑다)"이 합쳐져 "산이 맑은 곳"이라는 뜻입니다. 지리산 자락의 청정 고장입니다.',
    lat: 35.4157, lng: 127.8733,
    highlights: ['지리산', '한방약초축제', '남명 조식 유적'],
  },
  {
    id: 'hamyang', name: '함양군', nameHanja: '咸陽郡',
    population: 38000, area: 725.5,
    mascot: '산삼이', mascotEmoji: '🌿',
    nameOrigin: '"함(咸, 모두)"과 "양(陽, 햇빛)"이 합쳐져 "모든 곳에 햇빛이 비치는 곳"이라는 뜻입니다.',
    lat: 35.5200, lng: 127.7254,
    highlights: ['상림숲(천년의 숲)', '지리산 천왕봉', '함양 산삼축제'],
  },
  {
    id: 'geochang', name: '거창군', nameHanja: '居昌郡',
    population: 60000, area: 804.4,
    mascot: '감악이', mascotEmoji: '🍎',
    nameOrigin: '"거(居, 살다)"와 "창(昌, 번창하다)"이 합쳐져 "살기 좋고 번창하는 곳"이라는 뜻입니다.',
    lat: 35.6867, lng: 127.9094,
    highlights: ['거창 국제연극제', '수승대', '월성 우주창의과학관'],
  },
  {
    id: 'hapcheon', name: '합천군', nameHanja: '陜川郡',
    population: 43000, area: 983.5,
    mascot: '대장경이', mascotEmoji: '📿',
    nameOrigin: '"합(陜, 좁다)"과 "천(川, 내)"이 합쳐져 "좁은 내가 흐르는 곳"이라는 뜻입니다. 해인사와 팔만대장경으로 유명합니다.',
    lat: 35.5659, lng: 128.1659,
    highlights: ['해인사(팔만대장경)', '합천 영상테마파크', '황매산'],
  },
];

export function getGyeongnamCity(id: string): GyeongnamCity | undefined {
  return gyeongnamCities.find(c => c.id === id);
}
