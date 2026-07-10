import { supabase } from "@/integrations/supabase/client";
import { getMergedPlacesByGrade, getMergedContent } from "@/data/dataManager";
import { getGyeongnamCities } from "@/data/gyeongnam";
import { categoryLabels, publicSubCategoryLabels } from "@/data/places";
import { contentCategoryLabels } from "@/data/content";
import { chatbotQA } from "@/data/chatbotQA";

// Build a compact knowledge base string from local merged data.
// Keep it small: name + category + address + description (trimmed).
function buildGrade3Context(): string {
  const places = getMergedPlacesByGrade(3);
  const contents = getMergedContent().filter(
    (c) => c.grade === 3 || c.grade === "all" || c.grade === undefined,
  );

  const placeLines = places.map((p) => {
    const cat = categoryLabels[p.category] ?? p.category;
    const sub = p.subCategory ? ` / ${publicSubCategoryLabels[p.subCategory]}` : "";
    const desc = (p.description ?? "").replace(/\s+/g, " ").slice(0, 200);
    return `- [${cat}${sub}] ${p.name} | 주소: ${p.address ?? "-"} | 설명: ${desc}`;
  });

  const contentLines = contents.map((c) => {
    const cat = contentCategoryLabels[c.contentType] ?? c.contentType;
    const desc = (c.description ?? "").replace(/\s+/g, " ").slice(0, 220);
    return `- [${cat}] ${c.name} | 설명: ${desc}`;
  });

  const qaLines = chatbotQA.map(
    (q) => `- [${q.category}] Q: ${q.question} → A: ${q.answer.replace(/\s+/g, " ")}`,
  );

  return [
    "## 거제시 장소 목록",
    ...placeLines,
    "",
    "## 거제시 콘텐츠(옛이야기·지명·국가유산·자연 등)",
    ...contentLines,
    "",
    "## 거제시 Q&A 지식베이스 (읍·면·동별 상세 문답)",
    ...qaLines,
  ].join("\n");
}

function buildGrade4Context(): string {
  const cities = getGyeongnamCities();
  const g3 = buildGrade3Context();

  const cityLines = cities.map((c) => {
    const highlights = (c.highlights ?? []).slice(0, 6).join(", ");
    const details = c.details
      ? [
          c.details.nature ? `자연: ${c.details.nature}` : "",
          c.details.industry ? `산업: ${c.details.industry}` : "",
          c.details.culture ? `문화: ${c.details.culture}` : "",
        ]
          .filter(Boolean)
          .join(" | ")
      : "";
    return `- ${c.name}(${c.nameHanja}) | 인구 ${c.population.toLocaleString()}명, 면적 ${c.area}㎢ | 마스코트: ${c.mascot} | 지명유래: ${(c.nameOrigin ?? "").slice(0, 200)} | 대표: ${highlights} | ${details}`.trim();
  });

  return [
    "## 경상남도 18개 시·군",
    ...cityLines,
    "",
    g3,
  ].join("\n");
}

export function buildKnowledgeContext(grade: 3 | 4): string {
  const ctx = grade === 3 ? buildGrade3Context() : buildGrade4Context();
  // Safety cap to keep prompt reasonable
  const MAX = 200000;
  return ctx.length > MAX ? ctx.slice(0, MAX) + "\n...(생략)" : ctx;
}

export interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

export async function askChatbot(
  grade: 3 | 4,
  messages: ChatTurn[],
): Promise<{ text: string; followups: string[] }> {
  const context = buildKnowledgeContext(grade);
  const { data, error } = await supabase.functions.invoke("chatbot", {
    body: { grade, messages, context },
  });
  if (error) throw new Error(error.message || "챗봇 응답 실패");
  if (data && (data as any).error) throw new Error((data as any).error);
  return {
    text: (data as any)?.text ?? "",
    followups: Array.isArray((data as any)?.followups) ? (data as any).followups : [],
  };
}

export const SUGGESTED_QUESTIONS: Record<3 | 4, string[]> = {
  3: [
    "거제도에서 가볼 만한 관광지를 알려줘",
    "거제의 옛이야기 하나 소개해줘",
    "학동몽돌해변은 어떤 곳이야?",
    "거제의 전통시장을 알려줘",
  ],
  4: [
    "경상남도에는 어떤 시·군이 있어?",
    "창원특례시의 특징을 알려줘",
    "통영시의 대표 관광지는 뭐야?",
    "진주시 지명의 유래를 알려줘",
  ],
};
