import ProjectsClient from "@/components/ProjectsClient";
import { absoluteUrl } from "@/lib/absoluteUrl";

const qs = (o: Record<string, string | undefined>) =>
  Object.entries(o).reduce((u, [k, v]) => (v ? u.set(k, v) : u, u), new URLSearchParams()).toString();

  async function fetchItems(q?: string, sector?: string, maturity?: string) {
    const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (sector) params.set("sector", sector);
    if (maturity) params.set("maturity", maturity);
    // tu peux aussi mettre une limite si tu veux
    // params.set("limit", "100");
  
    const r = await fetch(`${API}/public/projects?${params.toString()}`, { cache: "no-store" });
    if (!r.ok) return [];               // << garde contre 404/500
    const d = await r.json();
    return d.items ?? d ?? [];
  }
  

export default async function Projects({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const { q, sector, maturity } = await searchParams;
  const items = await fetchItems(q, sector, maturity);

  return (
    <main className="container" style={{ display: "grid", gap: 24 }}>
      <form
        className="card"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr repeat(2, minmax(160px,220px)) auto",
          gap: 12,
          padding: 16,
        }}
      >
        <input name="q" defaultValue={q} placeholder="Search for a startup…" className="input" />
        <select name="sector" defaultValue={sector} className="select">
          <option value="">Sector</option>
          <option>Fintech</option>
          <option>Health</option>
          <option>AI</option>
          <option>Greentech</option>
        </select>
        <select name="maturity" defaultValue={maturity} className="select">
          <option value="">Maturity</option>
          <option>Ideation</option>
          <option>MVP</option>
          <option>Scale</option>
        </select>
        <button className="button" type="submit">Filter</button>
      </form>

      {/* Section purement client */}
      <ProjectsClient initialItems={items} />
    </main>
  );
}
