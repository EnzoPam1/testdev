import { prisma } from "../plugins/prisma";
import { fetchJeb } from "../lib/jeb";
async function main() {
    // Adapter les endpoints aux vrais de la JEB API (selon l'annexe)
    try {
        const startupsJson = await fetchJeb("/startups");
        const projectsJson = await fetchJeb("/projects");
        for (const s of startupsJson?.data ?? []) {
            await prisma.startup.upsert({
                where: { extId: String(s.id) },
                update: {
                    name: s.name ?? s.title ?? "Unnamed",
                    description: s.description ?? null,
                    website: s.website ?? null,
                },
                create: {
                    extId: String(s.id),
                    name: s.name ?? s.title ?? "Unnamed",
                    description: s.description ?? null,
                    website: s.website ?? null,
                },
            });
        }
        for (const p of projectsJson?.data ?? []) {
            await prisma.project.upsert({
                where: { extId: String(p.id) },
                update: {
                    name: p.name ?? p.title ?? "Untitled",
                    description: p.description ?? null,
                    status: p.status ?? null,
                },
                create: {
                    extId: String(p.id),
                    name: p.name ?? p.title ?? "Untitled",
                    description: p.description ?? null,
                    status: p.status ?? null,
                },
            });
        }
        console.log("Initial import done.");
    }
    catch (e) {
        console.error("Import error:", e);
        process.exit(1);
    }
}
main().finally(() => prisma.$disconnect());
