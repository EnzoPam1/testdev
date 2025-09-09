import fetch from "node-fetch";

export async function fetchJeb(endpoint: string, token = process.env.JEB_GROUP_TOKEN, base = process.env.JEB_API_URL) {
  if (!base) throw new Error("Missing JEB_API_URL");
  if (!token) throw new Error("Missing JEB_GROUP_TOKEN");

  const res = await fetch(`${base}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`, {
    headers: { "X-Group-Authorization": token },
  });
  if (!res.ok) throw new Error(`JEB API error: ${res.status} ${await res.text()}`);
  return res.json();
}
