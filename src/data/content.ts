// 새로운 콘텐츠 카테고리 시스템
export type ContentCategory = 'place' | 'story' | 'placename' | 'heritage' | 'pastpresent' | 'nature';

export interface MapContent {
  id: string;
  name: string;
  contentType: ContentCategory;
  description: string;
  lat: number;
  lng: number;
  icon: string;
  imageUrl?: string;
  oldImageUrl?: string;
  oldImageCaption?: string;
  source?: string;
  grade?: 3 | 4 | 'all';
  referenceUrl?: string;
}

export const contentCategoryLabels: Record<ContentCategory, string> = {
  place: '장소',
  story: '옛이야기',
  placename: '지명',
  heritage: '국가유산',
  pastpresent: '옛날과 오늘날',
  nature: '자연',
};

export const contentCategoryIcons: Record<ContentCategory, string> = {
  place: '📍',
  story: '📖',
  placename: '🗺️',
  heritage: '🏛️',
  pastpresent: '📷',
  nature: '🌿',
};

export const contentCategoryColors: Record<ContentCategory, string> = {
  place: '#FF6B35',
  story: '#8B4513',
  placename: '#2196F3',
  heritage: '#FF8F00',
  pastpresent: '#607D8B',
  nature: '#2E7D32',
};

// ===== 옛이야기 (16개 - 거제시 어린이 홈페이지 기준) =====
export const stories: MapContent[] = [
  {
    id: 'story1', name: '서불과차', contentType: 'story',
    description: '진시황의 신하 서불이 불로초를 찾아 해금강에 왔다가 "서불과차(서불이 지나가다)"라는 글을 바위에 새기고 갔다는 전설입니다. 사라호 태풍으로 바위는 사라졌지만, 그 흔적이 전해집니다.',
    lat: 34.7350, lng: 128.6950, icon: '📜',
    source: '거제문화원, 거제시 어린이 홈페이지 / 경남 거제시 남부면 갈곶리 산1 (해금강로 일대)',
    grade: 'all',
    referenceUrl: 'https://www.geoje.go.kr/kids/index.geoje?menuCd=DOM_000010804001000000',
  },
  {
    id: 'story2', name: '늙은 여우를 물리친 노인', contentType: 'story',
    description: '거제도 어느 마을에서 사람으로 변하여 마을 사람들을 괴롭히던 늙은 여우를 지혜로운 노인이 물리쳤다는 이야기입니다.',
    lat: 34.779971, lng: 128.605103, icon: '🦊',
    source: '거제시 어린이 홈페이지 / 경남 거제시 동부면 율포리 일대 (율포로)',
    grade: 'all',
    referenceUrl: 'https://www.geoje.go.kr/kids/index.geoje?menuCd=DOM_000010804002000000',
  },
  {
    id: 'story3', name: '망부석의 슬픈 이야기', contentType: 'story',
    description: '남편을 기다리다 돌이 되었다는 슬픈 전설의 망부석입니다. 거제도 해안가에서 남편이 돌아오기만을 기다리던 아내의 애틋한 사랑 이야기가 전해집니다.',
    lat: 34.736697, lng: 128.682001, icon: '🪨',
    source: '거제문화원 / 경남 거제시 남부면 갈곶리 일대 (해금강로)',
    grade: 'all',
    referenceUrl: 'https://www.geoje.go.kr/kids/index.geoje?menuCd=DOM_000010804003000000',
  },
  {
    id: 'story4', name: '까마귀 섬, 소병대도', contentType: 'story',
    description: '까마귀들이 모여 살았다는 작은 섬 소병대도에 얽힌 전설입니다. 옛날 까마귀들이 이 섬을 지키며 마을의 길흉을 알려주었다고 합니다.',
    lat: 34.696427, lng: 128.606355, icon: '🏝️',
    source: '거제시 어린이 홈페이지 / 경남 거제시 남부면 다포리 산42~51 (해상 무인도)',
    grade: 'all',
    referenceUrl: 'https://www.geoje.go.kr/kids/index.geoje?menuCd=DOM_000010804004000000',
  },
  {
    id: 'story5', name: '산방산과 삼신굴', contentType: 'story',
    description: '둔덕면 산방산에 있는 삼신굴은 고려 의종이 유배 시절 머물렀던 동굴로, 세 신선이 살았다는 전설이 있습니다.',
    lat: 34.8580, lng: 128.5020, icon: '⛰️',
    source: '거제문화원 / 경남 거제시 둔덕면 산방리 산173 (산방산길 197 일대)',
    grade: 'all',
    referenceUrl: 'https://www.geoje.go.kr/kids/index.geoje?menuCd=DOM_000010804005000000',
  },
  {
    id: 'story6', name: '벼락바위', contentType: 'story',
    description: '벼락이 떨어져 갈라졌다는 거대한 바위에 얽힌 이야기입니다. 하늘이 노하여 악인을 벌하기 위해 벼락을 내렸다는 전설이 전해집니다.',
    lat: 34.872478, lng: 128.541625, icon: '⚡',
    source: '거제시 어린이 홈페이지 / 경남 거제시 둔덕면 상둔리 옥동마을 산지 (옥동길 일대)',
    grade: 'all',
    referenceUrl: 'https://www.geoje.go.kr/kids/index.geoje?menuCd=DOM_000010804006000000',
  },
  {
    id: 'story7', name: '형제도', contentType: 'story',
    description: '형과 아우처럼 나란히 서 있는 두 섬에 얽힌 이야기입니다. 서로를 그리워하던 형제가 섬이 되었다는 전설이 전해집니다.',
    lat: 34.927969, lng: 128.451904, icon: '🏝️',
    source: '거제문화원 / 경남 거제시 사등면 청곡리 청포마을 앞 해상 (청포길 일대)',
    grade: 'all',
    referenceUrl: 'https://www.geoje.go.kr/kids/index.geoje?menuCd=DOM_000010804007000000',
  },
  {
    id: 'story8', name: '울음이재', contentType: 'story',
    description: '이 고개를 넘을 때 너무 슬퍼서 울었다는 고개입니다. 유배 온 사람들이 이 고개를 넘으며 고향을 그리워하며 울었다고 합니다.',
    lat: 34.862236, lng: 128.665365, icon: '😢',
    source: '거제시 어린이 홈페이지 / 경남 거제시 아주동 산123-1 ~ 문동동 산43-1 경계 고개',
    grade: 'all',
    referenceUrl: 'https://www.geoje.go.kr/kids/index.geoje?menuCd=DOM_000010804008000000',
  },
  {
    id: 'story9', name: '비파반석', contentType: 'story',
    description: '비파(琵琶) 모양의 큰 바위에 얽힌 이야기입니다. 옛날 선녀가 하늘에서 내려와 이 바위에서 비파를 타며 노래했다는 전설이 전해집니다.',
    lat: 34.851989, lng: 128.693258, icon: '🎵',
    source: '거제시 어린이 홈페이지 / 경남 거제시 아주동 산1 (옥녀봉 일대 바위)',
    grade: 'all',
    referenceUrl: 'https://www.geoje.go.kr/kids/index.geoje?menuCd=DOM_000010804009000000',
  },
  {
    id: 'story10', name: '조라 지역 지명 전설', contentType: 'story',
    description: '구조라 지역의 지명에 얽힌 전설입니다. 아홉 개의 낚시바위가 나란히 있어 "구조라"라 불리게 되었다고 합니다.',
    lat: 34.8070, lng: 128.6929, icon: '🎣',
    source: '거제문화원 / 경남 거제시 일운면 구조라리 일대 (구조라로)',
    grade: 'all',
    referenceUrl: 'https://www.geoje.go.kr/kids/index.geoje?menuCd=DOM_000010804010000000',
  },
  {
    id: 'story11', name: '뱀쥐섬', contentType: 'story',
    description: '뱀과 쥐가 서로 싸우다 섬이 되었다는 전설이 있는 곳입니다. 거제도 앞바다의 작은 섬으로, 그 모양이 뱀과 쥐를 닮았다고 합니다.',
    lat: 34.9050, lng: 128.7200, icon: '🐍',
    source: '거제시 어린이 홈페이지 / 경남 거제시 옥포동 옥포만 해상 (옥포대첩로 일대)',
    grade: 'all',
    referenceUrl: 'https://www.geoje.go.kr/kids/index.geoje?menuCd=DOM_000010804011000000',
  },
  {
    id: 'story12', name: '아주천 전설', contentType: 'story',
    description: '아주동을 흐르는 아주천에 얽힌 전설입니다. 옛날 이 하천에서 용이 승천했다는 이야기가 전해지며, 마을 사람들이 풍년을 기원하던 곳입니다.',
    lat: 34.8800, lng: 128.6300, icon: '🐲',
    source: '거제시 어린이 홈페이지 / 경남 거제시 아주동 아주천 일대 (아주로)',
    grade: 'all',
    referenceUrl: 'https://www.geoje.go.kr/kids/index.geoje?menuCd=DOM_000010804012000000',
  },
  {
    id: 'story13', name: '밀바다들과 돌틈', contentType: 'story',
    description: '거제도의 밀물과 썰물에 의해 만들어진 바다와 들판, 그리고 바위 사이 돌틈에 얽힌 이야기입니다. 자연의 신비로운 힘을 보여주는 전설입니다.',
    lat: 34.9200, lng: 128.6100, icon: '🌊',
    source: '거제시 어린이 홈페이지 / 경남 거제시 연초면 다공리 및 송정리 일대 (다공길/송정길)',
    grade: 'all',
    referenceUrl: 'https://www.geoje.go.kr/kids/index.geoje?menuCd=DOM_000010804013000000',
  },
  {
    id: 'story14', name: '전하도', contentType: 'story',
    description: '임금(殿下)이 머물렀다 하여 "전하도"라 불리는 섬에 얽힌 이야기입니다. 고려 의종이 거제도로 유배 올 때 잠시 머물렀다는 전설이 전해집니다.',
    lat: 34.9350, lng: 128.5350, icon: '👑',
    source: '거제시 어린이 홈페이지 / 경남 거제시 사등면 덕호리 견내량 일대 (견내량로)',
    grade: 'all',
    referenceUrl: 'https://www.geoje.go.kr/kids/index.geoje?menuCd=DOM_000010804014000000',
  },
  {
    id: 'story15', name: '돼지가 된 학', contentType: 'story',
    description: '학동(鶴洞)마을에 내려온 학이 돼지로 변했다는 전설입니다. 아름다운 학이 마을의 탐욕 때문에 돼지로 변했다는 교훈적인 이야기가 전해집니다.',
    lat: 34.9600, lng: 128.6750, icon: '🐷',
    source: '거제시 어린이 홈페이지 / 경남 거제시 장목면 유호리 산1 (거가대로 저도 일대)',
    grade: 'all',
    referenceUrl: 'https://www.geoje.go.kr/kids/index.geoje?menuCd=DOM_000010804015000000',
  },
  {
    id: 'story16', name: '용의 치 전설', contentType: 'story',
    description: '용이 이빨(치, 齒)을 드러내며 하늘로 올라갔다는 전설이 있는 곳입니다. 거제 해안의 뾰족한 바위들이 용의 이빨을 닮았다고 합니다.',
    lat: 34.9700, lng: 128.6200, icon: '🐉',
    source: '거제시 어린이 홈페이지 / 경남 거제시 하청면 실전리 칠천연륙교 서측 해상 바위(매미섬)',
    grade: 'all',
    referenceUrl: 'https://www.geoje.go.kr/kids/index.geoje?menuCd=DOM_000010804016000000',
  },
];
// ===== 지명 유래 =====
export const placenames: MapContent[] = [
  {
    id: 'pn1', name: '거제(巨濟)', contentType: 'placename',
    description: '거제의 옛 이름은 "기성(岐城)" 또는 "상군(裳郡)"이었습니다. "거제(巨濟)"는 "크게 건넌다"는 뜻으로, 이 큰 섬을 건너야 한다는 의미에서 유래되었습니다.',
    lat: 34.8805, lng: 128.6211, icon: '📌',
    grade: 'all',
    referenceUrl: 'https://www.geoje.go.kr/kids/index.geoje?menuCd=DOM_000010804001000000',
  },
  {
    id: 'pn2', name: '고현(古縣)', contentType: 'placename',
    description: '고현은 "옛 현청이 있던 곳"이라는 뜻입니다. 조선시대 거제현의 관아가 이곳에 있었기 때문에 붙여진 이름입니다.',
    lat: 34.8854, lng: 128.6240, icon: '📌',
    grade: 'all',
    referenceUrl: 'https://www.geoje.go.kr',
  },
  {
    id: 'pn3', name: '옥포(玉浦)', contentType: 'placename',
    description: '옥(玉)처럼 아름다운 포구(浦)라는 뜻입니다. 맑은 바닷물이 옥빛처럼 빛났다고 하여 붙여진 이름입니다. 임진왜란 최초 승전지이기도 합니다.',
    lat: 34.9021, lng: 128.7144, icon: '📌',
    grade: 'all',
    referenceUrl: 'https://www.geoje.go.kr',
  },
  {
    id: 'pn4', name: '장승포(長承浦)', contentType: 'placename',
    description: '"긴(長) 포구(浦)"라는 뜻으로, 예로부터 배가 드나들던 긴 항구 마을입니다. 장승이 서 있던 포구라는 설도 있습니다.',
    lat: 34.8678, lng: 128.7296, icon: '📌',
    grade: 'all',
    referenceUrl: 'https://www.geoje.go.kr',
  },
  {
    id: 'pn5', name: '둔덕(屯德)', contentType: 'placename',
    description: '"덕(德)이 모이는(屯) 곳"이라는 뜻입니다. 고려 의종이 유배와 이곳에서 덕을 쌓았다는 이야기에서 유래되었습니다.',
    lat: 34.8688, lng: 128.4985, icon: '📌',
    grade: 'all',
    referenceUrl: 'https://www.geoje.go.kr',
  },
  {
    id: 'pn6', name: '사등(沙等)', contentType: 'placename',
    description: '모래(沙)가 고르게(等) 펼쳐진 곳이라는 뜻입니다. 넓은 모래밭이 있어 붙여진 이름입니다.',
    lat: 34.9200, lng: 128.5800, icon: '📌',
    grade: 'all',
    referenceUrl: 'https://www.geoje.go.kr',
  },
  {
    id: 'pn7', name: '하청(河清)', contentType: 'placename',
    description: '"맑은(清) 강(河)"이라는 뜻으로, 이 지역을 흐르는 하천이 맑아서 붙여진 이름입니다.',
    lat: 34.9570, lng: 128.6550, icon: '📌',
    grade: 'all',
    referenceUrl: 'https://www.geoje.go.kr',
  },
  {
    id: 'pn8', name: '연초(延草)', contentType: 'placename',
    description: '풀(草)이 넓게(延) 펼쳐진 곳이라는 뜻입니다. 예로부터 넓은 초원이 있어 붙여진 이름입니다.',
    lat: 34.9120, lng: 128.6520, icon: '📌',
    grade: 'all',
    referenceUrl: 'https://www.geoje.go.kr',
  },
  {
    id: 'pn9', name: '일운(一運)', contentType: 'placename',
    description: '"하나의(一) 운(運)"이라는 뜻으로, 좋은 운이 모이는 곳이라는 의미에서 유래되었습니다.',
    lat: 34.8290, lng: 128.7060, icon: '📌',
    grade: 'all',
    referenceUrl: 'https://www.geoje.go.kr',
  },
  {
    id: 'pn10', name: '남부(南部)', contentType: 'placename',
    description: '거제도의 남쪽 지역이라는 뜻으로, 바람의 언덕, 해금강 등 유명 관광지가 모여 있는 곳입니다.',
    lat: 34.7416, lng: 128.6625, icon: '📌',
    grade: 'all',
    referenceUrl: 'https://www.geoje.go.kr',
  },
];

