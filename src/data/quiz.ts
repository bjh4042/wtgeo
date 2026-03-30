export interface QuizQuestion {
  id: number;
  question: string;
  type: 'ox' | 'choice';
  options: string[];
  answer: number; // 0-indexed
  explanation: string;
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: '거제도는 우리나라에서 두 번째로 큰 섬이다.',
    type: 'ox',
    options: ['O', 'X'],
    answer: 0,
    explanation: '거제도는 제주도 다음으로 우리나라에서 두 번째로 큰 섬입니다.',
  },
  {
    id: 2,
    question: '임진왜란 때 이순신 장군의 첫 번째 해전 승리가 이루어진 곳은?',
    type: 'choice',
    options: ['한산도', '옥포', '노량', '명량'],
    answer: 1,
    explanation: '1592년 5월 7일 옥포해전은 이순신 장군의 첫 번째 해전 승리입니다.',
  },
  {
    id: 3,
    question: '거제시의 최고봉은 노자산이다.',
    type: 'ox',
    options: ['O', 'X'],
    answer: 1,
    explanation: '거제시의 최고봉은 계룡산(566m)입니다. 노자산은 565m로 두 번째입니다.',
  },
  {
    id: 4,
    question: '바다의 금강산이라는 뜻을 가진 거제도의 명승지는?',
    type: 'choice',
    options: ['바람의 언덕', '해금강', '외도', '신선대'],
    answer: 1,
    explanation: '해금강(海金剛)은 "바다의 금강산"이라는 뜻으로, 명승 제2호입니다.',
  },
  {
    id: 5,
    question: '한국전쟁 당시 거제도 포로수용소에는 약 17만 명의 포로가 수용되었다.',
    type: 'ox',
    options: ['O', 'X'],
    answer: 0,
    explanation: '거제포로수용소에는 약 17만여 명의 인민군과 중공군 포로가 수용되었습니다.',
  },
  {
    id: 6,
    question: '거제도와 통영을 연결하는 최초의 다리가 개통된 해는?',
    type: 'choice',
    options: ['1961년', '1971년', '1981년', '1991년'],
    answer: 1,
    explanation: '거제대교는 1971년에 개통되어 거제도와 통영을 최초로 연결했습니다.',
  },
  {
    id: 7,
    question: '"구조라"라는 지명은 아홉 개의 낚시바위가 나란히 있다는 뜻에서 유래되었다.',
    type: 'ox',
    options: ['O', 'X'],
    answer: 0,
    explanation: '"구조라(九釣羅)"는 아홉(九)개의 낚시(釣) 바위가 나란히(羅) 있다는 뜻입니다.',
  },
  {
    id: 8,
    question: '고려시대 의종이 유배되었던 거제도의 성곽은?',
    type: 'choice',
    options: ['기성관', '둔덕기성', '거제향교', '가라산봉수대'],
    answer: 1,
    explanation: '둔덕기성(사적 제509호)은 고려 의종이 유배되었던 산성입니다.',
  },
  {
    id: 9,
    question: '거제도에서 국제공항이 운영되고 있다.',
    type: 'ox',
    options: ['O', 'X'],
    answer: 1,
    explanation: '거제도에는 국제공항이 없습니다. 가장 가까운 공항은 김해국제공항입니다.',
  },
  {
    id: 10,
    question: '외도 보타니아를 30년에 걸쳐 가꾼 부부의 성은?',
    type: 'choice',
    options: ['김씨 부부', '이씨 부부', '박씨 부부', '최씨 부부'],
    answer: 1,
    explanation: '이창호·최호숙 부부가 1969년부터 30년에 걸쳐 외도를 해상식물공원으로 가꾸었습니다.',
  },
  {
    id: 11,
    question: '거제도는 경상남도에 속해 있다.',
    type: 'ox',
    options: ['O', 'X'],
    answer: 0,
    explanation: '거제도는 경상남도 거제시에 속해 있습니다.',
  },
  {
    id: 12,
    question: '거제시의 행정 중심지(시청 소재지)는 어디인가요?',
    type: 'choice',
    options: ['옥포동', '고현동', '장승포동', '거제면'],
    answer: 1,
    explanation: '거제시청은 고현동(계룡로 125)에 위치해 있습니다.',
  },
  {
    id: 13,
    question: '거제 해금강은 명승 제2호이다.',
    type: 'ox',
    options: ['O', 'X'],
    answer: 0,
    explanation: '해금강은 1971년 명승 제2호로 지정되었습니다.',
  },
  {
    id: 14,
    question: '거제도에서 가장 유명한 검은 자갈 해변의 이름은?',
    type: 'choice',
    options: ['구조라해수욕장', '학동흑진주몽돌해변', '와현해수욕장', '명사해수욕장'],
    answer: 1,
    explanation: '학동흑진주몽돌해변은 검은 몽돌(자갈)이 깔린 거제도의 대표적인 해변입니다.',
  },
  {
    id: 15,
    question: '바람의 언덕은 거제시 남부면에 위치해 있다.',
    type: 'ox',
    options: ['O', 'X'],
    answer: 0,
    explanation: '바람의 언덕은 거제시 남부면 갈곶리 도장포마을에 위치해 있습니다.',
  },
  {
    id: 16,
    question: '조선시대 거제현의 관아 건물인 기성관은 현재 어떤 문화재로 지정되어 있나요?',
    type: 'choice',
    options: ['국보', '보물', '경상남도 유형문화재', '사적'],
    answer: 2,
    explanation: '거제 기성관은 경상남도 유형문화재 제81호로 지정되어 있습니다.',
  },
  {
    id: 17,
    question: '1597년 칠천량해전에서 조선 수군을 이끌었던 장군은?',
    type: 'choice',
    options: ['이순신', '원균', '김시민', '권율'],
    answer: 1,
    explanation: '칠천량해전에서는 원균이 이끈 조선 수군이 일본에 대패했습니다.',
  },
  {
    id: 18,
    question: '거제도의 대표적인 대나무 종류인 맹종죽은 효자 맹종의 이야기에서 이름이 유래되었다.',
    type: 'ox',
    options: ['O', 'X'],
    answer: 0,
    explanation: '맹종죽(孟宗竹)은 효자 맹종이 겨울에 어머니를 위해 죽순을 구했다는 고사에서 이름이 유래되었습니다.',
  },
  {
    id: 19,
    question: '거제도에서 "거제(巨濟)"라는 이름의 뜻은?',
    type: 'choice',
    options: ['큰 산', '크게 건넌다', '큰 바다', '큰 마을'],
    answer: 1,
    explanation: '"거제(巨濟)"는 "크게 건넌다"는 뜻으로, 이 큰 섬을 건너야 한다는 의미에서 유래되었습니다.',
  },
  {
    id: 20,
    question: '거제 포로수용소는 한국전쟁(6·25전쟁) 때 설치되었다.',
    type: 'ox',
    options: ['O', 'X'],
    answer: 0,
    explanation: '거제 포로수용소는 1950년 한국전쟁 당시 유엔군이 포로를 수용하기 위해 설치했습니다.',
  },
];

// 20문제 중 랜덤 10문제 선택
export function getRandomQuestions(count: number = 10): QuizQuestion[] {
  const shuffled = [...quizQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
