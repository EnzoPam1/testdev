import GradientHero from "@/components/GradientHero";
import StaggeredGrid from "@/components/StaggeredGrid";

async function fetchFeatured() {
  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  const r = await fetch(`${API}/public/projects?limit=6`, { cache: "no-store" });
  if (!r.ok) return [];
  const d = await r.json();
  return d.items ?? d ?? [];
}

export default async function Home() {
  const projects = await fetchFeatured();

  return (
    <main className="container" style={{ display: "grid", gap: 24 }}>
      <GradientHero />

      <section className="section" aria-labelledby="featured-title">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end" }}>
          <h2 id="featured-title" className="title-underline">Featured Projects</h2>
          <a className="button button--ghost" href="/projects">View all</a>
        </div>
        <StaggeredGrid projects={projects} />
      </section>
    </main>
  );
}
