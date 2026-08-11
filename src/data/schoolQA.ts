// 학교 정보 챗봇 데이터 — 이 파일만 수정해 관리하세요.
import { schools } from "./schools";
export interface SchoolQA {
  id: number;
  school_name: string;
  category: string;
  question: string;
  established_year: string;
  num_classes: string;
  num_students: string;
  /** 학급 수 기준 시점(공식 공시). 값이 없으면 기준일 미확인 */
  num_classes_as_of?: string;
  /** 공식 출처 */
  source?: string;
  /** 공식 출처 기준일 */
  source_date?: string;
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
    "established_year": "1929년 12월 20일",
    "num_classes": "13학급",
    "num_students": "",
    "website": "http://gyeryong-e.gne.go.kr",
    "phone": "055-635-2043",
    "address": "경상남도 거제시 거제중앙로 13길 14 (고현동)",
    "answer": "계룡초등학교는 1929년 12월 20일에 설립되었어요(교육부 NEIS 학교기본정보 기준). 2026학년도 학급 수는 13학급이에요(2026-08-01 공시 기준). 학생 수는 공식으로 확인된 자료가 없어서 안내하지 않을게요.",
    "num_classes_as_of": "2026학년도(2026-08-01 공시)",
    "source": "교육부 NEIS 학교기본정보·학급편성(경상남도교육청)",
    "source_date": "2026-08-01"
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
    "answer": "고현동 중심가에 있는 고현초등학교는 1997년에 문을 열었어. 지금은 28학급, 680명의 활기찬 친구들이 모여 있단다! 도로명 주소는 거제중앙로 31길 23이고, 궁금한 점은 전화(055-636-8402)나 홈페이지(http://gohyeon-e.gne.go.kr)에서 찾아볼 수 있어.",
    "source": "미확인"
  },
  {
    "id": 3,
    "school_name": "신현초등학교",
    "category": "고현동",
    "question": "신현초등학교 정보 알려줘",
    "established_year": "1993년 3월 1일",
    "num_classes": "19학급",
    "num_students": "",
    "website": "http://sinhyeon-e.gne.go.kr",
    "phone": "055-635-2742",
    "address": "경상남도 거제시 고현로 4길 25 (고현동)",
    "answer": "신현초등학교는 1993년 3월 1일에 설립되었어요(교육부 NEIS 학교기본정보 기준). 2026학년도 학급 수는 19학급이에요(2026-08-01 공시 기준). 학생 수는 공식으로 확인된 자료가 없어서 안내하지 않을게요.",
    "num_classes_as_of": "2026학년도(2026-08-01 공시)",
    "source": "교육부 NEIS 학교기본정보·학급편성(경상남도교육청)",
    "source_date": "2026-08-01"
  },
  {
    "id": 4,
    "school_name": "장평초등학교",
    "category": "장평동",
    "question": "장평초등학교 위치랑 학생 수 궁금해",
    "established_year": "1976년 3월 1일",
    "num_classes": "25학급",
    "num_students": "",
    "website": "http://jangpyeong-e.gne.go.kr",
    "phone": "055-635-4011",
    "address": "경상남도 거제시 장평로 4길 15 (장평동)",
    "answer": "장평초등학교는 1976년 3월 1일에 설립되었어요(교육부 NEIS 학교기본정보 기준). 2026학년도 학급 수는 25학급이에요(2026-08-01 공시 기준). 학생 수는 공식으로 확인된 자료가 없어서 안내하지 않을게요.",
    "num_classes_as_of": "2026학년도(2026-08-01 공시)",
    "source": "교육부 NEIS 학교기본정보·학급편성(경상남도교육청)",
    "source_date": "2026-08-01"
  },
  {
    "id": 5,
    "school_name": "양지초등학교",
    "category": "장평동",
    "question": "양지초등학교는 몇 년도에 지어졌어?",
    "established_year": "2004년 3월 1일",
    "num_classes": "20학급",
    "num_students": "",
    "website": "http://yangji-e.gne.go.kr",
    "phone": "055-638-4804",
    "address": "경상남도 거제시 장평1로 72 (장평동)",
    "answer": "양지초등학교는 2004년 3월 1일에 설립되었어요(교육부 NEIS 학교기본정보 기준). 2026학년도 학급 수는 20학급이에요(2026-08-01 공시 기준). 학생 수는 공식으로 확인된 자료가 없어서 안내하지 않을게요.",
    "num_classes_as_of": "2026학년도(2026-08-01 공시)",
    "source": "교육부 NEIS 학교기본정보·학급편성(경상남도교육청)",
    "source_date": "2026-08-01"
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
    "answer": "상동초등학교는 2015년에 개교한 학교로, 거제시 전체에서도 전교생이 아주 많은 매머드 학교야! 현재 42학급, 1,150명의 친구들이 다닌단다. 주소는 상동5길 27이고, 연락처는 055-730-1500, 누리집은 http://sangdong-e.gne.go.kr 이야.",
    "source": "미확인"
  },
  {
    "id": 7,
    "school_name": "삼룡초등학교",
    "category": "상문동",
    "question": "삼룡초등학교 사이트 주소랑 전번 뭐야?",
    "established_year": "2007년 9월 1일",
    "num_classes": "32학급",
    "num_students": "",
    "website": "http://samryong-e.gne.go.kr",
    "phone": "055-638-3492",
    "address": "경상남도 거제시 상동서길 32-5 (상동동)",
    "answer": "삼룡초등학교는 2007년 9월 1일에 설립되었어요(교육부 NEIS 학교기본정보 기준). 2026학년도 학급 수는 32학급이에요(2026-08-01 공시 기준). 학생 수는 공식으로 확인된 자료가 없어서 안내하지 않을게요.",
    "num_classes_as_of": "2026학년도(2026-08-01 공시)",
    "source": "교육부 NEIS 학교기본정보·학급편성(경상남도교육청)",
    "source_date": "2026-08-01"
  },
  {
    "id": 8,
    "school_name": "수월초등학교",
    "category": "수양동",
    "question": "수월초등학교 전교생 몇 명이야?",
    "established_year": "1944년 4월 15일",
    "num_classes": "26학급",
    "num_students": "",
    "website": "http://suwol-e.gne.go.kr",
    "phone": "055-635-2962",
    "address": "경상남도 거제시 수월로 68 (수월동)",
    "answer": "수월초등학교는 1944년 4월 15일에 설립되었어요(교육부 NEIS 학교기본정보 기준). 2026학년도 학급 수는 26학급이에요(2026-08-01 공시 기준). 학생 수는 공식으로 확인된 자료가 없어서 안내하지 않을게요.",
    "num_classes_as_of": "2026학년도(2026-08-01 공시)",
    "source": "교육부 NEIS 학교기본정보·학급편성(경상남도교육청)",
    "source_date": "2026-08-01"
  },
  {
    "id": 9,
    "school_name": "제산초등학교",
    "category": "수양동",
    "question": "제산초등학교 정보 다 알려줘",
    "established_year": "2008년 3월 1일",
    "num_classes": "31학급",
    "num_students": "",
    "website": "http://jesan-e.gne.go.kr",
    "phone": "055-638-5172",
    "address": "경상남도 거제시 제산로 49 (수월동)",
    "answer": "제산초등학교는 2008년 3월 1일에 설립되었어요(교육부 NEIS 학교기본정보 기준). 2026학년도 학급 수는 31학급이에요(2026-08-01 공시 기준). 학생 수는 공식으로 확인된 자료가 없어서 안내하지 않을게요.",
    "num_classes_as_of": "2026학년도(2026-08-01 공시)",
    "source": "교육부 NEIS 학교기본정보·학급편성(경상남도교육청)",
    "source_date": "2026-08-01"
  },
  {
    "id": 10,
    "school_name": "동부초등학교",
    "category": "동부면",
    "question": "동부초등학교 개교일이랑 주소는?",
    "established_year": "1938년 4월 20일",
    "num_classes": "6학급",
    "num_students": "",
    "website": "http://dongbu-e.gne.go.kr",
    "phone": "055-633-3012",
    "address": "경상남도 거제시 동부면 동부로 13길 19 (산양리)",
    "answer": "동부초등학교는 1938년 4월 20일에 설립되었어요(교육부 NEIS 학교기본정보 기준). 2026학년도 학급 수는 6학급이에요(2026-08-01 공시 기준). 학생 수는 공식으로 확인된 자료가 없어서 안내하지 않을게요.",
    "num_classes_as_of": "2026학년도(2026-08-01 공시)",
    "source": "교육부 NEIS 학교기본정보·학급편성(경상남도교육청)",
    "source_date": "2026-08-01"
  },
  {
    "id": 11,
    "school_name": "명사초등학교",
    "category": "남부면",
    "question": "남부면 명사초등학교 학생 수 몇 명이야?",
    "established_year": "1932년 9월 20일",
    "num_classes": "4학급",
    "num_students": "",
    "website": "http://myeongsa-e.gne.go.kr",
    "phone": "055-633-0492",
    "address": "경상남도 거제시 남부면 명사해변길 26-1 (저구리)",
    "answer": "명사초등학교는 1932년 9월 20일에 설립되었어요(교육부 NEIS 학교기본정보 기준). 2026학년도 학급 수는 4학급이에요(2026-08-01 공시 기준). 학생 수는 공식으로 확인된 자료가 없어서 안내하지 않을게요.",
    "num_classes_as_of": "2026학년도(2026-08-01 공시)",
    "source": "교육부 NEIS 학교기본정보·학급편성(경상남도교육청)",
    "source_date": "2026-08-01"
  },
  {
    "id": 12,
    "school_name": "거제초등학교",
    "category": "거제면",
    "question": "거제초등학교 역사 건물에 대해 말해줘",
    "established_year": "1908년 4월 8일",
    "num_classes": "7학급",
    "num_students": "",
    "website": "http://geoje-e.gne.go.kr",
    "phone": "055-633-2004",
    "address": "경상남도 거제시 거제면 기성관로 30 (서정리)",
    "answer": "거제초등학교는 1908년 4월 8일에 설립되었어요(교육부 NEIS 학교기본정보 기준). 2026학년도 학급 수는 7학급이에요(2026-08-01 공시 기준). 학생 수는 공식으로 확인된 자료가 없어서 안내하지 않을게요.",
    "num_classes_as_of": "2026학년도(2026-08-01 공시)",
    "source": "교육부 NEIS 학교기본정보·학급편성(경상남도교육청)",
    "source_date": "2026-08-01"
  },
  {
    "id": 13,
    "school_name": "외간초등학교",
    "category": "거제면",
    "question": "외간초등학교 사이트 주소랑 위치는?",
    "established_year": "1946년 10월 1일",
    "num_classes": "7학급",
    "num_students": "",
    "website": "http://oegan-e.gne.go.kr",
    "phone": "055-632-4911",
    "address": "경상남도 거제시 거제면 거제남서로 3379 (외간리)",
    "answer": "외간초등학교는 1946년 10월 1일에 설립되었어요(교육부 NEIS 학교기본정보 기준). 2026학년도 학급 수는 7학급이에요(2026-08-01 공시 기준). 학생 수는 공식으로 확인된 자료가 없어서 안내하지 않을게요.",
    "num_classes_as_of": "2026학년도(2026-08-01 공시)",
    "source": "교육부 NEIS 학교기본정보·학급편성(경상남도교육청)",
    "source_date": "2026-08-01"
  },
  {
    "id": 14,
    "school_name": "숭덕초등학교",
    "category": "둔덕면",
    "question": "둔덕면 숭덕초등학교 정보 보여줘",
    "established_year": "1948년 3월 24일",
    "num_classes": "6학급",
    "num_students": "",
    "website": "http://sungdeok-e.gne.go.kr",
    "phone": "055-632-5082",
    "address": "경상남도 거제시 둔덕면 하둔길 10 (하둔리)",
    "answer": "숭덕초등학교는 1948년 3월 24일에 설립되었어요(교육부 NEIS 학교기본정보 기준). 2026학년도 학급 수는 6학급이에요(2026-08-01 공시 기준). 학생 수는 공식으로 확인된 자료가 없어서 안내하지 않을게요.",
    "num_classes_as_of": "2026학년도(2026-08-01 공시)",
    "source": "교육부 NEIS 학교기본정보·학급편성(경상남도교육청)",
    "source_date": "2026-08-01"
  },
  {
    "id": 15,
    "school_name": "사등초등학교",
    "category": "사등면",
    "question": "사등초등학교 전교생이랑 연락처는?",
    "established_year": "1931년 5월 12일",
    "num_classes": "6학급",
    "num_students": "",
    "website": "http://sadeung-e.gne.go.kr",
    "phone": "055-632-6012",
    "address": "경상남도 거제시 사등면 사등로 95 (사등리)",
    "answer": "사등초등학교는 1931년 5월 12일에 설립되었어요(교육부 NEIS 학교기본정보 기준). 2026학년도 학급 수는 6학급이에요(2026-08-01 공시 기준). 학생 수는 공식으로 확인된 자료가 없어서 안내하지 않을게요.",
    "num_classes_as_of": "2026학년도(2026-08-01 공시)",
    "source": "교육부 NEIS 학교기본정보·학급편성(경상남도교육청)",
    "source_date": "2026-08-01"
  },
  {
    "id": 16,
    "school_name": "기성초등학교",
    "category": "사등면",
    "question": "사곡리 기성초등학교에 대해 가르쳐줘",
    "established_year": "1946년 8월 30일",
    "num_classes": "25학급",
    "num_students": "",
    "website": "http://giseong-e.gne.go.kr",
    "phone": "055-632-6502",
    "address": "경상남도 거제시 사등면 사곡로 61 (사곡리)",
    "answer": "기성초등학교는 1946년 8월 30일에 설립되었어요(교육부 NEIS 학교기본정보 기준). 2026학년도 학급 수는 25학급이에요(2026-08-01 공시 기준). 학생 수는 공식으로 확인된 자료가 없어서 안내하지 않을게요.",
    "num_classes_as_of": "2026학년도(2026-08-01 공시)",
    "source": "교육부 NEIS 학교기본정보·학급편성(경상남도교육청)",
    "source_date": "2026-08-01"
  },
  {
    "id": 17,
    "school_name": "연초초등학교",
    "category": "연초면",
    "question": "연초초등학교 전화번호랑 학생 수",
    "established_year": "1931년 5월 25일",
    "num_classes": "8학급",
    "num_students": "",
    "website": "http://yeoncho-e.gne.go.kr",
    "phone": "055-635-6014",
    "address": "경상남도 거제시 연초면 연사로 40 (연사리)",
    "answer": "연초초등학교는 1931년 5월 25일에 설립되었어요(교육부 NEIS 학교기본정보 기준). 2026학년도 학급 수는 8학급이에요(2026-08-01 공시 기준). 학생 수는 공식으로 확인된 자료가 없어서 안내하지 않을게요.",
    "num_classes_as_of": "2026학년도(2026-08-01 공시)",
    "source": "교육부 NEIS 학교기본정보·학급편성(경상남도교육청)",
    "source_date": "2026-08-01"
  },
  {
    "id": 18,
    "school_name": "하청초등학교",
    "category": "하청면",
    "question": "하청초등학교 주소랑 사이트 주소는?",
    "established_year": "1924년 4월 24일",
    "num_classes": "6학급",
    "num_students": "",
    "website": "http://hacheong-e.gne.go.kr",
    "phone": "055-633-1002",
    "address": "경상남도 거제시 하청면 하청로 12 (하청리)",
    "answer": "하청초등학교는 1924년 4월 24일에 설립되었어요(교육부 NEIS 학교기본정보 기준). 2026학년도 학급 수는 6학급이에요(2026-08-01 공시 기준). 학생 수는 공식으로 확인된 자료가 없어서 안내하지 않을게요.",
    "num_classes_as_of": "2026학년도(2026-08-01 공시)",
    "source": "교육부 NEIS 학교기본정보·학급편성(경상남도교육청)",
    "source_date": "2026-08-01"
  },
  {
    "id": 19,
    "school_name": "장목초등학교",
    "category": "장목면",
    "question": "장목초등학교 개교년도랑 정보 다 줘",
    "established_year": "1931년 6월 5일",
    "num_classes": "6학급",
    "num_students": "",
    "website": "http://jangmok-e.gne.go.kr",
    "phone": "055-635-0012",
    "address": "경상남도 거제시 장목면 장목로 26 (장목리)",
    "answer": "장목초등학교는 1931년 6월 5일에 설립되었어요(교육부 NEIS 학교기본정보 기준). 2026학년도 학급 수는 6학급이에요(2026-08-01 공시 기준). 학생 수는 공식으로 확인된 자료가 없어서 안내하지 않을게요.",
    "num_classes_as_of": "2026학년도(2026-08-01 공시)",
    "source": "교육부 NEIS 학교기본정보·학급편성(경상남도교육청)",
    "source_date": "2026-08-01"
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
    "answer": "해양문화관과 돌고래 수족관이 있는 일운면 지세포항의 지세포초등학교는 1940년에 개교했어. 현재 14학급, 260명의 멋진 대원들이 바다를 품으며 생활하고 있지! 도로명 주소는 지세포로 99이고, 대표번호는 055-637-2003, 누리집 주소는 http://jisetpo-e.gne.go.kr 란다.",
    "source": "미확인"
  },
  {
    "id": 21,
    "school_name": "아주초등학교",
    "category": "아주동",
    "question": "아주초등학교 위치랑 개교일 가르쳐줘",
    "established_year": "1954년 4월 9일",
    "num_classes": "19학급",
    "num_students": "",
    "website": "http://aju-e.gne.go.kr",
    "phone": "055-681-2015",
    "address": "경상남도 거제시 아주로 3길 13 (아주동)",
    "answer": "아주초등학교는 1954년 4월 9일에 설립되었어요(교육부 NEIS 학교기본정보 기준). 2026학년도 학급 수는 19학급이에요(2026-08-01 공시 기준). 학생 수는 공식으로 확인된 자료가 없어서 안내하지 않을게요.",
    "num_classes_as_of": "2026학년도(2026-08-01 공시)",
    "source": "교육부 NEIS 학교기본정보·학급편성(경상남도교육청)",
    "source_date": "2026-08-01"
  },
  {
    "id": 22,
    "school_name": "국산초등학교",
    "category": "옥포동",
    "question": "옥포동 국산초등학교 이름 뜻이랑 정보 줘",
    "established_year": "1977년 8월 28일",
    "num_classes": "33학급",
    "num_students": "",
    "website": "http://guksan-e.gne.go.kr",
    "phone": "055-687-5701",
    "address": "경상남도 거제시 옥포성안로 60 (옥포동)",
    "answer": "국산초등학교는 1977년 8월 28일에 설립되었어요(교육부 NEIS 학교기본정보 기준). 2026학년도 학급 수는 33학급이에요(2026-08-01 공시 기준). 학생 수는 공식으로 확인된 자료가 없어서 안내하지 않을게요.",
    "num_classes_as_of": "2026학년도(2026-08-01 공시)",
    "source": "교육부 NEIS 학교기본정보·학급편성(경상남도교육청)",
    "source_date": "2026-08-01"
  },
  {
    "id": 23,
    "school_name": "장승포초등학교",
    "category": "장승포동",
    "question": "장승포초등학교 전교생이랑 역사 알려줘",
    "established_year": "1921년 4월 1일",
    "num_classes": "13학급",
    "num_students": "",
    "website": "http://jangseungpo-e.gne.go.kr",
    "phone": "055-681-2503",
    "address": "경상남도 거제시 장승포로 66 (장승포동)",
    "answer": "장승포초등학교는 1921년 4월 1일에 설립되었어요(교육부 NEIS 학교기본정보 기준). 2026학년도 학급 수는 13학급이에요(2026-08-01 공시 기준). 학생 수는 공식으로 확인된 자료가 없어서 안내하지 않을게요.",
    "num_classes_as_of": "2026학년도(2026-08-01 공시)",
    "source": "교육부 NEIS 학교기본정보·학급편성(경상남도교육청)",
    "source_date": "2026-08-01"
  },
  {
    "id": 24,
    "school_name": "능포초등학교",
    "category": "능포동",
    "question": "능포초등학교 주소랑 학생 수 궁금해",
    "established_year": "1986년 3월 1일",
    "num_classes": "6학급",
    "num_students": "",
    "website": "http://neungpo-e.gne.go.kr",
    "phone": "055-681-8012",
    "address": "경상남도 거제시 능포로 8길 11 (능포동)",
    "answer": "능포초등학교는 1986년 3월 1일에 설립되었어요(교육부 NEIS 학교기본정보 기준). 2026학년도 학급 수는 6학급이에요(2026-08-01 공시 기준). 학생 수는 공식으로 확인된 자료가 없어서 안내하지 않을게요.",
    "num_classes_as_of": "2026학년도(2026-08-01 공시)",
    "source": "교육부 NEIS 학교기본정보·학급편성(경상남도교육청)",
    "source_date": "2026-08-01"
  }
];

