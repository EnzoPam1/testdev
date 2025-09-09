"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/auth";
import "../globals.css";

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+$/.test(v.trim());

export default function Login() {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (!isEmail(email)) return setErr("Please enter a valid email.");
    if (!pwd) return setErr("Password is required.");
    setPending(true);
    try {
      await login(email.trim().toLowerCase(), pwd);
      router.push("/projects");
      router.refresh();
    } catch (e: any) {
      setErr(e?.message || "Invalid credentials.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="formmain">
      <div className="signupContainer">
        <h1 className="title">Sign in to your account</h1>
        <form className="form" onSubmit={onSubmit} noValidate>
          <input className="input" type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
          <input className="input" type="password" placeholder="Password" value={pwd} onChange={e=>setPwd(e.target.value)} required />
          {err && <div className="card" style={{ padding:10, color:"#ffb4b4", borderColor:"rgba(255,0,0,.25)" }}>{err}</div>}
          <div className="buttonContainer">
            <button className="button signupButton" disabled={pending}>{pending ? "Signing in…" : "Sign in"}</button>
          </div>
        </form>
      </div>
    </main>
  );
}
