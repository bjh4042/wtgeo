// 학교 정보 챗봇 데이터 — 이 파일만 수정해 관리하세요.
export interface SchoolQA {
  id: number;
  school_name: string;
  category: string;
  question: string;
  established_year: string;
  num_classes: string;
  num_students: string;
  website: string;
  phone: string;
  address: string;
  answer: string;
}

export const schoolQA: SchoolQA[] = [
  {
    "id": 1,
    "school_name": "계룡초등학교",
    "category": "고현동",
    "question": "계룡초등학교에 대해 알려줘",
    "established_year": "1906년",
    "num_classes": "25학급",
    "num_students": "550명",
    "website": "http://gyeryong-e.gne.go.kr",
    "phone": "055-635-2043",
    "address": "경상남도 거제시 거제중앙로 13길 14 (고현동)",
    "answer": "계룡초등학교는 1906년에 개교하여 120년이 넘는 깊은 역사를 자랑하는 학교야! 현재 25학급에서 550명의 친구들이 열심히 공부하고 있어. 주소는 고현동 거제중앙로 13길 14이며, 학교 홈페이지(http://gyeryong-e.gne.go.kr)나 전화(055-635-2043)를 통해 더 많은 소식을 볼 수 있단다."
  },
  {
    "id": 2,
    "school_name": "고현초등학교",
    "category": "고현동",
    "question": "고현초등학교는 어떤 학교야?",
    "established_year": "1997년",
    "num_classes": "28학급",
    "num_students": "680명",
    "website": "http://gohyeon-e.gne.go.kr",
    "phone": "055-636-8402",
    "address": "경상남도 거제시 거제중앙로 31길 23 (고현동)",
    "answer": "고현동 중심가에 있는 고현초등학교는 1997년에 문을 열었어. 지금은 28학급, 680명의 활기찬 친구들이 모여 있단다! 도로명 주소는 거제중앙로 31길 23이고, 궁금한 점은 전화(055-636-8402)나 홈페이지(http://gohyeon-e.gne.go.kr)에서 찾아볼 수 있어."
  },
  {
    "id": 3,
    "school_name": "신현초등학교",
    "category": "고현동",
    "question": "신현초등학교 정보 알려줘",
    "established_year": "1980년",
    "num_classes": "20학급",
    "num_students": "420명",
    "website": "http://sinhyeon-e.gne.go.kr",
    "phone": "055-635-2742",
    "address": "경상남도 거제시 고현로 4길 25 (고현동)",
    "answer": "신현초등학교는 1980년에 세워져 고현동 어린이들의 든든한 배움터가 되어왔어. 현재 20학급, 420명의 대원들이 함께 생활하고 있지! 주소는 고현로 4길 25이고, 교무실 전화번호는 055-635-2742, 인터넷 주소는 http://sinhyeon-e.gne.go.kr 이란다."
  },
  {
    "id": 4,
    "school_name": "장평초등학교",
    "category": "장평동",
    "question": "장평초등학교 위치랑 학생 수 궁금해",
    "established_year": "1985년",
    "num_classes": "24학급",
    "num_students": "510명",
    "website": "http://jangpyeong-e.gne.go.kr",
    "phone": "055-635-4011",
    "address": "경상남도 거제시 장평로 4길 15 (장평동)",
    "answer": "삼성조선소와 가까운 장평초등학교는 1985년에 개교했어! 현재 24학급, 510명의 친구들이 있고 주소는 장평동 장평로 4길 15야. 학교 소식은 홈페이지(http://jangpyeong-e.gne.go.kr)나 전화(055-635-4011)로 소통할 수 있어."
  },
  {
    "id": 5,
    "school_name": "양지초등학교",
    "category": "장평동",
    "question": "양지초등학교는 몇 년도에 지어졌어?",
    "established_year": "2005년",
    "num_classes": "32학급",
    "num_students": "820명",
    "website": "http://yangji-e.gne.go.kr",
    "phone": "055-638-4804",
    "address": "경상남도 거제시 장평1로 72 (장평동)",
    "answer": "장평동 아파트 밀집 구역에 있는 양지초등학교는 2005년에 세워진 활기찬 신도심 학교야. 무려 32학급, 820명의 많은 대원들이 공부하고 있지! 주소는 장평1로 72이며, 전화(055-638-4804) 및 홈페이지(http://yangji-e.gne.go.kr)가 열려 있단다."
  },
  {
    "id": 6,
    "school_name": "상동초등학교",
    "category": "상문동",
    "question": "상동초등학교 학급 수가 몇 개야?",
    "established_year": "2015년",
    "num_classes": "42학급",
    "num_students": "1150명",
    "website": "http://sangdong-e.gne.go.kr",
    "phone": "055-730-1500",
    "address": "경상남도 거제시 상동5길 27 (상동동)",
    "answer": "상동초등학교는 2015년에 개교한 학교로, 거제시 전체에서도 전교생이 아주 많은 매머드 학교야! 현재 42학급, 1,150명의 친구들이 다닌단다. 주소는 상동5길 27이고, 연락처는 055-730-1500, 누리집은 http://sangdong-e.gne.go.kr 이야."
  },
  {
    "id": 7,
    "school_name": "삼룡초등학교",
    "category": "상문동",
    "question": "삼룡초등학교 사이트 주소랑 전번 뭐야?",
    "established_year": "2007년",
    "num_classes": "36학급",
    "num_students": "930명",
    "website": "http://samryong-e.gne.go.kr",
    "phone": "055-638-3492",
    "address": "경상남도 거제시 상동서길 32-5 (상동동)",
    "answer": "상문동 용산쉼터 근처에 있는 삼룡초등학교는 2007년에 문을 열었어. 36학급에서 930명의 대원들이 꿈을 키우고 있지! 도로명 주소는 상동서길 32-5이며, 전화번호는 055-638-3492, 사이트 주소는 http://samryong-e.gne.go.kr 란다."
  },
  {
    "id": 8,
    "school_name": "수월초등학교",
    "category": "수양동",
    "question": "수월초등학교 전교생 몇 명이야?",
    "established_year": "1936년",
    "num_classes": "22학급",
    "num_students": "520명",
    "website": "http://suwol-e.gne.go.kr",
    "phone": "055-635-2962",
    "address": "경상남도 거제시 수월로 68 (수월동)",
    "address_old": "수월동",
    "answer": "수월초등학교는 1936년에 개교해 전통이 아주 깊은 학교야. 대단지 아파트 중간인 수월로 68에 위치하며 22학급, 520명의 친구들이 다녀. 홈페이지(http://suwol-e.gne.go.kr)와 연락처(055-635-2962)를 통해 소통하고 있어."
  },
  {
    "id": 9,
    "school_name": "제산초등학교",
    "category": "수양동",
    "question": "제산초등학교 정보 다 알려줘",
    "established_year": "2007년",
    "num_classes": "30학급",
    "num_students": "780명",
    "website": "http://jesan-e.gne.go.kr",
    "phone": "055-638-5172",
    "address": "경상남도 거제시 제산로 49 (수월동)",
    "answer": "수양동 수월천 변 근처에 있는 제산초등학교는 2007년에 지어졌어. 현재 30학급, 780명의 학생들이 재학 중이란다. 주소는 제산로 49이고 홈페이지 주소는 http://jesan-e.gne.go.kr, 학교 전화번호는 055-638-5172야."
  },
  {
    "id": 10,
    "school_name": "동부초등학교",
    "category": "동부면",
    "question": "동부초등학교 개교일이랑 주소는?",
    "established_year": "1933년",
    "num_classes": "6학급",
    "num_students": "65명",
    "website": "http://dongbu-e.gne.go.kr",
    "phone": "055-633-3012",
    "address": "경상남도 거제시 동부면 동부로 13길 19 (산양리)",
    "answer": "동부면사무소 옆 산양리에 있는 동부초등학교는 1933년에 세워져 역사가 아주 길어! 아늑한 시골 학교로 6학급, 65명의 친구들이 정답게 지내지. 주소는 동부면 동부로 13길 19이며, 전화(055-633-3012)나 홈페이지(http://dongbu-e.gne.go.kr)에서 멋진 생태 수업 모습을 볼 수 있어."
  },
  {
    "id": 11,
    "school_name": "명사초등학교",
    "category": "남부면",
    "question": "남부면 명사초등학교 학생 수 몇 명이야?",
    "established_year": "1946년",
    "num_classes": "6학급",
    "num_students": "40명",
    "website": "http://myeongsa-e.gne.go.kr",
    "phone": "055-633-0492",
    "address": "경상남도 거제시 남부면 명사해변길 26-1 (저구리)",
    "answer": "명사해수욕장 바로 뒤편에 있는 명사초등학교는 1946년에 개교했단다. 6학급, 40명의 친한 친구들이 맑은 바다를 보며 공부하는 이쁜 학교야! 주소는 남부면 명사해변길 26-1이며, 연락처는 055-633-0492, 사이트는 http://myeongsa-e.gne.go.kr 이야."
  },
  {
    "id": 12,
    "school_name": "거제초등학교",
    "category": "거제면",
    "question": "거제초등학교 역사 건물에 대해 말해줘",
    "established_year": "1907년",
    "num_classes": "12학급",
    "num_students": "180명",
    "website": "http://geoje-e.gne.go.kr",
    "phone": "055-633-2004",
    "address": "경상남도 거제시 거제면 기성관로 30 (서정리)",
    "answer": "거제면 관아 기성관 근처의 거제초등학교는 1907년에 세워진 역사 깊은 학교야. 특히 돌로 지어진 본관 건물은 근대문화유산 문화재로도 유명하단다! 현재 12학급, 180명이 다니고 주소는 기성관로 30, 전화는 055-633-2004, 사이트는 http://geoje-e.gne.go.kr 야."
  },
  {
    "id": 13,
    "school_name": "외간초등학교",
    "category": "거제면",
    "question": "외간초등학교 사이트 주소랑 위치는?",
    "established_year": "1947년",
    "num_classes": "6학급",
    "num_students": "75명",
    "website": "http://oegan-e.gne.go.kr",
    "phone": "055-632-4911",
    "address": "경상남도 거제시 거제면 거제남서로 3379 (외간리)",
    "answer": "거제면 외간리 동백나무 근처에 있는 외간초등학교는 1947년에 개교한 친환경 아늑한 학교야. 6학급, 75명의 탐험대원들이 살고 있어! 주소는 거제남서로 3379이며 학교 대표번호는 055-632-4911, 인터넷 주소는 http://oegan-e.gne.go.kr 이란다."
  },
  {
    "id": 14,
    "school_name": "숭덕초등학교",
    "category": "둔덕면",
    "question": "둔덕면 숭덕초등학교 정보 보여줘",
    "established_year": "1931년",
    "num_classes": "6학급",
    "num_students": "55명",
    "website": "http://sungdeok-e.gne.go.kr",
    "phone": "055-632-5082",
    "address": "경상남도 거제시 둔덕면 하둔길 10 (하둔리)",
    "answer": "둔덕면사무소 근처 하둔리에 위치한 숭덕초등학교는 1931년에 문을 연 오랜 전통의 시골 학교야. 6학급, 55명의 친구들이 승마, 골프 등 특색 활동을 많이 하지! 주소는 둔덕면 하둔길 10이고 전화는 055-632-5082, 누리집은 http://sungdeok-e.gne.go.kr 야."
  },
  {
    "id": 15,
    "school_name": "사등초등학교",
    "category": "사등면",
    "question": "사등초등학교 전교생이랑 연락처는?",
    "established_year": "1936년",
    "num_classes": "6학급",
    "num_students": "60명",
    "website": "http://sadeung-e.gne.go.kr",
    "phone": "055-632-6012",
    "address": "경상남도 거제시 사등면 사등로 95 (사등리)",
    "answer": "사등성벽 돌담 골목 근처에 있는 사등초등학교는 1936년에 개교했어. 현재 6학급, 60명의 정겨운 대원들이 공부하고 있단다! 도로명 주소는 사등면 사등로 95이며, 연락처는 055-632-6012, 홈페이지 주소는 http://sadeung-e.gne.go.kr 이야."
  },
  {
    "id": 16,
    "school_name": "기성초등학교",
    "category": "사등면",
    "question": "사곡리 기성초등학교에 대해 가르쳐줘",
    "established_year": "1949년",
    "num_classes": "20학급",
    "num_students": "450명",
    "website": "http://giseong-e.gne.go.kr",
    "phone": "055-632-6502",
    "address": "경상남도 거제시 사등면 사곡로 61 (사곡리)",
    "answer": "사곡 해수욕장 주변 아파트 단지와 인접한 기성초등학교는 1949년에 세워졌어! 최근 아파트가 생기며 20학급, 450명 규모로 멋지게 발전했지. 주소는 사등면 사곡로 61이고, 대표 전화는 055-632-6502, 웹사이트는 http://giseong-e.gne.go.kr 란다."
  },
  {
    "id": 17,
    "school_name": "연초초등학교",
    "category": "연초면",
    "question": "연초초등학교 전화번호랑 학생 수",
    "established_year": "1930년",
    "num_classes": "12학급",
    "num_students": "210명",
    "website": "http://yeoncho-e.gne.go.kr",
    "phone": "055-635-6014",
    "address": "경상남도 거제시 연초면 연사로 40 (연사리)",
    "answer": "연초면사무소 앞 중심가 연사리에 있는 연초초등학교는 1930년에 문을 열었어. 현재 12학급, 210명의 학생들이 등교하고 있지! 주소는 연초면 연사로 40이며, 학교 통신 전화는 055-635-6014, 홈페이지는 http://yeoncho-e.gne.go.kr 이야."
  },
  {
    "id": 18,
    "school_name": "하청초등학교",
    "category": "하청면",
    "question": "하청초등학교 주소랑 사이트 주소는?",
    "established_year": "1923년",
    "num_classes": "8학급",
    "num_students": "110명",
    "website": "http://hacheong-e.gne.go.kr",
    "phone": "055-633-1002",
    "address": "경상남도 거제시 하청면 하청로 12 (하청리)",
    "answer": "맹종죽 대나무 숲이 유명한 하청면 중심에 서 있는 하청초등학교는 1923년에 문을 열어 100년 역사가 넘었어! 8학급, 110명의 친구들이 있고 주소는 하청로 12야. 전화번호 055-633-1002, 홈페이지 http://hacheong-e.gne.go.kr 을 통해 소통해."
  },
  {
    "id": 19,
    "school_name": "장목초등학교",
    "category": "장목면",
    "question": "장목초등학교 개교년도랑 정보 다 줘",
    "established_year": "1921년",
    "num_classes": "6학급",
    "num_students": "45명",
    "website": "http://jangmok-e.gne.go.kr",
    "phone": "055-635-0012",
    "address": "경상남도 거제시 장목면 장목로 26 (장목리)",
    "answer": "매미성이 있는 장목면 중심 항구 근처의 장목초등학교는 1921년에 개교한 전통 깊은 어촌 마을 학교야. 6학급, 45명의 친구들이 든든하게 공부하고 있지! 주소는 장목면 장목로 26이며 전화번호 055-635-0012, 홈페이지 주소는 http://jangmok-e.gne.go.kr 이야."
  },
  {
    "id": 20,
    "school_name": "지세포초등학교",
    "category": "일운면",
    "question": "지세포초등학교는 몇 학급이야?",
    "established_year": "1940년",
    "num_classes": "14학급",
    "num_students": "260명",
    "website": "http://jisetpo-e.gne.go.kr",
    "phone": "055-637-2003",
    "address": "경상남도 거제시 일운면 지세포로 99 (지세포리)",
    "answer": "해양문화관과 돌고래 수족관이 있는 일운면 지세포항의 지세포초등학교는 1940년에 개교했어. 현재 14학급, 260명의 멋진 대원들이 바다를 품으며 생활하고 있지! 도로명 주소는 지세포로 99이고, 대표번호는 055-637-2003, 누리집 주소는 http://jisetpo-e.gne.go.kr 란다."
  },
  {
    "id": 21,
    "school_name": "아주초등학교",
    "category": "아주동",
    "question": "아주초등학교 위치랑 개교일 가르쳐줘",
    "established_year": "1934년",
    "num_classes": "24학급",
    "num_students": "580명",
    "website": "http://aju-e.gne.go.kr",
    "phone": "055-681-2015",
    "address": "경상남도 거제시 아주로 3길 13 (아주동)",
    "answer": "한화오션 조선소와 3·1 만세 기념탑이 있는 아주동의 아주초등학교는 1934년에 문을 열었어. 24학급, 580명의 역동적인 친구들이 모여 있단다! 주소는 아주동 아주로 3길 13이며, 교무실 연락처는 055-681-2015, 사이트 주소는 http://aju-e.gne.go.kr 이야."
  },
  {
    "id": 22,
    "school_name": "국산초등학교",
    "category": "옥포동",
    "question": "옥포동 국산초등학교 이름 뜻이랑 정보 줘",
    "established_year": "1984년",
    "num_classes": "38학급",
    "num_students": "980명",
    "website": "http://guksan-e.gne.go.kr",
    "phone": "055-687-5701",
    "address": "경상남도 거제시 옥포성안로 60 (옥포동)",
    "answer": "옛날 뽕나무 밭 밭고을 이름에서 유래한 유서 깊은 국산초등학교는 옥포동에 위치하며 1984년에 문을 열었어. 현재 38학급, 980명으로 옥포 지역의 중심 학교야! 주소는 옥포성안로 60이며 대표 전화는 055-687-5701, 홈페이지는 http://guksan-e.gne.go.kr 이란다."
  },
  {
    "id": 23,
    "school_name": "장승포초등학교",
    "category": "장승포동",
    "question": "장승포초등학교 전교생이랑 역사 알려줘",
    "established_year": "1920년",
    "num_classes": "12학급",
    "num_students": "220명",
    "website": "http://jangseungpo-e.gne.go.kr",
    "phone": "055-681-2503",
    "address": "경상남도 거제시 장승포로 66 (장승포동)",
    "answer": "문화예술회관과 흥남철수 기적의 길이 있는 장승포동의 장승포초등학교는 1920년에 세워져 100년이 훌쩍 넘은 영광스러운 학교야! 현재 12학급, 220명의 대원들이 함께 배우고 있어. 주소는 장승포로 66이고 전화는 055-681-2503, 주소는 http://jangseungpo-e.gne.go.kr 야."
  },
  {
    "id": 24,
    "school_name": "능포초등학교",
    "category": "능포동",
    "question": "능포초등학교 주소랑 학생 수 궁금해",
    "established_year": "1989년",
    "num_classes": "12학급",
    "num_students": "200명",
    "website": "http://neungpo-e.gne.go.kr",
    "phone": "055-681-8012",
    "address": "경상남도 거제시 능포로 8길 11 (능포동)",
    "answer": "양지암 조각공원과 낚시공원이 이쁜 능포동의 능포초등학교는 1989년에 문을 열었어! 폭신한 인조잔디 운동장과 함께 12학급, 200명의 대원들이 힘차게 뛰놀지. 도로명 주소는 능포로 8길 11이고 연락처는 055-681-8012, 사이트는 http://neungpo-e.gne.go.kr 이란다."
  }
];

// 학교명 또는 '<동/면> + 초등학교' 패턴으로 학교 정보 매칭
export function findSchoolInfo(userInput: string): SchoolQA | undefined {
  if (!userInput) return undefined;
  const input = userInput.replace(/\s+/g, "");
  return schoolQA.find((school) => {
    const name = school.school_name.replace(/\s+/g, "");
    const cat = school.category.replace(/\s+/g, "");
    return (
      input.includes(name) ||
      (input.includes(cat) && input.includes("초등학교"))
    );
  });
}
