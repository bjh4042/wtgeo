// 인구 관련 직답용 데이터 (거제시 18개 행정구역 + 경상남도 18개 시·군)
export interface GeojePopulationItem { id:number; region:string; population:string; description:string }
export const geojePopulation: GeojePopulationItem[] = [
  { id:1, region:"고현동", population:"약 35,600명", description:"2026년 5월 말 기준으로 거제시에서 가장 많은 이웃이 사는 행정·교통의 중심지야." },
  { id:2, region:"상문동", population:"약 34,500명", description:"2026년 5월 말 기준으로 고현동 다음으로 인구가 많으며, 젊은 부부와 초등학생이 많이 살아." },
  { id:3, region:"아주동", population:"약 26,800명", description:"2026년 5월 말 기준으로 한화오션 조선소 근처라, 초등학생 친구들이 아주 왁자지껄 모여 사는 동네야." },
  { id:4, region:"옥포2동", population:"약 24,100명", description:"2026년 5월 말 기준으로 덕포 해수욕장과 대단지 아파트가 어우러진 활기찬 동네란다." },
  { id:5, region:"장평동", population:"약 20,800명", description:"2026년 5월 말 기준으로 삼성중공업 조선소와 대형 백화점이 있는 살기 좋은 동네야." },
  { id:6, region:"수양동", population:"약 22,100명", description:"2026년 5월 말 기준으로 수월동과 양정동이 합쳐진 곳인데, 공부를 열심히 하는 학원가가 많아." },
  { id:7, region:"일운면", population:"약 7,300명", description:"2026년 5월 말 기준으로 지세포항, 구조라, 지심도 등 예쁜 바다 관광지가 가득한 곳이지." },
  { id:8, region:"옥포1동", population:"약 6,800명", description:"2026년 5월 말 기준으로 옥포항 유람선 터미널과 역사 깊은 전통시장이 있는 중심 상가 동네야." },
  { id:9, region:"장목면", population:"약 6,200명", description:"2026년 5월 말 기준으로 부산으로 가는 거가대교와 매미성, 대금산이 있는 멋진 동네야." },
  { id:10, region:"연초면", population:"약 8,500명", description:"2026년 5월 말 기준으로 연초천 생태하천과 맑은 연초 댐이 고장의 물을 책임져 주는 곳이란다." },
  { id:11, region:"하청면", population:"약 4,800명", description:"2026년 5월 말 기준으로 칠천도 섬을 포함하고 있으며, 굵고 멋진 대나무 숲 테마파크가 유명해." },
  { id:12, region:"거제면", population:"약 10,200명", description:"2026년 5월 말 기준으로 옛날 조선시대 수도 역할을 했던 곳으로 기성관 관아와 식물원 정글돔이 있어." },
  { id:13, region:"사등면", population:"약 13,100명", description:"2026년 5월 말 기준으로 성포항 노을이 아름답고, 가조도 섬과 공룡 발자국 화석이 숨겨진 동네야." },
  { id:14, region:"둔덕면", population:"약 2,900명", description:"2026년 5월 말 기준으로 청마 유치환 생가와 고려시대 둔덕기성, 그리고 가을 코스모스가 이쁜 농촌이야." },
  { id:15, region:"동부면", population:"약 2,750명", description:"2026년 5월 말 기준으로 동부저수지 오리배와 학동 흑진주 몽돌해변 파도 소리가 예술인 동네야." },
  { id:16, region:"장승포동", population:"약 5,400명", description:"2026년 5월 말 기준으로 문화예술회관과 기적의 도서관, 맛있는 장승포차 거리가 항구를 채우고 있어." },
  { id:17, region:"능포동", population:"약 8,100명", description:"2026년 5월 말 기준으로 양지암 조각공원 튤립 축제와 어린이들의 최애 분수대 수변공원이 유명해." },
  { id:18, region:"남부면", population:"약 1,400명", description:"2026년 5월 말 기준으로 바람의 언덕, 신선대, 해금강이 있으며 거제에서 인구가 가장 적지만 자연이 제일 이뻐." },
];
export interface GyeongnamPopulationItem { id:number; region:string; type:string; population:string; base_date:string; office_address:string; description:string }
export const gyeongnamPopulation: GyeongnamPopulationItem[] = [
  { id:1, region:"창원시", type:"시", population:"약 1,000,500명", base_date:"2026년 6월 말 기준", office_address:"경상남도 창원시 성산구 중앙대로 151 (용호동)", description:"경상남도청이 있는 가장 큰 도시이자 우리 경남의 행정 중심지야." },
  { id:2, region:"김해시", type:"시", population:"약 531,200명", base_date:"2026년 6월 말 기준", office_address:"경상남도 김해시 김해대로 2401 (부원동)", description:"금관가야의 옛 수도이자, 경남에서 창원 다음으로 많은 이웃이 모여 사는 문화와 산업의 도시란다." },
  { id:3, region:"진주시", type:"시", population:"약 341,100명", base_date:"2026년 6월 말 기준", office_address:"경상남도 진주시 동진로 155 (상대동)", description:"진주성과 논개 이야기로 유명하며, 경남의 서쪽 지역을 든든하게 받쳐주는 교육과 역사의 중심지야." },
  { id:4, region:"양산시", type:"시", population:"약 356,400명", base_date:"2026년 6월 말 기준", office_address:"경상남도 양산시 중앙로 39 (다방동)", description:"부산, 울산과 이웃하고 있어서 최근에 새로운 아파트와 공장이 아주 많이 생긴 활기찬 도시지." },
  { id:5, region:"거제시", type:"시", population:"약 231,500명", base_date:"2026년 6월 말 기준", office_address:"경상남도 거제시 계룡로 125 (고현동)", description:"바로 우리가 살고 있는 자랑스러운 고장! 세계적인 조선소와 아름다운 해수욕장들이 가득한 멋진 섬 도시야." },
  { id:6, region:"통영시", type:"시", population:"약 120,400명", base_date:"2026년 6월 말 기준", office_address:"경상남도 통영시 해미당1길 33 (무전동)", description:"거제시와 신거제대교로 바로 연결된 이웃 도시로, 맛있는 꿀빵과 이순신 장군의 한산도대첩 바다가 유명해." },
  { id:7, region:"사천시", type:"시", population:"약 108,700명", base_date:"2026년 6월 말 기준", office_address:"경상남도 사천시 시청로 77 (용현면)", description:"하늘을 날아다니는 멋진 비행기와 우주선을 연구하고 만드는 대한민국 항공 우주 산업의 중심지란다." },
  { id:8, region:"밀양시", type:"시", population:"약 100,200명", base_date:"2026년 6월 말 기준", office_address:"경상남도 밀양시 밀양대로 2044 (교동)", description:"맑은 영남알프스 산자락 아래 비옥한 논밭이 넓게 펼쳐져 얼음골 사과와 전통 아리랑이 유명한 곳이야." },
  { id:9, region:"함안군", type:"군", population:"약 60,300명", base_date:"2026년 6월 말 기준", office_address:"경상남도 함안군 가야읍 말산로 1 (말산리)", description:"경남의 '군' 지역 중에서 이웃들이 가장 많이 살며, 옛 아라가야의 불꽃무늬 토기 문화재가 가득해." },
  { id:10, region:"창녕군", type:"군", population:"약 56,400명", base_date:"2026년 6월 말 기준", office_address:"경상남도 창녕군 창녕읍 군청길 1 (교리)", description:"우리나라에서 가장 크고 오래된 자연 늪인 '우포늪'이 있어서 신기한 철새와 자연을 공부하기 딱 좋아." },
  { id:11, region:"거창군", type:"군", population:"약 59,800명", base_date:"2026년 6월 말 기준", office_address:"경상남도 거창군 거창읍 중앙로 103 (상림리)", description:"경남의 북쪽 높은 산자락에 둘러싸여 맑은 계곡물이 흐르고 아삭아삭한 사과 농사를 많이 짓는 고장이야." },
  { id:12, region:"고성군", type:"군", population:"약 49,200명", base_date:"2026년 6월 말 기준", office_address:"경상남도 고성군 고성읍 성내로 130 (성내리)", description:"거제도 아래쪽에 위치하며, 옛날 중생대 백악기 시절 진짜 공룡들이 쿵쾅쿵쾅 밟고 간 발자국 화석이 세계적으로 유명해." },
  { id:13, region:"하동군", type:"군", population:"약 41,500명", base_date:"2026년 6월 말 기준", office_address:"경상남도 하동군 하동읍 군청로 23 (읍내리)", description:"전라남도와 경상남도를 이어주는 화개장터가 있고, 섬진강 맑은 물줄기를 따라 향긋한 녹차가 자란단다." },
  { id:14, region:"합천군", type:"군", population:"약 40,800명", base_date:"2026년 6월 말 기준", office_address:"경상남도 합천군 합천읍 동서로 119 (합천리)", description:"유네스코 세계문화유산인 고려만대장경판을 소중히 보관하고 있는 가야산 '해인사'가 위치한 유서 깊은 고장이야." },
  { id:15, region:"남해군", type:"군", population:"약 40,600명", base_date:"2026년 6월 말 기준", office_address:"경상남도 남해군 남해읍 망운로9번길 12 (서변리)", description:"거제도처럼 아름다운 섬으로 이루어진 군 지역으로, 다랭이논과 아름다운 독일마을이 넓게 펼쳐져 있어." },
  { id:16, region:"함양군", type:"군", population:"약 36,400명", base_date:"2026년 6월 말 기준", office_address:"경상남도 함양군 함양읍 고운로 35 (교산리)", description:"신라시대 최치원 선생님이 홍수를 막으려고 인공으로 심어 가꾼 웅장한 숲 '상림공원'이 아주 시원한 동네야." },
  { id:17, region:"산청군", type:"군", population:"약 33,500명", base_date:"2026년 6월 말 기준", office_address:"경상남도 산청군 산청읍 친환경로 2701 (옥산리)", description:"지리산 자락의 맑은 정기를 받고 자란 몸에 좋은 약초와 한의학 박물관인 동의보감촌이 유명하단다." },
  { id:18, region:"의령군", type:"군", population:"약 25,200명", base_date:"2026년 6월 말 기준", office_address:"경상남도 의령군 의령읍 충익로 63 (중동리)", description:"임진왜란 때 붉은 옷을 입고 왜적을 물리친 곽재우 의병장 장군의 기상과 고소한 망개떡이 대표적인 경남에서 인구가 가장 적은 군이야." },
];
const POP_KEYWORDS = ["인구", "몇 명", "몇명", "사람", "몇이나", "몇 이나"];

