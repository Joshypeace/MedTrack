// app/api/users/route.ts
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { Role } from '@prisma/client'
import { hashPassword } from '@/lib/hash'
import { ActivityType } from '@prisma/client'

// GET all users (ADMIN only)
export async function GET() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(users)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

// POST create new user (ADMIN only)
export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await request.json()
    const { email, password, name, role } = data

    // Validate role
    if (!Object.values(Role).includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role specified' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    })

    // Log the activity
    await prisma.activityLog.create({
      data: {
        type: 'ADD_STOCK', // Consider adding a USER_CREATED activity type
        message: `Created new user: ${email} with role ${role}`,
        userId: session.user.id,
      },
    })

    return NextResponse.json(newUser, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}

// PUT update user (ADMIN only)
export async function PUT(request: Request) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await request.json()
    const { id, email, name, role, password } = data

    // Validate role if provided
    if (role && !Object.values(Role).includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role specified' },
        { status: 400 }
      )
    }

    const updateData: any = {
      name,
      role,
    }

    // Only update email if it's provided and different
    if (email) {
      updateData.email = email
    }

    // Only hash and update password if it's provided
    if (password) {
      updateData.password = await hashPassword(password)
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        updatedAt: true,
      },
    })

    // Log the activity
    await prisma.activityLog.create({
      data: {
        type: 'UPDATE_STOCK', // Consider adding a USER_UPDATED activity type
        message: `Updated user: ${updatedUser.email}`,
        userId: session.user.id,
      },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    )
  }
}

// DELETE user (ADMIN only)
export async function DELETE(request: Request) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await request.json()

    // Prevent deleting self
    if (id === session.user.id) {
      return NextResponse.json(
        { error: 'You cannot delete your own account' },
        { status: 400 }
      )
    }

    const deletedUser = await prisma.user.delete({
      where: { id },
      select: {
        id: true,
        email: true,
      },
    })

    // Log the activity
    await prisma.activityLog.create({
      data: {
        type: 'DELETE_STOCK', // Consider adding a USER_DELETED activity type
        message: `Deleted user: ${deletedUser.email}`,
        userId: session.user.id,
      },
    })

    return NextResponse.json(deletedUser)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    )
  }
}