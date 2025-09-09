import Reveal from "@/components/Reveal";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const r = await fetch(`${API}/public/projects/${params.slug}`, { cache: "no-store" });

type Project = {
  id: string;
  name: string;
  description?: string | null;
  status?: string | null;
  createdAt?: string;
  updatedAt?: string;
  // Si plus tard tu ajoutes ces champs en DB, on les affichera automatiquement :
  sector?: string;
  stage?: string;
  location?: string;
  contactEmail?: string;
  website?: string;
  logoUrl?: string;
};

async function getProject(idOrSlug: string): Promise<Project | null> {
  const res = await fetch(`${API}/public/projects/${idOrSlug}`, { cache: "no-store" });
  if (!res.ok) return null;
  const data = await res.json().catch(() => null);
  return data?.project ?? null;
}

// ⚠️ Next 15: params est une Promise => il faut l'attendre
export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = await getProject(slug);

  if (!p) {
    return <main className="container">Projet introuvable.</main>;
  }

  return (
    <main className="container" style={{ display: "grid", gap: 20 }}>
      <Reveal>
        <h1 style={{ margin: 0 }}>{p.name}</h1>
      </Reveal>

      <Reveal delay={0.1}>
        <div
          className="card"
          style={{ padding: 18, borderRadius: 18, border: "1px solid rgba(255,255,255,.08)" }}
        >
          {/* Tags (affichés seulement si présents) */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
            {p.sector && <span className="tag">{p.sector}</span>}
            {p.stage && <span className="tag">{p.stage}</span>}
            {p.location && <span className="tag">{p.location}</span>}
            {p.status && <span className="tag">{p.status}</span>}
          </div>

          {/* Description */}
          {p.description && (
            <p style={{ opacity: 0.9, lineHeight: 1.7 }}>{p.description}</p>
          )}

          {/* Liens / contact si fournis */}
          <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
            {p.contactEmail && (
              <a
                className="button button--ghost"
                href={`mailto:${p.contactEmail}?subject=Intérêt pour ${encodeURIComponent(p.name)}`}
              >
                Contacter
              </a>
            )}
            {p.website && (
              <a className="button" href={p.website} target="_blank" rel="noreferrer">
                Site
              </a>
            )}
          </div>

          {/* Meta */}
          <div style={{ marginTop: 16, fontSize: 14, opacity: 0.8 }}>
            <div><strong>ID:</strong> {p.id}</div>
            {p.createdAt && (
              <div>
                <strong>Créé:</strong>{" "}
                {new Date(p.createdAt).toLocaleString()}
              </div>
            )}
          </div>
        </div>
      </Reveal>

      <a href="/projects" className="button button--ghost" style={{ width: "max-content" }}>
        ← Retour aux projets
      </a>
    </main>
  );
}
