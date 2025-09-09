import { prisma } from "../plugins/prisma";

async function main() {
  // Ordre à respecter si contraintes FK
  await prisma.project.deleteMany({});
  await prisma.startup.deleteMany({});
  await prisma.user.deleteMany({ where: { role: { not: "ADMIN" } } });
  console.log("Cleanup done.");
}
main().catch(console.error).finally(() => prisma.$disconnect());
