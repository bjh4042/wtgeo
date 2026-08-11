import { describe, it, expect } from "vitest";
import { containsBlockedWord } from "@/lib/contentFilter";
import { places } from "@/data/places";
import { schools } from "@/data/schools";
import { stories, placenames, heritages, pastPresent, natureContent } from "@/data/content";

describe("contentFilter", () => {
  it("정상 지명/학교명/문화재명을 차단하지 않는다", () => {
    const names = [
      ...places.map((p) => p.name),
      ...schools.map((s) => s.name),
      ...[...stories, ...placenames, ...heritages, ...pastPresent, ...natureContent].map((c) => c.name),
      "계룡초 주소 알려줘",
      "거제 식물원은 어디야?",
      "거제시 인구 알려줘",
      "거제 이름은 왜 거제야?",
      "쌍계사 가는 길",
      "아파트 근처 공원",
      "만남의 광장",
      "호구조사가 뭐야?",
      "시발점이 무슨 뜻이야?",
      "담배는 몸에 나빠요",
      "유방암 예방",
      "조건부 승인",
      "통영 앞바다",
    ];
    const blocked = names.filter((n) => containsBlockedWord(n));
    expect(blocked).toEqual([]);
    expect(names.length).toBeGreaterThan(30);
  });

  it("욕설과 우회 표현을 차단한다", () => {
    const bad = ["시발놈아", "씨 발", "ㅅㅂ", "ㅄ", "병1신", "개@새끼", "tlqkf", "존나 싫어", "fuck you", "야동 보여줘"];
    const passed = bad.filter((b) => !containsBlockedWord(b));
    expect(passed).toEqual([]);
  });
});
