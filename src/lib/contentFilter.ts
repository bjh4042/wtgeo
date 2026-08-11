/**
 * 공통 콘텐츠 필터 (학생 입력 보호용)
 * - 챗봇 입력, 장소 추가 신청 등 모든 학생 입력에서 재사용합니다.
 * - 금칙어 원문은 절대 사용자에게 다시 보여주지 않습니다.
 * - 정상적인 지명/학교명/문화재명을 막지 않도록 보수적으로 판정합니다.
 */
import { forbiddenWords } from "@/data/forbiddenWords";

/** 오탐이 잦아 '단어 단위'로만 검사할 표현 (정상 지명·일반 단어에 자주 포함됨) */
const AMBIGUOUS = new Set([
  "쌍", "상놈", "찐", "찐따", "아파", "담배", "담배빵", "만남", "조건", "조건만남",
  "구라", "호구", "혐오", "극혐", "개극혐", "애미", "애비", "유방", "팬티", "빤스",
  "자살", "살해", "죽인다", "테러", "폭탄", "칼부림", "낙태", "성추행", "성폭행",
  "강간", "정공", "아싸", "에바", "덕후", "셔틀", "빵셔틀", "대가리", "주둥이",
  "뒷담", "뒷담화", "걸레", "똥개", "안습", "꼰대", "모텔", "로리", "한남", "페미",
  "유충", "후장", "야스", "찌찌", "보지", "자지", "꼬추", "잠지", "씹", "조까",
  "자위", "정따", "전따", "은따", "강따", "고따", "뒷따", "찐", "쪼다", "등신",
  "아파트", "만남의광장", "죽어라", "가슴 만지기", "엉덩이 만지기", "바지 벗어",
  "소리하네", "야한거", "야한글", "여대생", "오빠랑", "삥뜯기", "귓방망이", "아구창",
]);

/** 짧지만 명백한 욕설 (부분 일치 허용) */
const STRONG_SHORT = [
  "씨발", "시발", "씨빨", "새끼", "병신", "븅신", "빙신", "지랄", "염병", "존나",
  "좆나", "좆까", "썅", "섹스", "야동", "앰창", "엠창", "느금", "짱깨", "쪽바리",
  "깜둥이", "뒈져", "개소리", "지랄하네",
];

/** 정상 표현이지만 금칙어를 부분 문자열로 포함하는 경우 → 검사 전에 제거 */
const SAFE_PHRASES = [
  "시발점", "시발역", "시발택시", "아파트", "만남의광장", "만남의장소", "쌍계사",
  "쌍둥이", "쌍정", "쌍용", "쌍촌", "조건부", "호구조사", "유방암", "정공법",
  "담배잎", "상놈이름",
];

/** 초성 욕설 (자모만 연속으로 등장할 때만 판정) */
const JAMO_PATTERNS = ["ㅅㅂ", "ㅆㅂ", "ㅄ", "ㅂㅅ", "ㅈㄹ", "ㄲㅈ", "ㄷㅊ", "ㅁㅊ", "ㅗ"];

/** 영문/로마자 우회 */
const LATIN_PATTERNS = [
  "tlqkf", "Tlqkf", "wlfkf", "qudtls", "rotorl", "shibal", "sibal", "ssibal",
  "fuck", "fuk", "fxxk", "shit", "bitch", "asshole", "dick", "porn", "sex",
];

const LETTERS_ONLY = /[^ㄱ-ㆎ가-힣a-zA-Z0-9]/g;
const JAMO_ONLY = /[^ㄱ-ㆎ]/g;

/** 검사 전용 정규화 — 저장/표시에는 절대 사용하지 않습니다. */
export function normalizeForModeration(text: string): string {
  let s = (text || "").toLowerCase();
  s = s.replace(LETTERS_ONLY, ""); // 공백·특수문자 우회 차단
  s = s.replace(/(.)\1{2,}/g, "$1$1"); // 반복문자 정리
  for (const safe of SAFE_PHRASES) {
    const key = safe.toLowerCase().replace(LETTERS_ONLY, "");
    if (key) s = s.split(key).join("");
  }
  return s;
}

