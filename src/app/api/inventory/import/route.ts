import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const { data } = await request.json();
    
    if (!data || !Array.isArray(data)) {
      return NextResponse.json(
        { error: "Invalid data format" },
        { status: 400 }
      );
    }

    // Validate and transform data
    const validItems = data
      .filter(item => item.name && item.batch && !isNaN(item.quantity))
      .map(item => ({
        name: String(item.name),
        batch: String(item.batch),
        quantity: Number(item.quantity),
        price: item.price ? Number(item.price) : 0,
        expiryDate: item.expiry ? new Date(item.expiry) : null,
        category: item.category || 'Uncategorized'
      }));

    if (validItems.length === 0) {
      return NextResponse.json(
        { error: 'No valid items found' },
        { status: 400 }
      );
    }

    // Create items in database
    const createdItems = await prisma.$transaction(
      validItems.map(item =>
        prisma.inventoryItem.create({
          data: item
        })
      )
    );

    // Log activity
    await prisma.activityLog.create({
      data: {
        type: 'ADD_STOCK',
        message: `Imported ${createdItems.length} items`,
        userId: session.user.id
      }
    });

    revalidatePath('/inventory');
    return NextResponse.json({
      success: true,
      importedCount: createdItems.length,
      skippedCount: data.length - validItems.length,
      errors: data.length > validItems.length ? 
        [`${data.length - validItems.length} rows skipped`] : []
    });

  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json(
      { error: 'Failed to process import data' },
      { status: 500 }
    );
  }
}