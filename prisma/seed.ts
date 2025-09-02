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