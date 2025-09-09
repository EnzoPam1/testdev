import { prisma } from "../plugins/prisma";

async function main() {
  const startups = await prisma.startup.count();
  const projects = await prisma.project.count();
  const users = await prisma.user.count();
  console.log(JSON.stringify({ startups, projects, users }, null, 2));
}
main().catch(console.error).finally(() => prisma.$disconnect());