// 학교명 또는 '<동/면> + 초등학교' 패턴으로 학교 정보 매칭
// 안전 규칙: 부분일치로 다른 학교가 답변되지 않도록 가장 긴 정식 학교명을 우선한다.
// 예) "거제고현초등학교" 질문에 "고현초등학교" 정보를 주지 않는다.
const normalize = (s: string) => s.replace(/\s+/g, "").trim();

// 지도 데이터(schools.ts)의 정식 학교명 — 챗봇 데이터에 없는 학교까지 포함한 전체 목록
const officialNames = schools.map((s) => normalize(s.name));

/**
 * 공식 정본(거제교육지원청 2026-03-01, 41개교)에 없는 챗봇 전용 학교명.
 * 이름이 비슷하다는 이유만으로 다른 학교와 병합하지 않는다(추정 금지).
 * → 현재 존재하는 학교처럼 안내하지 않도록 매칭·지식베이스에서 제외한다.
 */
export const UNVERIFIED_QA_SCHOOL_NAMES = ["고현초등학교", "상동초등학교", "지세포초등학교"];
const isVerified = (qa: SchoolQA) =>
  officialNames.includes(normalize(qa.school_name)) &&
  !UNVERIFIED_QA_SCHOOL_NAMES.includes(qa.school_name);

