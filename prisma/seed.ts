// prisma/seed.ts
import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcrypt'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const prisma = new PrismaClient()

const SALT_ROUNDS = 12

async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, SALT_ROUNDS)
}

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

  // Create inventory items
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

  console.log('🌱 Database seeded successfully')
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })