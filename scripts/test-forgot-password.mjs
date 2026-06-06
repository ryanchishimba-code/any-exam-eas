import { PrismaClient } from "@prisma/client";
import { createHash, randomBytes } from "node:crypto";

const prisma = new PrismaClient();

function hashToken(raw) {
  return createHash("sha256").update(raw).digest("hex");
}

async function main() {
  const user = await prisma.user.findFirst({ select: { id: true, email: true } });
  if (!user) {
    console.log("No users in database.");
    return;
  }

  console.log("Testing token create for user", user.id.slice(0, 10) + "...");

  try {
    await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });
    const rawToken = randomBytes(32).toString("base64url");
    const rec = await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        email: user.email,
        tokenHash: hashToken(rawToken),
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      },
    });
    console.log("OK — created token", rec.id);
    await prisma.passwordResetToken.delete({ where: { id: rec.id } });
  } catch (e) {
    console.error("FAILED:", e);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main();
