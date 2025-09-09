import type { FastifyInstance } from "fastify";
import { prisma } from "../plugins/prisma";
import { z } from "zod";
import { hashPassword, verifyPassword } from "../lib/auth";
import { issueJwt, setAuthCookie, clearAuthCookie } from "../lib/jwt";

// Email permissif (accepte enzo@local), trim + lowercase
const emailLoose = z
  .string()
  .trim()
  .toLowerCase()
  .refine((v) => /^[^\s@]+@[^\s@]+$/.test(v), "Invalid email");

// ---------- Schémas d'entrée ----------
const signupBody = z.object({
  // le front envoie "fullName" ; on garde "name" en option pour compat
  fullName: z.string().trim().min(2, "Name must be at least 2 characters").optional(),
  name: z.string().trim().min(2).optional(), // alias legacy
  email: emailLoose,
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const loginBody = z.object({
  email: emailLoose,
  password: z.string().min(6),
});

export async function authRoutes(app: FastifyInstance) {
  // POST /auth/signup
  app.post("/signup", async (req, reply) => {
    const parsed = signupBody.safeParse(req.body ?? {});
    if (!parsed.success) {
      return reply.code(400).send({ error: "Invalid payload", issues: parsed.error.issues });
    }

    // normalisation
    const email = parsed.data.email.toLowerCase().trim();
    const password = parsed.data.password;
    const fullName = (parsed.data.fullName ?? parsed.data.name ?? "").trim() || null;

    // email déjà utilisé → 409
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return reply.code(409).send({ error: "Email already used" });

    const hash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        password: hash,
        fullName,
        role: "STARTUP",
      },
      select: { id: true, email: true, fullName: true, role: true },
    });

    const token = issueJwt(app, { id: user.id, email: user.email, role: user.role });
    setAuthCookie(reply, token);

    return { user };
  });

  // POST /auth/login
  app.post("/login", async (req, reply) => {
    const parsed = loginBody.safeParse(req.body ?? {});
    if (!parsed.success) {
      return reply.code(400).send({ error: "Invalid payload", issues: parsed.error.issues });
    }
    const email = parsed.data.email.toLowerCase().trim();
    const password = parsed.data.password;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) return reply.code(401).send({ error: "Invalid credentials" });

    const ok = await verifyPassword(user.password, password);
    if (!ok) return reply.code(401).send({ error: "Invalid credentials" });

    const token = issueJwt(app, { id: user.id, email: user.email, role: user.role });
    setAuthCookie(reply, token);

    // on renvoie un shape “safe”
    return { user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role } };
  });

  // GET /auth/me
  app.get("/me", async (req) => {
    try {
      const u = await req.jwtVerify();
      return { user: u };
    } catch {
      return { user: null };
    }
  });

  // POST /auth/logout
  app.post("/logout", async (_req, reply) => {
    clearAuthCookie(reply);
    return { ok: true };
  });
}