// ===== 국가유산 =====
export const heritages: MapContent[] = [
  {
    id: 'h1', name: '거제 둔덕기성', contentType: 'heritage',
    description: '사적 제509호. 고려시대에 축성된 폐왕성으로, 고려 의종이 유배되었던 곳입니다. 성벽 둘레 약 920m의 산성입니다.',
    lat: 34.8688, lng: 128.4985, icon: '🏯',
    source: '문화재청 국가문화유산포털',
    grade: 'all',
    referenceUrl: 'https://www.heritage.go.kr',
  },
  {
    id: 'h2', name: '거제 기성관', contentType: 'heritage',
    description: '경상남도 유형문화재 제81호. 조선시대 거제현의 동헌(관아) 건물로, 현존하는 조선시대 관아 건축물입니다.',
    lat: 34.8520, lng: 128.5910, icon: '🏛️',
    source: '문화재청 국가문화유산포털',
    grade: 'all',
    referenceUrl: 'https://www.heritage.go.kr',
  },
  {
    id: 'h3', name: '거제 옥포대첩비', contentType: 'heritage',
    description: '경상남도 유형문화재 제16호. 임진왜란 최초의 해전 승리인 옥포해전을 기념하여 세운 비석입니다.',
    lat: 34.9021, lng: 128.7144, icon: '🪨',
    source: '문화재청 국가문화유산포털',
    grade: 'all',
    referenceUrl: 'https://www.heritage.go.kr',
  },
  {
    id: 'h4', name: '거제 반곡서원', contentType: 'heritage',
    description: '경상남도 문화재자료 제78호. 조선 중기에 건립된 서원으로, 유학자들을 기리기 위한 교육기관이었습니다.',
    lat: 34.8550, lng: 128.5850, icon: '📚',
    source: '문화재청 국가문화유산포털',
    grade: 'all',
    referenceUrl: 'https://www.heritage.go.kr',
  },
  {
    id: 'h5', name: '거제 둔덕면 석조여래좌상', contentType: 'heritage',
    description: '보물 제1421호. 통일신라시대에 제작된 석조 불상으로, 거제도의 불교 문화를 보여주는 귀중한 문화재입니다.',
    lat: 34.8650, lng: 128.5000, icon: '🙏',
    source: '문화재청 국가문화유산포털',
    grade: 'all',
    referenceUrl: 'https://www.heritage.go.kr',
  },
  {
    id: 'h6', name: '해금강', contentType: 'heritage',
    description: '명승 제2호. 바다의 금강산이라 불리는 해금강은 기암절벽과 해식동굴이 장관을 이루는 명승지입니다.',
    lat: 34.7378, lng: 128.6732, icon: '🏞️',
    source: '문화재청 국가문화유산포털',
    grade: 'all',
    referenceUrl: 'https://www.heritage.go.kr',
  },
  {
    id: 'h7', name: '거제 가라산봉수대', contentType: 'heritage',
    description: '경상남도 기념물 제147호. 조선시대 봉화(불과 연기로 신호를 보내는 통신 수단)를 올렸던 봉수대입니다.',
    lat: 34.7900, lng: 128.6800, icon: '🔥',
    source: '문화재청 국가문화유산포털',
    grade: 'all',
    referenceUrl: 'https://www.heritage.go.kr',
  },
  {
    id: 'h8', name: '거제향교', contentType: 'heritage',
    description: '경상남도 유형문화재 제206호. 조선 태조 7년(1398) 창건된 유교 교육기관으로, 거제 지역 교육의 산실이었습니다.',
    lat: 34.8526, lng: 128.5898, icon: '🎓',
    source: '문화재청 국가문화유산포털',
    grade: 'all',
    referenceUrl: 'https://www.heritage.go.kr',
  },
];

