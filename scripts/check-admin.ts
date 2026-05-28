import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

async function main() {
  const prisma = new PrismaClient();
  const email = (process.env.ADMIN_EMAIL ?? "admin@onkoklub.sk")
    .trim()
    .toLowerCase();
  const pwd = process.env.ADMIN_PASSWORD ?? "OnkoAdmin#2026";

  const user = await prisma.user.findUnique({ where: { email } });
  console.log(
    "admin user:",
    user ? { id: user.id, email: user.email, role: user.role } : "NOT FOUND",
  );
  if (user) {
    console.log("password match:", await bcrypt.compare(pwd, user.passwordHash));
  }

  const all = await prisma.user.findMany({
    select: { email: true, role: true },
    orderBy: { createdAt: "asc" },
  });
  console.log("all users:", all);
  await prisma.$disconnect();
}

main().catch(console.error);
