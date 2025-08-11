// prisma/seed.ts
import { PrismaClient, Role } from '@prisma/client'
import { hashPassword } from '../src/lib/hash'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const adminPassword = await hashPassword('admin123')
  await prisma.user.create({
    data: {
      email: 'admin@pharmacy.com',
      password: adminPassword,
      name: 'Admin User',
      role: Role.ADMIN,
    },
  })

  // Create worker user
  const workerPassword = await hashPassword('worker123')
  await prisma.user.create({
    data: {
      email: 'worker@pharmacy.com',
      password: workerPassword,
      name: 'Worker User',
      role: Role.WORKER,
    },
  })

  // Create some inventory items
  await prisma.inventoryItem.createMany({
    data: [
      {
        name: 'Paracetamol 500mg',
        category: 'Pain Relief',
        quantity: 100,
        price: 5.99,
        expiryDate: new Date('2025-12-31'),
      },
      {
        name: 'Ibuprofen 200mg',
        category: 'Pain Relief',
        quantity: 75,
        price: 7.49,
        expiryDate: new Date('2025-11-30'),
      },
      {
        name: 'Amoxicillin 250mg',
        category: 'Antibiotic',
        quantity: 50,
        price: 12.99,
        expiryDate: new Date('2024-10-15'),
      },
    ],
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })