import { prisma } from "../plugins/prisma";
/**
 * Routes publiques pour exposer des projets sans auth.
 * /public/projects        -> liste (limit)
 * /public/projects/:idOrSlug -> détail
 */
export async function projectsPublicRoutes(app) {
    // Liste
    app.get("/", async (req) => {
        const q = req.query ?? {};
        const limit = Math.min(Number(q.limit ?? 6), 50);
        const skip = Math.max(Number(q.skip ?? 0), 0);
        const qstr = (q.q ?? "").toString().trim();
        const where = qstr
            ? { name: { contains: qstr, mode: "insensitive" } }
            : {};
        const [projects, total] = await Promise.all([
            prisma.project.findMany({ take: limit, skip, where, orderBy: { createdAt: "desc" } }),
            prisma.project.count({ where }),
        ]);
        return { projects, total, limit, skip };
    });
    // Détail (par id ou slug si tu ajoutes un champ slug plus tard)
    app.get("/:idOrSlug", async (req, reply) => {
        const { idOrSlug } = req.params;
        // Essai par id
        let project = await prisma.project.findUnique({ where: { id: idOrSlug } });
        // (Optionnel) si tu as un champ "slug" un jour :
        if (!project) {
            try {
                // @ts-ignore - décommente si tu ajoutes slug dans ton schema
                project = await prisma.project.findFirst({ where: { slug: idOrSlug } });
            }
            catch { /* ignore */ }
        }
        if (!project)
            return reply.code(404).send({ error: "Not found" });
        return { project };
    });
}