/** 단어 경계 기반 토큰 목록 (짧고 모호한 표현용) */
function tokenize(text: string): string[] {
  return (text || "")
    .toLowerCase()
    .split(/[^ㄱ-ㆎ가-힣a-zA-Z0-9]+/)
    .filter(Boolean);
}

const strongWords: string[] = (() => {
  const set = new Set<string>(STRONG_SHORT.map((w) => w.replace(LETTERS_ONLY, "")));
  for (const raw of forbiddenWords) {
    const w = raw.toLowerCase().replace(LETTERS_ONLY, "");
    if (!w) continue;
    if (AMBIGUOUS.has(raw) || AMBIGUOUS.has(w)) continue;
    if (w.length >= 3) set.add(w);
  }
  return [...set].filter((w) => w.length >= 2);
})();

const tokenWords: string[] = (() => {
  const set = new Set<string>();
  for (const raw of forbiddenWords) {
    const w = raw.toLowerCase().replace(LETTERS_ONLY, "");
    if (!w || strongWords.includes(w)) continue;
    set.add(w);
  }
  return [...set];
})();

/** 금칙어 포함 여부 */
export function containsBlockedWord(text: string): boolean {
  if (!text) return false;
  const norm = normalizeForModeration(text);
  if (norm) {
    for (const w of strongWords) if (norm.includes(w)) return true;
    for (const w of LATIN_PATTERNS) if (norm.includes(w.toLowerCase())) return true;
  }

  // 초성 욕설: 자모만 연속으로 나열된 구간에서만 판정
  const jamoRuns = (text.match(/[ㄱ-ㆎ]{2,}/g) ?? []).map((r) => r.replace(JAMO_ONLY, ""));
  for (const run of jamoRuns) {
    for (const p of JAMO_PATTERNS) if (p.length >= 2 && run.includes(p)) return true;
  }

  // 짧고 모호한 표현: 단어 단위 완전 일치일 때만 차단
  const tokens = tokenize(text);
  for (const t of tokens) if (tokenWords.includes(t)) return true;

  return false;
}

export interface StudentTextRule {
  label: string;
  min?: number;
  max?: number;
  required?: boolean;
}

export interface ValidationResult {
  ok: boolean;
  value: string;
  message?: string;
}

/** 실행형 문자열(HTML/스크립트) 방어 */
const DANGEROUS = [/<\s*script/i, /javascript\s*:/i, /data\s*:\s*text\/html/i, /on\w+\s*=/i, /<\s*iframe/i];

export function containsExecutableString(text: string): boolean {
  return DANGEROUS.some((re) => re.test(text || ""));
}

export const BLOCKED_WORD_MESSAGE_FORM =
  "사용하기 어려운 표현이 포함되어 있어요. 다른 표현으로 바꿔 주세요.";
export const BLOCKED_WORD_MESSAGE_CHAT =
  "그 표현 대신 다른 말로 질문해 주세요. 🙂";

/** 학생 입력 공통 검증: trim → 필수/길이 → 실행형 문자열 → 금칙어 */
export function validateStudentText(text: string, rule: StudentTextRule): ValidationResult {
  const value = (text ?? "").trim();
  if (!value) {
    if (rule.required) return { ok: false, value, message: `${rule.label}을(를) 입력해 주세요.` };
    return { ok: true, value };
  }
  if (rule.min && value.length < rule.min) {
    return { ok: false, value, message: `${rule.label}은(는) ${rule.min}자 이상 입력해 주세요.` };
  }
  if (rule.max && value.length > rule.max) {
    return { ok: false, value, message: `${rule.label}은(는) ${rule.max}자 이하로 입력해 주세요.` };
  }
  if (containsExecutableString(value)) {
    return { ok: false, value, message: BLOCKED_WORD_MESSAGE_FORM };
  }
  if (containsBlockedWord(value)) {
    return { ok: false, value, message: BLOCKED_WORD_MESSAGE_FORM };
  }
  return { ok: true, value };
}
