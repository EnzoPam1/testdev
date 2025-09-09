import { prisma } from "../plugins/prisma";

async function main() {
  console.log("DB url:", process.env.DATABASE_URL);
  await prisma.$queryRaw`SELECT 1`;
  console.log("DB OK");
}
main().catch(console.error).finally(() => prisma.$disconnect());
