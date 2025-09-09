import { prisma } from "../plugins/prisma";
import { z } from "zod";
export async function startupsRoutes(_app) {
    const Id = z.object({ id: z.string() });
    const Body = z.object({
        name: z.string(),
        description: z.string().optional(),
        website: z.string().url().optional(),
        ownerId: z.string().optional(),
    });
    _app.get("/", async () => {
        const startups = await prisma.startup.findMany({ orderBy: { createdAt: "desc" }, include: { projects: true } });
        return { startups };
    });
    _app.post("/", async (req) => {
        const data = Body.parse(req.body ?? {});
        const startup = await prisma.startup.create({ data });
        return { startup };
    });
    _app.patch("/:id", async (req) => {
        const { id } = Id.parse(req.params);
        const body = Body.partial().parse(req.body ?? {});
        const startup = await prisma.startup.update({ where: { id }, data: body });
        return { startup };
    });
    _app.delete("/:id", async (req) => {
        const { id } = Id.parse(req.params);
        await prisma.startup.delete({ where: { id } });
        return { ok: true };
    });
}
