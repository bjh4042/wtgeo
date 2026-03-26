export interface School {
  name: string;
  address: string;
  lat: number;
  lng: number;
  phone?: string;
}

// 거제시 초등학교 목록 (Kakao Maps API 좌표 기반)
export const schools: School[] = [
  { name: "거제초등학교", address: "경상남도 거제시 거제면 동상리 415", lat: 34.8516, lng: 128.5916, phone: "055-633-4016" },
  { name: "거제중앙초등학교", address: "경상남도 거제시 중앙로 1", lat: 34.8956, lng: 128.6346, phone: "055-681-6900" },
  { name: "거제고현초등학교", address: "경상남도 거제시 고현로 47", lat: 34.8737, lng: 128.6288, phone: "055-639-0500" },
  { name: "거류초등학교", address: "경상남도 거제시 거제면 거제북로 60", lat: 34.9938, lng: 128.4045, phone: "055-633-3004" },
  { name: "거제상동초등학교", address: "경상남도 거제시 상동5길 75-41", lat: 34.8620, lng: 128.6345, phone: "055-730-9441" },
  { name: "고현초등학교", address: "경상남도 거제시 고현로11길 27", lat: 34.8737, lng: 128.6288, phone: "055-639-1300" },
  { name: "능포초등학교", address: "경상남도 거제시 능포로 86", lat: 34.8810, lng: 128.7371, phone: "055-682-5893" },
  { name: "동부초등학교", address: "경상남도 거제시 동부면 동부로 48", lat: 34.8211, lng: 128.6100, phone: "055-632-7804" },
  { name: "둔덕초등학교", address: "경상남도 거제시 둔덕면 둔덕로 95", lat: 34.8450, lng: 128.6150, phone: "055-632-5009" },
  { name: "명사초등학교", address: "경상남도 거제시 남부면 명사길 20", lat: 34.7257, lng: 128.6037, phone: "055-632-6801" },
  { name: "사등초등학교", address: "경상남도 거제시 사등면 사등로 125", lat: 34.9130, lng: 128.5158, phone: "055-633-0374" },
  { name: "수양초등학교", address: "경상남도 거제시 수양로 60", lat: 34.8870, lng: 128.6419, phone: "055-639-2500" },
  { name: "아주초등학교", address: "경상남도 거제시 아주동", lat: 34.8642, lng: 128.6929, phone: "055-681-3785" },
  { name: "양지초등학교", address: "경상남도 거제시 장평1로 51", lat: 34.8913, lng: 128.6022, phone: "055-680-9600" },
  { name: "연초초등학교", address: "경상남도 거제시 연초면 연초로 182", lat: 34.9123, lng: 128.6520, phone: "055-636-0020" },
  { name: "옥포초등학교", address: "경상남도 거제시 옥포로 90", lat: 34.8924, lng: 128.6901, phone: "055-687-2505" },
  { name: "외포초등학교", address: "경상남도 거제시 사등면 외포길 30", lat: 34.9430, lng: 128.7180, phone: "055-633-5804" },
  { name: "일운초등학교", address: "경상남도 거제시 일운면 일운로 55", lat: 34.8286, lng: 128.7057, phone: "055-632-7703" },
  { name: "장승포초등학교", address: "경상남도 거제시 장승포로 120", lat: 34.8699, lng: 128.7289, phone: "055-682-0700" },
  { name: "장평초등학교", address: "경상남도 거제시 장평로 85", lat: 34.8938, lng: 128.6071, phone: "055-639-3400" },
  { name: "지세포초등학교", address: "경상남도 거제시 일운면 지세포로 35", lat: 34.8286, lng: 128.7057, phone: "055-681-5234" },
  { name: "하청초등학교", address: "경상남도 거제시 하청면 하청로 170", lat: 34.9564, lng: 128.6553, phone: "055-636-0803" },
  { name: "옥산초등학교", address: "경상남도 거제시 옥포대첩로 90", lat: 34.8980, lng: 128.6950, phone: "055-687-5805" },
  { name: "삼성초등학교", address: "경상남도 거제시 고현동", lat: 34.8830, lng: 128.6220, phone: "055-639-1500" },
  { name: "계룡초등학교", address: "경상남도 거제시 계룡로 25", lat: 34.8813, lng: 128.6251, phone: "055-639-2100" },
  { name: "내곡초등학교", address: "경상남도 거제시 장목면 내곡길 15", lat: 34.8710, lng: 128.6785, phone: "055-636-4005" },
  { name: "장목초등학교", address: "경상남도 거제시 장목면 장목로 80", lat: 34.9927, lng: 128.6822, phone: "055-636-3003" },
  { name: "칠천초등학교", address: "경상남도 거제시 하청면 칠천로 50", lat: 34.9841, lng: 128.6252, phone: "055-636-1004" },
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