import { headers } from "next/headers";

/** Construit une URL absolue côté serveur (RSC/SSR) vers nos routes /api */
export async function absoluteUrl(path = "/") {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? (process.env.NODE_ENV === "production" ? "https" : "http");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${proto}://${host}${p}`;
}
