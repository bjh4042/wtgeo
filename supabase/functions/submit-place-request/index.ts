// 장소 추가 신청 접수 — 서버 측 검증 후 service role 로 저장한다.
import { createClient } from "npm:@supabase/supabase-js@2";
import { containsBlockedWord, containsExecutableString } from "../_shared/contentFilter.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const ALLOWED_CATEGORIES = new Set([
  "tourism",
  "nature",
  "culture",
  "public",
  "experience",
  "market",
]);

const PHONE_RE = /^[0-9+\-()\s.]{0,30}$/;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") return json({ error: "잘못된 요청입니다." }, 400);

    const name = String((body as any).name ?? "").trim();
    const address = String((body as any).address ?? "").trim();
    const category = String((body as any).category ?? "").trim();
    const phone = String((body as any).phone ?? "").trim();
    const description = String((body as any).description ?? "").trim();

    if (name.length < 2 || name.length > 60) return json({ error: "장소 이름을 2~60자로 입력해 주세요." }, 400);
    if (address.length < 5 || address.length > 150) return json({ error: "주소를 5~150자로 입력해 주세요." }, 400);
    if (!ALLOWED_CATEGORIES.has(category)) return json({ error: "장소 종류를 선택해 주세요." }, 400);
    if (phone && !PHONE_RE.test(phone)) return json({ error: "전화번호 형식을 확인해 주세요." }, 400);
    if (description.length > 300) return json({ error: "추가 설명은 300자 이하로 입력해 주세요." }, 400);

    for (const v of [name, address, phone, description]) {
      if (!v) continue;
      if (containsExecutableString(v) || containsBlockedWord(v)) {
        return json(
          { error: "사용하기 어려운 표현이 포함되어 있어요. 다른 표현으로 바꿔 주세요." },
          400,
        );
      }
    }

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { error } = await admin.from("place_requests").insert({
      name,
      address,
      category,
      phone: phone || null,
      description: description || null,
      status: "pending",
    });

    if (error) {
      // 동일한 대기 중 신청(장소명+주소)은 유니크 인덱스로 차단된다.
      if ((error as any).code === "23505") {
        return json({ error: "이미 같은 내용으로 신청되어 있어요. 확인 후 반영할게요!" }, 409);
      }
      console.error("place_requests insert failed", error.message);
      return json({ error: "신청하지 못했어요. 잠시 후 다시 시도해 주세요." }, 500);
    }

    return json({ ok: true });
  } catch (e) {
    console.error(e);
    return json({ error: "신청하지 못했어요. 잠시 후 다시 시도해 주세요." }, 500);
  }
});
