"use client";

import { useState } from "react";
import { api } from "@/lib/api";

export default function ProjectCreate({ onCreated }: { onCreated?: () => void }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (!name.trim()) { setError("Name is required"); return; }
    setPending(true);
    try {
      await api("/projects", {
        method: "POST",
        body: JSON.stringify({ name: name.trim(), description: description.trim() || null }),
      });
      setName("");
      setDescription("");
      onCreated?.();
    } catch (err: any) {
      setError(err?.message ?? "Create failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="card" style={{ padding: 16, display:"grid", gap: 10 }} onSubmit={submit}>
      <h3 style={{ margin:0 }}>Create a project</h3>
      <input className="input" placeholder="Project name" value={name} onChange={e=>setName(e.target.value)} required />
      <textarea className="input" placeholder="Short description (optional)" value={description} onChange={e=>setDescription(e.target.value)} rows={3}/>
      {error && <div className="card" style={{ padding:10, color:"#ffb4b4", borderColor:"rgba(255,0,0,.25)" }}>{error}</div>}
      <div className="buttonContainer">
        <button className="button" disabled={pending}>{pending ? "Creating…" : "Create"}</button>
      </div>
    </form>
  );
}
