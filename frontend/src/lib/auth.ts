const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export type CurrentUser = { id: string; email: string; role: string; fullName?: string } | null;

export async function getMe(): Promise<CurrentUser> {
  try {
    const r = await fetch(`${API}/auth/me`, { credentials: "include", cache: "no-store" });
    if (!r.ok) return null;
    const j = await r.json();
    return j?.user ?? null;
  } catch {
    return null;
  }
}

export async function login(email: string, password: string) {
  const r = await fetch(`${API}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!r.ok) throw new Error((await r.json().catch(()=>null))?.error || r.statusText);
  return r.json();
}

export async function signup(email: string, password: string, name?: string) {
  const r = await fetch(`${API}/auth/signup`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, name }),
  });
  if (!r.ok) throw new Error((await r.json().catch(()=>null))?.error || r.statusText);
  return r.json();
}

export async function logout() {
  await fetch(`${API}/auth/logout`, { method: "POST", credentials: "include" });
}
