import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
  log: ["warn", "error"],
});

// Optionnel : connexion au démarrage
(async () => {
  try {
    await prisma.$connect();
  } catch (e) {
    console.error("Prisma connect error:", e);
  }
})();