function normalize(s: string): string {
  return s.replace(/\s+/g, "");
}

// 지역명 별칭(동/면/시/군/특례시 제거해도 매칭되게)
function regionAliases(region: string): string[] {
  const stripped = region
    .replace(/특례시$/, "")
    .replace(/광역시$/, "")
    .replace(/특별자치시$/, "")
    .replace(/(동|면|읍|시|군|구)$/, "");
  return Array.from(new Set([region, stripped].filter(Boolean)));
}

export function findGeojePopulation(userInput: string) {
  const q = normalize(userInput);
  if (!POP_KEYWORDS.some((k) => q.includes(normalize(k)))) return null;
  // 긴 이름부터 매칭(옥포2동이 옥포보다 먼저)
  const sorted = [...geojePopulation].sort((a, b) => b.region.length - a.region.length);
  for (const item of sorted) {
    for (const alias of regionAliases(item.region)) {
      if (alias && q.includes(normalize(alias))) return item;
    }
  }
  return null;
}

export function findGyeongnamPopulation(userInput: string) {
  const q = normalize(userInput);
  if (!POP_KEYWORDS.some((k) => q.includes(normalize(k)))) return null;
  const sorted = [...gyeongnamPopulation].sort((a, b) => b.region.length - a.region.length);
  for (const item of sorted) {
    for (const alias of regionAliases(item.region)) {
      if (alias && q.includes(normalize(alias))) return item;
    }
  }
  return null;
}
