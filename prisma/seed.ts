import "dotenv/config";
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma";

const seed = async () => {
  const password = await bcrypt.hash("admin123", 10);

  const company = await prisma.company.upsert({
    where: { email: "admin@imprenta.pe" },
    update: {},
    create: {
      name: "Imprenta Central",
      email: "admin@imprenta.pe",
      password,
    },
  });

  console.log(`Empresa lista: ${company.email}`);
};

void seed()
  .then(() => {
    void prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });