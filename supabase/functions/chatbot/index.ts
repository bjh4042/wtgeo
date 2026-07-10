// Chatbot edge function — proxies to Lovable AI Gateway.
// Uses provided context (places/content/gyeongnam) as the only knowledge source.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface Body {
  grade: 3 | 4;
  messages: ChatMessage[];
  context: string; // pre-formatted knowledge base text from client
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "LOVABLE_API_KEY 미설정" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { grade, messages, context } = (await req.json()) as Body;

    if (!grade || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "잘못된 요청입니다." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const scope = grade === 3 ? "거제시(경상남도 거제시)" : "경상남도(18개 시·군)";

    const scopeRule = grade === 3
      ? `- 답변 범위(엄격): 오직 '경상남도 거제시' 지역에 한정합니다. 거제시 외 지역(경상남도의 다른 시·군 포함, 예: 창원, 통영, 진주, 김해 등)이나 거제와 무관한 주제는 답하지 말고, "저는 거제시에 대한 것만 알려줄 수 있어요 🙂"라고 정중히 거절하세요.
- 후속 질문 3개도 반드시 '거제시'에 관한 것만 만듭니다. 다른 지역명이 들어간 질문은 절대 만들지 마세요.`
      : `- 답변 범위(엄격): 오직 '경상남도(18개 시·군)' 범위에 한정합니다. 경상남도 밖 지역(서울/부산광역시/전라도/충청도 등)이나 무관한 주제는 답하지 말고, "저는 경상남도에 대한 것만 알려줄 수 있어요 🙂"라고 정중히 거절하세요.
- 후속 질문 3개도 반드시 '경상남도 18개 시·군' 범위 안에서만 만듭니다. 그 밖의 지역명이 들어간 질문은 절대 만들지 마세요.`;

    const systemPrompt = `당신은 초등학교 ${grade}학년 학생을 돕는 '거제 탐험대' 챗봇입니다.
${scopeRule}
- 지식 출처: 아래 <데이터> 블록에 포함된 정보만 사용합니다. 데이터에 없는 사실은 "제가 가진 자료에는 없어요"라고 말하세요. 절대 지어내지 마세요.
- 말투: 초등학생이 이해하기 쉬운 친근하고 짧은 문장. 이모지를 적절히 사용.
- 길이: 3~6문장 정도로 간결하게. 필요하면 짧은 목록으로.
- 형식: 마크다운 사용 가능.
- 답변 끝에는 반드시 아래 규격의 후속 질문 3개를 붙이세요. 사용자의 방금 질문/답변 주제와 밀접하게 이어지고, 범위 규칙을 지키며 <데이터>로 답할 수 있는 것으로 골라주세요. 이 블록은 정확히 이 형식이어야 하며 다른 텍스트를 덧붙이지 마세요:

[FOLLOWUPS]
- 질문1
- 질문2
- 질문3
[/FOLLOWUPS]

<데이터>
${context}
</데이터>`;

    const payload = {
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ],
    };

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": apiKey,
      },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      const text = await resp.text();
      let msg = `AI 요청 실패 (${resp.status})`;
      if (resp.status === 429) msg = "요청이 너무 많아요. 잠시 후 다시 시도해 주세요.";
      if (resp.status === 402) msg = "AI 크레딧이 부족합니다. 관리자에게 문의하세요.";
      console.error("AI gateway error:", resp.status, text);
      return new Response(JSON.stringify({ error: msg }), {
        status: resp.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await resp.json();
    const raw = data?.choices?.[0]?.message?.content ?? "";

    // Extract [FOLLOWUPS]...[/FOLLOWUPS] block
    let text = raw;
    let followups: string[] = [];
    const m = raw.match(/\[FOLLOWUPS\]([\s\S]*?)\[\/FOLLOWUPS\]/);
    if (m) {
      text = raw.replace(m[0], "").trim();
      followups = m[1]
        .split("\n")
        .map((l: string) => l.replace(/^\s*[-*\d.)]+\s*/, "").trim())
        .filter((l: string) => l.length > 0)
        .slice(0, 3);
    }

    return new Response(JSON.stringify({ text, followups }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error(e);
    return new Response(
      JSON.stringify({ error: String((e as Error)?.message ?? e) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