/** 공식 정본과 학교명이 일치하는 챗봇 데이터만 사용한다. */
export const verifiedSchoolQA = schoolQA.filter(isVerified);

export function findSchoolInfo(userInput: string): SchoolQA | undefined {
  if (!userInput) return undefined;
  // "계룡초" 같은 축약형을 정식 명칭으로 확장 (명확한 alias만)
  const input = normalize(userInput).replace(/초(?!등학교)/g, "초등학교");

  // 1) 입력에 포함된 정식 학교명 중 가장 긴 것을 찾는다.
  const longestOfficial = officialNames
    .filter((n) => input.includes(n))
    .sort((a, b) => b.length - a.length)[0];

  if (longestOfficial) {
    const exact = verifiedSchoolQA.find((s) => normalize(s.school_name) === longestOfficial);
    if (exact) return exact;
    // 지도에는 있으나 챗봇 데이터가 없는 학교 → 다른 학교로 오답하지 않도록 중단
    return undefined;
  }

  // 2) '<동/면> + 초등학교' 패턴 (정본 학교만)
  return verifiedSchoolQA.find(
    (s) => input.includes(normalize(s.category)) && input.includes("초등학교"),
  );
}

/**
 * 학교의 주소·전화·홈페이지 '정본'은 지도 데이터(schools.ts) 하나로만 관리한다.
 * 정본 출처: 경상남도거제교육지원청 「초등학교 학교현황」(2026-03-01).
 * schoolQA.ts의 주소/전화/홈페이지 값은 사용하지 않는다.
 */
export function getSchoolFacts(qa: SchoolQA): {
  address?: string;
  website?: string;
  teacherPhone?: string;
  adminPhone?: string;
  fax?: string;
} {
  const canonical = schools.find((s) => normalize(s.name) === normalize(qa.school_name));
  if (!canonical) return {};
  return {
    address: canonical.address,
    website: canonical.website,
    teacherPhone: canonical.teacherPhone ?? canonical.phone,
    adminPhone: canonical.adminPhone,
    fax: canonical.fax,
  };
}
