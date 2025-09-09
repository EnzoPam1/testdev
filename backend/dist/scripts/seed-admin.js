import { prisma } from "../plugins/prisma";
async function main() {
    const email = process.env.ADMIN_EMAIL ?? "admin@local";
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
        console.log("Admin already exists:", email);
        return;
    }
    // Mot de passe "dummy" (mettez un vrai hash si besoin)
    const dummyHash = "$argon2id$dummy";
    const user = await prisma.user.create({
        data: {
            email,
            fullName: "Admin", // <-- schema utilise fullName, pas name
            role: "ADMIN",
            password: dummyHash,
        },
    });
    console.log("Seeded admin:", user.email);
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(() => prisma.$disconnect());
