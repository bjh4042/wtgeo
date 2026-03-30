export interface School {
  name: string;
  address: string;
  lat: number;
  lng: number;
  phone?: string;
  district: string; // 동 또는 면
}

// 거제시 초등학교 목록 (31개교)
export const schools: School[] = [
  { name: "거제고현초등학교", address: "경상남도 거제시 거제중앙로 1891-1", lat: 34.8800, lng: 128.6240, district: "고현동" },
  { name: "거제양정초등학교", address: "경상남도 거제시 양정1길 45", lat: 34.8700, lng: 128.6180, district: "양정동" },
  { name: "거제중앙초등학교", address: "경상남도 거제시 상동5길 21", lat: 34.8620, lng: 128.6340, district: "상동" },
  { name: "거제초등학교", address: "경상남도 거제시 거제면 기성로 34", lat: 34.8520, lng: 128.5910, district: "거제면" },
  { name: "국산초등학교", address: "경상남도 거제시 옥포대첩로 100", lat: 34.8980, lng: 128.6950, district: "옥포동" },
  { name: "기성초등학교", address: "경상남도 거제시 사등면 거제남서로 5345", lat: 34.9180, lng: 128.5300, district: "사등면" },
  { name: "내곡초등학교", address: "경상남도 거제시 아주1로 100", lat: 34.8640, lng: 128.6930, district: "아주동" },
  { name: "동부초등학교", address: "경상남도 거제시 동부면 동부로 19", lat: 34.7900, lng: 128.6150, district: "동부면" },
  { name: "마전초등학교", address: "경상남도 거제시 장승포로 152", lat: 34.8700, lng: 128.7290, district: "장승포동" },
  { name: "명사초등학교", address: "경상남도 거제시 남부면 명사해수욕장길 25", lat: 34.7260, lng: 128.6040, district: "남부면" },
  { name: "사등초등학교", address: "경상남도 거제시 사등면 성포로3길 16", lat: 34.9250, lng: 128.5450, district: "사등면" },
  { name: "상동초등학교", address: "경상남도 거제시 상동7길 36", lat: 34.8600, lng: 128.6360, district: "상동" },
  { name: "수월초등학교", address: "경상남도 거제시 수양로 456", lat: 34.8820, lng: 128.6450, district: "수양동" },
  { name: "신현초등학교", address: "경상남도 거제시 거제중앙로13길 18", lat: 34.8780, lng: 128.6200, district: "신현동" },
  { name: "아주초등학교", address: "경상남도 거제시 아주로 16", lat: 34.8660, lng: 128.6900, district: "아주동" },
  { name: "양지초등학교", address: "경상남도 거제시 장평3로 28", lat: 34.8930, lng: 128.6070, district: "장평동" },
  { name: "연초초등학교", address: "경상남도 거제시 연초면 거제북로 38", lat: 34.9120, lng: 128.6520, district: "연초면" },
  { name: "오량초등학교", address: "경상남도 거제시 사등면 거제남서로 5493", lat: 34.9220, lng: 128.5350, district: "사등면" },
  { name: "오비초등학교", address: "경상남도 거제시 연초면 오비1길 22", lat: 34.9200, lng: 128.6600, district: "연초면" },
  { name: "옥포초등학교", address: "경상남도 거제시 옥포로 179", lat: 34.8920, lng: 128.6900, district: "옥포동" },
  { name: "외포초등학교", address: "경상남도 거제시 장목면 외포5길 21", lat: 34.9850, lng: 128.7150, district: "장목면" },
  { name: "일운초등학교", address: "경상남도 거제시 일운면 지세포로 115", lat: 34.8290, lng: 128.7060, district: "일운면" },
  { name: "장목초등학교", address: "경상남도 거제시 장목면 거제북로 1177", lat: 34.9930, lng: 128.6820, district: "장목면" },
  { name: "장승포초등학교", address: "경상남도 거제시 장승로 74", lat: 34.8680, lng: 128.7270, district: "장승포동" },
  { name: "장평초등학교", address: "경상남도 거제시 장평로 11", lat: 34.8910, lng: 128.6050, district: "장평동" },
  { name: "제산초등학교", address: "경상남도 거제시 수양로 420-13", lat: 34.8840, lng: 128.6400, district: "수양동" },
  { name: "중곡초등학교", address: "경상남도 거제시 중곡1로 42", lat: 34.8910, lng: 128.6360, district: "중곡동" },
  { name: "진목초등학교", address: "경상남도 거제시 옥포대첩로5길 32", lat: 34.8960, lng: 128.6880, district: "옥포동" },
  { name: "창호초등학교", address: "경상남도 거제시 사등면 가조로 1195", lat: 34.9400, lng: 128.4700, district: "사등면" },
  { name: "칠천초등학교", address: "경상남도 거제시 하청면 칠천로 133", lat: 34.9840, lng: 128.6250, district: "하청면" },
  { name: "하청초등학교", address: "경상남도 거제시 하청면 하청로 23", lat: 34.9570, lng: 128.6550, district: "하청면" },
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
