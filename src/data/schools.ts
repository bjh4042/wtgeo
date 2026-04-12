export interface School {
  name: string;
  address: string;
  lat: number;
  lng: number;
  phone?: string;
  district: string;
  website?: string;
}

// 거제시 초등학교 목록 (41개교, 분교 포함) - 2026년 4월 기준
export const schools: School[] = [
  { name: "거제고현초등학교", address: "경상남도 거제시 거제중앙로 1891-1", lat: 34.8733, lng: 128.6289, district: "고현동", website: "http://gjgh.gne.go.kr" },
  { name: "거제양정초등학교", address: "경상남도 거제시 양정1길 45", lat: 34.8712, lng: 128.6511, district: "양정동", website: "http://gjyj.gne.go.kr" },
  { name: "거제중앙초등학교", address: "경상남도 거제시 상동5길 21", lat: 34.8615, lng: 128.6340, district: "상동", website: "http://gjja.gne.go.kr" },
  { name: "거제초등학교", address: "경상남도 거제시 거제면 기성로 34", lat: 34.8514, lng: 128.5919, district: "거제면", website: "http://geoje.gne.go.kr" },
  { name: "거제용산초등학교", address: "경상남도 거제시 상동7길 58", lat: 34.8575, lng: 128.6355, district: "상동동", website: "https://gjyongsan-p.gne.go.kr" },
  { name: "거제용소초등학교", address: "경상남도 거제시 아주로 90", lat: 34.8655, lng: 128.6910, district: "아주동", website: "http://gjys.gne.go.kr" },
  { name: "거제상동초등학교", address: "경상남도 거제시 상동5길 75-41", lat: 34.8590, lng: 128.6360, district: "상동동", website: "http://gjsangdong-p.gne.go.kr" },
  { name: "국산초등학교", address: "경상남도 거제시 옥포대첩로 100", lat: 34.8968, lng: 128.6934, district: "옥포동", website: "http://guksan.gne.go.kr" },
  { name: "기성초등학교", address: "경상남도 거제시 사등면 거제남서로 5345", lat: 34.9011, lng: 128.5515, district: "사등면", website: "http://giseong.gne.go.kr" },
  { name: "계룡초등학교", address: "경상남도 거제시 고현천로 84", lat: 34.8806, lng: 128.6254, district: "고현동", website: "http://gyeryong.gne.go.kr" },
  { name: "내곡초등학교", address: "경상남도 거제시 아주1로 100", lat: 34.8707, lng: 128.6788, district: "아주동", website: "http://naegok.gne.go.kr" },
  { name: "능포초등학교", address: "경상남도 거제시 능포로 149", lat: 34.8810, lng: 128.7368, district: "능포동", website: "http://neungpo.gne.go.kr" },
  { name: "대우초등학교", address: "경상남도 거제시 옥포대로3길 63", lat: 34.8610, lng: 128.6848, district: "아주동", website: "http://daewoo.gne.go.kr" },
  { name: "동부초등학교", address: "경상남도 거제시 동부면 동부로 19", lat: 34.8207, lng: 128.6100, district: "동부면", website: "http://gjdb.gne.go.kr" },
  { name: "동부초등학교 율포분교장", address: "경상남도 거제시 동부면 율포로 333", lat: 34.7788, lng: 128.5941, district: "동부면" },
  { name: "마전초등학교", address: "경상남도 거제시 장승포로 152", lat: 34.8599, lng: 128.7207, district: "장승포동", website: "http://majeon.gne.go.kr" },
  { name: "명사초등학교", address: "경상남도 거제시 남부면 명사해수욕장길 25", lat: 34.7255, lng: 128.6037, district: "남부면", website: "http://myeongsa.gne.go.kr" },
  { name: "사등초등학교", address: "경상남도 거제시 사등면 성포로3길 16", lat: 34.9130, lng: 128.5161, district: "사등면", website: "http://sadeung.gne.go.kr" },
  { name: "삼룡초등학교", address: "경상남도 거제시 상동3길 20", lat: 34.8617, lng: 128.6443, district: "상동", website: "http://samryong.gne.go.kr" },
  { name: "송정초등학교", address: "경상남도 거제시 연초면 송정이목로 47", lat: 34.9180, lng: 128.6400, district: "연초면", website: "http://gjsongjeong-p.gne.go.kr" },
  { name: "수월초등학교", address: "경상남도 거제시 수양로 456", lat: 34.8902, lng: 128.6438, district: "수양동", website: "http://suwol.gne.go.kr" },
  { name: "숭덕초등학교", address: "경상남도 거제시 둔덕면 거림길 62", lat: 34.8363, lng: 128.4960, district: "둔덕면", website: "http://sungdeok.gne.go.kr" },
  { name: "신현초등학교", address: "경상남도 거제시 거제중앙로13길 18", lat: 34.8881, lng: 128.6169, district: "신현동", website: "http://gjsh.gne.go.kr" },
  { name: "아주초등학교", address: "경상남도 거제시 아주로 16", lat: 34.8642, lng: 128.6931, district: "아주동", website: "http://aju.gne.go.kr" },
  { name: "양지초등학교", address: "경상남도 거제시 장평3로 28", lat: 34.8912, lng: 128.6024, district: "장평동", website: "http://yangji.gne.go.kr" },
  { name: "연초초등학교", address: "경상남도 거제시 연초면 거제북로 38", lat: 34.9122, lng: 128.6520, district: "연초면", website: "http://yeoncho.gne.go.kr" },
  { name: "오량초등학교", address: "경상남도 거제시 사등면 거제남서로 5493", lat: 34.8864, lng: 128.4826, district: "사등면", website: "http://oryang.gne.go.kr" },
  { name: "오비초등학교", address: "경상남도 거제시 연초면 오비1길 22", lat: 34.9226, lng: 128.6221, district: "연초면", website: "http://obi.gne.go.kr" },
  { name: "옥포초등학교", address: "경상남도 거제시 옥포로 179", lat: 34.8921, lng: 128.6903, district: "옥포동", website: "http://okpo.gne.go.kr" },
  { name: "외간초등학교", address: "경상남도 거제시 거제면 거제남서로 3156-2", lat: 34.8600, lng: 128.5760, district: "거제면", website: "http://oegan.gne.go.kr" },
  { name: "외포초등학교", address: "경상남도 거제시 장목면 외포5길 21", lat: 34.9427, lng: 128.7177, district: "장목면", website: "http://oepo.gne.go.kr" },
  { name: "일운초등학교", address: "경상남도 거제시 일운면 지세포로 115", lat: 34.8282, lng: 128.7062, district: "일운면", website: "http://ilun.gne.go.kr" },
  { name: "장목초등학교", address: "경상남도 거제시 장목면 거제북로 1177", lat: 34.9923, lng: 128.6823, district: "장목면", website: "http://jangmok.gne.go.kr" },
  { name: "장승포초등학교", address: "경상남도 거제시 장승로 74", lat: 34.8696, lng: 128.7292, district: "장승포동", website: "http://jangsp.gne.go.kr" },
  { name: "장평초등학교", address: "경상남도 거제시 장평로 11", lat: 34.8937, lng: 128.6074, district: "장평동", website: "http://jp.gne.go.kr" },
  { name: "제산초등학교", address: "경상남도 거제시 수양로 420-13", lat: 34.8872, lng: 128.6420, district: "수양동", website: "http://jesan.gne.go.kr" },
  { name: "중곡초등학교", address: "경상남도 거제시 중곡1로 42", lat: 34.8949, lng: 128.6296, district: "중곡동", website: "http://junggok.gne.go.kr" },
  { name: "진목초등학교", address: "경상남도 거제시 옥포대첩로5길 32", lat: 34.9014, lng: 128.6843, district: "옥포동", website: "http://jinmok.gne.go.kr" },
  { name: "창호초등학교", address: "경상남도 거제시 사등면 가조로 1195", lat: 34.9556, lng: 128.5207, district: "사등면", website: "http://changho.gne.go.kr" },
  { name: "칠천초등학교", address: "경상남도 거제시 하청면 칠천로 133", lat: 34.9840, lng: 128.6250, district: "하청면", website: "http://chilcheon.gne.go.kr" },
  { name: "하청초등학교", address: "경상남도 거제시 하청면 하청로 23", lat: 34.9559, lng: 128.6553, district: "하청면", website: "http://hacheong.gne.go.kr" },
];

// 초성 추출 함수
const CONSONANTS = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];

export function getInitialConsonant(char: string): string {
  const code = char.charCodeAt(0) - 0xAC00;
  if (code < 0 || code > 11171) return char;
  return CONSONANTS[Math.floor(code / 588)];
}

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
