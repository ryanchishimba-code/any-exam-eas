import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

try {
  const promos = await prisma.promoCode.findMany({
    select: { code: true, discountPercent: true, active: true },
  });
  console.log("Promo codes:", promos);

  const sessionCount = await prisma.examSession.count();
  console.log("exam_sessions rows:", sessionCount);

  console.log("Platform migration OK");
} finally {
  await prisma.$disconnect();
}
