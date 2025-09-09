import { prisma } from "../plugins/prisma";
import { z } from "zod";
export async function usersRoutes(app) {
    const Id = z.object({ id: z.string() });
    const Body = z.object({
        email: z.string().email().optional(),
        name: z.string().optional(),
        role: z.enum(["ADMIN", "STARTUP", "MEMBER"]).optional(),
    });
    app.get("/", async (req, reply) => {
        const u = req.user;
        if (u?.role !== "ADMIN")
            return reply.code(403).send({ error: "Forbidden" });
        const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });
        return { users };
    });
    app.patch("/:id", async (req, reply) => {
        const u = req.user;
        if (u?.role !== "ADMIN")
            return reply.code(403).send({ error: "Forbidden" });
        const { id } = Id.parse(req.params);
        const body = Body.parse(req.body ?? {});
        const user = await prisma.user.update({ where: { id }, data: body });
        return { user };
    });
    app.delete("/:id", async (req, reply) => {
        const u = req.user;
        if (u?.role !== "ADMIN")
            return reply.code(403).send({ error: "Forbidden" });
        const { id } = Id.parse(req.params);
        await prisma.user.delete({ where: { id } });
        return { ok: true };
    });
}
