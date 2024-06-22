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
      id: '53d05e3d-8ec2-43d6-90a8-247f3afe7c1e',
    },
    update: {},
    create: {
      fullName: 'admin',
      id: '53d05e3d-8ec2-43d6-90a8-247f3afe7c1e',
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
