import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { forbiddenWords } from "@/data/forbiddenWords";
import { containsBlockedWord } from "@/lib/contentFilter";
import { places } from "@/data/places";
import { schools } from "@/data/schools";
import { stories, placenames, heritages, pastPresent, natureContent } from "@/data/content";

const server = readFileSync("supabase/functions/_shared/contentFilter.ts", "utf8");
const client = readFileSync("src/lib/contentFilter.ts", "utf8");

describe("filter sync", () => {
  it("서버 사본이 클라이언트 핵심 로직과 동일하다", () => {
    const key = "/** 오탐이 잦아";
    expect(server.slice(server.indexOf(key))).toEqual(client.slice(client.indexOf(key)));
  });
  it("금칙어 목록이 동일하다", () => {
    const arr = server.slice(server.indexOf("const forbiddenWords"), server.indexOf("/** 오탐이 잦아"));
    const words = [...arr.matchAll(/"([^"]+)"/g)].map(m => m[1]);
    expect(words).toEqual(forbiddenWords);
  });
  it("실제 데이터 336건 오탐 0", () => {
    const names = [
      ...places.map(p => p.name),
      ...schools.map(s => s.name),
      ...[...stories, ...placenames, ...heritages, ...pastPresent, ...natureContent].map(c => c.name),
    ];
    expect(names.length).toBe(336);
    expect(names.filter(containsBlockedWord)).toEqual([]);
  });
});
