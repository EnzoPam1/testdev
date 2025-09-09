export function issueJwt(app, payload, expiresIn = "1h") {
    return app.jwt.sign(payload, { expiresIn });
}
export function setAuthCookie(reply, token) {
    reply.setCookie("access_token", token, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
    });
}
export function clearAuthCookie(reply) {
    reply.clearCookie("access_token", { path: "/" });
}
