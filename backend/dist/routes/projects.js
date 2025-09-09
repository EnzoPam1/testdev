import { prisma } from "../plugins/prisma";
import { z } from "zod";
export async function projectsRoutes(_app) {
    const Id = z.object({ id: z.string() });
    const Body = z.object({
        name: z.string().trim().min(2),
        description: z.string().trim().optional(),
        status: z.string().trim().optional(),
        startupId: z.string().optional(),
    });
    _app.get("/", async () => {
        const projects = await prisma.project.findMany({ orderBy: { createdAt: "desc" } });
        return { projects };
    });
    _app.post("/", async (req) => {
        const data = Body.parse(req.body ?? {});
        const project = await prisma.project.create({ data });
        return { project };
    });
    _app.patch("/:id", async (req) => {
        const { id } = Id.parse(req.params);
        const body = Body.partial().parse(req.body ?? {});
        const project = await prisma.project.update({ where: { id }, data: body });
        return { project };
    });
    _app.delete("/:id", async (req) => {
        const { id } = Id.parse(req.params);
        await prisma.project.delete({ where: { id } });
        return { ok: true };
    });
}
