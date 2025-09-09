"use client";

import { motion } from "framer-motion";

export default function GradientHero() {
  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <section
      className="container"
      style={{
        paddingTop: 32,
        paddingBottom: 24,
        display: "grid",
        gap: 16,
        placeItems: "center",
        textAlign: "center",
        position: "relative",
      }}
      aria-label="JEB Incubator - Accueil"
    >
      {/* bande lumineuse derrière le titre */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: "auto 0 20% 0",
          height: 140,
          background:
            "radial-gradient(60% 50% at 50% 50%, rgba(203,144,241,.20), transparent 70%)",
          filter: "blur(30px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Titre principal */}
      <motion.h1
        initial={reduceMotion ? false : { opacity: 0, y: 20 }}
        animate={reduceMotion ? {} : { opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          margin: 0,
          fontFamily: "var(--font-montserrat)",
          fontWeight: 800,
          fontSize: "clamp(34px, 6vw, 64px)",
          lineHeight: 1.1,
          letterSpacing: 0.2,
          position: "relative",
          zIndex: 1,
        }}
      >
        <span className="text-gradient-animate">
          Empower your startup
        </span>
      </motion.h1>

      {/* Sous-titre */}
      <motion.p
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        animate={reduceMotion ? {} : { opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
        style={{
          maxWidth: 780,
          color: "var(--text)",
          opacity: 0.9,
          fontSize: "clamp(16px, 2.4vw, 18px)",
          lineHeight: 1.7,
          marginTop: 8,
          zIndex: 1,
        }}
      >
        The JEB platform connects <strong>founders</strong>,{" "}
        <strong>investors</strong> and <strong>partners</strong>. 
        Create your profile, showcase your project, and join the ecosystem.
      </motion.p>

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        animate={reduceMotion ? {} : { opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          justifyContent: "center",
          marginTop: 8,
          zIndex: 1,
        }}
      >
        <a href="/projects" className="button">
          Explore projects
        </a>
        <a href="/signup" className="button button--ghost">
          Create my profile
        </a>
      </motion.div>

      {/* ligne gradient sous texte*/}
      <motion.div
        aria-hidden
        initial={reduceMotion ? false : { scaleX: 0 }}
        animate={reduceMotion ? {} : { scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.25, ease: "easeOut" }}
        className="shine-line"
        style={{ marginTop: 14 }}
      />
    </section>
  );
}
