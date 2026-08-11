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
  { name: "거제고현초등학교", address: "경상남도 거제시 계룡로 25", lat: 34.8733, lng: 128.6289, district: "고현동", website: "https://gjgohyeon-p.gne.go.kr", phone: "055-638-4631", teacherPhone: "055-638-4631", adminPhone: "055-638-4632", fax: "055-638-5859" },
  { name: "거제양정초등학교", address: "경상남도 거제시 양정2길 15", lat: 34.8712, lng: 128.6511, district: "양정동", website: "https://gjyangjeong-p.gne.go.kr", phone: "055-638-0054", teacherPhone: "055-638-0054", adminPhone: "055-638-0056", fax: "055-638-0017" },
  { name: "거제중앙초등학교", address: "경상남도 거제시 중곡로2길 45", lat: 34.8615, lng: 128.6340, district: "상동", website: "https://gjja-p.gne.go.kr", phone: "055-638-1406", teacherPhone: "055-638-1406", adminPhone: "055-638-1407", fax: "055-638-1408" },
  { name: "거제초등학교", address: "경상남도 거제시 거제면 읍내로2길 20", lat: 34.8514, lng: 128.5919, district: "거제면", website: "https://geoje-p.gne.go.kr", phone: "055-633-4016", teacherPhone: "055-633-4016", adminPhone: "055-632-7106", fax: "055-633-7295" },
  { name: "거제용산초등학교", address: "경상남도 거제시 상동7길 58", lat: 34.8575, lng: 128.6355, district: "상동동", website: "https://gjyongsan-p.gne.go.kr", phone: "055-951-2300", teacherPhone: "055-951-2300", adminPhone: "055-951-2372", fax: "055-633-8390" },
  { name: "거제용소초등학교", address: "경상남도 거제시 아주동 산40-1", lat: 34.8655, lng: 128.6910, district: "아주동", website: "https://gjyongso-p.gne.go.kr", phone: "055-638-4878", teacherPhone: "055-638-4878", adminPhone: "055-638-4879", fax: "055-638-4887" },
  { name: "거제상동초등학교", address: "경상남도 거제시 상동5길 75-41", lat: 34.8590, lng: 128.6360, district: "상동동", website: "https://gjsangdong-p.gne.go.kr", phone: "055-730-9441", teacherPhone: "055-730-9441", adminPhone: "055-730-9442", fax: "055-638-5471" },
  { name: "국산초등학교", address: "경상남도 거제시 국산1길 2", lat: 34.8968, lng: 128.6934, district: "옥포동", website: "https://guksan-p.gne.go.kr", phone: "055-687-2830", teacherPhone: "055-687-2830", adminPhone: "055-687-2134", fax: "055-687-1028" },
  { name: "기성초등학교", address: "경상남도 거제시 사등면 언양로 541", lat: 34.9011, lng: 128.5515, district: "사등면", website: "https://giseong-p.gne.go.kr", phone: "055-636-5202", teacherPhone: "055-636-5202", adminPhone: "055-636-6553", fax: "055-636-6874" },
  { name: "계룡초등학교", address: "경상남도 거제시 거제중앙로 1821-7", lat: 34.8806, lng: 128.6254, district: "고현동", website: "https://gyearyong-p.gne.go.kr", phone: "055-637-5001~5", teacherPhone: "055-637-5001~5", adminPhone: "055-637-5008", fax: "055-637-5007" },
  { name: "내곡초등학교", address: "경상남도 거제시 아주2로 112", lat: 34.8707, lng: 128.6788, district: "아주동", website: "https://naegok-p.gne.go.kr", phone: "055-730-9661", teacherPhone: "055-730-9661", adminPhone: "055-730-9662", fax: "055-682-3309" },
  { name: "능포초등학교", address: "경상남도 거제시 능포로 208", lat: 34.8810, lng: 128.7368, district: "능포동", website: "https://neungpo-p.gne.go.kr", phone: "055-681-9003", teacherPhone: "055-681-9003", adminPhone: "055-681-9002", fax: "055-681-9503" },
  { name: "대우초등학교", address: "경상남도 거제시 아주로3길 63", lat: 34.8610, lng: 128.6848, district: "아주동", website: "https://daeu-p.gne.go.kr", phone: "055-681-5202", teacherPhone: "055-681-5202", adminPhone: "055-681-2281", fax: "055-682-3313" },
  { name: "동부초등학교", address: "경상남도 거제시 동부면 동부로 27", lat: 34.8207, lng: 128.6100, district: "동부면", website: "https://gjdongbu-p.gne.go.kr", phone: "055-633-2025", teacherPhone: "055-633-2025", adminPhone: "055-633-5644", fax: "055-633-2023" },
  { name: "동부초등학교 율포분교장", address: "경상남도 거제시 동부면 율포4길 1", lat: 34.7788, lng: 128.5941, district: "동부면", phone: "055-635-6478", teacherPhone: "055-635-6478", adminPhone: "055-635-8549" },
  { name: "마전초등학교", address: "경상남도 거제시 마전2길 3-4", lat: 34.8599, lng: 128.7207, district: "장승포동", website: "https://gjmajeon-p.gne.go.kr", phone: "055-681-7755", teacherPhone: "055-681-7755", adminPhone: "055-681-7769", fax: "055-681-7754" },
  { name: "명사초등학교", address: "경상남도 거제시 남부면 명사해수욕장길 11", lat: 34.7255, lng: 128.6037, district: "남부면", website: "https://myongsa-p.gne.go.kr", phone: "055-951-2000", teacherPhone: "055-951-2000", adminPhone: "055-951-2010", fax: "055-951-2020" },
  { name: "사등초등학교", address: "경상남도 거제시 사등면 성포로 21", lat: 34.9130, lng: 128.5161, district: "사등면", website: "https://sadeung-p.gne.go.kr", phone: "055-632-5048", teacherPhone: "055-632-5048", adminPhone: "055-633-4526", fax: "055-633-4527" },
  { name: "삼룡초등학교", address: "경상남도 거제시 거제중앙로 1548", lat: 34.8617, lng: 128.6443, district: "상동", website: "https://sns-p.gne.go.kr", phone: "055-633-8972", teacherPhone: "055-633-8972", adminPhone: "055-633-8973", fax: "055-633-8844" },
  { name: "송정초등학교", address: "경상남도 거제시 연초면 송정이목로 47", lat: 34.9180, lng: 128.6400, district: "연초면", website: "https://gjsongjeong-p.gne.go.kr", phone: "055-636-4411", teacherPhone: "055-636-4411", adminPhone: "055-636-4491", fax: "055-635-5492" },
  { name: "수월초등학교", address: "경상남도 거제시 수양로 420", lat: 34.8902, lng: 128.6438, district: "수양동", website: "https://suweol-p.gne.go.kr", phone: "055-636-8312", teacherPhone: "055-636-8312", adminPhone: "055-636-8313~4", fax: "055-636-8315" },
  { name: "숭덕초등학교", address: "경상남도 거제시 둔덕면 거제남서로 4720", lat: 34.8363, lng: 128.4960, district: "둔덕면", website: "https://sungduck-p.gne.go.kr", phone: "055-633-5052", teacherPhone: "055-633-5052", adminPhone: "055-633-5058", fax: "055-633-5045" },
  { name: "신현초등학교", address: "경상남도 거제시 서문로1길 7", lat: 34.8881, lng: 128.6169, district: "신현동", website: "https://sinhyeon-p.gne.go.kr", phone: "055-633-3014", teacherPhone: "055-633-3014", adminPhone: "055-633-3015", fax: "055-633-3017" },
  { name: "아주초등학교", address: "경상남도 거제시 탑곡로4길 24", lat: 34.8642, lng: 128.6931, district: "아주동", website: "https://aju-p.gne.go.kr", phone: "055-682-2801", teacherPhone: "055-682-2801", adminPhone: "055-682-2802", fax: "055-681-8355" },
  { name: "양지초등학교", address: "경상남도 거제시 장평1로 170", lat: 34.8912, lng: 128.6024, district: "장평동", website: "https://gjyangji-p.gne.go.kr", phone: "055-637-8622", teacherPhone: "055-637-8622", adminPhone: "055-633-6294~5", fax: "055-633-6296" },
  { name: "연초초등학교", address: "경상남도 거제시 연초면 거제대로 4280", lat: 34.9122, lng: 128.6520, district: "연초면", website: "https://yeoncho-p.gne.go.kr", phone: "055-636-3906", teacherPhone: "055-636-3906", adminPhone: "055-636-2509", fax: "055-636-2583" },
  { name: "오량초등학교", address: "경상남도 거제시 사등면 거제남서로 5405", lat: 34.8864, lng: 128.4826, district: "사등면", website: "https://oryang-p.gne.go.kr", phone: "055-635-8201", teacherPhone: "055-635-8201", adminPhone: "055-637-5280", fax: "055-635-9981" },
  { name: "오비초등학교", address: "경상남도 거제시 연초면 오비5길 21", lat: 34.9226, lng: 128.6221, district: "연초면", website: "https://ob-p.gne.go.kr", phone: "055-634-4249", teacherPhone: "055-634-4249", adminPhone: "055-632-4211", fax: "055-632-0799" },
  { name: "옥포초등학교", address: "경상남도 거제시 옥포로13길 12", lat: 34.8921, lng: 128.6903, district: "옥포동", website: "https://okpo-p.gne.go.kr", phone: "055-687-2380", teacherPhone: "055-687-2380", adminPhone: "055-687-6667", fax: "055-687-9556" },
  { name: "외간초등학교", address: "경상남도 거제시 거제면 외간옥산1길 10", lat: 34.8600, lng: 128.5760, district: "거제면", website: "https://oegan-p.gne.go.kr", phone: "055-633-3267", teacherPhone: "055-633-3267", adminPhone: "055-633-3135", fax: "055-633-0681" },
  { name: "외포초등학교", address: "경상남도 거제시 장목면 외포5길 17", lat: 34.9427, lng: 128.7177, district: "장목면", website: "https://wepo-p.gne.go.kr", phone: "055-636-6014", teacherPhone: "055-636-6014", adminPhone: "055-636-1969", fax: "055-636-1557" },
  { name: "일운초등학교", address: "경상남도 거제시 일운면 지세포로 74", lat: 34.8282, lng: 128.7062, district: "일운면", website: "https://ilwoon-p.gne.go.kr", phone: "055-681-0706", teacherPhone: "055-681-0706", adminPhone: "055-682-0769", fax: "055-681-5536" },
  { name: "장목초등학교", address: "경상남도 거제시 장목면 거제북로 1220", lat: 34.9923, lng: 128.6823, district: "장목면", website: "https://jangmok-p.gne.go.kr", phone: "055-636-9760", teacherPhone: "055-636-9760", adminPhone: "055-636-9762", fax: "055-636-9765" },
  { name: "장승포초등학교", address: "경상남도 거제시 신부로1길 19", lat: 34.8696, lng: 128.7292, district: "장승포동", website: "https://jsp-p.gne.go.kr", phone: "055-681-8111", teacherPhone: "055-681-8111", adminPhone: "055-681-8102", fax: "055-682-3643" },
  { name: "장평초등학교", address: "경상남도 거제시 장평1로 116", lat: 34.8937, lng: 128.6074, district: "장평동", website: "https://jangpyung-p.gne.go.kr", phone: "055-635-7652~3", teacherPhone: "055-635-7652~3", adminPhone: "055-635-7651", fax: "055-637-4056" },
  { name: "제산초등학교", address: "경상남도 거제시 제산로 70", lat: 34.8872, lng: 128.6420, district: "수양동", website: "https://jesan-p.gne.go.kr", phone: "055-634-1061", teacherPhone: "055-634-1061", adminPhone: "055-634-1062", fax: "055-634-1064" },
  { name: "중곡초등학교", address: "경상남도 거제시 중곡로 27", lat: 34.8949, lng: 128.6296, district: "중곡동", website: "https://junggok-p.gne.go.kr", phone: "055-632-8792~3", teacherPhone: "055-632-8792~3", adminPhone: "055-632-8791", fax: "055-632-8795" },
  { name: "진목초등학교", address: "경상남도 거제시 진목1길 101", lat: 34.9014, lng: 128.6843, district: "옥포동", website: "https://jinmok-p.gne.go.kr", phone: "055-688-6243", teacherPhone: "055-688-6243", adminPhone: "055-688-6244", fax: "055-688-6245" },
  { name: "창호초등학교", address: "경상남도 거제시 사등면 가조로 1281-16", lat: 34.9556, lng: 128.5207, district: "사등면", website: "https://changho-p.gne.go.kr", phone: "055-633-9608", teacherPhone: "055-633-9608", adminPhone: "055-633-9606", fax: "055-633-9677" },
  { name: "칠천초등학교", address: "경상남도 거제시 하청면 칠천로 372", lat: 34.9840, lng: 128.6250, district: "하청면", website: "https://chilcheon-p.gne.go.kr", phone: "055-951-2400~1", teacherPhone: "055-951-2400~1", adminPhone: "055-951-2410~1", fax: "055-951-2490" },
  { name: "하청초등학교", address: "경상남도 거제시 하청면 하청로 22", lat: 34.9559, lng: 128.6553, district: "하청면", website: "https://hc-p.gne.go.kr", phone: "055-635-9008", teacherPhone: "055-635-9008", adminPhone: "055-636-7095", fax: "055-636-7091" },
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
