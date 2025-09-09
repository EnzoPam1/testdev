"use client";

import { motion } from "framer-motion";
import ProjectCard from "./ProjectCard";

type Project = {
  id?: string;
  slug?: string;
  name?: string;
  [k: string]: any;
};

export default function StaggeredGrid({ projects }: { projects?: any }) {
  // Normalisation: accepte [], {items: []}, null/undefined
  const list: Project[] = Array.isArray(projects)
    ? projects
    : Array.isArray(projects?.items)
    ? projects.items
    : [];

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.1 }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
      style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 16 }}
    >
      {list.map((p, i) => (
        <motion.div
          key={p.id ?? p.slug ?? i}
          variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } }}
        >
          <ProjectCard p={p as any} />
        </motion.div>
      ))}
      {list.length === 0 && (
        <div className="card" style={{ padding: 16, opacity: 0.9 }}>
          No project found.
        </div>
      )}
    </motion.div>
  );
}
