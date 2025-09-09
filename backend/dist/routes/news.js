import { prisma } from "../plugins/prisma";
import { z } from "zod";
export async function newsRoutes(_app) {
    const Id = z.object({ id: z.string() });
    const Body = z.object({
        title: z.string(),
        content: z.string().optional(),
        publishedAt: z.string().datetime().optional(), // adapter si modèle différent
    });
    _app.get("/", async () => {
        const items = await prisma.news.findMany?.({ orderBy: { publishedAt: "desc" } }).catch(async () => {
            // si pas de modèle News dans le schéma
            return [];
        });
        return { news: items || [] };
    });
    _app.post("/", async (req) => {
        const data = Body.parse(req.body ?? {});
        // @ts-ignore — uniquement si le modèle News existe
        const item = await prisma.news?.create({ data });
        return { news: item };
    });
    _app.patch("/:id", async (req) => {
        const { id } = Id.parse(req.params);
        const data = Body.partial().parse(req.body ?? {});
        // @ts-ignore
        const item = await prisma.news?.update({ where: { id }, data });
        return { news: item };
    });
    _app.delete("/:id", async (req) => {
        const { id } = Id.parse(req.params);
        // @ts-ignore
        await prisma.news?.delete({ where: { id } });
        return { ok: true };
    });
}