// ===== 옛날과 오늘날 =====
export const pastPresent: MapContent[] = [
  {
    id: 'pp1', name: '거제포로수용소', contentType: 'pastpresent',
    description: '한국전쟁(1950~1953) 당시 17만여 명의 포로를 수용했던 곳입니다. 현재는 유적공원으로 조성되어 전쟁의 아픔과 평화의 소중함을 배울 수 있습니다.',
    lat: 34.8764, lng: 128.6254, icon: '📷',
    oldImageCaption: '1951년 거제포로수용소 전경',
    grade: 'all',
    referenceUrl: 'https://www.pow.or.kr',
  },
  {
    id: 'pp2', name: '옥포조선소', contentType: 'pastpresent',
    description: '1973년 대우조선해양(현 한화오션)이 설립되면서 작은 어촌이었던 옥포가 세계적인 조선소 도시로 변모했습니다.',
    lat: 34.9100, lng: 128.7200, icon: '📷',
    oldImageCaption: '1970년대 옥포 어촌 마을',
    grade: 'all',
    referenceUrl: 'https://tour.geoje.go.kr',
  },
  {
    id: 'pp3', name: '거제대교', contentType: 'pastpresent',
    description: '1971년 개통된 거제대교는 거제도와 통영을 연결한 최초의 다리입니다. 이전에는 배로만 오갈 수 있었습니다. 현재는 신거제대교(2010)도 함께 운영됩니다.',
    lat: 34.8400, lng: 128.4800, icon: '📷',
    oldImageCaption: '1971년 거제대교 개통식',
    grade: 'all',
    referenceUrl: 'https://tour.geoje.go.kr',
  },
  {
    id: 'pp4', name: '고현 시가지', contentType: 'pastpresent',
    description: '거제시의 행정 중심지인 고현은 1970년대까지 작은 읍 수준이었으나, 조선소 건설과 함께 급속히 도시화되었습니다.',
    lat: 34.8854, lng: 128.6240, icon: '📷',
    oldImageCaption: '1980년대 고현 시가지',
    grade: 'all',
    referenceUrl: 'https://www.geoje.go.kr',
  },
  {
    id: 'pp5', name: '장승포항', contentType: 'pastpresent',
    description: '예로부터 거제도의 관문 역할을 했던 항구입니다. 부산과 거제를 잇는 여객선이 운항하던 곳으로, 현재도 외도 관광 유람선이 출발합니다.',
    lat: 34.8678, lng: 128.7296, icon: '📷',
    oldImageCaption: '1960년대 장승포항',
    grade: 'all',
    referenceUrl: 'https://tour.geoje.go.kr',
  },
];

