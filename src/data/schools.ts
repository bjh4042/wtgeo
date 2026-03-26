export interface School {
  name: string;
  address: string;
  lat: number;
  lng: number;
  phone?: string;
}

// 거제시 초등학교 목록 (공공데이터 기반)
export const schools: School[] = [
  { name: "거제초등학교", address: "경상남도 거제시 거제면 거제남서로 20", lat: 34.8567, lng: 128.5733, phone: "055-633-4016" },
  { name: "거제중앙초등학교", address: "경상남도 거제시 중앙로 1", lat: 34.8808, lng: 128.6211, phone: "055-681-6900" },
  { name: "거제고현초등학교", address: "경상남도 거제시 고현로 47", lat: 34.8847, lng: 128.6265, phone: "055-639-0500" },
  { name: "거류초등학교", address: "경상남도 거제시 거제면 거제북로 60", lat: 34.8720, lng: 128.5810, phone: "055-633-3004" },
  { name: "거제상동초등학교", address: "경상남도 거제시 상동5길 75-41", lat: 34.8950, lng: 128.5980, phone: "055-730-9441" },
  { name: "고현초등학교", address: "경상남도 거제시 고현로11길 27", lat: 34.8870, lng: 128.6300, phone: "055-639-1300" },
  { name: "능포초등학교", address: "경상남도 거제시 능포로 86", lat: 34.8760, lng: 128.6860, phone: "055-682-5893" },
  { name: "동부초등학교", address: "경상남도 거제시 동부면 동부로 48", lat: 34.8230, lng: 128.6630, phone: "055-632-7804" },
  { name: "둔덕초등학교", address: "경상남도 거제시 둔덕면 둔덕로 95", lat: 34.8410, lng: 128.6200, phone: "055-632-5009" },
  { name: "명사초등학교", address: "경상남도 거제시 남부면 명사길 20", lat: 34.7620, lng: 128.6550, phone: "055-632-6801" },
  { name: "사등초등학교", address: "경상남도 거제시 사등면 사등로 125", lat: 34.9120, lng: 128.5680, phone: "055-633-0374" },
  { name: "수양초등학교", address: "경상남도 거제시 수양로 60", lat: 34.8790, lng: 128.6180, phone: "055-639-2500" },
  { name: "아주초등학교", address: "경상남도 거제시 아주동 산1", lat: 34.8530, lng: 128.6470, phone: "055-681-3785" },
  { name: "양지초등학교", address: "경상남도 거제시 장평1로 51", lat: 34.8920, lng: 128.6040, phone: "055-680-9600" },
  { name: "연초초등학교", address: "경상남도 거제시 연초면 연초로 182", lat: 34.9250, lng: 128.5950, phone: "055-636-0020" },
  { name: "옥포초등학교", address: "경상남도 거제시 옥포로 90", lat: 34.8940, lng: 128.6890, phone: "055-687-2505" },
  { name: "외포초등학교", address: "경상남도 거제시 사등면 외포길 30", lat: 34.9280, lng: 128.5450, phone: "055-633-5804" },
  { name: "일운초등학교", address: "경상남도 거제시 일운면 일운로 55", lat: 34.8350, lng: 128.6850, phone: "055-632-7703" },
  { name: "장승포초등학교", address: "경상남도 거제시 장승포로 120", lat: 34.8530, lng: 128.7020, phone: "055-682-0700" },
  { name: "장평초등학교", address: "경상남도 거제시 장평로 85", lat: 34.8880, lng: 128.6100, phone: "055-639-3400" },
  { name: "지세포초등학교", address: "경상남도 거제시 일운면 지세포로 35", lat: 34.8450, lng: 128.7050, phone: "055-681-5234" },
  { name: "하청초등학교", address: "경상남도 거제시 하청면 하청로 170", lat: 34.9340, lng: 128.6120, phone: "055-636-0803" },
  { name: "옥산초등학교", address: "경상남도 거제시 옥포대첩로 90", lat: 34.8980, lng: 128.6950, phone: "055-687-5805" },
  { name: "삼성초등학교", address: "경상남도 거제시 고현동 삼성길 20", lat: 34.8830, lng: 128.6220, phone: "055-639-1500" },
  { name: "계룡초등학교", address: "경상남도 거제시 계룡로 25", lat: 34.8860, lng: 128.6150, phone: "055-639-2100" },
  { name: "내곡초등학교", address: "경상남도 거제시 장목면 내곡길 15", lat: 34.9500, lng: 128.6350, phone: "055-636-4005" },
  { name: "장목초등학교", address: "경상남도 거제시 장목면 장목로 80", lat: 34.9580, lng: 128.6580, phone: "055-636-3003" },
  { name: "칠천초등학교", address: "경상남도 거제시 하청면 칠천로 50", lat: 34.9600, lng: 128.5800, phone: "055-636-1004" },
];

// 초성 추출 함수
const CONSONANTS = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];

export function getInitialConsonant(char: string): string {
  const code = char.charCodeAt(0) - 0xAC00;
  if (code < 0 || code > 11171) return char;
  return CONSONANTS[Math.floor(code / 588)];
}

// 사용되는 초성 목록
export function getAvailableConsonants(): string[] {
  const consonantSet = new Set<string>();
  schools.forEach(school => {
    const initial = getInitialConsonant(school.name[0]);
    consonantSet.add(initial);
  });
  return ['ㄱ','ㄴ','ㄷ','ㄹ','ㅁ','ㅂ','ㅅ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'].filter(c => consonantSet.has(c));
}

export function filterSchoolsByConsonant(consonant: string): School[] {
  return schools.filter(school => getInitialConsonant(school.name[0]) === consonant);
}
