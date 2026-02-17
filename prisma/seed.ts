import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import "dotenv/config";

async function main() {
    console.log("Start seeding...");
    await auth.api.signUpEmail({
        body: {
            email: "admin@example.com",
            name: "Administrador",
            password: "Administrator1234*",
            type: "ADMIN",
        },
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