// ===== 자연 =====
export const natureContent: MapContent[] = [
  {
    id: 'nat1', name: '계룡산(566m)', contentType: 'nature',
    description: '거제시 최고봉으로, 산세가 닭의 볏과 용의 형상을 닮았다 하여 계룡산이라 불립니다. 다양한 등산로가 있으며, 정상에서 거제도 전경을 조망할 수 있습니다.',
    lat: 34.8710, lng: 128.6076, icon: '⛰️',
    grade: 'all',
    referenceUrl: 'https://tour.geoje.go.kr',
  },
  {
    id: 'nat2', name: '노자산(565m)', contentType: 'nature',
    description: '거제도 두 번째 높은 산으로, 정상에서 남해바다와 거제도 일대를 한눈에 볼 수 있습니다. 사계절 등산을 즐길 수 있는 명산입니다.',
    lat: 34.7845, lng: 128.6162, icon: '⛰️',
    grade: 'all',
    referenceUrl: 'https://tour.geoje.go.kr',
  },
  {
    id: 'nat3', name: '대금산(437m)', contentType: 'nature',
    description: '거제도 남서쪽에 위치한 산으로, 정상에서 다도해의 아름다운 전경을 감상할 수 있습니다. 산에서 금이 많이 났다 하여 대금산이라 불립니다.',
    lat: 34.7600, lng: 128.6200, icon: '⛰️',
    grade: 'all',
    referenceUrl: 'https://tour.geoje.go.kr',
  },
  {
    id: 'nat4', name: '거제 해안 습지', contentType: 'nature',
    description: '거제도 곳곳에 발달한 해안 습지는 다양한 철새와 해양 생물이 서식하는 생태 보고입니다. 갯벌에서 조개, 게 등을 관찰할 수 있습니다.',
    lat: 34.9200, lng: 128.6000, icon: '🦀',
    grade: 'all',
    referenceUrl: 'https://tour.geoje.go.kr',
  },
  {
    id: 'nat5', name: '동백나무 군락지', contentType: 'nature',
    description: '거제도는 동백나무가 자생하는 남쪽 한계선에 위치해 있어, 겨울부터 봄까지 아름다운 동백꽃을 볼 수 있습니다. 지심도가 대표적입니다.',
    lat: 34.8050, lng: 128.7300, icon: '🌺',
    grade: 'all',
    referenceUrl: 'https://tour.geoje.go.kr',
  },
  {
    id: 'nat6', name: '칠천도 갯벌', contentType: 'nature',
    description: '칠천도 주변의 갯벌은 다양한 해양 생물이 서식하는 자연 생태계입니다. 썰물 때 넓은 갯벌이 드러나 자연관찰 학습에 좋습니다.',
    lat: 34.9885, lng: 128.6358, icon: '🐚',
    grade: 'all',
    referenceUrl: 'https://tour.geoje.go.kr',
  },
  {
    id: 'nat7', name: '공곶이 수선화 군락', contentType: 'nature',
    description: '일운면 공곶이에는 수선화, 동백 등이 자연적으로 군락을 이루고 있어 봄철 아름다운 꽃길을 걸을 수 있습니다.',
    lat: 34.7680, lng: 128.7050, icon: '🌼',
    grade: 'all',
    referenceUrl: 'https://tour.geoje.go.kr',
  },
  {
    id: 'nat8', name: '구조라 해양생태', contentType: 'nature',
    description: '구조라 앞바다는 맑은 수질과 풍부한 해양 생태계를 자랑합니다. 해양 생물 관찰과 스노클링을 즐길 수 있는 곳입니다.',
    lat: 34.8070, lng: 128.6929, icon: '🐠',
    grade: 'all',
    referenceUrl: 'https://tour.geoje.go.kr',
  },
];

// 출처 목록
export const sources = [
  { name: '거제시 공식 홈페이지', url: 'https://www.geoje.go.kr' },
  { name: '거제시 어린이 홈페이지', url: 'https://www.geoje.go.kr/kids' },
  { name: '문화재청 국가문화유산포털', url: 'https://www.heritage.go.kr' },
  { name: '거제문화원', url: 'https://www.geojemunhwa.or.kr' },
  { name: '경상남도 공식 홈페이지', url: 'https://www.gyeongnam.go.kr' },
  { name: '한국관광공사', url: 'https://korean.visitkorea.or.kr' },
  { name: '거제시 관광포털', url: 'https://tour.geoje.go.kr' },
];

// 전체 콘텐츠 가져오기
export function getContentByCategory(contentType: ContentCategory, grade?: 3 | 4): MapContent[] {
  let items: MapContent[] = [];
  switch (contentType) {
    case 'story': items = stories; break;
    case 'placename': items = placenames; break;
    case 'heritage': items = heritages; break;
    case 'pastpresent': items = pastPresent; break;
    case 'nature': items = natureContent; break;
    default: return [];
  }
  if (grade) {
    return items.filter(i => i.grade === grade || i.grade === 'all');
  }
  return items;
}
