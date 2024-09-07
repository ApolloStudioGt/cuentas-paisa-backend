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

  const adminUser = await prisma.user.upsert({
    where: {
      id: '525efc74-e492-4905-8bca-faf05a664910',
    },
    update: {},
    create: {
      fullName: 'admin',
      id: '525efc74-e492-4905-8bca-faf05a664910',
      email: 'kevingil1910@gmail.com',
    },
  });

  const bankIndustrial = await prisma.bank.upsert({
    where: {
      description: 'Banco Industrial',
    },
    update: {},
    create: {
      description: 'Banco Industrial'
    }
  })

  console.log({ saleTypeSale, saleTypeWork, adminUser, bankIndustrial });
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
