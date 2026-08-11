const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const FN_BASE = `${SUPABASE_URL}/functions/v1/app-image`;

/**
 * Resolve any stored image reference to a URL that actually loads.
 *
 * The `app-images` bucket is PRIVATE, so legacy `/storage/v1/object/public/app-images/...`
 * URLs return 400, and signed URLs eventually expire. Both are rewritten to the
 * public read-only `app-image` edge function, which streams the object server-side.
 * External URLs (city hall sites, etc.) are returned untouched.
 */
export function getAppImageUrl(src?: string | null): string | undefined {
  if (!src) return undefined;
  const s = src.trim();
  if (!s) return undefined;

  const marker = "/storage/v1/object/";
  const idx = s.indexOf(marker);
  if (idx !== -1) {
    // e.g. .../object/public/app-images/city-logos/x.png
    //      .../object/sign/app-images/city-logos/x.png?token=...
    let rest = s.slice(idx + marker.length);
    rest = rest.replace(/^(public|sign|authenticated)\//, "");
    if (rest.startsWith("app-images/")) {
      const path = rest.slice("app-images/".length).split("?")[0];
      return `${FN_BASE}?path=${encodeURIComponent(path)}`;
    }
    return s;
  }

  // Bare storage path such as "city-logos/x.png"
  if (/^[a-zA-Z0-9_-]+\/[a-zA-Z0-9._-]+$/.test(s)) {
    return `${FN_BASE}?path=${encodeURIComponent(s)}`;
  }

  return s;
}
