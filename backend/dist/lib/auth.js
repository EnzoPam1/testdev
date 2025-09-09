import argon2 from "argon2";
export async function hashPassword(pwd) {
    return argon2.hash(pwd);
}
export async function verifyPassword(hash, pwd) {
    return argon2.verify(hash, pwd);
}
