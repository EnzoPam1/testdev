import 'dotenv/config';
import Fastify from "fastify";
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";
import jwt from "@fastify/jwt";

import { authRoutes } from "./routes/auth";
import { projectsRoutes } from "./routes/projects";
import { startupsRoutes } from "./routes/startups";
import { usersRoutes } from "./routes/users";
import { newsRoutes } from "./routes/news";
import { eventsRoutes } from "./routes/events";
import { projectsPublicRoutes } from "./routes/projects-public";

// ⬇️ importe bien depuis l’endroit où tu as mis le fichier.
// Si ton fichier est à `src/public-stats.ts`, change le chemin en "./public-stats".
import { publicStatsRoutes } from "./routes/public-stats";

const app = Fastify({ logger: true });

// CORS
await app.register(cors, {
  origin: (origin, cb) => {
    const allow = [
      process.env.WEB_ORIGIN,
      "http://localhost:3000",
      "http://127.0.0.1:3000",
    ].filter(Boolean) as string[];
    if (!origin || allow.includes(origin)) return cb(null, true);
    return cb(new Error("Not allowed by CORS"), false);
  },
  credentials: true,
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  maxAge: 86400,
});

app.addHook("onSend", async (_req, reply, payload) => {
  reply.header("Vary", "Origin");
  return payload;
});

// Cookies + JWT
await app.register(cookie);
await app.register(jwt, {
  secret: process.env.JWT_SECRET || "dev-secret",
  cookie: { 
    cookieName: "access_token",
    signed: false
  },
});

// Guard
app.decorate("authenticate", async (req: any, reply: any) => {
  try {
    if (!req.cookies?.access_token && req.headers.authorization?.startsWith("Bearer ")) {
      const token = req.headers.authorization.substring("Bearer ".length);
      req.user = app.jwt.verify(token);
      return;
    }
    await req.jwtVerify();
  } catch {
    return reply.code(401).send({ error: "Unauthorized" });
  }
});

app.get("/health", async () => ({ ok: true }));

// -------- PUBLIC (pas d'auth) --------
await app.register(projectsPublicRoutes, { prefix: "/public/projects" }); // ⬅️ remis
await app.register(publicStatsRoutes, { prefix: "/public/stats" });       // ⬅️ ajouté

// -------- AUTH --------
await app.register(authRoutes, { prefix: "/auth" });

// -------- PROTÉGÉ --------
app.register(async (r) => {
  r.addHook("onRequest", r.authenticate);
  await r.register(projectsRoutes, { prefix: "/projects" });
  await r.register(startupsRoutes, { prefix: "/startups" });
  await r.register(usersRoutes, { prefix: "/users" });
  await r.register(newsRoutes, { prefix: "/news" });
  await r.register(eventsRoutes, { prefix: "/events" });
});

const port = Number(process.env.PORT || 4000);
app.listen({ host: "0.0.0.0", port }).catch((e) => {
  app.log.error(e);
  process.exit(1);
});
