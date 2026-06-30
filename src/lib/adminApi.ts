import { supabase } from "@/integrations/supabase/client";

const ADMIN_PW_KEY = "geoje-admin-pw";

export function setAdminPassword(pw: string) {
  try { sessionStorage.setItem(ADMIN_PW_KEY, pw); } catch {}
}
export function getAdminPassword(): string | null {
  try { return sessionStorage.getItem(ADMIN_PW_KEY); } catch { return null; }
}
export function clearAdminPassword() {
  try { sessionStorage.removeItem(ADMIN_PW_KEY); } catch {}
}
export function isAdminAuthenticated(): boolean {
  return !!getAdminPassword();
}

async function call(action: string, params: Record<string, unknown> = {}) {
  const password = getAdminPassword();
  if (!password) throw new Error("관리자 인증이 필요합니다.");
  const { data, error } = await supabase.functions.invoke("admin-action", {
    body: { password, action, ...params },
  });
  if (error) throw error;
  if (data && (data as any).error) throw new Error((data as any).error);
  return data;
}

export async function verifyAdminPassword(pw: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.functions.invoke("admin-action", {
      body: { password: pw, action: "verify" },
    });
    if (error) return false;
    return !!(data && (data as any).ok);
  } catch {
    return false;
  }
}

type Match = Record<string, string | number | boolean>;

export const adminApi = {
  upsert(table: string, row: any | any[], onConflict?: string) {
    return call("upsert", { table, row, onConflict });
  },
  insert(table: string, rows: any | any[]) {
    return call("insert", { table, rows });
  },
  update(table: string, patch: any, opts: { match?: Match; matchNeq?: Match }) {
    return call("update", { table, patch, ...opts });
  },
  delete(table: string, opts: { match?: Match; matchNeq?: Match }) {
    return call("delete", { table, ...opts });
  },
  async uploadImage(
    folder: string,
    file: File,
  ): Promise<string> {
    const buf = await file.arrayBuffer();
    // base64 encode without blowing the stack on large files
    const bytes = new Uint8Array(buf);
    let binary = "";
    const CHUNK = 0x8000;
    for (let i = 0; i < bytes.length; i += CHUNK) {
      binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
    }
    const base64 = btoa(binary);
    const ext = (file.name.split(".").pop() || "bin").toLowerCase();
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`;
    const res = await call("upload", {
      folder,
      filename,
      contentType: file.type || undefined,
      base64,
    });
    return (res as any).url as string;
  },
};
