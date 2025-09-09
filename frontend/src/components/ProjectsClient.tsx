"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useMe } from "@/lib/useMe";
import StaggeredGrid from "@/components/StaggeredGrid";

// Le dynamic import (ssr: false) doit être DANS un composant client
const ProjectCreate = dynamic(() => import("@/components/ProjectCreate"), { ssr: false });

type Props = { initialItems: any[] };

export default function ProjectsClient({ initialItems }: Props) {
  const { user } = useMe();
  const [items, setItems] = useState(initialItems);
  const [refreshKey, setRefreshKey] = useState(0);

  // (optionnel) refetch côté client après création pour rafraîchir la grille
  useEffect(() => {
    async function refetch() {
      const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      try {
        const r = await fetch(`${API}/public/projects?limit=100`, { cache: "no-store" });
        const d = await r.json();
        setItems(d.items ?? d ?? []);
      } catch {
        /* no-op */
      }
    }
    if (refreshKey > 0) refetch();
  }, [refreshKey]);

  return (
    <>
      {user && <ProjectCreate onCreated={() => setRefreshKey((k) => k + 1)} />}
      <StaggeredGrid projects={items} />
    </>
  );
}
