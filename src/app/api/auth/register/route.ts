// src/app/api/auth/register/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma' // Use your existing prisma instance
import bcrypt from 'bcryptjs'
import { z } from 'zod'

// Validation schema
const registerSchema = z.object({
  pharmacyName: z.string().min(2, 'Pharmacy name must be at least 2 characters'),
  ownerName: z.string().min(2, 'Owner name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  licenseNumber: z.string().min(5, 'License number must be at least 5 characters'),
  location: z.string().min(2, 'Location is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = registerSchema.parse(body)
    
    const { pharmacyName, ownerName, email, phone, licenseNumber, location, password } = validatedData

    // Check if pharmacy already exists
    const existingPharmacy = await prisma.pharmacy.findFirst({
      where: {
        OR: [
          { name: pharmacyName },
          { licenseNumber },
          { email }
        ]
      }
    })

    if (existingPharmacy) {
      return NextResponse.json(
        { 
          error: 'Pharmacy already exists',
          message: 'A pharmacy with this name, license number, or email already exists' 
        },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists', message: 'A user with this email already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create pharmacy and user in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create pharmacy
      const pharmacy = await tx.pharmacy.create({
        data: {
          name: pharmacyName,
          licenseNumber,
          ownerName,
          email,
          phone,
          location
        }
      })

      // Create admin user
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          name: ownerName,
          role: 'ADMIN',
          pharmacyId: pharmacy.id
        }
      })

      // Create activity log
      await tx.activityLog.create({
        data: {
          type: 'LOGIN',
          message: 'Pharmacy account created and admin user registered',
          userId: user.id
        }
      })

      return { pharmacy, user }
    })

    // Remove password from response
    const { password: _, ...userWithoutPassword } = result.user

    return NextResponse.json(
      { 
        success: true, 
        message: 'Registration successful',
        data: {
          pharmacyId: result.pharmacy.id,
          user: userWithoutPassword
        }
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Registration error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          message: error.errors.map(e => e.message).join(', ')
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error', message: 'Failed to create account' },
      { status: 500 }
    )
  }
}