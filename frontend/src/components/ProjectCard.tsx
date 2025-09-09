"use client";
import { motion } from "framer-motion";

export type Project = {
  id: string;
  name: string;
  sector?: string;
  stage?: string;
  location?: string;
  logoUrl?: string;
  slug?: string;
};

export default function ProjectCard({ p }: { p: Project }) {
  return (
    <motion.a
      href={`/projects/${p.slug ?? p.id}`}
      style={card}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35 }}
    >
      <motion.div aria-hidden style={halo} whileHover={{ opacity: 1 }} />

      <div
        style={{
          padding: 18,
          display: "grid",
          gridTemplateColumns: "64px 1fr",
          gap: 14,
        }}
      >
        {/* Avatar */}
        <div style={logoBox}>
          {p.logoUrl ? (
            <img
              src={p.logoUrl}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <span style={{ fontSize: 22 }}>🚀</span>
          )}
        </div>

        {/* Contenu */}
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 10,
            }}
          >
            {/* Titre gradient */}
            <h3 style={title}>
              <span style={{ color: "inherit" }}>{p.name}</span>
            </h3>
            <span style={chipStage}>{p.stage ?? "—"}</span>
          </div>

          <div
            style={{
              marginTop: 8,
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            {p.sector && <span style={chipSector}>{p.sector}</span>}
            {p.location && <span style={chipLocation}>{p.location}</span>}
          </div>
        </div>
      </div>
    </motion.a>
  );
}

/* styles */

const card: React.CSSProperties = {
  display: "block",
  position: "relative",
  textDecoration: "none",
  color: "inherit",
  borderRadius: 18,
  background:
    "radial-gradient(180% 120% at -10% -30%, rgba(243,219,255,.06), transparent 60%)," +
    "radial-gradient(120% 80%  at 120% -10%, rgba(255,238,246,.05), transparent 60%)," +
    "linear-gradient(180deg, rgba(255,255,255,.04), rgba(255,255,255,.02))",
  border: "1px solid rgba(255,255,255,.10)",
  boxShadow: "0 12px 36px rgba(0,0,0,.25)",
  overflow: "hidden",
  transition: "transform .18s ease, box-shadow .18s ease, border-color .18s ease",
};

const halo: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  background:
    "radial-gradient(380px 180px at 85% -10%, rgba(203,144,241,.16), transparent 60%)",
  opacity: 0,
  pointerEvents: "none",
  transition: "opacity .25s ease",
};

const logoBox: React.CSSProperties = {
  width: 64,
  height: 64,
  borderRadius: 16,
  background: "linear-gradient(135deg, var(--vio-200), var(--rose-200))",
  display: "grid",
  placeItems: "center",
  overflow: "hidden",
  border: "1px solid rgba(255,255,255,.14)",
};

const title: React.CSSProperties = {
  margin: 0,
  fontSize: "1.05rem",
  fontWeight: 800,
  letterSpacing: ".2px",
  background: "linear-gradient(90deg, var(--rose-200), var(--vio-400))",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
  fontFamily: "var(--font-montserrat)",
};

const chipBase: React.CSSProperties = {
  fontSize: ".74rem",
  padding: ".38rem .66rem",
  borderRadius: 999,
  border: "1px solid rgba(255,255,255,.14)",
  background: "rgba(255,255,255,.06)",
  color: "var(--text)",
  whiteSpace: "nowrap",
};

const chipStage: React.CSSProperties = {
  ...chipBase,
  background: "rgba(255,255,255,.08)",
};

const chipSector: React.CSSProperties = {
  ...chipBase,
  border: "1px solid rgba(203,144,241,.35)",
  background:
    "linear-gradient(90deg, rgba(246,174,174,.18), rgba(203,144,241,.18))",
};

const chipLocation: React.CSSProperties = {
  ...chipBase,
  color: "#D8D9E3",
};
