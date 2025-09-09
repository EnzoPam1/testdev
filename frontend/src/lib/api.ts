const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function api<T>(
  path: string,
  opts: RequestInit = {},
  { withCredentials = true }: { withCredentials?: boolean } = {}
): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...opts,
    credentials: withCredentials ? "include" : "same-origin",
    headers: {
      "Content-Type": "application/json",
      ...(opts.headers || {}),
    },
  });
  if (!res.ok) {
    let msg = res.statusText;
    try {
      const j = await res.json();
      msg = (j?.error || j?.message) ?? msg;
    } catch {}
    throw new Error(`${res.status} ${msg}`);
  }
  return res.json() as Promise<T>;
}
