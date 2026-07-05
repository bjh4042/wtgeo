import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const ALLOWED_TABLES = new Set([
  "place_edits",
  "custom_places",
  "content_edits",
  "custom_content",
  "school_edits",
  "site_settings",
  "gyeongnam_edits",
  "quiz_questions",
  "error_reports",
]);

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function sanitizeSiteSettings(row: any) {
  if (row && row.key === "site_info" && row.value) {
    let v = row.value;
    if (typeof v === "string") {
      try { v = JSON.parse(v); } catch { /* keep as is */ }
    }
    if (v && typeof v === "object") {
      const { devEmail: _drop, ...rest } = v;
      row.value = rest;
    }
  }
  return row;
}

function sanitize(table: string, row: any) {
  if (!row) return row;
  if (table === "site_settings") return sanitizeSiteSettings(row);
  return row;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { password, action } = body ?? {};

    const expected = Deno.env.get("ADMIN_PASSWORD");
    if (!expected) return json({ error: "Admin password not configured" }, 500);
    if (typeof password !== "string" || password !== expected) {
      return json({ error: "Unauthorized" }, 401);
    }

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    if (action === "verify") {
      return json({ ok: true });
    }

    if (action === "upload") {
      const { folder, filename, contentType, base64 } = body;
      const safeFolder = String(folder || "misc").replace(/[^a-zA-Z0-9_-]/g, "_");
      const safeName = String(filename || `${Date.now()}.bin`).replace(/[^a-zA-Z0-9._-]/g, "_");
      const path = `${safeFolder}/${safeName}`;
      const bin = Uint8Array.from(atob(String(base64 || "")), (c) => c.charCodeAt(0));
      const { error } = await admin.storage.from("app-images").upload(path, bin, {
        contentType: contentType || "application/octet-stream",
        upsert: false,
      });
      if (error) return json({ error: error.message }, 500);
      // Bucket is private; return a long-lived signed URL (~10 years).
      const { data: signed, error: signErr } = await admin.storage
        .from("app-images")
        .createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
      if (signErr) return json({ error: signErr.message }, 500);
      return json({ url: signed.signedUrl });
    }

    const table = String(body.table || "");
    if (!ALLOWED_TABLES.has(table)) return json({ error: "Forbidden table" }, 403);

    if (action === "upsert") {
      const onConflict: string | undefined = body.onConflict;
      const row = Array.isArray(body.row)
        ? body.row.map((r: any) => sanitize(table, { ...r }))
        : sanitize(table, { ...body.row });
      const q = admin.from(table).upsert(row, onConflict ? { onConflict } : undefined);
      const { data, error } = await q.select();
      if (error) return json({ error: error.message }, 500);
      return json({ data });
    }

    if (action === "insert") {
      const rows = Array.isArray(body.rows)
        ? body.rows.map((r: any) => sanitize(table, { ...r }))
        : sanitize(table, { ...body.rows });
      const { data, error } = await admin.from(table).insert(rows).select();
      if (error) return json({ error: error.message }, 500);
      return json({ data });
    }

    if (action === "update") {
      const patch = sanitize(table, { ...body.patch });
      let q: any = admin.from(table).update(patch);
      for (const [k, v] of Object.entries(body.match || {})) q = q.eq(k, v as any);
      for (const [k, v] of Object.entries(body.matchNeq || {})) q = q.neq(k, v as any);
      const { data, error } = await q.select();
      if (error) return json({ error: error.message }, 500);
      return json({ data });
    }

    if (action === "delete") {
      let q: any = admin.from(table).delete();
      for (const [k, v] of Object.entries(body.match || {})) q = q.eq(k, v as any);
      for (const [k, v] of Object.entries(body.matchNeq || {})) q = q.neq(k, v as any);
      const { error } = await q;
      if (error) return json({ error: error.message }, 500);
      return json({ ok: true });
    }

    return json({ error: "Unknown action" }, 400);
  } catch (e) {
    return json({ error: String((e as Error)?.message ?? e) }, 500);
  }
});
