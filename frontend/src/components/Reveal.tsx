"use client";
import { motion, useAnimation } from "framer-motion";
import { useEffect, useRef } from "react";

export default function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const controls = useAnimation();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current!;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && controls.start({ opacity: 1, y: 0, scale: 1 }), { threshold: 0.18 });
    io.observe(el);
    return () => io.disconnect();
  }, [controls]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={controls}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}
