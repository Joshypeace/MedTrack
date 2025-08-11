// app/api/inventory/route.ts
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { ActivityType } from '@prisma/client'
import { getServerSession } from 'next-auth'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const items = await prisma.inventoryItem.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(items)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch inventory' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await request.json()
    const { name, category, quantity, price, expiryDate } = data

    const newItem = await prisma.inventoryItem.create({
      data: {
        name,
        category,
        quantity,
        price,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
      },
    })

    // Log the activity
    await prisma.activityLog.create({
      data: {
        type: 'ADD_STOCK',
        message: `Added new inventory item: ${name} (${quantity} units)`,
        userId: session.user.id,
      },
    })

    return NextResponse.json(newItem, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create inventory item' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await request.json()
    const { id, ...updateData } = data

    const updatedItem = await prisma.inventoryItem.update({
      where: { id },
      data: updateData,
    })

    // Log the activity
    await prisma.activityLog.create({
      data: {
        type: 'UPDATE_STOCK',
        message: `Updated inventory item: ${updatedItem.name}`,
        userId: session.user.id,
      },
    })

    return NextResponse.json(updatedItem)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update inventory item' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await request.json()
    const deletedItem = await prisma.inventoryItem.delete({
      where: { id },
    })

    // Log the activity
    await prisma.activityLog.create({
      data: {
        type: 'DELETE_STOCK',
        message: `Deleted inventory item: ${deletedItem.name}`,
        userId: session.user.id,
      },
    })

    return NextResponse.json(deletedItem)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete inventory item' },
      { status: 500 }
    )
  }
}