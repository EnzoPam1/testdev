import type { FastifyInstance } from "fastify";
import { prisma } from "../plugins/prisma";

export async function publicStatsRoutes(app: FastifyInstance) {
  app.get("/", async () => {
    const [users, projects] = await Promise.all([
      prisma.user.count(),
      prisma.project.count(),
    ]);
    const last7 = await prisma.project.count({
      where: { createdAt: { gte: new Date(Date.now() - 7 * 864e5) } },
    });
    const engagement = projects ? Math.min(100, Math.round((last7 / projects) * 100)) : 0;

    return {
      users,
      projects,
      engagement,           // %
      last7Projects: last7, // info utile pour l’UI
      generatedAt: new Date().toISOString(),
    };
  });
}
