// app/api/sales/route.ts
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
    const sales = await prisma.sale.findMany({
      include: {
        item: true,
        soldBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(sales)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch sales' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { itemId, quantity } = await request.json()

    // Get the item
    const item = await prisma.inventoryItem.findUnique({
      where: { id: itemId },
    })

    if (!item) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      )
    }

    if (item.quantity < quantity) {
      return NextResponse.json(
        { error: 'Insufficient stock' },
        { status: 400 }
      )
    }

    // Calculate total price
    const totalPrice = item.price * quantity

    // Create the sale
    const sale = await prisma.sale.create({
      data: {
        itemId,
        quantity,
        totalPrice,
        userId: session.user.id,
      },
    })

    // Update inventory quantity
    await prisma.inventoryItem.update({
      where: { id: itemId },
      data: {
        quantity: {
          decrement: quantity,
        },
      },
    })

    // Log the activity
    await prisma.activityLog.create({
      data: {
        type: 'SALE',
        message: `Sold ${quantity} units of ${item.name} for $${totalPrice}`,
        userId: session.user.id,
      },
    })

    return NextResponse.json(sale, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to record sale' },
      { status: 500 }
    )
  }
}