import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

// Public read-only proxy for the PRIVATE `app-images` storage bucket.
// The bucket stays private (no listing, no public write). This function only
// streams a single object by exact path, using the service role internally.
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "GET" && req.method !== "HEAD") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  const url = new URL(req.url);
  const raw = url.searchParams.get("path") || "";
  // Only allow simple `folder/file.ext` paths — no traversal, no wildcards.
  if (!/^[a-zA-Z0-9_-]{1,64}\/[a-zA-Z0-9._-]{1,128}$/.test(raw)) {
    return new Response("Invalid path", { status: 400, headers: corsHeaders });
  }

  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const { data, error } = await admin.storage.from("app-images").download(raw);
  if (error || !data) {
    return new Response("Not found", { status: 404, headers: corsHeaders });
  }

  return new Response(data, {
    status: 200,
    headers: {
      ...corsHeaders,
      "Content-Type": data.type || "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
});
