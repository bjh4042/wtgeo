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
    question: '한국전쟁 당시 거제도에 있었던 포로수용소에는 약 17만 명의 포로가 수용되었다.',
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
];
