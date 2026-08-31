// prisma/seed.ts — Datos iniciales del dominio Catering
// Ejecutar con: pnpm dlx prisma db seed

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('🌱 Iniciando seed...');

  // Limpiar datos existentes (idempotente)
  await prisma.menuItem.deleteMany();
  await prisma.cateringService.deleteMany();

  // 1. Buffet Ejecutivo Premium
  const buffet = await prisma.cateringService.create({
    data: {
      name: 'Buffet Ejecutivo Premium',
      category: 'Buffet',
      pricePerPerson: 35.0,
      minPeople: 20,
      isAvailable: true,
      menuItems: {
        create: [
          { name: 'Ensalada César', description: 'Lechuga romana, crutones y aderezo césar' },
          { name: 'Pollo al Horno', description: 'Pollo marinado con hierbas finas' },
          { name: 'Arroz Pilaf', description: 'Arroz con vegetales salteados' },
        ],
      },
    },
  });

  // 2. Coffee Break Empresarial
  const coffeeBreak = await prisma.cateringService.create({
    data: {
      name: 'Coffee Break Empresarial',
      category: 'Coffee Break',
      pricePerPerson: 15.5,
      minPeople: 15,
      isAvailable: true,
      menuItems: {
        create: [
          { name: 'Café Americano', description: 'Café recién preparado' },
          { name: 'Mini Croissants', description: 'Croissants de mantequilla' },
        ],
      },
    },
  });

  // 3. Banquete de Gala y Bodas
  const banquete = await prisma.cateringService.create({
    data: {
      name: 'Banquete de Gala y Bodas',
      category: 'Banquete',
      pricePerPerson: 65.0,
      minPeople: 50,
      isAvailable: true,
      menuItems: {
        create: [
          { name: 'Filete Mignon', description: 'Corte premium de res con salsa de vino tinto' },
          { name: 'Risotto de Champiñones', description: 'Arroz cremoso con champiñones porcini' },
        ],
      },
    },
  });

  // 4. Estación de Postres y Repostería
  const postres = await prisma.cateringService.create({
    data: {
      name: 'Estación de Postres y Repostería',
      category: 'Postres',
      pricePerPerson: 18.0,
      minPeople: 25,
      isAvailable: false,
      menuItems: {
        create: [
          { name: 'Cheesecake de Frutos Rojos', description: 'Tarta de queso con coulis de fresas' },
          { name: 'Macarons Surtidos', description: 'Macarons franceses de varios sabores' },
        ],
      },
    },
  });

  // 5. Cocktail Sunset & Tapas
  const cocktail = await prisma.cateringService.create({
    data: {
      name: 'Cocktail Sunset & Tapas',
      category: 'Cocktail',
      pricePerPerson: 28.5,
      minPeople: 15,
      isAvailable: true,
      menuItems: {
        create: [
          { name: 'Bruschettas Variadas', description: 'Pan tostado con toppings mediterráneos' },
        ],
      },
    },
  });

  console.log(`✅ Seed completado: 5 servicios creados`);
  console.log(`   - ${buffet.name} (ID: ${buffet.id})`);
  console.log(`   - ${coffeeBreak.name} (ID: ${coffeeBreak.id})`);
  console.log(`   - ${banquete.name} (ID: ${banquete.id})`);
  console.log(`   - ${postres.name} (ID: ${postres.id})`);
  console.log(`   - ${cocktail.name} (ID: ${cocktail.id})`);
}

main()
  .catch((err: unknown) => {
    console.error('❌ Error en seed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
