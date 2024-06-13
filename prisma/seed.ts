import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const saleTypeSale = await prisma.saleType.upsert({
    where: {
      description: 'Salida de bodega', // Usar la descripción como campo único
    },
    update: {},
    create: {
      description: 'Salida de bodega',
    },
  });

  const saleTypeWork = await prisma.saleType.upsert({
    where: {
      description: 'Orden de trabajo', // Usar la descripción como campo único
    },
    update: {},
    create: {
      description: 'Orden de trabajo',
    },
  });

  console.log({ saleTypeSale, saleTypeWork });
}

main()
  .then(async () => {
    console.log('Seed data created successfully');
  })
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
