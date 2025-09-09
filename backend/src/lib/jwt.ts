import type { FastifyInstance } from "fastify";

export function issueJwt(app: FastifyInstance, payload: object, expiresIn = "1h") {
  return app.jwt.sign(payload, { expiresIn });
}

export function setAuthCookie(reply: any, token: string) {
  reply.setCookie("access_token", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
}

export function clearAuthCookie(reply: any) {
  reply.clearCookie("access_token", { path: "/" });
}
