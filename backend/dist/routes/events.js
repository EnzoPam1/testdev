import { prisma } from "../plugins/prisma";
import { z } from "zod";
export async function eventsRoutes(_app) {
    const Id = z.object({ id: z.string() });
    const Body = z.object({
        title: z.string(),
        description: z.string().optional(),
        date: z.string().datetime().optional(), // adapter selon le schéma
        location: z.string().optional(),
    });
    _app.get("/", async () => {
        const items = await prisma.event.findMany?.({ orderBy: { date: "desc" } }).catch(async () => {
            return [];
        });
        return { events: items || [] };
    });
    _app.post("/", async (req) => {
        const data = Body.parse(req.body ?? {});
        // @ts-ignore
        const item = await prisma.event?.create({ data });
        return { event: item };
    });
    _app.patch("/:id", async (req) => {
        const { id } = Id.parse(req.params);
        const data = Body.partial().parse(req.body ?? {});
        // @ts-ignore
        const item = await prisma.event?.update({ where: { id }, data });
        return { event: item };
    });
    _app.delete("/:id", async (req) => {
        const { id } = Id.parse(req.params);
        // @ts-ignore
        await prisma.event?.delete({ where: { id } });
        return { ok: true };
    });
}
