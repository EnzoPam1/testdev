"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useMe } from "@/lib/useMe";
import { api } from "@/lib/api";

export default function Header() {
  const pathname = usePathname();
  const isActive = (href: string) => (pathname === href ? "active" : "");

  const [open, setOpen] = useState(false);
  const { user, refresh } = useMe();

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  async function onLogout() {
    try {
      await api("/auth/logout", { method: "POST" });
      await refresh();
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <header className="topbar">
      <div className="navLogo">
        <Link href="/" className="brand" aria-label="JEB Home">
          <Image src="/jeb_logo.png" alt="JEB Incubator" width={66} height={66} priority />
          <span style={{ fontFamily:"var(--font-montserrat)", fontWeight:800, letterSpacing:.3 }}>
            JEB <span style={{ background:"linear-gradient(90deg,var(--rose-200),var(--vio-400))", WebkitBackgroundClip:"text", color:"transparent" }}>Incubator</span>
          </span>
        </Link>
      </div>

      <div className="topwrap">
        <nav className="navPrimary" aria-label="Navigation principale">
          <Link href="/" className={`nav-item ${isActive("/")}`}>Home</Link>
          <Link href="/projects" className={`nav-item ${isActive("/projects")}`}>Projects</Link>
          <Link href="/news" className={`nav-item ${isActive("/news")}`}>News</Link>
          <Link href="/events" className={`nav-item ${isActive("/events")}`}>Events</Link>
          <Link href="/about" className={`nav-item ${isActive("/about")}`}>About</Link>
          <Link href="/dashboard" className={`nav-item ${isActive("/dashboard")}`}>Dashboard</Link>
        </nav>
      </div>

      <nav className="navAuth" aria-label="Authentification" style={{ alignItems:"center" }}>
        {user ? (
          <>
            <span style={{ opacity:.9, fontSize:14, marginRight:8 }}>
              Signed in as <strong>{user.email}</strong>
            </span>
            <button onClick={onLogout} className="authBtn" style={{ background:"var(--rose-200)" }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="authBtn">Login</Link>
            <Link href="/signup" className="authBtn">Sign&nbsp;Up</Link>
          </>
        )}
      </nav>

      <button
        className="navToggle"
        aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
        aria-expanded={open}
        onClick={() => setOpen(v => !v)}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
          {open ? (
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          ) : (
            <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          )}
        </svg>
        <span className="sr-only">{open ? "Fermer le menu" : "Ouvrir le menu"}</span>
      </button>

      <div className="mobileNav" data-open={open ? "true" : "false"} aria-hidden={!open}>
        <nav aria-label="Menu mobile" className="mobileNavInner">
          <Link href="/" className={`mobileNavItem ${isActive("/")}`}>Home</Link>
          <Link href="/projects" className={`mobileNavItem ${isActive("/projects")}`}>Projects</Link>
          <Link href="/news" className={`mobileNavItem ${isActive("/news")}`}>News</Link>
          <Link href="/events" className={`mobileNavItem ${isActive("/events")}`}>Events</Link>
          <Link href="/about" className={`mobileNavItem ${isActive("/about")}`}>About</Link>
          <div style={{ display:"flex", gap:10, marginTop:8 }}>
            {user ? (
              <button onClick={onLogout} className="button" style={{ flex:1, justifyContent:"center" }}>
                Logout
              </button>
            ) : (
              <>
                <Link href="/login" className="button button--ghost" style={{ flex:1, justifyContent:"center" }}>Login</Link>
                <Link href="/signup" className="button" style={{ flex:1, justifyContent:"center" }}>Sign&nbsp;Up</Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
